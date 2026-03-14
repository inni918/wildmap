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
  type UserAchievement,
} from '@/lib/achievements'
import AchievementBadge from './AchievementBadge'
import AchievementIcon from './AchievementIcon'
import { CATEGORY_SVG_ICONS } from '@/lib/achievement-icons'
import { supabase } from '@/lib/supabase'

interface Props {
  /** 是否只顯示摘要（profile 頁嵌入用） */
  summary?: boolean
}

const CATEGORIES: AchievementCategory[] = ['exploration', 'contribution', 'community', 'special']

// ============================================
// 成就進度估算
// ============================================

interface AchievementProgress {
  /** 百分比 0-100 */
  percent: number
}

function estimateAchievementProgress(
  achievement: Achievement,
  stats: Record<string, number>,
): AchievementProgress {
  const criteria = achievement.criteria as Record<string, unknown>
  const type = criteria?.type as string | undefined
  const threshold = (criteria?.threshold as number) || 1

  if (!type) return { percent: 0 }

  let current = 0
  switch (type) {
    case 'view_spots':
    case 'checkins':
      current = stats.checkins_total || 0
      break
    case 'comments':
      current = stats.comments_total || 0
      break
    case 'ratings':
      current = stats.ratings_total || 0
      break
    case 'votes':
      current = stats.votes_total || 0
      break
    case 'upload_photos':
      current = stats.photos_total || 0
      break
    case 'add_spots':
      current = stats.spots_total || 0
      break
    case 'edits':
      current = stats.edits_total || 0
      break
    case 'replies':
      current = stats.replies_total || 0
      break
    case 'favorites':
      current = stats.favorites_unique || 0
      break
    case 'reports':
      current = stats.reports_total || 0
      break
    case 'consecutive_days':
      current = stats.streak_longest || stats.streak_current || 0
      break
    case 'detailed_comments':
      current = stats.detailed_comments || 0
      break
    case 'view_all_counties':
    case 'view_region':
      // 這些需要特殊查詢，先給一個粗略估計
      current = stats.checkins_total ? Math.min(threshold, Math.floor((stats.checkins_total || 0) / 3)) : 0
      break
    default:
      return { percent: 0 }
  }

  return { percent: Math.min(100, Math.round((current / threshold) * 100)) }
}

