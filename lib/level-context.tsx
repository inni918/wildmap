'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { type LevelDefinition } from './levels'
import LevelUpModal from '@/components/LevelUpModal'

// ============================================
// Context 類型
// ============================================

interface LevelContextType {
  /** 觸發升級動效 */
  showLevelUp: (newLevel: LevelDefinition) => void
}

const LevelContext = createContext<LevelContextType>({
  showLevelUp: () => {},
})

// ============================================
// Provider
// ============================================

export function LevelProvider({ children }: { children: ReactNode }) {
  const [pendingLevelUp, setPendingLevelUp] = useState<LevelDefinition | null>(null)

  const showLevelUp = useCallback((newLevel: LevelDefinition) => {
    setPendingLevelUp(newLevel)
  }, [])

  const handleClose = useCallback(() => {
    setPendingLevelUp(null)
  }, [])

  return (
    <LevelContext.Provider value={{ showLevelUp }}>
      {children}
      {pendingLevelUp && (
        <LevelUpModal newLevel={pendingLevelUp} onClose={handleClose} />
      )}
    </LevelContext.Provider>
  )
}

export const useLevelUp = () => useContext(LevelContext)
