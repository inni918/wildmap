'use client'

import { useRef, useCallback, useState, useEffect } from 'react'
import ReactMapGL, { Marker, Popup, NavigationControl, MapRef } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { supabase, type Spot } from '@/lib/supabase'

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
  layers: [
    {
      id: 'osm',
      type: 'raster' as const,
      source: 'osm',
    },
  ],
}

export default function Map() {
  const mapRef = useRef<MapRef>(null)
  const [spots, setSpots] = useState<Spot[]>([])
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewState, setViewState] = useState({
    longitude: 121.0,
    latitude: 23.8,
    zoom: 7,
  })

  // 從 Supabase 載入地標
  useEffect(() => {
    async function fetchSpots() {
      const { data, error } = await supabase.from('spots').select('*')
      if (!error && data) setSpots(data as Spot[])
      setLoading(false)
    }
    fetchSpots()
  }, [])

  const handleMarkerClick = useCallback((spot: Spot) => {
    setSelectedSpot(spot)
  }, [])

  return (
    <div className="relative w-full h-full">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm shadow-sm px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-700">🗺️ Wildmap</h1>
        <p className="text-sm text-gray-500">
          {loading ? '載入中...' : `${spots.length} 個地點`}
        </p>
      </div>

      {/* Category Legend */}
      <div className="absolute bottom-8 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-md px-4 py-3">
        <p className="text-xs text-gray-500 mb-2 font-medium">地點類型</p>
        <div className="flex flex-col gap-1">
          {Object.entries(CATEGORY_EMOJI).map(([key, emoji]) => (
            <div key={key} className="flex items-center gap-2 text-sm">
              <span>{emoji}</span>
              <span className="text-gray-700">{CATEGORY_LABEL[key as Spot['category']]}</span>
            </div>
          ))}
        </div>
      </div>

      <ReactMapGL
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLE}
      >
        <NavigationControl position="top-right" />

        {spots.map((spot) => (
          <Marker
            key={spot.id}
            longitude={spot.longitude}
            latitude={spot.latitude}
            anchor="center"
            onClick={() => handleMarkerClick(spot)}
          >
            <button className="text-2xl hover:scale-125 transition-transform cursor-pointer">
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
          >
            <div className="p-2 min-w-[160px]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{CATEGORY_EMOJI[selectedSpot.category]}</span>
                <h3 className="font-bold text-gray-800">{selectedSpot.name}</h3>
              </div>
              <p className="text-sm text-gray-600">{selectedSpot.description}</p>
            </div>
          </Popup>
        )}
      </ReactMapGL>
    </div>
  )
}
