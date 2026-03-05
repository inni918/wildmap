'use client'

import { useRef, useCallback, useState, useEffect, useMemo } from 'react'
import ReactMapGL, { Marker, Popup, NavigationControl, MapRef, MapMouseEvent } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import Supercluster from 'supercluster'
import { supabase, type Spot, type SpotCategory, CATEGORY_EMOJI, CATEGORY_LABEL } from '@/lib/supabase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'
import AddSpotModal from './AddSpotModal'
import SpotDetail from './SpotDetail'
import Header from './Header'
import FeatureFilter from './FeatureFilter'

const MAP_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
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

  // ====== Viewport-based fetch ======
  const fetchViewportSpots = useCallback(async (
    bounds: [number, number, number, number],
    category: SpotCategory | 'all',
    search: string,
    featureIds: Set<string> | null,
  ) => {
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
      // 篩選 feature_votes 過濾出來的 spot_ids
      query = query.in('id', Array.from(featureIds))
    }

    query = query.limit(500)

    const { data, error } = await query

    if (error) {
      console.error('fetchViewportSpots error:', error)
      return
    }

    setSpots((data || []) as SpotSummary[])
    setLoading(false)
  }, [])

  // ====== Count query（帶 filter） ======
  const fetchTotalCount = useCallback(async (
    category: SpotCategory | 'all',
    search: string,
    featureIds: Set<string> | null,
  ) => {
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

    const { count, error } = await query

    if (!error && count !== null) {
      setTotalCount(count)
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
      fetchTotalCount(category, search, featureIds)
    }, 300)
  }, [fetchViewportSpots, fetchTotalCount])

  // ====== 初次載入 + filter/search 改變時重新 fetch ======
  useEffect(() => {
    triggerFetch(mapBounds, activeFilter, searchQuery, featureSpotIds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, searchQuery, featureSpotIds])

  // 初次載入也要算 count
  useEffect(() => {
    fetchTotalCount(activeFilter, searchQuery, featureSpotIds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 當選擇特性篩選時，查詢符合條件的 spot ids
  useEffect(() => {
    if (selectedFeatures.length === 0) {
      setFeatureSpotIds(null)
      return
    }

    async function fetchFeatureFilteredSpots() {
      const { data: votes, error } = await supabase
        .from('feature_votes')
        .select('spot_id, feature_id, vote')
        .in('feature_id', selectedFeatures)

      if (error || !votes) {
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
    fetchTotalCount(activeFilter, searchQuery, featureSpotIds)
  }, [mapBounds, activeFilter, searchQuery, featureSpotIds, fetchViewportSpots, fetchTotalCount])

  // SpotDetail 更新後重新 fetch viewport
  const handleSpotUpdated = useCallback(() => {
    setDetailSpotId(null)
    fetchViewportSpots(mapBounds, activeFilter, searchQuery, featureSpotIds)
    fetchTotalCount(activeFilter, searchQuery, featureSpotIds)
  }, [mapBounds, activeFilter, searchQuery, featureSpotIds, fetchViewportSpots, fetchTotalCount])

  return (
    <div className="relative w-full h-full flex flex-col">
      <Header
        spotCount={totalCount}
        loading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchExpandedChange={setSearchExpanded}
      />

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
        {(['camping', 'carcamp'] as SpotCategory[]).map(cat => (
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
          {/* Loading overlay — 只在第一次載入時顯示 */}
          {loading && spots.length === 0 && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-bg/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                  <FontAwesomeIcon icon={NAV_ICONS.map} className="text-primary text-2xl animate-spin-slow" />
                </div>
                <p className="text-sm font-medium text-text-secondary">載入地圖中...</p>
              </div>
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
                      <h3 className="font-bold text-text-main text-base leading-snug mb-1">{selectedSpot.name}</h3>
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
                  <button
                    onClick={() => {
                      setDetailSpotId(selectedSpot.id)
                      setSelectedSpot(null)
                    }}
                    className="mt-1 w-full text-center text-sm font-semibold text-white bg-primary hover:bg-primary-dark py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98] min-h-[44px]"
                  >
                    查看詳情
                    <FontAwesomeIcon icon={NAV_ICONS.chevronRight} className="text-xs" />
                  </button>
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
        <AddSpotModal
          lat={addModal.lat}
          lng={addModal.lng}
          onClose={() => setAddModal(null)}
          onAdded={handleSpotAdded}
        />
      )}

      {detailSpotId && (
        <SpotDetail
          spotId={detailSpotId}
          onClose={() => setDetailSpotId(null)}
          onSpotUpdated={handleSpotUpdated}
        />
      )}
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
            <h3 className="font-bold text-text-main text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
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
