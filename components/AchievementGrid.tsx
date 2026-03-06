'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import {
  getAllAchievements,
  getUserAchievements,
  getLevel,
  getNextLevel,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  type Achievement,
  type AchievementCategory,
} from '@/lib/achievements'
import AchievementBadge from './AchievementBadge'
import AchievementIcon from './AchievementIcon'
import { CATEGORY_SVG_ICONS } from '@/lib/achievement-icons'

interface Props {
  /** 是否只顯示摘要（profile 頁嵌入用） */
  summary?: boolean
}

const CATEGORIES: AchievementCategory[] = ['exploration', 'contribution', 'community', 'special']

export default function AchievementGrid({ summary }: Props) {
  const { user } = useAuth()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set())
  const [totalPoints, setTotalPoints] = useState(0)
  const [activeTab, setActiveTab] = useState<AchievementCategory>('exploration')
  const [loading, setLoading] = useState(true)
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const [allAchievements, userAchievements] = await Promise.all([
      getAllAchievements(),
      getUserAchievements(user.id),
    ])

    setAchievements(allAchievements)
    const ids = new Set(userAchievements.map(ua => ua.achievement_id))
    setUnlockedIds(ids)

    const points = userAchievements.reduce((sum, ua) => sum + (ua.achievement?.points || 0), 0)
    setTotalPoints(points)

    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const level = getLevel(totalPoints)
  const nextLevel = getNextLevel(totalPoints)
  const unlockedCount = unlockedIds.size
  const totalCount = achievements.length
  const progressPercent = nextLevel
    ? Math.min(100, ((totalPoints - level.minPoints) / (nextLevel.minPoints - level.minPoints)) * 100)
    : 100

  // Summary 模式：顯示最近解鎖 + 等級 + 進度
  if (summary) {
    const recentUnlocked = achievements
      .filter(a => unlockedIds.has(a.id))
      .slice(0, 6)

    return (
      <div className="space-y-4">
        {/* 等級 + 點數 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏅</span>
            <div>
              <div className="text-sm font-bold text-text-main">
                Lv.{level.level} {level.name}
              </div>
              <div className="text-xs text-text-secondary">
                {totalPoints} 點 · {unlockedCount}/{totalCount} 成就
              </div>
            </div>
          </div>
          {nextLevel && (
            <div className="text-xs text-text-secondary">
              距離 Lv.{nextLevel.level} 還需 {nextLevel.minPoints - totalPoints} 點
            </div>
          )}
        </div>

        {/* 進度條 */}
        <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #2D6A4F, #52B788)',
            }}
          />
        </div>

        {/* 最近解鎖的徽章 */}
        {recentUnlocked.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-text-secondary mb-2">最近解鎖</h4>
            <div className="flex flex-wrap gap-2">
              {recentUnlocked.map(a => (
                <AchievementBadge
                  key={a.id}
                  achievement={a}
                  unlocked
                  compact
                />
              ))}
            </div>
          </div>
        )}

        {recentUnlocked.length === 0 && (
          <div className="text-center py-4">
            <span className="text-2xl">🎯</span>
            <p className="text-xs text-text-secondary mt-1">開始探索來解鎖第一個成就吧！</p>
          </div>
        )}
      </div>
    )
  }

  // Full 模式：4 大類 tab + 全部成就
  const filteredAchievements = achievements.filter(a => a.category === activeTab)
  const unlockedList = filteredAchievements.filter(a => unlockedIds.has(a.id))
  const lockedList = filteredAchievements.filter(a => !unlockedIds.has(a.id))

  return (
    <div className="space-y-4">
      {/* 等級條 */}
      <div className="bg-surface rounded-2xl border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏅</span>
            <div>
              <div className="text-base font-bold text-text-main">
                Lv.{level.level} {level.name}
              </div>
              <div className="text-xs text-text-secondary">
                {totalPoints} 點 · {unlockedCount}/{totalCount} 成就已解鎖
              </div>
            </div>
          </div>
        </div>
        <div className="h-2.5 bg-surface-alt rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #2D6A4F, #52B788, #D4A843)',
            }}
          />
        </div>
        {nextLevel && (
          <div className="text-[10px] text-text-secondary mt-1 text-right">
            {totalPoints}/{nextLevel.minPoints} → Lv.{nextLevel.level} {nextLevel.name}
          </div>
        )}
      </div>

      {/* 分類 Tabs */}
      <div className="flex border-b border-border">
        {CATEGORIES.map(cat => {
          const catAchievements = achievements.filter(a => a.category === cat)
          const catUnlocked = catAchievements.filter(a => unlockedIds.has(a.id)).length
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`flex-1 py-2.5 text-center text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === cat
                  ? 'border-primary text-primary-dark'
                  : 'border-transparent text-text-secondary hover:text-text-main'
              }`}
            >
              <span className="mr-1 inline-flex items-center">
                {CATEGORY_SVG_ICONS[cat] ? (
                  <img src={CATEGORY_SVG_ICONS[cat]} alt="" width={16} height={16} className="inline-block" />
                ) : (
                  CATEGORY_ICONS[cat]
                )}
              </span>
              {CATEGORY_LABELS[cat]}
              <span className="ml-1 text-[10px] opacity-60">
                {catUnlocked}/{catAchievements.length}
              </span>
            </button>
          )
        })}
      </div>

      {/* 已解鎖 */}
      {unlockedList.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-primary mb-2 flex items-center gap-1">
            ✅ 已解鎖 ({unlockedList.length})
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {unlockedList.map(a => (
              <AchievementBadge
                key={a.id}
                achievement={a}
                unlocked
                onClick={() => setSelectedAchievement(a)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 未解鎖 */}
      {lockedList.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-text-secondary mb-2 flex items-center gap-1">
            🔒 未解鎖 ({lockedList.length})
            <span className="text-[10px] font-normal text-text-secondary/50 ml-1">
              — 灰色徽章含解鎖提示
            </span>
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {lockedList.map(a => (
              <AchievementBadge
                key={a.id}
                achievement={a}
                unlocked={false}
                onClick={() => setSelectedAchievement(a)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 成就詳情 Modal */}
      {selectedAchievement && (
        <AchievementDetailModal
          achievement={selectedAchievement}
          unlocked={unlockedIds.has(selectedAchievement.id)}
          onClose={() => setSelectedAchievement(null)}
        />
      )}
    </div>
  )
}

// === 成就詳情彈窗 ===

function AchievementDetailModal({
  achievement,
  unlocked,
  onClose,
}: {
  achievement: Achievement
  unlocked: boolean
  onClose: () => void
}) {
  const tierLabels = { bronze: '銅', silver: '銀', gold: '金' }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl border border-border p-6 max-w-xs w-full shadow-2xl animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
          {/* 大徽章 */}
          <div className="relative w-20 h-20 mx-auto mb-3">
            <svg viewBox="0 0 80 80" className="w-full h-full">
              <circle
                cx="40"
                cy="40"
                r="38"
                fill={unlocked ? (
                  achievement.tier === 'gold' ? '#D4A84320' :
                  achievement.tier === 'silver' ? '#A8A8A820' : '#CD7F3220'
                ) : '#F5EFE4'}
                stroke={unlocked ? (
                  achievement.tier === 'gold' ? '#D4A843' :
                  achievement.tier === 'silver' ? '#A8A8A8' : '#CD7F32'
                ) : '#D9CDB8'}
                strokeWidth="2.5"
              />
              <circle
                cx="40"
                cy="40"
                r="31"
                fill="none"
                stroke={unlocked ? (
                  achievement.tier === 'gold' ? '#D4A843' :
                  achievement.tier === 'silver' ? '#A8A8A8' : '#CD7F32'
                ) : '#D9CDB8'}
                strokeWidth="0.5"
                strokeDasharray="4 4"
                opacity={0.4}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`${unlocked ? '' : 'grayscale opacity-40'}`}>
                <AchievementIcon achievementKey={achievement.key} emoji={achievement.icon} size={40} />
              </span>
            </div>
          </div>

          <h3 className={`text-lg font-bold ${unlocked ? 'text-text-main' : 'text-text-secondary'}`}>
            {achievement.name_zh}
          </h3>

          {achievement.name_en && (
            <p className="text-xs text-text-secondary/60 mt-0.5">{achievement.name_en}</p>
          )}

          <p className="text-sm text-text-secondary mt-2">
            {achievement.description_zh}
          </p>

          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-surface-alt text-text-secondary">
              {tierLabels[achievement.tier]}框
            </span>
            <span className="text-xs font-bold text-primary">
              {achievement.points} 點
            </span>
            <span className="text-xs text-text-secondary">
              {CATEGORY_LABELS[achievement.category]}類
            </span>
          </div>

          {unlocked ? (
            <div className="mt-3 text-xs text-primary font-medium flex items-center justify-center gap-1">
              ✅ 已解鎖
            </div>
          ) : (
            <div className="mt-3 space-y-1">
              <div className="text-xs text-text-secondary flex items-center justify-center gap-1">
                🔒 尚未解鎖
              </div>
              <div className="text-[10px] text-text-secondary/50 text-center">
                💡 {achievement.description_zh}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 text-sm font-medium text-text-secondary hover:text-text-main bg-surface-alt rounded-xl transition-colors cursor-pointer"
        >
          關閉
        </button>
      </div>
    </div>
  )
}
