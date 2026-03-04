'use client'

import { useState } from 'react'
import type { GroupedFeatures, FeatureWithVotes } from '@/lib/features'
import { castVote } from '@/lib/features'

interface Props {
  spotId: string
  groups: GroupedFeatures[]
  userId: string | null
  onVoted: () => void
}

function FeatureRow({
  feature,
  spotId,
  userId,
  groupColor,
  onVoted,
}: {
  feature: FeatureWithVotes
  spotId: string
  userId: string | null
  groupColor: string
  onVoted: () => void
}) {
  const [voting, setVoting] = useState(false)

  const handleVote = async (vote: boolean) => {
    if (!userId) return
    setVoting(true)
    const result = await castVote(spotId, feature.id, userId, vote)
    if (result.success) {
      onVoted()
    }
    setVoting(false)
  }

  const isConfirmed = feature.status === 'confirmed'
  const isPending = feature.status === 'pending'

  return (
    <div
      className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
        isConfirmed ? 'bg-white' : 'bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="text-base flex-shrink-0"
          style={{ opacity: isConfirmed ? 1 : 0.4 }}
        >
          {feature.icon}
        </span>
        <span
          className={`text-sm truncate ${isConfirmed ? 'font-medium' : 'text-gray-400'}`}
          style={isConfirmed ? { color: groupColor } : {}}
        >
          {feature.name_zh}
        </span>
        {isPending && (
          <span className="text-xs text-gray-400 flex-shrink-0">❓</span>
        )}
        {isConfirmed && (
          <span className="text-xs text-gray-400 flex-shrink-0">
            {feature.yes_count}人確認
          </span>
        )}
      </div>

      {/* Vote buttons */}
      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
        {userId ? (
          <>
            <button
              onClick={() => handleVote(true)}
              disabled={voting}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                feature.user_vote === true
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700'
              }`}
            >
              ✅ 有
            </button>
            <button
              onClick={() => handleVote(false)}
              disabled={voting}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                feature.user_vote === false
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-700'
              }`}
            >
              ❌ 沒有
            </button>
          </>
        ) : (
          <span className="text-xs text-gray-400">登入投票</span>
        )}
      </div>
    </div>
  )
}

export default function FeatureVoting({ spotId, groups, userId, onVoted }: Props) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      {groups.map((group) => {
        const confirmedCount = group.features.filter(f => f.status === 'confirmed').length
        const isExpanded = expandedGroup === group.group_key

        return (
          <div key={group.group_key} className="rounded-xl border overflow-hidden">
            {/* Group header */}
            <button
              onClick={() => setExpandedGroup(isExpanded ? null : group.group_key)}
              className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
              style={{ borderLeft: `4px solid ${group.color}` }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: group.color }}
                />
                <span className="font-medium text-sm text-gray-800">
                  {group.group_name}
                </span>
                <span className="text-xs text-gray-400">
                  {confirmedCount}/{group.features.length}
                </span>
              </div>

              {/* Compact icons */}
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5 mr-2">
                  {group.features
                    .filter(f => f.status === 'confirmed')
                    .slice(0, 6)
                    .map((f, i) => (
                      <span key={i} className="text-sm">{f.icon}</span>
                    ))}
                  {confirmedCount > 6 && (
                    <span className="text-xs text-gray-400">+{confirmedCount - 6}</span>
                  )}
                </div>
                <span className="text-gray-400 text-sm">
                  {isExpanded ? '▲' : '▼'}
                </span>
              </div>
            </button>

            {/* Expanded feature list */}
            {isExpanded && (
              <div className="px-2 pb-2 space-y-1 border-t bg-gray-50/50">
                {group.features.map((feature) => (
                  <FeatureRow
                    key={feature.id}
                    feature={feature}
                    spotId={spotId}
                    userId={userId}
                    groupColor={group.color}
                    onVoted={onVoted}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
