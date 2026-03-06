'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getNearlyUnlockedAchievements, type AchievementProgress } from '@/lib/achievements'

/**
 * 「即將解鎖」進度提示
 * 顯示在頁面底部，當用戶有成就進度 >= 70% 時觸發
 */
export default function NearlyUnlockedHint() {
  const { user } = useAuth()
  const [hints, setHints] = useState<AchievementProgress[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const fetchProgress = useCallback(async () => {
    if (!user) return
    try {
      const progress = await getNearlyUnlockedAchievements(user.id)
      if (progress.length > 0) {
        setHints(progress)
        // 延遲顯示，不干擾用戶當前操作
        setTimeout(() => setIsVisible(true), 2000)
      }
    } catch (err) {
      console.error('Failed to fetch achievement progress:', err)
    }
  }, [user])

  useEffect(() => {
    fetchProgress()
  }, [fetchProgress])

  // 自動輪播多個提示
  useEffect(() => {
    if (hints.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % hints.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [hints.length])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => setDismissed(true), 300)
  }

  if (dismissed || hints.length === 0 || !isVisible) return null

  const current = hints[currentIndex]
  if (!current) return null

  const remaining = current.target - current.current

  return (
    <div
      className={`fixed bottom-20 md:bottom-4 left-4 right-4 z-50 flex justify-center pointer-events-none transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <button
        onClick={handleDismiss}
        className="pointer-events-auto max-w-md w-full bg-surface/95 backdrop-blur-sm border border-border rounded-2xl px-4 py-3 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg">{current.achievement.icon}</span>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="text-xs text-primary font-semibold flex items-center gap-1">
              <span>🎯</span>
              即將解鎖
              {hints.length > 1 && (
                <span className="text-text-secondary/50 font-normal ml-1">
                  {currentIndex + 1}/{hints.length}
                </span>
              )}
            </div>
            <div className="text-sm text-text-main font-medium truncate">
              你離「{current.achievement.name_zh}」只差{' '}
              <span className="text-primary font-bold">{remaining}</span>{' '}
              步
            </div>
          </div>

          {/* 進度圓環 */}
          <div className="flex-shrink-0 w-10 h-10 relative">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              {/* 背景圓 */}
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="#D9CDB8"
                strokeWidth="2.5"
              />
              {/* 進度圓 */}
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="#2D6A4F"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={`${current.percent * 0.974} 100`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary">
                {Math.round(current.percent)}%
              </span>
            </div>
          </div>
        </div>

        {/* 進度條 */}
        <div className="mt-2 h-1.5 bg-surface-alt rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${current.percent}%`,
              background: 'linear-gradient(90deg, #2D6A4F, #52B788)',
            }}
          />
        </div>
      </button>
    </div>
  )
}
