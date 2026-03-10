'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import {
  getUserAchievements,
  getFeaturedAchievements,
  setFeaturedAchievement,
  removeFeaturedAchievement,
  type Achievement,
} from '@/lib/achievements'
import AchievementBadge from './AchievementBadge'

/**
 * Profile 精選徽章：用戶可自選 3 個成就展示
 */
export default function FeaturedBadges() {
  const { user, loading: authLoading } = useAuth()
  const [featured, setFeatured] = useState<(Achievement | null)[]>([null, null, null])
  const [showPicker, setShowPicker] = useState<number | null>(null) // 正在選擇的 slot
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const [featuredList, userAchievements] = await Promise.all([
      getFeaturedAchievements(user.id),
      getUserAchievements(user.id),
    ])

    // 精選：按 slot 填入
    const slots: (Achievement | null)[] = [null, null, null]
    // getFeaturedAchievements 已經按 slot 排序
    // 但我們需要從 featured_achievements 取 slot 資訊，這裡做簡化處理
    featuredList.forEach((a, i) => {
      if (i < 3) slots[i] = a
    })
    setFeatured(slots)

    // 已解鎖成就
    const unlocked = userAchievements
      .map(ua => ua.achievement)
      .filter(Boolean) as Achievement[]
    setUnlockedAchievements(unlocked)

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

  const handleSelectSlot = (slot: number) => {
    setShowPicker(slot)
  }

  const handlePickAchievement = async (achievement: Achievement, slot: number) => {
    if (!user) return

    // 檢查是否已在其他 slot 中
    const existingSlot = featured.findIndex(f => f?.id === achievement.id)
    if (existingSlot >= 0 && existingSlot !== slot) {
      // 從舊 slot 移除
      await removeFeaturedAchievement(user.id, existingSlot + 1)
    }

    await setFeaturedAchievement(user.id, achievement.id, slot + 1)

    const newFeatured = [...featured]
    if (existingSlot >= 0) newFeatured[existingSlot] = null
    newFeatured[slot] = achievement
    setFeatured(newFeatured)
    setShowPicker(null)
  }

  const handleRemoveSlot = async (slot: number) => {
    if (!user) return
    await removeFeaturedAchievement(user.id, slot + 1)
    const newFeatured = [...featured]
    newFeatured[slot] = null
    setFeatured(newFeatured)
  }

  if (loading) return null

  const hasFeatured = featured.some(f => f !== null)
  const featuredIds = new Set(featured.filter(Boolean).map(f => f!.id))

  return (
    <div>
      {/* 精選徽章展示 */}
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-xs font-semibold text-text-secondary">✨ 精選徽章</h4>
        {!hasFeatured && (
          <span className="text-[10px] text-text-secondary/50">點擊 + 選擇展示</span>
        )}
      </div>
      <div className="flex gap-2">
        {[0, 1, 2].map(slot => {
          const achievement = featured[slot]
          return (
            <div key={slot} className="flex-1">
              {achievement ? (
                <div className="relative group">
                  <AchievementBadge
                    achievement={achievement}
                    unlocked
                    compact
                    onClick={() => handleSelectSlot(slot)}
                  />
                  {/* 移除按鈕 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveSlot(slot)
                    }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-error/80 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleSelectSlot(slot)}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-border hover:border-primary/30 text-text-secondary/40 hover:text-primary/40 transition-colors cursor-pointer flex items-center justify-center gap-1 text-sm"
                >
                  <span className="text-lg">+</span>
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* 選擇器彈窗 */}
      {showPicker !== null && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[2px]"
          onClick={() => setShowPicker(null)}
        >
          <div
            className="bg-surface rounded-t-2xl border-t border-border w-full max-w-lg max-h-[60vh] overflow-auto p-4 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-text-main">選擇展示的成就</h3>
              <button
                onClick={() => setShowPicker(null)}
                className="text-text-secondary hover:text-text-main p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {unlockedAchievements.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-2xl">🎯</span>
                <p className="text-xs text-text-secondary mt-2">還沒有解鎖的成就可展示</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {unlockedAchievements.map(a => (
                  <button
                    key={a.id}
                    onClick={() => handlePickAchievement(a, showPicker)}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${
                      featuredIds.has(a.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30 hover:bg-surface-alt/50'
                    }`}
                  >
                    <span className="text-xl">{a.icon}</span>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-xs font-medium text-text-main truncate">{a.name_zh}</div>
                      <div className="text-[10px] text-text-secondary">{a.points} 點</div>
                    </div>
                    {featuredIds.has(a.id) && (
                      <span className="text-[10px] text-primary">展示中</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 動畫 */}
      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
