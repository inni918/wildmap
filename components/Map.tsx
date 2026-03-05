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
  const [spots, setSpots] = useState<Spot[]>([])
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<SpotCategory | 'all'>('all')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [featureSpotIds, setFeatureSpotIds] = useState<Set<string> | null>(null)
  const [addModal, setAddModal] = useState<{ lat: number; lng: number } | null>(null)
  const [detailSpot, setDetailSpot] = useState<Spot | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const [viewState, setViewState] = useState({
    longitude: 121.0,
    latitude: 23.8,
    zoom: 7,
  })

  // 用來觸發 cluster 重新計算的 bounds 狀態
  const [mapBounds, setMapBounds] = useState<[number, number, number, number]>(
    [119.0, 21.5, 123.0, 25.5]
  )

  const fetchSpots = useCallback(async () => {
    const { data, error } = await supabase
      .from('spots')
      .select('id, name, name_en, description, description_en, category, latitude, longitude, address, status, quality, is_free, is_private, created_by, managed_by, phone, website, facebook, instagram, line_id, email, google_maps_url, gov_certified, view_count, created_at, updated_at')
      .range(0, 9999)
    if (!error && data) setSpots(data as Spot[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSpots()
  }, [fetchSpots])

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

  const filteredSpots = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return spots.filter(s => {
      if (activeFilter !== 'all' && s.category !== activeFilter) return false
      if (featureSpotIds !== null && !featureSpotIds.has(s.id)) return false
      if (q && !s.name.toLowerCase().includes(q) && !(s.name_en?.toLowerCase().includes(q))) return false
      return true
    })
  }, [spots, activeFilter, featureSpotIds, searchQuery])

  // ====== Supercluster 建立 ======
  const supercluster = useMemo(() => {
    const sc = new Supercluster({
      radius: 60,
      maxZoom: 14,
    })

    const points: Supercluster.PointFeature<{ spotId: string }>[] = filteredSpots.map(spot => ({
      type: 'Feature',
      properties: { spotId: spot.id },
      geometry: {
        type: 'Point',
        coordinates: [spot.longitude, spot.latitude],
      },
    }))

    sc.load(points)
    return sc
  }, [filteredSpots])

  // 根據目前 viewport 計算 clusters
  const clusters = useMemo(() => {
    return supercluster.getClusters(mapBounds, Math.floor(viewState.zoom))
  }, [supercluster, mapBounds, viewState.zoom])

  // spot id → Spot 快速查詢
  const spotMap = useMemo(() => {
    const m = new globalThis.Map<string, Spot>()
    for (const s of spots) m.set(s.id, s)
    return m
  }, [spots])

  // 地圖移動時更新 bounds
  const handleMapMove = useCallback((evt: { viewState: typeof viewState }) => {
    setViewState(evt.viewState)
    const map = mapRef.current?.getMap()
    if (map) {
      const b = map.getBounds()
      setMapBounds([
        b.getWest(),
        b.getSouth(),
        b.getEast(),
        b.getNorth(),
      ])
    }
  }, [])

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

  // 列表模式：按名稱排序
  const sortedFilteredSpots = useMemo(() => {
    return [...filteredSpots].sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant'))
  }, [filteredSpots])

  return (
    <div className="relative w-full h-full flex flex-col">
      <Header
        spotCount={filteredSpots.length}
        loading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Category Filter Bar + 地圖/列表切換 */}
      <div className="absolute top-14 left-0 right-0 z-10 px-3 py-2 flex gap-2 items-center overflow-x-auto bg-surface/80 backdrop-blur-sm">
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
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
            className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
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
      />

      {/* =================== 地圖模式 =================== */}
      {viewMode === 'map' && (
        <>
          {/* Add Spot Hint */}
          <div className="absolute bottom-8 right-4 z-10 bg-primary text-text-on-primary rounded-xl shadow-md px-4 py-2 text-sm flex items-center gap-2">
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
                maxWidth="260px"
              >
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{CATEGORY_EMOJI[selectedSpot.category]}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-text-main text-base truncate">{selectedSpot.name}</h3>
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
                  {selectedSpot.description && (
                    <p className="text-sm text-text-secondary mb-1">{selectedSpot.description}</p>
                  )}
                  {selectedSpot.address && (
                    <p className="text-xs text-text-secondary mb-1 flex items-center gap-1">
                      <FontAwesomeIcon icon={NAV_ICONS.location} className="text-primary" />
                      {selectedSpot.address}
                    </p>
                  )}
                  <p className="text-xs text-text-secondary/60 mt-1">
                    {selectedSpot.latitude.toFixed(4)}, {selectedSpot.longitude.toFixed(4)}
                  </p>
                  <button
                    onClick={() => {
                      setDetailSpot(selectedSpot)
                      setSelectedSpot(null)
                    }}
                    className="mt-2 w-full text-center text-sm font-medium text-primary hover:text-primary-dark py-1.5 rounded-lg hover:bg-primary-light/10 transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    查看特性詳情
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
          className="absolute left-0 right-0 bottom-0 overflow-y-auto bg-surface"
          style={{ top: '8.5rem' }}
        >
          {loading ? (
            <div className="flex items-center justify-center h-40 text-text-secondary">
              <FontAwesomeIcon icon={NAV_ICONS.spinner} className="animate-spin mr-2" />
              載入中…
            </div>
          ) : sortedFilteredSpots.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-text-secondary gap-2">
              <span className="text-4xl">🗺️</span>
              <p>找不到符合條件的地點</p>
            </div>
          ) : (
            <div className="p-3 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedFilteredSpots.map(spot => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  onDetail={() => setDetailSpot(spot)}
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
          onAdded={() => {
            setAddModal(null)
            fetchSpots()
          }}
        />
      )}

      {detailSpot && (
        <SpotDetail
          spot={detailSpot}
          onClose={() => setDetailSpot(null)}
        />
      )}
    </div>
  )
}

// ====== 列表卡片元件 ======
function SpotCard({ spot, onDetail }: { spot: Spot; onDetail: () => void }) {
  return (
    <div
      onClick={onDetail}
      className="bg-surface rounded-2xl shadow-sm border border-border hover:shadow-md hover:border-primary-light transition-all cursor-pointer overflow-hidden"
    >
      {/* 卡片頂部色帶 */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: spot.category === 'camping' ? '#4CAF50' : '#FF9800' }}
      />

      <div className="p-4">
        {/* 標題行 */}
        <div className="flex items-start gap-2 mb-2">
          <span className="text-2xl flex-shrink-0 leading-none mt-0.5">
            {CATEGORY_EMOJI[spot.category]}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-text-main text-sm leading-snug line-clamp-2">
              {spot.name}
            </h3>
            <span className="text-xs text-primary font-medium">
              {CATEGORY_LABEL[spot.category]}
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-2">
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

        {/* 地址 */}
        {spot.address && (
          <p className="text-xs text-text-secondary flex items-start gap-1 line-clamp-1">
            <FontAwesomeIcon icon={NAV_ICONS.location} className="text-primary mt-0.5 flex-shrink-0 text-[10px]" />
            {spot.address}
          </p>
        )}

        {/* 查看詳情 */}
        <div className="mt-3 flex justify-end">
          <span className="text-xs text-primary font-medium flex items-center gap-0.5">
            查看詳情
            <FontAwesomeIcon icon={NAV_ICONS.chevronRight} className="text-[10px]" />
          </span>
        </div>
      </div>
    </div>
  )
}
