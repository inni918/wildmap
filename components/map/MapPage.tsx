'use client'

import { useEffect, useState, useCallback } from 'react'
import Map from './Map'
import PreviewCard from './PreviewCard'
import { Spot } from '@/types/database'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

export default function MapPage() {
  const [spots, setSpots] = useState<Spot[]>([])
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetch('/api/spots?limit=2000')
      .then(r => r.json())
      .then(data => {
        if (data.success) setSpots(data.data.spots)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleMarkerClick = useCallback((spot: Spot) => {
    setSelectedSpot(spot)
  }, [])

  const handleMapClick = useCallback(() => {
    setSelectedSpot(null)
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute top-4 right-4 z-20">
        <Link href={user ? '/profile' : '/login'}
          className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
          <span className="text-lg">{user ? '👤' : '🔑'}</span>
        </Link>
      </div>
      <Map
        spots={spots}
        onMarkerClick={handleMarkerClick}
        onMapClick={handleMapClick}
      />
      {selectedSpot && (
        <PreviewCard
          spot={selectedSpot}
          onClose={() => setSelectedSpot(null)}
        />
      )}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-brand-beige/80 z-50">
          <div className="text-brand-green font-medium">載入地圖中...</div>
        </div>
      )}
    </div>
  )
}
