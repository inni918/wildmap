'use client'

import type { Achievement, AchievementTier } from '@/lib/achievements'
import AchievementIcon from './AchievementIcon'

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

// 未解鎖時的模糊提示文字
function getLockedHint(achievement: Achievement): string {
  const criteria = achievement.criteria as Record<string, unknown>
  if (!criteria?.type) return '繼續探索以解鎖'

  const type = criteria.type as string
  const threshold = criteria.threshold as number

  switch (type) {
    case 'view_spots':
      return `查看 ${threshold} 個地點`
    case 'view_region':
      return `探索特定區域 ${threshold}+ 個地點`
    case 'view_all_counties':
      return `打卡 ${threshold}+ 個縣市`
    case 'view_category':
      return `探索特定類型 ${threshold}+ 個地點`
    case 'add_spots':
      return `新增 ${threshold} 個地點`
    case 'upload_photos':
      return `上傳 ${threshold} 張照片`
    case 'comments':
      return `留下 ${threshold} 則評論`
    case 'votes':
      return `投票 ${threshold} 次`
    case 'edits':
      return `編輯 ${threshold} 個地點`
    case 'ratings':
      return `評分 ${threshold} 次`
    case 'replies':
      return `回覆 ${threshold} 則評論`
    case 'favorites':
      return `收藏 ${threshold} 個地點`
    case 'reports':
      return `回報 ${threshold} 個問題`
    case 'meta_achievement':
      return '完成一組相關成就'
    case 'altitude_variety':
      return '收集不同海拔的地點'
    case 'detailed_comments':
      return '撰寫詳細的評論'
    case 'consecutive_days':
      return `連續 ${threshold} 天使用`
    case 'time_range':
    case 'time_category_checkin':
      return '在特定時間活動'
    case 'early_user':
      return '限定資格'
    default:
      return '繼續探索以解鎖'
  }
}

export default function AchievementBadge({ achievement, unlocked, compact, onClick }: Props) {
  const tier = TIER_COLORS[achievement.tier]
  const lockedHint = !unlocked ? getLockedHint(achievement) : ''

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`relative flex items-center gap-2 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
          unlocked
            ? 'bg-surface hover:shadow-md'
            : 'bg-surface-alt/30 opacity-40 hover:opacity-50'
        }`}
        style={{
          borderColor: unlocked ? tier.border : '#D9CDB8',
          filter: unlocked ? 'none' : 'grayscale(100%)',
        }}
        title={unlocked ? (achievement.description_zh || achievement.name_zh) : lockedHint}
      >
        <span className={`${unlocked ? '' : 'opacity-50'}`}>
          <AchievementIcon achievementKey={achievement.key} emoji={achievement.icon} size={20} />
        </span>
        <span className={`text-xs font-medium ${unlocked ? 'text-text-main' : 'text-text-secondary/60'}`}>
          {achievement.name_zh}
        </span>
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
          style={{
            backgroundColor: unlocked ? tier.bg : '#D9CDB810',
            color: unlocked ? tier.border : '#5C5C5C80',
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
          : 'bg-surface-alt/20 hover:bg-surface-alt/30'
      }`}
      style={{
        borderColor: unlocked ? tier.border : '#D9CDB860',
        boxShadow: unlocked ? `0 2px 12px ${tier.glow}` : 'none',
        filter: unlocked ? 'none' : 'grayscale(100%)',
        opacity: unlocked ? 1 : 0.5,
      }}
      title={unlocked ? (achievement.description_zh || achievement.name_zh) : lockedHint}
    >
      {/* 徽章 SVG */}
      <div className="relative w-14 h-14 mb-2">
        <svg viewBox="0 0 56 56" className="w-full h-full">
          {/* 外框 */}
          <circle
            cx="28"
            cy="28"
            r="26"
            fill={unlocked ? tier.bg : '#F0EBE0'}
            stroke={unlocked ? tier.border : '#D9CDB860'}
            strokeWidth="2"
          />
          {/* 裝飾內圈 */}
          <circle
            cx="28"
            cy="28"
            r="21"
            fill="none"
            stroke={unlocked ? tier.border : '#D9CDB850'}
            strokeWidth="0.5"
            strokeDasharray="3 3"
            opacity={unlocked ? 0.5 : 0.2}
          />
        </svg>
        {/* Achievement SVG icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${unlocked ? '' : 'opacity-30'}`}>
            <AchievementIcon achievementKey={achievement.key} emoji={achievement.icon} size={28} />
          </span>
        </div>
        {/* 鎖頭（未解鎖） */}
        {!unlocked && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-text-secondary/60 flex items-center justify-center">
            <span className="text-[10px]">🔒</span>
          </div>
        )}
      </div>

      {/* 名稱 */}
      <span className={`text-xs font-semibold text-center leading-tight ${
        unlocked ? 'text-text-main' : 'text-text-secondary/50'
      }`}>
        {achievement.name_zh}
      </span>

      {/* 點數（已解鎖）或模糊提示（未解鎖） */}
      {unlocked ? (
        <span
          className="text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: tier.bg,
            color: tier.border,
          }}
        >
          {achievement.points} 點
        </span>
      ) : (
        <span className="text-[9px] text-text-secondary/40 mt-1 text-center leading-tight line-clamp-1 px-1">
          {lockedHint}
        </span>
      )}
    </button>
  )
}
