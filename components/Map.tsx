'use client'

import { useRef, useCallback, useState, useEffect, useMemo } from 'react'
import ReactMapGL, { Marker, Popup, NavigationControl, MapRef, MapMouseEvent } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import Supercluster from 'supercluster'
import { supabase, type SpotCategory, CATEGORY_EMOJI, CATEGORY_LABEL } from '@/lib/supabase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'
import AddSpotModal from './AddSpotModal'
import SpotDetail from './SpotDetail'
import Header from './Header'
import FeatureFilter from './FeatureFilter'
import OnboardingOverlay from './OnboardingOverlay'
import { usePermission } from './PermissionGate'
import { track } from '@/lib/tracker'

// ====== Nominatim 地理編碼 ======
let lastNominatimCall = 0

async function geocodeWithNominatim(query: string): Promise<{
  lat: number
  lon: number
  displayName: string
  zoom: number
} | null> {
  // 每秒最多 1 次請求
  const now = Date.now()
  const elapsed = now - lastNominatimCall
  if (elapsed < 1000) {
    await new Promise(resolve => setTimeout(resolve, 1000 - elapsed))
  }
  lastNominatimCall = Date.now()

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=tw&format=json&limit=1`,
      {
        headers: { 'User-Agent': 'Wildmap/1.0' },
      }
    )
    if (!res.ok) return null
    const data = await res.json()
    if (!data || data.length === 0) return null

    const result = data[0]
    const lat = parseFloat(result.lat)
    const lon = parseFloat(result.lon)
    const displayName = result.display_name?.split(',')[0] || query

    // 根據 boundingbox 計算適當的 zoom level
    let zoom = 12
    if (result.boundingbox) {
      const [south, north, west, east] = result.boundingbox.map(Number)
      const latDiff = Math.abs(north - south)
      const lonDiff = Math.abs(east - west)
      const maxDiff = Math.max(latDiff, lonDiff)
      if (maxDiff > 2) zoom = 8
      else if (maxDiff > 1) zoom = 9
      else if (maxDiff > 0.5) zoom = 10
      else if (maxDiff > 0.2) zoom = 11
      else if (maxDiff > 0.1) zoom = 12
      else if (maxDiff > 0.05) zoom = 13
      else zoom = 14
    }

    return { lat, lon, displayName, zoom }
  } catch {
    return null
  }
}

// ====== Timeout helper ======
function withTimeout<T>(promise: PromiseLike<T>, ms: number, label = 'operation'): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`))
    }, ms)
    promise.then(
      (val) => { clearTimeout(timer); resolve(val) },
      (err: unknown) => { clearTimeout(timer); reject(err) },
    )
  })
}

// ====== Retry helper（指數退避） ======
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  onRetry?: (attempt: number) => void,
): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 500 // 0.5s, 1s, 2s（更快重試）
        onRetry?.(attempt + 1)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  throw lastError
}

const MAP_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: 'raster' as const,
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  },
  layers: [{ id: 'osm', type: 'raster' as const, source: 'osm' }],
}

const QUALITY_BADGE: Record<string, { label: string; color: string }> = {
  excellent: { label: '精選', color: 'bg-accent/20 text-secondary' },
  good: { label: '優質', color: 'bg-primary-light/20 text-primary-dark' },
  fair: { label: '普通', color: 'bg-surface-alt text-text-secondary' },
  poor: { label: '待改善', color: 'bg-error/10 text-error' },
  unrated: { label: '', color: '' },
}

// 精簡的地圖 marker 用 type
type SpotSummary = {
  id: string
  name: string
  category: SpotCategory
  latitude: number
  longitude: number
  is_free: boolean | null
  gov_certified: boolean | null
  quality: string
}

// 根據 cluster 數量決定圓圈大小
function getClusterSize(count: number): number {
  if (count < 10) return 36
  if (count < 50) return 44
  if (count < 100) return 52
  if (count < 500) return 60
  return 70
}

// 根據 cluster 數量決定顏色
function getClusterColor(count: number): string {
  if (count < 10) return '#4CAF50'   // 綠色
  if (count < 50) return '#FF9800'   // 橘色
  if (count < 100) return '#F44336'  // 紅色
  return '#9C27B0'                   // 紫色
}

