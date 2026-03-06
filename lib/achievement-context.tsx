'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { checkAchievements, type UnlockedAchievement } from './achievements'
import { useAuth } from './auth-context'
import AchievementToast from '@/components/AchievementToast'
import NearlyUnlockedHint from '@/components/NearlyUnlockedHint'

interface AchievementContextType {
  /** 觸發成就檢查（在用戶做完動作後呼叫） */
  triggerCheck: () => Promise<void>
  /** 是否正在檢查中 */
  checking: boolean
  /** 觸發即將解鎖提示刷新的版本號 */
  hintVersion: number
}

const AchievementContext = createContext<AchievementContextType>({
  triggerCheck: async () => {},
  checking: false,
  hintVersion: 0,
})

export function AchievementProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
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

  const handleDismissToast = useCallback(() => {
    setToastQueue([])
  }, [])

  return (
    <AchievementContext.Provider value={{ triggerCheck, checking, hintVersion }}>
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
