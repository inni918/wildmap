'use client'

import { useState } from 'react'
import type { GroupedFeatures, FeatureWithVotes } from '@/lib/features'
import { castVote } from '@/lib/features'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS, getFeatureIcon } from '@/lib/icons'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'

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
  const faIcon = getFeatureIcon(feature.key)

  return (
    <div
      className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
        isConfirmed ? 'bg-surface' : 'bg-surface-alt/50'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="text-base flex-shrink-0"
          style={{ opacity: isConfirmed ? 1 : 0.4, color: isConfirmed ? groupColor : undefined }}
        >
          {faIcon ? (
            <FontAwesomeIcon icon={faIcon} className="text-sm" />
          ) : (
            feature.icon
          )}
        </span>
        <span
          className={`text-sm truncate ${isConfirmed ? 'font-medium' : 'text-text-secondary/60'}`}
          style={isConfirmed ? { color: groupColor } : {}}
        >
          {feature.name_zh}
        </span>
        {isPending && (
          <FontAwesomeIcon icon={faCircleQuestion} className="text-xs text-text-secondary/60 flex-shrink-0" />
        )}
        {isConfirmed && (
          <span className="text-xs text-text-secondary/60 flex-shrink-0">
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
              className={`px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                feature.user_vote === true
                  ? 'bg-primary text-text-on-primary'
                  : 'bg-surface-alt text-text-secondary hover:bg-primary-light/20 hover:text-primary-dark'
              }`}
            >
              <FontAwesomeIcon icon={NAV_ICONS.thumbsUp} className="text-[10px]" /> 有
            </button>
            <button
              onClick={() => handleVote(false)}
              disabled={voting}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                feature.user_vote === false
                  ? 'bg-error text-white'
                  : 'bg-surface-alt text-text-secondary hover:bg-error/10 hover:text-error'
              }`}
            >
              <FontAwesomeIcon icon={NAV_ICONS.thumbsDown} className="text-[10px]" /> 沒有
            </button>
          </>
        ) : (
          <span className="text-xs text-text-secondary/60">登入投票</span>
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
          <div key={group.group_key} className="rounded-xl border border-border overflow-hidden">
            {/* Group header */}
            <button
              onClick={() => setExpandedGroup(isExpanded ? null : group.group_key)}
              className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-surface-alt/50 transition-colors"
              style={{ borderLeft: `4px solid ${group.color}` }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: group.color }}
                />
                <span className="font-medium text-sm text-text-main">
                  {group.group_name}
                </span>
                <span className="text-xs text-text-secondary/60">
                  {confirmedCount}/{group.features.length}
                </span>
              </div>

              {/* Compact icons */}
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5 mr-2">
                  {group.features
                    .filter(f => f.status === 'confirmed')
                    .slice(0, 6)
                    .map((f, i) => {
                      const faIcon = getFeatureIcon(f.key)
                      return (
                        <span key={i} className="text-sm" style={{ color: group.color }}>
                          {faIcon ? (
                            <FontAwesomeIcon icon={faIcon} className="text-xs" />
                          ) : (
                            f.icon
                          )}
                        </span>
                      )
                    })}
                  {confirmedCount > 6 && (
                    <span className="text-xs text-text-secondary/60">+{confirmedCount - 6}</span>
                  )}
                </div>
                <FontAwesomeIcon
                  icon={isExpanded ? NAV_ICONS.chevronUp : NAV_ICONS.chevronDown}
                  className="text-text-secondary text-xs"
                />
              </div>
            </button>

            {/* Expanded feature list */}
            {isExpanded && (
              <div className="px-2 pb-2 space-y-1 border-t border-border bg-surface-alt/30">
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
