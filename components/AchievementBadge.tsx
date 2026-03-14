'use client'

import type { Achievement, AchievementTier } from '@/lib/achievements'
import AchievementIcon from './AchievementIcon'

interface Props {
  achievement: Achievement
  unlocked: boolean
  compact?: boolean
  onClick?: () => void
  /** 進度百分比 0-100（三態顯示用） */
  progress?: number
  /** 解鎖日期 */
  unlockedAt?: string
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
  // 優先使用 hint_text
  if (achievement.hint_text) return achievement.hint_text

  if (!criteria?.type) return '繼續探索以解鎖'

  const type = criteria.type as string
  const threshold = criteria.threshold as number

  switch (type) {
    case 'view_spots':
      return `探索更多地方吧`
    case 'view_region':
      return `探索特定區域`
    case 'view_all_counties':
      return `讓足跡遍布更多縣市`
    case 'view_category':
      return `探索特定類型的地點`
    case 'add_spots':
      return `開始貢獻新地點`
    case 'upload_photos':
      return `上傳更多照片`
    case 'comments':
      return `分享你的體驗`
    case 'votes':
      return `積極參與投票`
    case 'edits':
      return `幫助編輯地點資訊`
    case 'ratings':
      return `為更多地點評分`
    case 'replies':
      return `回覆其他人的留言`
    case 'favorites':
      return `收藏更多喜歡的地點`
    case 'reports':
      return `回報地點問題`
    case 'meta_achievement':
      return '完成一組相關成就'
    case 'altitude_variety':
      return '收集不同海拔的地點'
    case 'detailed_comments':
      return '撰寫更詳細的評論'
    case 'consecutive_days':
      return `保持連續使用`
    case 'time_range':
    case 'time_category_checkin':
      return '在特定時間活動'
    case 'early_user':
      return '限定資格'
    default:
      return '繼續探索以解鎖'
  }
}

// 即將解鎖的鼓勵文案
function getNearlyUnlockedText(achievement: Achievement, progress: number): string {
  if (progress >= 90) return '就差一點了！🔥'
  if (progress >= 80) return '快到了！加油！'
  return '即將解鎖！'
}

// 格式化日期
function formatUnlockDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * 三態判斷：
 * - unlocked = true → ✅ 已解鎖
 * - unlocked = false && progress >= 70 → 🔓 即將解鎖
 * - unlocked = false && progress < 70 → 🔒 未解鎖
 */
type BadgeState = 'unlocked' | 'nearly' | 'locked'

function getBadgeState(unlocked: boolean, progress: number = 0): BadgeState {
  if (unlocked) return 'unlocked'
  if (progress >= 70) return 'nearly'
  return 'locked'
}

