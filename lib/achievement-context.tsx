'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { checkAchievements, type UnlockedAchievement } from './achievements'
import { earnPoints, earnReviewPoints, type EarnPointsResult } from './points-service'
import { type PointAction } from './points'
import { useAuth } from './auth-context'
import { useLevelUp } from './level-context'
import AchievementToast from '@/components/AchievementToast'
import NearlyUnlockedHint from '@/components/NearlyUnlockedHint'

interface AchievementContextType {
  /** 觸發成就檢查（在用戶做完動作後呼叫） */
  triggerCheck: () => Promise<void>
  /** 發放積分 + 檢查成就 + 升級動效（統一入口） */
  earnAction: (action: PointAction, targetId?: string, metadata?: Record<string, unknown>) => Promise<EarnPointsResult | null>
  /** 評論專用積分（自動根據字數決定） */
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
      // 每次檢查後刷新「即將解鎖」提示
      setHintVersion(v => v + 1)
    } catch (err) {
      console.error('Achievement check failed:', err)
    } finally {
      setChecking(false)
    }
  }, [user, checking])

  /**
   * 統一入口：發放積分 → 檢查成就 → 觸發升級動效
   */
  const earnAction = useCallback(async (
    action: PointAction,
    targetId?: string,
    metadata?: Record<string, unknown>,
  ): Promise<EarnPointsResult | null> => {
    if (!user) return null

    try {
      const result = await earnPoints(user.id, action, targetId, metadata)

      // 如果升級，顯示動效
      if (result.levelUp) {
        showLevelUp(result.levelUp)
      }

      // 發放積分後檢查成就
      if (result.success) {
        const newlyUnlocked = await checkAchievements(user.id)
        if (newlyUnlocked.length > 0) {
          setToastQueue(prev => [...prev, ...newlyUnlocked])
        }
        setHintVersion(v => v + 1)
      }

      return result
    } catch (err) {
      console.error('Earn action failed:', err)
      return null
    }
  }, [user, showLevelUp])

  /**
   * 評論專用：根據字數自動決定積分類型
   */
  const earnReview = useCallback(async (
    spotId: string,
    content: string,
  ): Promise<EarnPointsResult | null> => {
    if (!user) return null

    try {
      const result = await earnReviewPoints(user.id, spotId, content)

      if (result.levelUp) {
        showLevelUp(result.levelUp)
      }

      if (result.success) {
        const newlyUnlocked = await checkAchievements(user.id)
        if (newlyUnlocked.length > 0) {
          setToastQueue(prev => [...prev, ...newlyUnlocked])
        }
        setHintVersion(v => v + 1)
      }

      return result
    } catch (err) {
      console.error('Earn review failed:', err)
      return null
    }
  }, [user, showLevelUp])

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
