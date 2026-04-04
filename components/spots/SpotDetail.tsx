'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Globe, MapPin, Mountain } from 'lucide-react'
import { Spot } from '@/types/database'

interface SpotDetailProps {
  spot: Spot
}

export default function SpotDetail({ spot }: SpotDetailProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'discussion'>('info')

  const spotTypeLabel = {
    paid: '付費露營地',
    free: '免費露營地',
    wild: '野營地'
  }[spot.spot_type] || '露營地'

  return (
    <div className="min-h-screen bg-brand-beige">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} className="text-gray-700" />
          </Link>
          <h1 className="font-semibold text-gray-900 flex-1 truncate">{spot.name}</h1>
        </div>
        {/* Tabs */}
        <div className="flex border-t border-gray-100">
          {[
            { key: 'info', label: '資訊' },
            { key: 'discussion', label: '討論' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'info' | 'discussion')}
              className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.key
                  ? 'text-brand-green'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="pb-8">
        {activeTab === 'info' && (
          <div>
            {/* Photo placeholder */}
            <div className="w-full h-48 bg-brand-beige-dark flex items-center justify-center">
              <span className="text-6xl">🏕️</span>
            </div>

            <div className="p-4 space-y-4">
              {/* Title section */}
              <div>
                <span className="text-xs text-brand-green font-medium bg-brand-beige px-2 py-0.5 rounded-full">
                  {spotTypeLabel}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-2">{spot.name}</h2>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  {spot.gov_certified && <span className="text-green-600 font-medium">🛡️ 合法登記</span>}
                  {spot.city && (
                    <span>
                      <MapPin size={14} className="inline mr-0.5" />
                      {spot.city}{spot.district}
                    </span>
                  )}
                  {spot.altitude && (
                    <span>
                      <Mountain size={14} className="inline mr-0.5" />
                      {spot.altitude}m
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {spot.description && (
                <p className="text-gray-700 text-sm leading-relaxed">{spot.description}</p>
              )}

              {/* Basic info */}
              <div className="bg-white rounded-xl p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 text-sm">基本資訊</h3>
                {spot.address && (
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{spot.address}</span>
                  </div>
                )}
                {spot.website && (
                  <a
                    href={spot.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-brand-green hover:underline"
                  >
                    <Globe size={16} className="flex-shrink-0" />
                    <span className="truncate">{spot.website}</span>
                  </a>
                )}
                {spot.google_maps_url && (
                  <a
                    href={spot.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm bg-brand-green text-white px-4 py-2 rounded-lg hover:bg-brand-green-dark transition-colors"
                  >
                    導航前往
                  </a>
                )}
              </div>

              {/* Features placeholder (Sprint 3) */}
              <div className="bg-white rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">地點特性</h3>
                <p className="text-sm text-gray-500">特性投票功能即將推出...</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'discussion' && (
          <div className="p-4">
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">討論區</h3>
              <p className="text-sm text-gray-500">登入後即可留言討論...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
