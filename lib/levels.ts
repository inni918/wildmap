/**
 * 等級系統定義（共用模組）
 * 由 achievements.ts 和 permissions.ts 共同引用
 */

export interface LevelDefinition {
  readonly level: number
  readonly name: string
  readonly minPoints: number
  readonly icon: string
  readonly color: string
}

export const LEVELS: readonly LevelDefinition[] = [
  { level: 1, name: '探索者', minPoints: 0, icon: '🔍', color: '#5C5C5C' },
  { level: 2, name: '開拓者', minPoints: 50, icon: '🧭', color: '#8B6914' },
  { level: 3, name: '嚮導', minPoints: 200, icon: '🗺️', color: '#52B788' },
  { level: 4, name: '守護者', minPoints: 500, icon: '🛡️', color: '#2D6A4F' },
  { level: 5, name: '先驅者', minPoints: 1000, icon: '⭐', color: '#D4A843' },
] as const

/**
 * 根據積分取得目前等級
 */
export function getLevel(points: number): LevelDefinition {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) return LEVELS[i]
  }
  return LEVELS[0]
}

/**
 * 取得下一個等級（已滿級則回傳 null）
 */
export function getNextLevel(points: number): LevelDefinition | null {
  const current = getLevel(points)
  const idx = LEVELS.findIndex(l => l.level === current.level)
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null
}

/**
 * 計算到下一級的進度百分比 (0-100)
 */
export function getLevelProgress(points: number): number {
  const current = getLevel(points)
  const next = getNextLevel(points)
  if (!next) return 100 // 已滿級

  const needed = next.minPoints - current.minPoints
  const earned = points - current.minPoints
  return Math.min(100, Math.round((earned / needed) * 100))
}

/**
 * 計算到下一級還差多少分
 */
export function getPointsToNextLevel(points: number): number | null {
  const next = getNextLevel(points)
  if (!next) return null
  return next.minPoints - points
}

/**
 * 根據新舊積分判斷是否升級，回傳新等級（無升級回傳 null）
 */
export function checkLevelUp(
  oldPoints: number,
  newPoints: number
): LevelDefinition | null {
  const oldLevel = getLevel(oldPoints)
  const newLevel = getLevel(newPoints)
  if (newLevel.level > oldLevel.level) return newLevel
  return null
}
