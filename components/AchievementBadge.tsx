'use client'

import type { Achievement, AchievementTier } from '@/lib/achievements'

interface Props {
  achievement: Achievement
  unlocked: boolean
  compact?: boolean
  onClick?: () => void
}

// 邊框顏色定義
const TIER_COLORS: Record<AchievementTier, { border: string; bg: string; glow: string; label: string }> = {
  bronze: {
    border: '#CD7F32',
    bg: '#CD7F3220',
    glow: '#CD7F3240',
    label: '銅',
  },
  silver: {
    border: '#A8A8A8',
    bg: '#A8A8A820',
    glow: '#A8A8A840',
    label: '銀',
  },
  gold: {
    border: '#D4A843',
    bg: '#D4A84320',
    glow: '#D4A84350',
    label: '金',
  },
}

export default function AchievementBadge({ achievement, unlocked, compact, onClick }: Props) {
  const tier = TIER_COLORS[achievement.tier]

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`relative flex items-center gap-2 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
          unlocked
            ? 'bg-surface hover:shadow-md'
            : 'bg-surface-alt/50 opacity-50 grayscale'
        }`}
        style={{
          borderColor: unlocked ? tier.border : '#D9CDB8',
        }}
        title={achievement.description_zh || achievement.name_zh}
      >
        <span className="text-lg">{achievement.icon}</span>
        <span className={`text-xs font-medium ${unlocked ? 'text-text-main' : 'text-text-secondary'}`}>
          {achievement.name_zh}
        </span>
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
          style={{
            backgroundColor: unlocked ? tier.bg : '#D9CDB820',
            color: unlocked ? tier.border : '#5C5C5C',
          }}
        >
          {achievement.points}pt
        </span>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center p-3 rounded-2xl border-2 transition-all cursor-pointer group ${
        unlocked
          ? 'bg-surface hover:shadow-lg hover:-translate-y-0.5'
          : 'bg-surface-alt/30 opacity-60 grayscale hover:opacity-70'
      }`}
      style={{
        borderColor: unlocked ? tier.border : '#D9CDB8',
        boxShadow: unlocked ? `0 2px 12px ${tier.glow}` : 'none',
      }}
      title={achievement.description_zh || achievement.name_zh}
    >
      {/* 徽章 SVG */}
      <div className="relative w-14 h-14 mb-2">
        <svg viewBox="0 0 56 56" className="w-full h-full">
          {/* 外框 */}
          <circle
            cx="28"
            cy="28"
            r="26"
            fill={unlocked ? tier.bg : '#F5EFE4'}
            stroke={unlocked ? tier.border : '#D9CDB8'}
            strokeWidth="2"
          />
          {/* 裝飾內圈 */}
          <circle
            cx="28"
            cy="28"
            r="21"
            fill="none"
            stroke={unlocked ? tier.border : '#D9CDB8'}
            strokeWidth="0.5"
            strokeDasharray="3 3"
            opacity={unlocked ? 0.5 : 0.3}
          />
        </svg>
        {/* Emoji icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl ${unlocked ? '' : 'grayscale opacity-40'}`}>
            {achievement.icon}
          </span>
        </div>
        {/* 鎖頭（未解鎖） */}
        {!unlocked && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-text-secondary flex items-center justify-center">
            <span className="text-[10px]">🔒</span>
          </div>
        )}
      </div>

      {/* 名稱 */}
      <span className={`text-xs font-semibold text-center leading-tight ${
        unlocked ? 'text-text-main' : 'text-text-secondary'
      }`}>
        {achievement.name_zh}
      </span>

      {/* 點數 */}
      <span
        className="text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full"
        style={{
          backgroundColor: unlocked ? tier.bg : '#D9CDB820',
          color: unlocked ? tier.border : '#5C5C5C',
        }}
      >
        {achievement.points} 點
      </span>
    </button>
  )
}
