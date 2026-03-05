'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { checkAchievements, type UnlockedAchievement } from './achievements'
import { useAuth } from './auth-context'
import AchievementToast from '@/components/AchievementToast'

interface AchievementContextType {
  /** 觸發成就檢查（在用戶做完動作後呼叫） */
  triggerCheck: () => Promise<void>
  /** 是否正在檢查中 */
  checking: boolean
}

const AchievementContext = createContext<AchievementContextType>({
  triggerCheck: async () => {},
  checking: false,
})

export function AchievementProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [checking, setChecking] = useState(false)
  const [toastQueue, setToastQueue] = useState<UnlockedAchievement[]>([])

  const triggerCheck = useCallback(async () => {
    if (!user || checking) return
    setChecking(true)

    try {
      const newlyUnlocked = await checkAchievements(user.id)
      if (newlyUnlocked.length > 0) {
        setToastQueue(prev => [...prev, ...newlyUnlocked])
      }
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
    <AchievementContext.Provider value={{ triggerCheck, checking }}>
      {children}
      {toastQueue.length > 0 && (
        <AchievementToast
          achievements={toastQueue}
          onDismiss={handleDismissToast}
        />
      )}
    </AchievementContext.Provider>
  )
}

export const useAchievements = () => useContext(AchievementContext)
