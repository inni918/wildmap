'use client'

import { useState, useEffect } from 'react'
import type { UnlockedAchievement } from '@/lib/achievements'

interface Props {
  achievements: UnlockedAchievement[]
  onDismiss: () => void
}

const TIER_COLORS = {
  bronze: { border: '#CD7F32', bg: '#CD7F3215', text: '#8B5E20' },
  silver: { border: '#A8A8A8', bg: '#A8A8A815', text: '#666666' },
  gold: { border: '#D4A843', bg: '#D4A84315', text: '#8B6914' },
}

export default function AchievementToast({ achievements, onDismiss }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (achievements.length === 0) return

    // 入場動畫
    const showTimer = setTimeout(() => setIsVisible(true), 100)

    // 自動消失（每個 toast 顯示 4 秒）
    const hideTimer = setTimeout(() => {
      handleNext()
    }, 4000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, achievements.length])

  const handleNext = () => {
    setIsExiting(true)
    setTimeout(() => {
      if (currentIndex < achievements.length - 1) {
        setCurrentIndex(prev => prev + 1)
        setIsExiting(false)
        setIsVisible(true)
      } else {
        onDismiss()
      }
    }, 300)
  }

  if (achievements.length === 0) return null

  const current = achievements[currentIndex]
  if (!current) return null

  const tier = TIER_COLORS[current.achievement.tier]

  return (
    <div className="fixed top-4 left-0 right-0 z-[100] flex justify-center pointer-events-none px-4">
      <button
        onClick={handleNext}
        className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl border-2 shadow-2xl backdrop-blur-sm transition-all duration-300 cursor-pointer max-w-sm w-full ${
          isVisible && !isExiting
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 -translate-y-4 scale-95'
        }`}
        style={{
          backgroundColor: `${tier.bg}`,
          borderColor: tier.border,
          boxShadow: `0 8px 32px ${tier.border}30`,
        }}
      >
        {/* 成就 icon */}
        <div className="relative flex-shrink-0">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${tier.bg}, ${tier.border}30)`,
              border: `2px solid ${tier.border}`,
            }}
          >
            <span className="text-2xl animate-bounce">{current.achievement.icon}</span>
          </div>
          {/* 閃光效果 */}
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ backgroundColor: tier.border }}
          />
        </div>

        {/* 文字 */}
        <div className="flex-1 min-w-0 text-left">
          <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: tier.border }}>
            🎉 成就解鎖！
          </div>
          <div className="text-sm font-bold text-text-main truncate">
            {current.achievement.name_zh}
          </div>
          <div className="text-xs text-text-secondary truncate">
            +{current.achievement.points} 點
          </div>
        </div>

        {/* 計數（多個成就時） */}
        {achievements.length > 1 && (
          <div className="flex-shrink-0 text-[10px] text-text-secondary bg-surface-alt rounded-full px-2 py-0.5">
            {currentIndex + 1}/{achievements.length}
          </div>
        )}
      </button>
    </div>
  )
}
