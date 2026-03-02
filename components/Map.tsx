'use client'

import { useRef, useCallback, useState } from 'react'
import ReactMapGL, { Marker, Popup, NavigationControl, MapRef } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'

interface Spot {
  id: string
  name: string
  description: string
  category: 'camping' | 'fishing' | 'diving' | 'surfing' | 'hiking' | 'carcamp'
  latitude: number
  longitude: number
}

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

// 初始測試資料
const MOCK_SPOTS: Spot[] = [
  {
    id: '1',
    name: '福隆海水浴場',
    description: '東北角熱門衝浪點，夏天人多',
    category: 'surfing',
    latitude: 25.0229,
    longitude: 121.9422,
  },
  {
    id: '2',
    name: '武陵農場露營區',
    description: '高山露營，氣候涼爽，需提早訂位',
    category: 'camping',
    latitude: 24.3618,
    longitude: 121.2747,
  },
  {
    id: '3',
    name: '碧砂漁港',
    description: '基隆熱門釣魚點，有多種魚種',
    category: 'fishing',
    latitude: 25.1489,
    longitude: 121.7906,
  },
]

// OpenStreetMap 免費地圖樣式
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
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null)
  const [viewState, setViewState] = useState({
    longitude: 121.0,
    latitude: 23.8,
    zoom: 7,
  })

  const handleMarkerClick = useCallback((spot: Spot) => {
    setSelectedSpot(spot)
  }, [])

  return (
    <div className="relative w-full h-full">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm shadow-sm px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-700">🗺️ Wildmap</h1>
        <p className="text-sm text-gray-500">台灣戶外活動地點地圖</p>
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

        {MOCK_SPOTS.map((spot) => (
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
