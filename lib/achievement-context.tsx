'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { checkAchievements, type UnlockedAchievement } from './achievements'
import { useAuth } from './auth-context'
import { useLevelUp } from './level-context'
import AchievementToast from '@/components/AchievementToast'
import NearlyUnlockedHint from '@/components/NearlyUnlockedHint'

/**
 * 成就系統 v2 — 積分發放已移除，成就由觸發點直接驅動
 * 保留 earnAction / earnReview 介面做向後相容（no-op）
 */

interface EarnPointsResult {
  success: boolean
  pointsEarned: number
  newTotal: number
  levelUp: null
  reason?: string
}

interface AchievementContextType {
  /** 觸發成就檢查（在用戶做完動作後呼叫） */
  triggerCheck: () => Promise<void>
  /** 向後相容：原本發放積分，現在只觸發成就檢查 */
  earnAction: (action: string, targetId?: string, metadata?: Record<string, unknown>) => Promise<EarnPointsResult | null>
  /** 向後相容：原本發放評論積分，現在只觸發成就檢查 */
  earnReview: (spotId: string, content: string) => Promise<EarnPointsResult | null>
  /** 是否正在檢查中 */
  checking: boolean
  /** 觸發即將解鎖提示刷新的版本號 */
  hintVersion: number
}

const AchievementContext = createContext<AchievementContextType>({
  triggerCheck: async () => {},
  earnAction: async () => null,
  earnReview: async () => null,
  checking: false,
  hintVersion: 0,
})

export function AchievementProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { showLevelUp } = useLevelUp()
  const [checking, setChecking] = useState(false)
  const [toastQueue, setToastQueue] = useState<UnlockedAchievement[]>([])
  const [hintVersion, setHintVersion] = useState(0)

  const triggerCheck = useCallback(async () => {
    if (!user || checking) return
    setChecking(true)

    try {
      const newlyUnlocked = await checkAchievements(user.id)
      if (newlyUnlocked.length > 0) {
        setToastQueue(prev => [...prev, ...newlyUnlocked])
      }
      setHintVersion(v => v + 1)
    } catch (err) {
      console.error('Achievement check failed:', err)
    } finally {
      setChecking(false)
    }
  }, [user, checking])

  /**
   * 向後相容入口：不再發放積分，只觸發成就檢查
   * 各元件呼叫 earnAction 後仍然會正常觸發成就
   */
  const earnAction = useCallback(async (
    _action: string,
    _targetId?: string,
    _metadata?: Record<string, unknown>,
  ): Promise<EarnPointsResult | null> => {
    if (!user) return null

    try {
      // 直接觸發成就檢查（不再發放積分）
      const newlyUnlocked = await checkAchievements(user.id)
      if (newlyUnlocked.length > 0) {
        setToastQueue(prev => [...prev, ...newlyUnlocked])
      }
      setHintVersion(v => v + 1)

      return {
        success: true,
        pointsEarned: 0,
        newTotal: 0,
        levelUp: null,
      }
    } catch (err) {
      console.error('Earn action failed:', err)
      return null
    }
  }, [user])

  /**
   * 向後相容：評論專用
   */
  const earnReview = useCallback(async (
    _spotId: string,
    _content: string,
  ): Promise<EarnPointsResult | null> => {
    if (!user) return null

    try {
      const newlyUnlocked = await checkAchievements(user.id)
      if (newlyUnlocked.length > 0) {
        setToastQueue(prev => [...prev, ...newlyUnlocked])
      }
      setHintVersion(v => v + 1)

      return {
        success: true,
        pointsEarned: 0,
        newTotal: 0,
        levelUp: null,
      }
    } catch (err) {
      console.error('Earn review failed:', err)
      return null
    }
  }, [user])

  const handleDismissToast = useCallback(() => {
    setToastQueue([])
  }, [])

  return (
    <AchievementContext.Provider value={{ triggerCheck, earnAction, earnReview, checking, hintVersion }}>
      {children}
      {toastQueue.length > 0 && (
        <AchievementToast
          achievements={toastQueue}
          onDismiss={handleDismissToast}
        />
      )}
      {/* 即將解鎖提示（只在沒有 Toast 時顯示） */}
      {toastQueue.length === 0 && <NearlyUnlockedHint key={hintVersion} />}
    </AchievementContext.Provider>
  )
}

export const useAchievements = () => useContext(AchievementContext)
