'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Spot } from '@/types/database'

// 底圖設定
const TILE_SOURCES = {
  road: {
    label: '道路',
    style: {
      version: 8 as const,
      sources: {
        nlsc: {
          type: 'raster' as const,
          tiles: ['https://wmts.nlsc.gov.tw/wmts/EMAP/default/GoogleMapsCompatible/{z}/{y}/{x}'],
          tileSize: 256,
          attribution: '© 國土測繪中心'
        }
      },
      layers: [{ id: 'nlsc', type: 'raster' as const, source: 'nlsc' }]
    }
  },
  satellite: {
    label: '衛星',
    style: {
      version: 8 as const,
      sources: {
        esri: {
          type: 'raster' as const,
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
          tileSize: 256,
          attribution: '© Esri'
        }
      },
      layers: [{ id: 'esri', type: 'raster' as const, source: 'esri' }]
    }
  },
  topo: {
    label: '地形',
    style: {
      version: 8 as const,
      sources: {
        topo: {
          type: 'raster' as const,
          tiles: ['https://tile.opentopomap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenTopoMap'
        }
      },
      layers: [{ id: 'topo', type: 'raster' as const, source: 'topo' }]
    }
  }
}

interface MapProps {
  spots: Spot[]
  onMarkerClick: (spot: Spot) => void
  onMapClick: () => void
}

export default function Map({ spots, onMarkerClick, onMapClick }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const [currentTile, setCurrentTile] = useState<'road' | 'satellite' | 'topo'>('road')
  const spotsRef = useRef<Spot[]>([])
  spotsRef.current = spots

  // Helper to add spots source and layers
  const addSpotsLayers = useCallback((m: maplibregl.Map, spotsData: Spot[]) => {
    if (m.getSource('spots')) return

    m.addSource('spots', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: spotsData.map(spot => ({
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: [spot.lng, spot.lat] },
          properties: { id: spot.id, name: spot.name, city: spot.city, gov_certified: spot.gov_certified }
        }))
      },
      cluster: true,
      clusterMaxZoom: 12,
      clusterRadius: 50
    })

    // Cluster circles
    m.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'spots',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': 'rgba(45, 106, 79, 0.85)',
        'circle-radius': ['step', ['get', 'point_count'], 20, 10, 28, 50, 36],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff'
      }
    })

    // Cluster count labels
    m.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'spots',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-size': 13
      },
      paint: { 'text-color': '#fff' }
    })

    // Individual points
    m.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'spots',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#2D6A4F',
        'circle-radius': 8,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff'
      }
    })
  }, [])

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    const m = new maplibregl.Map({
      container: mapContainer.current,
      style: TILE_SOURCES.road.style as maplibregl.StyleSpecification,
      center: [121.0, 23.8],
      zoom: 7,
      minZoom: 6,
      maxBounds: [[118, 21], [123, 26.5]] as maplibregl.LngLatBoundsLike,
      dragRotate: false,
      touchPitch: false,
    })

    map.current = m

    m.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'bottom-left'
    )

    m.on('load', () => {
      addSpotsLayers(m, spotsRef.current)

      // Click cluster → zoom in
      m.on('click', 'clusters', (e) => {
        const features = m.queryRenderedFeatures(e.point, { layers: ['clusters'] })
        if (!features.length) return
        const clusterId = features[0].properties?.cluster_id
        const source = m.getSource('spots') as maplibregl.GeoJSONSource
        source.getClusterExpansionZoom(clusterId).then((zoom) => {
          const coords = (features[0].geometry as GeoJSON.Point).coordinates as [number, number]
          m.easeTo({ center: coords, zoom })
        })
      })

      // Click individual point
      m.on('click', 'unclustered-point', (e) => {
        e.preventDefault()
        const feature = e.features?.[0]
        if (!feature) return
        const spotId = feature.properties?.id
        const spot = spotsRef.current.find(s => s.id === spotId)
        if (spot) onMarkerClick(spot)
      })

      // Click empty map area
      m.on('click', (e) => {
        const features = m.queryRenderedFeatures(e.point, {
          layers: ['unclustered-point', 'clusters']
        })
        if (!features.length) onMapClick()
      })

      // Cursor styles
      m.on('mouseenter', 'clusters', () => { m.getCanvas().style.cursor = 'pointer' })
      m.on('mouseleave', 'clusters', () => { m.getCanvas().style.cursor = '' })
      m.on('mouseenter', 'unclustered-point', () => { m.getCanvas().style.cursor = 'pointer' })
      m.on('mouseleave', 'unclustered-point', () => { m.getCanvas().style.cursor = '' })
    })

    return () => {
      map.current?.remove()
      map.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update GeoJSON data when spots change
  useEffect(() => {
    if (!map.current || !spots.length) return
    const updateData = () => {
      const source = map.current?.getSource('spots') as maplibregl.GeoJSONSource | undefined
      if (!source) return
      source.setData({
        type: 'FeatureCollection',
        features: spots.map(spot => ({
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: [spot.lng, spot.lat] },
          properties: { id: spot.id, name: spot.name, city: spot.city, gov_certified: spot.gov_certified }
        }))
      })
    }
    if (map.current.isStyleLoaded()) updateData()
    else map.current.on('load', updateData)
  }, [spots])

  // Switch tile source
  const switchTile = useCallback((tile: 'road' | 'satellite' | 'topo') => {
    if (!map.current || tile === currentTile) return
    map.current.setStyle(TILE_SOURCES[tile].style as maplibregl.StyleSpecification)
    map.current.once('styledata', () => {
      if (!map.current) return
      addSpotsLayers(map.current, spotsRef.current)
    })
    setCurrentTile(tile)
  }, [currentTile, addSpotsLayers])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      {/* Tile source switcher */}
      <div className="absolute bottom-16 right-4 flex flex-col gap-1 z-10">
        {(Object.keys(TILE_SOURCES) as Array<keyof typeof TILE_SOURCES>).map(tile => (
          <button
            key={tile}
            onClick={() => switchTile(tile)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shadow-md transition-all ${
              currentTile === tile
                ? 'bg-brand-green text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {TILE_SOURCES[tile].label}
          </button>
        ))}
      </div>
    </div>
  )
}