export default function AchievementGrid({ summary }: Props) {
  const { user, loading: authLoading } = useAuth()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [unlockedMap, setUnlockedMap] = useState<Map<string, UserAchievement>>(new Map())
  const [totalPoints, setTotalPoints] = useState(0)
  const [activeTab, setActiveTab] = useState<AchievementCategory>('exploration')
  const [loading, setLoading] = useState(true)
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const [userStats, setUserStats] = useState<Record<string, number>>({})

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const [allAchievements, userAchievements] = await Promise.all([
      getAllAchievements(),
      getUserAchievements(user.id),
    ])

    setAchievements(allAchievements)

    const uaMap = new Map<string, UserAchievement>()
    for (const ua of userAchievements) {
      uaMap.set(ua.achievement_id, ua)
    }
    setUnlockedMap(uaMap)

    const points = userAchievements.reduce((sum, ua) => sum + (ua.achievement?.points || 0), 0)
    setTotalPoints(points)

    // 取得 user_stats（用於進度估算）
    const { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (stats) {
      setUserStats(stats as Record<string, number>)
    }

    setLoading(false)
  }, [user])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setLoading(false)
      return
    }
    fetchData()
  }, [fetchData, authLoading, user])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const level = getLevel(totalPoints)
  const nextLevel = getNextLevel(totalPoints)
  const unlockedCount = unlockedMap.size
  const totalCount = achievements.length
  const progressPercent = nextLevel
    ? Math.min(100, ((totalPoints - level.minPoints) / (nextLevel.minPoints - level.minPoints)) * 100)
    : 100

  // Summary 模式
  if (summary) {
    const recentUnlocked = achievements
      .filter(a => unlockedMap.has(a.id))
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
                <span className="text-[10px] text-text-secondary/50 font-normal ml-1">榮譽稱號</span>
              </div>
              <div className="text-xs text-text-secondary">
                {unlockedCount}/{totalCount} 成就
              </div>
            </div>
          </div>
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

  // Full 模式：4 大類 tab + 三態顯示
  const filteredAchievements = achievements.filter(a => a.category === activeTab)

  // 分成三組：已解鎖、即將解鎖（≥70%）、未解鎖（<70%）
  const unlockedList: { achievement: Achievement; ua: UserAchievement }[] = []
  const nearlyList: { achievement: Achievement; progress: number }[] = []
  const lockedList: { achievement: Achievement; progress: number }[] = []

  for (const a of filteredAchievements) {
    const ua = unlockedMap.get(a.id)
    if (ua) {
      unlockedList.push({ achievement: a, ua })
    } else {
      const prog = estimateAchievementProgress(a, userStats)
      if (prog.percent >= 70) {
        nearlyList.push({ achievement: a, progress: prog.percent })
      } else {
        lockedList.push({ achievement: a, progress: prog.percent })
      }
    }
  }

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
                <span className="text-[10px] text-text-secondary/50 font-normal ml-1.5">榮譽稱號</span>
              </div>
              <div className="text-xs text-text-secondary">
                {unlockedCount}/{totalCount} 成就已解鎖
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
      </div>

      {/* 分類 Tabs */}
      <div className="flex border-b border-border">
        {CATEGORIES.map(cat => {
          const catAchievements = achievements.filter(a => a.category === cat)
          const catUnlocked = catAchievements.filter(a => unlockedMap.has(a.id)).length
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

      {/* ✅ 已解鎖 */}
      {unlockedList.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-primary mb-2 flex items-center gap-1">
            ✅ 已解鎖 ({unlockedList.length})
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {unlockedList.map(({ achievement, ua }) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                unlocked
                progress={100}
                unlockedAt={ua.unlocked_at}
                onClick={() => setSelectedAchievement(achievement)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 🔓 即將解鎖 */}
      {nearlyList.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-[#D4A843] mb-2 flex items-center gap-1">
            🔓 即將解鎖 ({nearlyList.length})
            <span className="text-[10px] font-normal text-text-secondary/50 ml-1">
              — 再努力一下！
            </span>
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {nearlyList.map(({ achievement, progress }) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                unlocked={false}
                progress={progress}
                onClick={() => setSelectedAchievement(achievement)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 🔒 未解鎖 */}
      {lockedList.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-text-secondary mb-2 flex items-center gap-1">
            🔒 未解鎖 ({lockedList.length})
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {lockedList.map(({ achievement, progress }) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                unlocked={false}
                progress={progress}
                onClick={() => setSelectedAchievement(achievement)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 成就詳情 Modal */}
      {selectedAchievement && (
        <AchievementDetailModal
          achievement={selectedAchievement}
          unlocked={unlockedMap.has(selectedAchievement.id)}
          unlockedAt={unlockedMap.get(selectedAchievement.id)?.unlocked_at}
          progress={
            unlockedMap.has(selectedAchievement.id)
              ? 100
              : estimateAchievementProgress(selectedAchievement, userStats).percent
          }
          onClose={() => setSelectedAchievement(null)}
        />
      )}
    </div>
  )
}

// === 成就詳情彈窗（三態） ===

function AchievementDetailModal({
  achievement,
  unlocked,
  unlockedAt,
  progress,
  onClose,
}: {
  achievement: Achievement
  unlocked: boolean
  unlockedAt?: string
  progress: number
  onClose: () => void
}) {
  const tierLabels = { bronze: '銅', silver: '銀', gold: '金' }
  const state = unlocked ? 'unlocked' : progress >= 70 ? 'nearly' : 'locked'

  const tierColors = {
    gold: '#D4A843',
    silver: '#A8A8A8',
    bronze: '#CD7F32',
  }

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
                fill={state === 'unlocked' ? `${tierColors[achievement.tier]}20`
                  : state === 'nearly' ? '#D4A84310' : '#F5EFE4'}
                stroke={state === 'unlocked' ? tierColors[achievement.tier]
                  : state === 'nearly' ? '#D4A84360' : '#D9CDB8'}
                strokeWidth="2.5"
                className={state === 'nearly' ? 'animate-pulse' : ''}
              />
              <circle
                cx="40"
                cy="40"
                r="31"
                fill="none"
                stroke={state === 'unlocked' ? tierColors[achievement.tier]
                  : state === 'nearly' ? '#D4A84350' : '#D9CDB8'}
                strokeWidth="0.5"
                strokeDasharray="4 4"
                opacity={0.4}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={
                  state === 'unlocked' ? ''
                  : state === 'nearly' ? 'opacity-70'
                  : 'opacity-40'
                }
                style={{
                  filter: state === 'locked' ? 'grayscale(1)' : 'none',
                }}
              >
                <AchievementIcon achievementKey={achievement.key} emoji={achievement.icon} size={40} />
              </span>
            </div>
          </div>

          <h3 className={`text-lg font-bold ${
            state === 'unlocked' ? 'text-text-main'
            : state === 'nearly' ? 'text-text-main/80'
            : 'text-text-secondary'
          }`}>
            {achievement.name_zh}
          </h3>

          {achievement.name_en && (
            <p className="text-xs text-text-secondary/60 mt-0.5">{achievement.name_en}</p>
          )}

          <p className="text-sm text-text-secondary mt-2">
            {state === 'unlocked'
              ? achievement.description_zh  // 已解鎖：完整條件公開
              : achievement.hint_text || achievement.description_zh  // 未解鎖：模糊提示
            }
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

          {/* 進度條 */}
          {state !== 'unlocked' && (
            <div className="mt-3">
              <div className="h-2 bg-border/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    background: state === 'nearly'
                      ? 'linear-gradient(90deg, #D4A843, #F0C060)'
                      : '#888',
                  }}
                />
              </div>
              <span className="text-[10px] text-text-secondary/60 mt-1 block">
                進度 {Math.round(progress)}%
              </span>
            </div>
          )}

          {state === 'unlocked' ? (
            <div className="mt-3 text-xs font-medium flex items-center justify-center gap-1" style={{ color: tierColors[achievement.tier] }}>
              ✅ 已解鎖
              {unlockedAt && (
                <span className="text-text-secondary/50 font-normal ml-1">
                  {new Date(unlockedAt).toLocaleDateString('zh-TW', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>
          ) : state === 'nearly' ? (
            <div className="mt-3 space-y-1">
              <div className="text-xs text-[#D4A843] font-bold flex items-center justify-center gap-1">
                🔓 即將解鎖！
              </div>
              <div className="text-[10px] text-text-secondary/60">
                再努力一下就能達成了
              </div>
            </div>
          ) : (
            <div className="mt-3 space-y-1">
              <div className="text-xs text-text-secondary flex items-center justify-center gap-1">
                🔒 尚未解鎖
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
