'use client'

import { useRef, useCallback, useState, useEffect } from 'react'
import ReactMapGL, { Marker, Popup, NavigationControl, MapRef, MapMouseEvent } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { supabase, type Spot } from '@/lib/supabase'
import AddSpotModal from './AddSpotModal'

const CATEGORY_EMOJI: Record<Spot['category'], string> = {
  camping: '🏕️',
  fishing: '🎣',
  diving: '🤿',
  surfing: '🏄',
  hiking: '🏔️',
  carcamp: '🚐',
}

const CATEGORY_LABEL: Record<Spot['category'], string> = {
  camping: '露營',
  fishing: '釣魚',
  diving: '潛水',
  surfing: '衝浪',
  hiking: '登山',
  carcamp: '車宿',
}

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

export default function Map() {
  const mapRef = useRef<MapRef>(null)
  const [spots, setSpots] = useState<Spot[]>([])
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<Spot['category'] | 'all'>('all')
  const [addModal, setAddModal] = useState<{ lat: number; lng: number } | null>(null)
  const [viewState, setViewState] = useState({
    longitude: 121.0,
    latitude: 23.8,
    zoom: 7,
  })

  const fetchSpots = useCallback(async () => {
    const { data, error } = await supabase.from('spots').select('*')
    if (!error && data) setSpots(data as Spot[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSpots()
  }, [fetchSpots])

  const handleMapClick = useCallback((e: MapMouseEvent) => {
    setSelectedSpot(null)
    setAddModal({ lat: e.lngLat.lat, lng: e.lngLat.lng })
  }, [])

  const filteredSpots = activeFilter === 'all'
    ? spots
    : spots.filter(s => s.category === activeFilter)

  return (
    <div className="relative w-full h-full">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm shadow-sm px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-700">🗺️ Wildmap</h1>
        <p className="text-sm text-gray-500">
          {loading ? '載入中...' : `${filteredSpots.length} 個地點`}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="absolute top-14 left-0 right-0 z-10 px-3 py-2 flex gap-2 overflow-x-auto bg-white/80 backdrop-blur-sm">
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
            activeFilter === 'all' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300'
          }`}
        >
          全部
        </button>
        {(Object.keys(CATEGORY_EMOJI) as Spot['category'][]).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
              activeFilter === cat ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300'
            }`}
          >
            {CATEGORY_EMOJI[cat]} {CATEGORY_LABEL[cat]}
          </button>
        ))}
      </div>

      {/* Add Spot Hint */}
      <div className="absolute bottom-8 right-4 z-10 bg-green-600 text-white rounded-xl shadow-md px-4 py-2 text-sm">
        點地圖新增地點 ➕
      </div>

      <ReactMapGL
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={handleMapClick}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLE}
        cursor="crosshair"
      >
        <NavigationControl position="top-right" />

        {filteredSpots.map((spot) => (
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
        ))}

        {selectedSpot && (
          <Popup
            longitude={selectedSpot.longitude}
            latitude={selectedSpot.latitude}
            anchor="bottom"
            onClose={() => setSelectedSpot(null)}
            closeOnClick={false}
            maxWidth="240px"
          >
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{CATEGORY_EMOJI[selectedSpot.category]}</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-base">{selectedSpot.name}</h3>
                  <span className="text-xs text-green-600 font-medium">{CATEGORY_LABEL[selectedSpot.category]}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{selectedSpot.description}</p>
              <p className="text-xs text-gray-400 mt-2">
                📍 {selectedSpot.latitude.toFixed(4)}, {selectedSpot.longitude.toFixed(4)}
              </p>
            </div>
          </Popup>
        )}
      </ReactMapGL>

      {/* Add Spot Modal */}
      {addModal && (
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
    </div>
  )
}
