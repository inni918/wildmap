'use client'

import { useState, useEffect, useCallback } from 'react'
import { type Spot, CATEGORY_EMOJI, CATEGORY_LABEL } from '@/lib/supabase'
import { fetchSpotFeatures, type GroupedFeatures } from '@/lib/features'
import { useAuth } from '@/lib/auth-context'
import FeatureIcons from './FeatureIcons'
import FeatureVoting from './FeatureVoting'

interface Props {
  spot: Spot
  onClose: () => void
}

type Tab = 'info' | 'vote'

const QUALITY_BADGE: Record<string, { emoji: string; label: string; color: string }> = {
  new: { emoji: '🟡', label: '新建', color: '#EAB308' },
  community_verified: { emoji: '🟢', label: '社群驗證', color: '#22C55E' },
  featured: { emoji: '⭐', label: '精選', color: '#F59E0B' },
}

export default function SpotDetail({ spot, onClose }: Props) {
  const { user } = useAuth()
  const [groups, setGroups] = useState<GroupedFeatures[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('info')
  const [isClosing, setIsClosing] = useState(false)

  const loadFeatures = useCallback(async () => {
    setLoading(true)
    const result = await fetchSpotFeatures(spot.id, spot.category, user?.id)
    setGroups(result)
    setLoading(false)
  }, [spot.id, spot.category, user?.id])

  useEffect(() => {
    loadFeatures()
  }, [loadFeatures])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(onClose, 200)
  }

  const qualityConfig = QUALITY_BADGE[spot.quality] || QUALITY_BADGE.new

  return (
    <div
      className="absolute inset-0 z-30 flex items-end justify-center bg-black/20 backdrop-blur-[2px]"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div
        className={`bg-white rounded-t-2xl w-full max-w-lg shadow-2xl flex flex-col transition-transform duration-200 ${
          isClosing ? 'translate-y-full' : 'translate-y-0 animate-slide-up'
        }`}
        style={{ maxHeight: '80vh' }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="px-5 pb-3 border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-3xl flex-shrink-0">
                {CATEGORY_EMOJI[spot.category]}
              </span>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-gray-800 truncate">{spot.name}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-medium text-green-600">
                    {CATEGORY_LABEL[spot.category]}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: qualityConfig.color + '20',
                      color: qualityConfig.color,
                    }}
                  >
                    {qualityConfig.emoji} {qualityConfig.label}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1 cursor-pointer"
            >
              ×
            </button>
          </div>

          {/* Description */}
          {spot.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-3">{spot.description}</p>
          )}

          {/* Coordinates */}
          <p className="text-xs text-gray-400 mt-2">
            📍 {spot.latitude.toFixed(4)}, {spot.longitude.toFixed(4)}
          </p>

          {/* Compact feature icons */}
          {!loading && groups.length > 0 && (
            <div className="mt-3">
              <FeatureIcons groups={groups} compact />
            </div>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex border-b px-5">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2.5 text-sm font-medium text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'info'
                ? 'border-green-500 text-green-700'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            特性一覽
          </button>
          <button
            onClick={() => setActiveTab('vote')}
            className={`flex-1 py-2.5 text-sm font-medium text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'vote'
                ? 'border-green-500 text-green-700'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            投票特性 {user ? '' : '🔒'}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              <span className="ml-2 text-sm text-gray-500">載入特性資料...</span>
            </div>
          ) : activeTab === 'info' ? (
            <InfoTab groups={groups} />
          ) : (
            <VoteTab
              spotId={spot.id}
              groups={groups}
              userId={user?.id ?? null}
              onVoted={loadFeatures}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// === Info Tab: Read-only feature display ===

function InfoTab({ groups }: { groups: GroupedFeatures[] }) {
  const hasAnyFeature = groups.some(g => g.features.some(f => f.status !== 'absent'))

  if (!hasAnyFeature) {
    return (
      <div className="text-center py-8">
        <p className="text-4xl mb-2">🤷</p>
        <p className="text-sm text-gray-500">尚無特性資料</p>
        <p className="text-xs text-gray-400 mt-1">切換到「投票特性」幫忙回報吧！</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const visibleFeatures = group.features.filter(f => f.status !== 'absent')
        if (visibleFeatures.length === 0) return null

        return (
          <div key={group.group_key}>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: group.color }}
              />
              <span className="text-sm font-semibold" style={{ color: group.color }}>
                {group.group_name}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {visibleFeatures.map((f) => {
                const isConfirmed = f.status === 'confirmed'
                return (
                  <span
                    key={f.id}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      isConfirmed ? '' : 'opacity-50'
                    }`}
                    style={
                      isConfirmed
                        ? {
                            backgroundColor: group.color + '15',
                            color: group.color,
                            border: `1px solid ${group.color}40`,
                          }
                        : {
                            backgroundColor: '#f3f4f6',
                            color: '#9ca3af',
                            border: '1px solid #e5e7eb',
                          }
                    }
                    title={
                      isConfirmed
                        ? `${f.yes_count}人確認`
                        : `待確認（${f.total}票）`
                    }
                  >
                    {f.icon} {f.name_zh}
                    {isConfirmed && (
                      <span className="text-[10px] opacity-70">✅</span>
                    )}
                    {f.status === 'pending' && (
                      <span className="text-[10px]">❓</span>
                    )}
                  </span>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// === Vote Tab ===

function VoteTab({
  spotId,
  groups,
  userId,
  onVoted,
}: {
  spotId: string
  groups: GroupedFeatures[]
  userId: string | null
  onVoted: () => void
}) {
  if (!userId) {
    return (
      <div className="text-center py-8">
        <p className="text-4xl mb-2">🔒</p>
        <p className="text-sm text-gray-500">登入後即可投票</p>
        <p className="text-xs text-gray-400 mt-1">你的回報能幫助其他用戶！</p>
      </div>
    )
  }

  return (
    <FeatureVoting
      spotId={spotId}
      groups={groups}
      userId={userId}
      onVoted={onVoted}
    />
  )
}
