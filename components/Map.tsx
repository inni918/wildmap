'use client'

import { useRef, useCallback, useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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
import { useAuth } from '@/lib/auth-context'

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
        'https://tile.openstreetmap.jp/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
  status: string
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

// ====== SVG 水滴圖釘 Marker ======
function SpotMarker({ isSelected, isSuspended }: { isSelected: boolean; isSuspended: boolean }) {
  if (isSuspended) {
    return (
      <svg width="40" height="52" viewBox="0 0 40 52" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2C10.059 2 2 10.059 2 20C2 31.5 20 50 20 50C20 50 38 31.5 38 20C38 10.059 29.941 2 20 2Z" fill="#9ca3af" filter="url(#marker-shadow-suspended)"/>
        <circle cx="20" cy="19" r="13" fill="white" opacity="0.85"/>
        <g transform="translate(20,19)" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="-9,7 0,-7 9,7"/>
          <line x1="-9" y1="7" x2="9" y2="7"/>
          <path d="M-2.5,7 Q-2.5,2 0,2 Q2.5,2 2.5,7"/>
          <line x1="-5" y1="7" x2="-2" y2="1.5"/>
          <line x1="5" y1="7" x2="2" y2="1.5"/>
        </g>
      </svg>
    )
  }
  if (isSelected) {
    return (
      <svg width="50" height="64" viewBox="0 0 50 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 3C13.402 3 4 12.402 4 24C4 38 25 61 25 61C25 61 46 38 46 24C46 12.402 36.598 3 25 3Z" fill="#2D6A4F" filter="url(#marker-shadow-selected)"/>
        <path d="M25 3C13.402 3 4 12.402 4 24C4 38 25 61 25 61C25 61 46 38 46 24C46 12.402 36.598 3 25 3Z" fill="none" stroke="white" strokeWidth="3"/>
        <circle cx="25" cy="23" r="15" fill="white"/>
        <g transform="translate(25,23)" fill="none" stroke="#2D6A4F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="-10,8 0,-8 10,8"/>
          <line x1="-10" y1="8" x2="10" y2="8"/>
          <path d="M-3,8 Q-3,2.5 0,2.5 Q3,2.5 3,8"/>
          <line x1="-6" y1="8" x2="-2.5" y2="1.5"/>
          <line x1="6" y1="8" x2="2.5" y2="1.5"/>
        </g>
      </svg>
    )
  }
  return (
    <svg width="40" height="52" viewBox="0 0 40 52" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2C10.059 2 2 10.059 2 20C2 31.5 20 50 20 50C20 50 38 31.5 38 20C38 10.059 29.941 2 20 2Z" fill="#2D6A4F" filter="url(#marker-shadow)"/>
      <circle cx="20" cy="19" r="13" fill="white"/>
      <g transform="translate(20,19)" fill="none" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="-9,7 0,-7 9,7"/>
        <line x1="-9" y1="7" x2="9" y2="7"/>
        <path d="M-2.5,7 Q-2.5,2 0,2 Q2.5,2 2.5,7"/>
        <line x1="-5" y1="7" x2="-2" y2="1.5"/>
        <line x1="5" y1="7" x2="2" y2="1.5"/>
      </g>
    </svg>
  )
}

export default function Map() {
  const mapRef = useRef<MapRef>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const addSpotPerm = usePermission('add_spot')
  const [spots, setSpots] = useState<SpotSummary[]>([])
  const [selectedSpot, setSelectedSpot] = useState<SpotSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<SpotCategory | 'all'>('all')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [featureSpotIds, setFeatureSpotIds] = useState<Set<string> | null>(null)
  const [addModal, setAddModal] = useState<{ lat: number; lng: number } | null>(null)
  const [detailSpotId, setDetailSpotId] = useState<string | null>(null)
  const [placingMode, setPlacingMode] = useState(false) // 放置模式
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
  // 收藏模式
  const [favoritesMode, setFavoritesMode] = useState(false)
  const [favoriteSpotIds, setFavoriteSpotIds] = useState<Set<string> | null>(null)
  const [favoritesLoading, setFavoritesLoading] = useState(false)

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
            .select('id, name, category, latitude, longitude, is_free, gov_certified, quality, status')
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

  // ====== URL query params 處理：search=1 / favorites=1 / view=map ======
  useEffect(() => {
    const searchParam = searchParams.get('search')
    const favoritesParam = searchParams.get('favorites')
    const viewParam = searchParams.get('view')

    if (viewParam === 'map') {
      // 地圖 tab 按下：強制回到地圖模式，清除所有覆蓋狀態
      setViewMode('map')
      setFavoritesMode(false)
      setSearchExpanded(false)
      router.replace('/map', { scroll: false })
      return
    }

    if (searchParam === '1') {
      // 展開搜尋框
      setSearchExpanded(true)
      // 清除 query param（避免重整時重複觸發）
      router.replace('/map', { scroll: false })
    }

    if (favoritesParam === '1') {
      setFavoritesMode(true)
      setViewMode('list')
      router.replace('/map', { scroll: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // ====== 收藏模式：載入用戶收藏的 spot ids ======
  useEffect(() => {
    if (!favoritesMode) {
      setFavoriteSpotIds(null)
      return
    }

    if (!user) {
      // 未登入：不需要載入，顯示提示
      setFavoriteSpotIds(new Set())
      return
    }

    async function loadFavorites() {
      setFavoritesLoading(true)
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('spot_id')
          .eq('user_id', user!.id)
        if (!error && data) {
          setFavoriteSpotIds(new Set(data.map((f: { spot_id: string }) => f.spot_id)))
        } else {
          setFavoriteSpotIds(new Set())
        }
      } catch {
        setFavoriteSpotIds(new Set())
      } finally {
        setFavoritesLoading(false)
      }
    }

    loadFavorites()
  }, [favoritesMode, user])

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
    // 不再直接開 AddSpotModal，改用放置模式
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
            onClick={() => { setViewMode('map'); setFavoritesMode(false) }}
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

          {/* SVG filter defs（全域共用，避免每個 marker 重複定義 filter id 衝突） */}
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <filter id="marker-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#00000035"/>
              </filter>
              <filter id="marker-shadow-selected" x="-40%" y="-30%" width="180%" height="160%">
                <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#2D6A4F55"/>
              </filter>
              <filter id="marker-shadow-suspended" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000025"/>
              </filter>
            </defs>
          </svg>

          <ReactMapGL
            ref={mapRef}
            {...viewState}
            onMove={handleMapMove}
            onClick={handleMapClick}
            style={{ width: '100%', height: '100%' }}
            mapStyle={MAP_STYLE}
            cursor={placingMode ? 'move' : 'grab'}
            maxBounds={[
              [118.0, 21.0],  // 西南角（涵蓋金門）
              [123.0, 26.5],  // 東北角（涵蓋馬祖）
            ]}
            minZoom={6}
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
                  anchor="bottom"
                  onClick={(e) => {
                    e.originalEvent.stopPropagation()
                    setSelectedSpot(spot)
                    setAddModal(null)
                  }}
                >
                  <button
                    className="hover:scale-110 transition-transform cursor-pointer"
                    title={spot.status === 'suspended' ? `${spot.name}（暫停營業）` : spot.name}
                  >
                    <SpotMarker
                      isSelected={selectedSpot?.id === spot.id}
                      isSuspended={spot.status === 'suspended'}
                    />
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

          {/* 放置模式：十字準心 + 確認/取消 */}
          {placingMode && (
            <>
              {/* 十字準心（畫面正中央） */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
                <div className="relative w-12 h-12">
                  {/* 垂直線 */}
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 w-0.5 h-full bg-primary/80" />
                  {/* 水平線 */}
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 w-full bg-primary/80" />
                  {/* 中心點 */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary ring-2 ring-white shadow" />
                </div>
                {/* 提示文字 */}
                <p className="text-xs text-text-main font-medium bg-surface/90 backdrop-blur-sm rounded-full px-3 py-1 mt-2 text-center shadow-sm whitespace-nowrap -translate-x-1/4">
                  拖動地圖選擇位置
                </p>
              </div>

              {/* 確認 / 取消按鈕 */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                <button
                  onClick={() => setPlacingMode(false)}
                  className="px-5 py-2.5 bg-surface text-text-secondary border border-border rounded-xl text-sm font-medium shadow-lg hover:bg-surface-hover transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    const map = mapRef.current?.getMap()
                    if (map) {
                      const center = map.getCenter()
                      setPlacingMode(false)
                      setAddModal({ lat: center.lat, lng: center.lng })
                    }
                  }}
                  className="px-5 py-2.5 bg-primary text-text-on-primary rounded-xl text-sm font-medium shadow-lg hover:bg-primary-dark transition-colors cursor-pointer"
                >
                  ✓ 確認位置
                </button>
              </div>

              {/* 半透明遮罩提示 */}
              <div className="absolute inset-0 pointer-events-none z-10 border-4 border-primary/30 rounded-none" />
            </>
          )}

          {/* ＋ 新增地點 FAB（非放置模式時顯示） */}
          {!placingMode && viewMode === 'map' && (
            <button
              onClick={() => {
                if (!addSpotPerm.allowed) {
                  setAddModal({ lat: 0, lng: 0 }) // 觸發權限不足提示
                  return
                }
                setPlacingMode(true)
                setSelectedSpot(null)
              }}
              className="absolute bottom-6 right-4 z-20 flex items-center gap-2 px-4 py-3 bg-primary text-text-on-primary rounded-full shadow-lg hover:bg-primary-dark hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <FontAwesomeIcon icon={NAV_ICONS.plus} className="text-sm" />
              <span className="text-sm font-medium">新增地點</span>
            </button>
          )}
        </>
      )}

      {/* =================== 列表模式 =================== */}
      {viewMode === 'list' && (
        <div
          className="absolute left-0 right-0 bottom-0 overflow-y-auto bg-surface transition-all duration-200"
          style={{ top: searchExpanded ? '12rem' : '8.5rem' }}
        >
          {/* 收藏模式標題列 */}
          {favoritesMode && (
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-alt">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={NAV_ICONS.heartSolid} className="text-error text-sm" />
                <span className="text-sm font-semibold text-text-main">我的收藏</span>
                {favoriteSpotIds && (
                  <span className="text-xs text-text-secondary">（{favoriteSpotIds.size} 個）</span>
                )}
              </div>
              <button
                onClick={() => { setFavoritesMode(false); setFavoriteSpotIds(null) }}
                className="text-xs text-text-secondary hover:text-primary cursor-pointer flex items-center gap-1"
              >
                <FontAwesomeIcon icon={NAV_ICONS.close} className="text-xs" />
                離開收藏
              </button>
            </div>
          )}

          {/* 未登入時的收藏提示 */}
          {favoritesMode && !user ? (
            <div className="flex flex-col items-center justify-center h-60 gap-3 px-4">
              <div className="w-20 h-20 rounded-full bg-surface-alt flex items-center justify-center mb-1">
                <FontAwesomeIcon icon={NAV_ICONS.heartSolid} className="text-error/30 text-3xl" />
              </div>
              <p className="text-base font-semibold text-text-main">請先登入</p>
              <p className="text-sm text-text-secondary text-center max-w-xs">
                登入後即可查看你收藏的地點
              </p>
              <a
                href="/login"
                className="mt-2 px-6 py-2.5 bg-primary text-text-on-primary rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors no-underline"
              >
                前往登入
              </a>
            </div>
          ) : favoritesLoading ? (
            <div className="flex items-center justify-center h-40 text-text-secondary">
              <FontAwesomeIcon icon={NAV_ICONS.spinner} className="animate-spin mr-2" />
              載入收藏中…
            </div>
          ) : loading && spots.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-text-secondary">
              <FontAwesomeIcon icon={NAV_ICONS.spinner} className="animate-spin mr-2" />
              載入中…
            </div>
          ) : (() => {
            // 收藏模式下過濾 spots
            const displaySpots = favoritesMode && favoriteSpotIds
              ? sortedSpots.filter(s => favoriteSpotIds.has(s.id))
              : sortedSpots

            return displaySpots.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-60 text-text-secondary gap-3 px-4">
                <div className="w-20 h-20 rounded-full bg-surface-alt flex items-center justify-center mb-1">
                  <span className="text-4xl">{favoritesMode ? '💔' : '🔍'}</span>
                </div>
                <p className="text-base font-semibold text-text-main">
                  {favoritesMode ? '還沒有收藏任何地點' : '找不到符合條件的地點'}
                </p>
                <p className="text-sm text-text-secondary text-center max-w-xs">
                  {favoritesMode
                    ? '在地圖上找到喜歡的露營地，點擊愛心圖示加入收藏'
                    : '試試調整篩選條件，或切換到地圖模式瀏覽附近地點'}
                </p>
                {!favoritesMode && (
                  <button
                    onClick={() => { setActiveFilter('all'); setSelectedFeatures([]); setSearchQuery('') }}
                    className="mt-2 text-sm text-primary font-medium hover:text-primary-dark transition-colors flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={NAV_ICONS.close} className="text-xs" />
                    清除所有篩選
                  </button>
                )}
              </div>
            ) : (
              <div className="p-3 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {displaySpots.map(spot => (
                  <SpotCard
                    key={spot.id}
                    spot={spot}
                    onDetail={() => setDetailSpotId(spot.id)}
                  />
                ))}
              </div>
            )
          })()}
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