type ViewMode = 'map' | 'list'

export default function Map() {
  const mapRef = useRef<MapRef>(null)
  const addSpotPerm = usePermission('add_spot')
  const [spots, setSpots] = useState<SpotSummary[]>([])
  const [selectedSpot, setSelectedSpot] = useState<SpotSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<SpotCategory | 'all'>('all')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [featureSpotIds, setFeatureSpotIds] = useState<Set<string> | null>(null)
  const [addModal, setAddModal] = useState<{ lat: number; lng: number } | null>(null)
  const [detailSpotId, setDetailSpotId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const [totalCount, setTotalCount] = useState(0)
  const [geoHint, setGeoHint] = useState<string | null>(null) // 地理搜尋提示
  const [loadError, setLoadError] = useState<string | null>(null) // 載入失敗訊息
  const [retrying, setRetrying] = useState(false) // 重試中
  const [viewState, setViewState] = useState({
    longitude: 121.0,
    latitude: 23.8,
    zoom: 7,
  })

  // 用來觸發 cluster 重新計算的 bounds 狀態
  const [mapBounds, setMapBounds] = useState<[number, number, number, number]>(
    [119.0, 21.5, 123.0, 25.5]
  )

  // Debounce timer ref
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Geocoding debounce timer ref
  const geoDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Geo hint timer ref
  const geoHintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ====== Viewport-based fetch（含 retry + timeout 機制） ======
  const fetchViewportSpots = useCallback(async (
    bounds: [number, number, number, number],
    category: SpotCategory | 'all',
    search: string,
    featureIds: Set<string> | null,
  ) => {
    setLoadError(null)

    // 若 featureIds 為空集合，不需查詢，直接設為空結果
    if (featureIds !== null && featureIds.size === 0) {
      setSpots([])
      setLoading(false)
      setRetrying(false)
      return
    }

    try {
      const data = await withRetry(
        async () => {
          const [west, south, east, north] = bounds

          let query = supabase
            .from('spots')
            .select('id, name, category, latitude, longitude, is_free, gov_certified, quality')
            .gte('latitude', south)
            .lte('latitude', north)
            .gte('longitude', west)
            .lte('longitude', east)

          if (category !== 'all') {
            query = query.eq('category', category)
          }

          if (search.trim()) {
            query = query.ilike('name', `%${search.trim()}%`)
          }

          if (featureIds !== null) {
            query = query.in('id', Array.from(featureIds))
          }

          query = query.limit(500)

          // 加入 8 秒 timeout 防止查詢無限等待
          const result = await withTimeout(query, 8000, 'Supabase spots query')

          if (result.error) {
            throw result.error
          }

          return (result.data || []) as SpotSummary[]
        },
        2, // 最多重試 2 次（共 3 次嘗試）
        (attempt) => {
          console.log(`Supabase fetch retry attempt ${attempt}`)
          setRetrying(true)
        }
      )

      setSpots(data)
      setLoading(false)
      setRetrying(false)
      setLoadError(null)
    } catch (err) {
      console.error('fetchViewportSpots failed after retries:', err)
      setRetrying(false)
      setLoading(false)
      setLoadError('載入失敗，請重新整理頁面')
    }
  }, [])

  // ====== Count query（帶 filter + viewport bounds） ======
  const fetchTotalCount = useCallback(async (
    category: SpotCategory | 'all',
    search: string,
    featureIds: Set<string> | null,
    bounds?: [number, number, number, number],
  ) => {
    // 若 featureIds 為空集合，count 直接為 0
    if (featureIds !== null && featureIds.size === 0) {
      setTotalCount(0)
      return
    }

    try {
      let query = supabase
        .from('spots')
        .select('id', { count: 'exact', head: true })

      if (category !== 'all') {
        query = query.eq('category', category)
      }

      if (search.trim()) {
        query = query.ilike('name', `%${search.trim()}%`)
      }

      if (featureIds !== null) {
        query = query.in('id', Array.from(featureIds))
      }

      // 搜尋時也限制 viewport bounds，讓計數與列表一致
      if (bounds) {
        const [west, south, east, north] = bounds
        query = query
          .gte('latitude', south)
          .lte('latitude', north)
          .gte('longitude', west)
          .lte('longitude', east)
      }

      const result = await withTimeout(query, 8000, 'Supabase count query')

      if (!result.error && result.count !== null) {
        setTotalCount(result.count)
      }
    } catch (err) {
      console.error('fetchTotalCount failed:', err)
    }
  }, [])

  // ====== Trigger viewport fetch with debounce ======
  const triggerFetch = useCallback((
    bounds: [number, number, number, number],
    category: SpotCategory | 'all',
    search: string,
    featureIds: Set<string> | null,
  ) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      fetchViewportSpots(bounds, category, search, featureIds)
      fetchTotalCount(category, search, featureIds, bounds)
    }, 300)
  }, [fetchViewportSpots, fetchTotalCount])

  // ====== 初次載入：直接 fetch（不經過 debounce） ======
  const initialFetchDone = useRef(false)
  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true
      fetchViewportSpots(mapBounds, activeFilter, searchQuery, featureSpotIds)
      fetchTotalCount(activeFilter, searchQuery, featureSpotIds, mapBounds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ====== filter/search 改變時重新 fetch（debounced） ======
  const filterChangeCount = useRef(0)
  useEffect(() => {
    // 跳過初次渲染（由上面的 effect 處理）
    filterChangeCount.current++
    if (filterChangeCount.current <= 1) return

    triggerFetch(mapBounds, activeFilter, searchQuery, featureSpotIds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, searchQuery, featureSpotIds])

  // ====== 行為追蹤：search ======
  const searchTrackRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    const trimmed = searchQuery.trim()
    if (!trimmed) return
    if (searchTrackRef.current) clearTimeout(searchTrackRef.current)
    searchTrackRef.current = setTimeout(() => {
      track({
        event_type: 'search',
        metadata: { query: trimmed, category_filter: activeFilter },
      })
    }, 800)
    return () => { if (searchTrackRef.current) clearTimeout(searchTrackRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  // ====== 行為追蹤：filter_change ======
  const filterTrackCount = useRef(0)
  useEffect(() => {
    filterTrackCount.current++
    if (filterTrackCount.current <= 1) return
    track({
      event_type: 'filter_change',
      metadata: { selected_features: selectedFeatures, category: activeFilter },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFeatures, activeFilter])

  // ====== P1-1：地理搜尋（Nominatim geocoding） ======
  useEffect(() => {
    if (geoDebounceRef.current) {
      clearTimeout(geoDebounceRef.current)
    }

    const trimmed = searchQuery.trim()
    if (!trimmed || trimmed.length < 2) {
      return
    }

    geoDebounceRef.current = setTimeout(async () => {
      const result = await geocodeWithNominatim(trimmed)
      if (result) {
        // flyTo 到搜尋結果位置
        mapRef.current?.flyTo({
          center: [result.lon, result.lat],
          zoom: result.zoom,
          duration: 1000,
        })

        // flyTo 完成後，手動用新位置觸發一次 fetch
        // 確保搜尋結果在新 viewport 內正確顯示
        const newZoom = result.zoom
        const latSpan = 180 / Math.pow(2, newZoom)
        const lonSpan = 360 / Math.pow(2, newZoom)
        const newBounds: [number, number, number, number] = [
          result.lon - lonSpan / 2,
          result.lat - latSpan / 2,
          result.lon + lonSpan / 2,
          result.lat + latSpan / 2,
        ]
        // 延遲到 flyTo 動畫結束後 fetch，避免被中途 onMove 覆蓋
        setTimeout(() => {
          fetchViewportSpots(newBounds, activeFilter, trimmed, featureSpotIds)
          fetchTotalCount(activeFilter, trimmed, featureSpotIds, newBounds)
        }, 1100)

        // 顯示地理搜尋提示
        setGeoHint(`📍 已移動到${result.displayName}區域`)

        // 3 秒後自動隱藏提示
        if (geoHintTimerRef.current) {
          clearTimeout(geoHintTimerRef.current)
        }
        geoHintTimerRef.current = setTimeout(() => {
          setGeoHint(null)
        }, 3000)
      }
    }, 500) // 500ms debounce

    return () => {
      if (geoDebounceRef.current) {
        clearTimeout(geoDebounceRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  // 當選擇特性篩選時，查詢符合條件的 spot ids
  useEffect(() => {
    if (selectedFeatures.length === 0) {
      setFeatureSpotIds(null)
      return
    }

    async function fetchFeatureFilteredSpots() {
      let votes: { spot_id: string; feature_id: string; vote: boolean }[] | null = null
      try {
        const query = supabase
          .from('feature_votes')
          .select('spot_id, feature_id, vote')
          .in('feature_id', selectedFeatures)

        const result = await withTimeout(query, 8000, 'feature_votes query')
        if (result.error || !result.data) {
          setFeatureSpotIds(new Set())
          return
        }
        votes = result.data as { spot_id: string; feature_id: string; vote: boolean }[]
      } catch (err) {
        console.error('fetchFeatureFilteredSpots failed:', err)
        setFeatureSpotIds(new Set())
        return
      }

      if (!votes || votes.length === 0) {
        setFeatureSpotIds(new Set())
        return
      }

      const voteMap = new globalThis.Map<string, { yes: number; total: number }>()
      for (const v of votes) {
        const key = `${v.spot_id}::${v.feature_id}`
        if (!voteMap.has(key)) voteMap.set(key, { yes: 0, total: 0 })
        const entry = voteMap.get(key)!
        entry.total++
        if (v.vote) entry.yes++
      }

      const perFeatureSpots = new globalThis.Map<string, Set<string>>()
      for (const fId of selectedFeatures) {
        perFeatureSpots.set(fId, new Set())
      }

      for (const [key, counts] of voteMap.entries()) {
        const [spotId, featureId] = key.split('::')
        const ratio = counts.yes / counts.total
        if (ratio >= 0.6) {
          perFeatureSpots.get(featureId)?.add(spotId)
        }
      }

      let result: Set<string> | null = null
      for (const spotSet of perFeatureSpots.values()) {
        if (result === null) {
          result = new Set(spotSet)
        } else {
          for (const id of result) {
            if (!spotSet.has(id)) result.delete(id)
          }
        }
      }

      setFeatureSpotIds(result || new Set())
    }

    fetchFeatureFilteredSpots()
  }, [selectedFeatures])

  const handleMapClick = useCallback((e: MapMouseEvent) => {
    setSelectedSpot(null)
    setAddModal({ lat: e.lngLat.lat, lng: e.lngLat.lng })
  }, [])

  // ====== Supercluster 建立（直接用 viewport spots） ======
  const supercluster = useMemo(() => {
    const sc = new Supercluster({
      radius: 60,
      maxZoom: 14,
    })

    const points: Supercluster.PointFeature<{ spotId: string }>[] = spots.map(spot => ({
      type: 'Feature',
      properties: { spotId: spot.id },
      geometry: {
        type: 'Point',
        coordinates: [spot.longitude, spot.latitude],
      },
    }))

    sc.load(points)
    return sc
  }, [spots])

  // 根據目前 viewport 計算 clusters
  const clusters = useMemo(() => {
    return supercluster.getClusters(mapBounds, Math.floor(viewState.zoom))
  }, [supercluster, mapBounds, viewState.zoom])

  // spot id → SpotSummary 快速查詢
  const spotMap = useMemo(() => {
    const m = new globalThis.Map<string, SpotSummary>()
    for (const s of spots) m.set(s.id, s)
    return m
  }, [spots])

  // 地圖移動時更新 bounds + 觸發 debounced fetch
  const handleMapMove = useCallback((evt: { viewState: typeof viewState }) => {
    setViewState(evt.viewState)
    const map = mapRef.current?.getMap()
    if (map) {
      const b = map.getBounds()
      const newBounds: [number, number, number, number] = [
        b.getWest(),
        b.getSouth(),
        b.getEast(),
        b.getNorth(),
      ]
      setMapBounds(newBounds)
      triggerFetch(newBounds, activeFilter, searchQuery, featureSpotIds)

      // 行為追蹤：map_move（tracker 內部有 10 秒節流）
      track({
        event_type: 'map_move',
        metadata: {
          center_lat: evt.viewState.latitude,
          center_lng: evt.viewState.longitude,
          zoom: evt.viewState.zoom,
          bounds: newBounds,
        },
      })
    }
  }, [triggerFetch, activeFilter, searchQuery, featureSpotIds])

  // 點擊 cluster → zoom in
  const handleClusterClick = useCallback((clusterId: number, longitude: number, latitude: number) => {
    const expansionZoom = Math.min(
      supercluster.getClusterExpansionZoom(clusterId),
      20
    )
    mapRef.current?.flyTo({
      center: [longitude, latitude],
      zoom: expansionZoom,
      duration: 500,
    })
  }, [supercluster])

  // 列表模式：按名稱排序（用 viewport 內的 spots）
  const sortedSpots = useMemo(() => {
    return [...spots].sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant'))
  }, [spots])

  // 新增地點後重新 fetch viewport
  const handleSpotAdded = useCallback(() => {
    setAddModal(null)
    fetchViewportSpots(mapBounds, activeFilter, searchQuery, featureSpotIds)
    fetchTotalCount(activeFilter, searchQuery, featureSpotIds, mapBounds)
  }, [mapBounds, activeFilter, searchQuery, featureSpotIds, fetchViewportSpots, fetchTotalCount])

  // SpotDetail 更新後重新 fetch viewport
  const handleSpotUpdated = useCallback(() => {
    setDetailSpotId(null)
    fetchViewportSpots(mapBounds, activeFilter, searchQuery, featureSpotIds)
    fetchTotalCount(activeFilter, searchQuery, featureSpotIds, mapBounds)
  }, [mapBounds, activeFilter, searchQuery, featureSpotIds, fetchViewportSpots, fetchTotalCount])

  return (
    <div className="relative w-full h-full flex flex-col">
      <Header
        spotCount={totalCount}
        loading={loading}
        searchQuery={searchQuery}
        searchExpanded={searchExpanded}
        onSearchChange={setSearchQuery}
        onSearchExpandedChange={setSearchExpanded}
      />

      {/* 地理搜尋提示 */}
      {geoHint && (
        <div
          className="absolute left-0 right-0 z-20 flex justify-center transition-all duration-300"
          style={{ top: searchExpanded ? '6rem' : '3.2rem' }}
        >
          <div className="bg-primary/90 text-text-on-primary text-sm px-4 py-1.5 rounded-full shadow-md backdrop-blur-sm animate-fade-in">
            {geoHint}
          </div>
        </div>
      )}

      {/* Category Filter Bar + 地圖/列表切換 */}
      <div
        className="absolute left-0 right-0 z-10 px-3 py-2 flex gap-2 items-center overflow-x-auto bg-surface/80 backdrop-blur-sm transition-all duration-200"
        style={{ top: searchExpanded ? '6.5rem' : '3.5rem' }}
      >
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex-shrink-0 px-4 py-2 min-h-[36px] rounded-full text-sm font-medium border transition-colors active:scale-95 ${
            activeFilter === 'all'
              ? 'bg-primary text-text-on-primary border-primary'
              : 'bg-surface text-text-secondary border-border'
          }`}
        >
          全部
        </button>
        {(['camping'] as SpotCategory[]).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`flex-shrink-0 px-4 py-2 min-h-[36px] rounded-full text-sm font-medium border transition-colors active:scale-95 ${
              activeFilter === cat
                ? 'bg-primary text-text-on-primary border-primary'
                : 'bg-surface text-text-secondary border-border'
            }`}
          >
            {CATEGORY_EMOJI[cat]} {CATEGORY_LABEL[cat]}
          </button>
        ))}

        {/* 地圖 / 列表 切換按鈕 */}
        <div className="flex-shrink-0 ml-auto flex items-center gap-1 bg-surface-alt rounded-lg p-0.5 border border-border">
          <button
            onClick={() => setViewMode('map')}
            title="地圖模式"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'map'
                ? 'bg-primary text-text-on-primary shadow-sm'
                : 'text-text-secondary hover:text-primary'
            }`}
          >
            <FontAwesomeIcon icon={NAV_ICONS.mapView} className="text-sm" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            title="列表模式"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-primary text-text-on-primary shadow-sm'
                : 'text-text-secondary hover:text-primary'
            }`}
          >
            <FontAwesomeIcon icon={NAV_ICONS.list} className="text-sm" />
          </button>
        </div>
      </div>

      {/* Feature Filter */}
      <FeatureFilter
        selectedFeatures={selectedFeatures}
        onFeaturesChange={setSelectedFeatures}
        searchExpanded={searchExpanded}
      />

      {/* =================== 地圖模式 =================== */}
      {viewMode === 'map' && (
        <>
          {/* Loading / Retry / Error overlay — 只在第一次載入時顯示 */}
          {(loading || loadError) && spots.length === 0 && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-bg/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                {loadError ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
                      <FontAwesomeIcon icon={NAV_ICONS.warning} className="text-error text-2xl" />
                    </div>
                    <p className="text-sm font-medium text-text-main">{loadError}</p>
                    <button
                      onClick={() => {
                        setLoading(true)
                        setLoadError(null)
                        fetchViewportSpots(mapBounds, activeFilter, searchQuery, featureSpotIds)
                        fetchTotalCount(activeFilter, searchQuery, featureSpotIds, mapBounds)
                      }}
                      className="mt-2 px-6 py-2.5 bg-primary text-text-on-primary rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors cursor-pointer active:scale-95"
                    >
                      重試
                    </button>
                  </>
                ) : retrying ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                      <FontAwesomeIcon icon={NAV_ICONS.spinner} className="text-primary text-2xl animate-spin" />
                    </div>
                    <p className="text-sm font-medium text-text-secondary">正在重新載入...</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                      <FontAwesomeIcon icon={NAV_ICONS.map} className="text-primary text-2xl animate-spin-slow" />
                    </div>
                    <p className="text-sm font-medium text-text-secondary">載入地圖中...</p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Empty state for 0 results in map mode */}
          {!loading && spots.length === 0 && (searchQuery || activeFilter !== 'all' || featureSpotIds !== null) && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-surface/95 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-6 max-w-xs text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-surface-alt flex items-center justify-center mb-3">
                <span className="text-3xl">😕</span>
              </div>
              <p className="text-base font-semibold text-text-main mb-1">
                {selectedFeatures.length > 0 && !searchQuery && activeFilter === 'all'
                  ? '沒有符合篩選條件的地點'
                  : '找不到符合條件的地點'}
              </p>
              <p className="text-sm text-text-secondary mb-4">
                {selectedFeatures.length > 0 && !searchQuery && activeFilter === 'all'
                  ? '試試減少特性篩選條件'
                  : '試試調整篩選條件或搜尋其他關鍵字'}
              </p>
              <button
                onClick={() => { setActiveFilter('all'); setSelectedFeatures([]); setSearchQuery('') }}
                className="text-sm text-primary font-medium hover:text-primary-dark transition-colors flex items-center gap-1 mx-auto cursor-pointer"
              >
                <FontAwesomeIcon icon={NAV_ICONS.close} className="text-xs" />
                清除篩選
              </button>
            </div>
          )}

          {/* Add Spot Hint */}
          <div className="absolute bottom-8 right-4 z-10 bg-primary text-text-on-primary rounded-xl shadow-md px-4 py-2 text-sm flex items-center gap-2 md:bottom-8 bottom-20">
            點地圖新增地點
            <FontAwesomeIcon icon={NAV_ICONS.plus} className="text-xs" />
          </div>

          <ReactMapGL
            ref={mapRef}
            {...viewState}
            onMove={handleMapMove}
            onClick={handleMapClick}
            style={{ width: '100%', height: '100%' }}
            mapStyle={MAP_STYLE}
            cursor="crosshair"
          >
            <NavigationControl position="top-right" />

            {clusters.map(cluster => {
              const [longitude, latitude] = cluster.geometry.coordinates
              const { cluster: isCluster, cluster_id, point_count } = cluster.properties as {
                cluster: boolean
                cluster_id: number
                point_count: number
              }

              if (isCluster) {
                const size = getClusterSize(point_count)
                const color = getClusterColor(point_count)
                return (
                  <Marker
                    key={`cluster-${cluster_id}`}
                    longitude={longitude}
                    latitude={latitude}
                    anchor="center"
                    onClick={(e) => {
                      e.originalEvent.stopPropagation()
                      handleClusterClick(cluster_id, longitude, latitude)
                    }}
                  >
                    <div
                      className="flex items-center justify-center rounded-full text-white font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform select-none"
                      style={{
                        width: size,
                        height: size,
                        backgroundColor: color,
                        border: '3px solid white',
                        fontSize: point_count >= 100 ? 13 : 15,
                      }}
                    >
                      {point_count}
                    </div>
                  </Marker>
                )
              }

              // 個別 marker
              const spotId = (cluster.properties as { spotId: string }).spotId
              const spot = spotMap.get(spotId)
              if (!spot) return null

              return (
                <Marker
                  key={spot.id}
                  longitude={spot.longitude}
                  latitude={spot.latitude}
                  anchor="center"
                  onClick={(e) => {
                    e.originalEvent.stopPropagation()
                    setSelectedSpot(spot)
                    setAddModal(null)
                  }}
                >
                  <button className="text-2xl hover:scale-125 transition-transform cursor-pointer drop-shadow-md">
                    {CATEGORY_EMOJI[spot.category]}
                  </button>
                </Marker>
              )
            })}

            {selectedSpot && (
              <Popup
                longitude={selectedSpot.longitude}
                latitude={selectedSpot.latitude}
                anchor="bottom"
                onClose={() => setSelectedSpot(null)}
                closeOnClick={false}
                maxWidth="280px"
                className="wildmap-popup"
              >
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl flex-shrink-0 mt-0.5">{CATEGORY_EMOJI[selectedSpot.category]}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-text-main text-base leading-snug mb-1 line-clamp-2" title={selectedSpot.name}>{selectedSpot.name}</h3>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs text-primary font-medium">
                          {CATEGORY_LABEL[selectedSpot.category]}
                        </span>
                        {selectedSpot.quality && selectedSpot.quality !== 'unrated' && QUALITY_BADGE[selectedSpot.quality] && (
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${QUALITY_BADGE[selectedSpot.quality].color}`}>
                            {QUALITY_BADGE[selectedSpot.quality].label}
                          </span>
                        )}
                        {selectedSpot.is_free !== undefined && selectedSpot.is_free !== null && (
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                            selectedSpot.is_free
                              ? 'bg-primary-light/20 text-primary-dark'
                              : 'bg-accent/20 text-secondary'
                          }`}>
                            {selectedSpot.is_free ? '免費' : '付費'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-1 flex gap-2">
                    <button
                      onClick={() => {
                        setDetailSpotId(selectedSpot.id)
                        setSelectedSpot(null)
                      }}
                      className="flex-1 text-center text-sm font-semibold text-white bg-primary hover:bg-primary-dark py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98] min-h-[44px]"
                    >
                      查看詳情
                      <FontAwesomeIcon icon={NAV_ICONS.chevronRight} className="text-xs" />
                    </button>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedSpot.latitude},${selectedSpot.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-[44px] h-[44px] flex-shrink-0 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-colors active:scale-95"
                      title="導航"
                    >
                      <FontAwesomeIcon icon={NAV_ICONS.navigate} className="text-base" />
                    </a>
                  </div>
                </div>
              </Popup>
            )}
          </ReactMapGL>
        </>
      )}

      {/* =================== 列表模式 =================== */}
      {viewMode === 'list' && (
        <div
          className="absolute left-0 right-0 bottom-0 overflow-y-auto bg-surface transition-all duration-200"
          style={{ top: searchExpanded ? '12rem' : '8.5rem' }}
        >
          {loading && spots.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-text-secondary">
              <FontAwesomeIcon icon={NAV_ICONS.spinner} className="animate-spin mr-2" />
              載入中…
            </div>
          ) : sortedSpots.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 text-text-secondary gap-3 px-4">
              <div className="w-20 h-20 rounded-full bg-surface-alt flex items-center justify-center mb-1">
                <span className="text-4xl">🔍</span>
              </div>
              <p className="text-base font-semibold text-text-main">找不到符合條件的地點</p>
              <p className="text-sm text-text-secondary text-center max-w-xs">
                試試調整篩選條件，或切換到地圖模式瀏覽附近地點
              </p>
              <button
                onClick={() => { setActiveFilter('all'); setSelectedFeatures([]); setSearchQuery('') }}
                className="mt-2 text-sm text-primary font-medium hover:text-primary-dark transition-colors flex items-center gap-1"
              >
                <FontAwesomeIcon icon={NAV_ICONS.close} className="text-xs" />
                清除所有篩選
              </button>
            </div>
          ) : (
            <div className="p-3 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedSpots.map(spot => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  onDetail={() => setDetailSpotId(spot.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {addModal && viewMode === 'map' && (
        addSpotPerm.allowed ? (
          <AddSpotModal
            lat={addModal.lat}
            lng={addModal.lng}
            onClose={() => setAddModal(null)}
            onAdded={handleSpotAdded}
          />
        ) : (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setAddModal(null)}>
            <div className="bg-surface rounded-2xl border border-border p-6 mx-4 max-w-sm text-center shadow-xl" onClick={e => e.stopPropagation()}>
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-base font-bold text-text-main mb-2">需要更高等級</h3>
              <p className="text-sm text-text-secondary mb-4">
                新增地點需要 Lv.{addSpotPerm.requiredLevel} 才能使用。繼續累積積分升級吧！
              </p>
              <button
                onClick={() => setAddModal(null)}
                className="px-6 py-2.5 bg-primary text-text-on-primary rounded-xl text-sm font-medium cursor-pointer"
              >
                我知道了
              </button>
            </div>
          </div>
        )
      )}

      {detailSpotId && (
        <SpotDetail
          spotId={detailSpotId}
          onClose={() => setDetailSpotId(null)}
          onSpotUpdated={handleSpotUpdated}
        />
      )}

      <OnboardingOverlay />
    </div>
  )
}

// ====== 列表卡片元件 ======
function SpotCard({ spot, onDetail }: { spot: SpotSummary; onDetail: () => void }) {
  return (
    <div
      onClick={onDetail}
      className="bg-surface rounded-2xl shadow-sm border border-border hover:shadow-lg hover:border-primary-light hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden group"
    >
      {/* 卡片頂部色帶 */}
      <div
        className="h-1 w-full transition-all group-hover:h-1.5"
        style={{ backgroundColor: spot.category === 'camping' ? '#2D6A4F' : '#D4A843' }}
      />

      <div className="p-4">
        {/* 標題行 */}
        <div className="flex items-start gap-3 mb-2.5">
          <span className="text-2xl flex-shrink-0 leading-none mt-0.5 group-hover:scale-110 transition-transform">
            {CATEGORY_EMOJI[spot.category]}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-text-main text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors" title={spot.name}>
              {spot.name}
            </h3>
            <span className="text-xs text-primary font-medium">
              {CATEGORY_LABEL[spot.category]}
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {spot.is_free !== undefined && spot.is_free !== null && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              spot.is_free
                ? 'bg-green-100 text-green-700'
                : 'bg-orange-100 text-orange-700'
            }`}>
              {spot.is_free ? '免費' : '付費'}
            </span>
          )}
          {spot.quality && spot.quality !== 'unrated' && QUALITY_BADGE[spot.quality]?.label && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${QUALITY_BADGE[spot.quality].color}`}>
              {QUALITY_BADGE[spot.quality].label}
            </span>
          )}
          {spot.gov_certified && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
              合法營地
            </span>
          )}
        </div>

        {/* Separator */}
        <div className="border-t border-border/50 mb-2.5" />

        {/* 查看詳情 */}
        <div className="flex justify-end">
          <span className="text-xs text-primary font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all">
            查看詳情
            <FontAwesomeIcon icon={NAV_ICONS.chevronRight} className="text-[10px]" />
          </span>
        </div>
      </div>
    </div>
  )
}