export default function AchievementBadge({ achievement, unlocked, compact, onClick, progress = 0, unlockedAt }: Props) {
  const tier = TIER_COLORS[achievement.tier]
  const state = getBadgeState(unlocked, progress)
  const lockedHint = !unlocked ? getLockedHint(achievement) : ''

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`relative flex items-center gap-2 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
          state === 'unlocked'
            ? 'bg-surface hover:shadow-md'
            : state === 'nearly'
            ? 'bg-[#D4A843]/5 hover:bg-[#D4A843]/10'
            : 'bg-surface-alt/30 opacity-40 hover:opacity-50'
        }`}
        style={{
          borderColor: state === 'unlocked' ? tier.border : state === 'nearly' ? '#D4A84360' : '#D9CDB8',
          filter: state === 'locked' ? 'grayscale(100%)' : 'none',
        }}
        title={unlocked ? (achievement.description_zh || achievement.name_zh) : lockedHint}
      >
        <span className={`${state === 'unlocked' ? '' : state === 'nearly' ? 'opacity-70' : 'opacity-50'}`}>
          <AchievementIcon achievementKey={achievement.key} emoji={achievement.icon} size={20} />
        </span>
        <span className={`text-xs font-medium ${
          state === 'unlocked' ? 'text-text-main' : state === 'nearly' ? 'text-text-main/70' : 'text-text-secondary/60'
        }`}>
          {achievement.name_zh}
        </span>
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
          style={{
            backgroundColor: state === 'unlocked' ? tier.bg : state === 'nearly' ? '#D4A84315' : '#D9CDB810',
            color: state === 'unlocked' ? tier.border : state === 'nearly' ? '#D4A843' : '#5C5C5C80',
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
        state === 'unlocked'
          ? 'bg-surface hover:shadow-lg hover:-translate-y-0.5'
          : state === 'nearly'
          ? 'bg-[#D4A843]/5 hover:bg-[#D4A843]/8 hover:-translate-y-0.5'
          : 'bg-surface-alt/20 hover:bg-surface-alt/30'
      }`}
      style={{
        borderColor: state === 'unlocked'
          ? tier.border
          : state === 'nearly'
          ? '#D4A84350'
          : '#D9CDB860',
        boxShadow: state === 'unlocked'
          ? `0 2px 12px ${tier.glow}`
          : state === 'nearly'
          ? '0 2px 8px #D4A84320'
          : 'none',
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
            fill={state === 'unlocked' ? tier.bg
              : state === 'nearly' ? '#D4A84310' : '#F0EBE0'}
            stroke={state === 'unlocked' ? tier.border
              : state === 'nearly' ? '#D4A84360' : '#D9CDB860'}
            strokeWidth="2"
            className={state === 'nearly' ? 'animate-pulse-slow' : ''}
          />
          {/* 裝飾內圈 */}
          <circle
            cx="28"
            cy="28"
            r="21"
            fill="none"
            stroke={state === 'unlocked' ? tier.border
              : state === 'nearly' ? '#D4A84350' : '#D9CDB850'}
            strokeWidth="0.5"
            strokeDasharray="3 3"
            opacity={state === 'unlocked' ? 0.5 : state === 'nearly' ? 0.4 : 0.2}
          />
        </svg>
        {/* Achievement SVG icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={
              state === 'unlocked' ? ''
              : state === 'nearly' ? 'opacity-70'
              : 'opacity-30'
            }
            style={{
              filter: state === 'locked' ? 'grayscale(1) opacity(0.4)' : 'none',
            }}
          >
            <AchievementIcon achievementKey={achievement.key} emoji={achievement.icon} size={28} />
          </span>
        </div>
        {/* 狀態標示 */}
        {state === 'locked' && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-text-secondary/60 flex items-center justify-center">
            <span className="text-[10px]">🔒</span>
          </div>
        )}
        {state === 'nearly' && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#D4A843] flex items-center justify-center animate-pulse">
            <span className="text-[10px]">🔓</span>
          </div>
        )}
      </div>

      {/* 名稱 */}
      <span className={`text-xs font-semibold text-center leading-tight ${
        state === 'unlocked' ? 'text-text-main'
        : state === 'nearly' ? 'text-text-main/70'
        : 'text-text-secondary/50'
      }`}>
        {achievement.name_zh}
      </span>

      {/* 狀態資訊 */}
      {state === 'unlocked' ? (
        <div className="flex flex-col items-center mt-1">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: tier.bg,
              color: tier.border,
            }}
          >
            {achievement.points} 點
          </span>
          {unlockedAt && (
            <span className="text-[9px] text-text-secondary/50 mt-0.5">
              {formatUnlockDate(unlockedAt)}
            </span>
          )}
        </div>
      ) : state === 'nearly' ? (
        <div className="flex flex-col items-center mt-1 w-full">
          <span className="text-[9px] text-[#D4A843] font-bold">
            {getNearlyUnlockedText(achievement, progress)}
          </span>
          {/* 金色進度條 */}
          <div className="w-full h-1 bg-border/20 rounded-full overflow-hidden mt-1">
            <div
              className="h-full rounded-full animate-pulse-glow"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #D4A843, #F0C060)',
              }}
            />
          </div>
          <span className="text-[9px] text-[#D4A843]/60 mt-0.5">{Math.round(progress)}%</span>
        </div>
      ) : (
        <div className="flex flex-col items-center mt-1 w-full">
          <span className="text-[9px] text-text-secondary/40 text-center leading-tight line-clamp-1 px-1">
            {lockedHint}
          </span>
          {/* 灰色進度條 */}
          {progress > 0 && (
            <>
              <div className="w-full h-1 bg-border/20 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full rounded-full bg-text-secondary/30"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[9px] text-text-secondary/30 mt-0.5">{Math.round(progress)}%</span>
            </>
          )}
        </div>
      )}

      {/* CSS 動畫 */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; box-shadow: 0 0 4px #D4A84340; }
          50% { opacity: 0.85; box-shadow: 0 0 8px #D4A84360; }
        }
        .animate-pulse-glow {
          animation: pulse-glow 1.5s ease-in-out infinite;
        }
      `}</style>
    </button>
  )
}
