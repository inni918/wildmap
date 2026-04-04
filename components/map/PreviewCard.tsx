'use client'

import { X } from 'lucide-react'
import Link from 'next/link'
import { Spot } from '@/types/database'
import FavoriteButton from '@/components/spots/FavoriteButton'

interface PreviewCardProps {
  spot: Spot
  onClose: () => void
}

export default function PreviewCard({ spot, onClose }: PreviewCardProps) {
  const spotTypeLabel = {
    paid: '付費露營地',
    free: '免費露營地',
    wild: '野營地'
  }[spot.spot_type] || '露營地'

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-6">
      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden max-w-lg mx-auto">
        <Link href={`/spots/${spot.id}`} className="block">
          <div className="flex gap-3 p-4">
            {/* Photo placeholder */}
            <div className="w-24 h-20 bg-brand-beige rounded-xl flex-shrink-0 flex items-center justify-center">
              <span className="text-2xl">🏕️</span>
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs text-brand-green font-medium bg-brand-beige px-2 py-0.5 rounded-full">
                    {spotTypeLabel}
                  </span>
                  <h3 className="font-semibold text-gray-900 mt-1 text-sm leading-tight line-clamp-2">
                    {spot.name}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                {spot.gov_certified && (
                  <span className="text-green-600 font-medium">🛡️ 合法登記</span>
                )}
                {spot.city && <span>{spot.city}</span>}
                {spot.altitude && <span>⛰️ {spot.altitude}m</span>}
              </div>
            </div>
          </div>
        </Link>
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <FavoriteButton spotId={spot.id} />
          <button
            onClick={(e) => { e.stopPropagation(); onClose() }}
            className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X size={14} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
