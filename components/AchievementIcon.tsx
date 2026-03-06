'use client'

import Image from 'next/image'
import { getAchievementIconPath } from '@/lib/achievement-icons'

interface Props {
  /** achievement key (snake_case) */
  achievementKey: string
  /** emoji fallback from DB */
  emoji?: string
  /** CSS size in px */
  size?: number
  /** Additional CSS classes */
  className?: string
}

/**
 * 成就 icon 元件：優先顯示 SVG，找不到時 fallback 到 emoji
 */
export default function AchievementIcon({ achievementKey, emoji, size = 24, className = '' }: Props) {
  const iconPath = getAchievementIconPath(achievementKey)

  if (iconPath) {
    return (
      <Image
        src={iconPath}
        alt={achievementKey}
        width={size}
        height={size}
        className={`inline-block ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  // Fallback to emoji
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.7 }}
    >
      {emoji || '🏆'}
    </span>
  )
}
