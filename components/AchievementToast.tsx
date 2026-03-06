'use client'

import { useState, useEffect, useRef } from 'react'
import type { UnlockedAchievement } from '@/lib/achievements'
import AchievementIcon from './AchievementIcon'

interface Props {
  achievements: UnlockedAchievement[]
  onDismiss: () => void
}

const TIER_COLORS = {
  bronze: { border: '#CD7F32', bg: '#CD7F3215', text: '#8B5E20', glow: '#CD7F3240' },
  silver: { border: '#A8A8A8', bg: '#A8A8A815', text: '#666666', glow: '#A8A8A840' },
  gold: { border: '#D4A843', bg: '#D4A84315', text: '#8B6914', glow: '#D4A84360' },
}

// 每個等級的動效強度
const TIER_ANIMATION = {
  bronze: { bounceClass: 'animate-bounce-sm', particles: 4, duration: 3500 },
  silver: { bounceClass: 'animate-bounce-md', particles: 6, duration: 4000 },
  gold: { bounceClass: 'animate-bounce-lg', particles: 10, duration: 5000 },
}

export default function AchievementToast({ achievements, onDismiss }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [showPoints, setShowPoints] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (achievements.length === 0) return

    setIsVisible(false)
    setIsExiting(false)
    setShowPoints(false)

    // 入場動畫
    const showTimer = setTimeout(() => setIsVisible(true), 100)

    // 顯示 +X 分飛行動畫
    const pointsTimer = setTimeout(() => setShowPoints(true), 600)

    // 自動消失
    const tier = achievements[currentIndex]?.achievement.tier || 'bronze'
    const displayTime = TIER_ANIMATION[tier].duration

    const hideTimer = setTimeout(() => {
      handleNext()
    }, displayTime)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(pointsTimer)
      clearTimeout(hideTimer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, achievements.length])

  const handleNext = () => {
    setIsExiting(true)
    setTimeout(() => {
      if (currentIndex < achievements.length - 1) {
        setCurrentIndex(prev => prev + 1)
        setIsExiting(false)
        setIsVisible(true)
      } else {
        onDismiss()
      }
    }, 300)
  }

  if (achievements.length === 0) return null

  const current = achievements[currentIndex]
  if (!current) return null

  const tier = TIER_COLORS[current.achievement.tier]
  const anim = TIER_ANIMATION[current.achievement.tier]

  return (
    <div
      ref={containerRef}
      className="fixed top-4 left-0 right-0 z-[100] flex justify-center pointer-events-none px-4"
    >
      <button
        onClick={handleNext}
        className={`pointer-events-auto relative flex items-center gap-3 px-5 py-3.5 rounded-2xl border-2 shadow-2xl backdrop-blur-sm transition-all duration-500 cursor-pointer max-w-sm w-full overflow-hidden ${
          isVisible && !isExiting
            ? 'opacity-100 translate-y-0 scale-100'
            : isExiting
            ? 'opacity-0 translate-y-4 scale-95'
            : 'opacity-0 -translate-y-6 scale-90'
        }`}
        style={{
          backgroundColor: `${tier.bg}`,
          borderColor: tier.border,
          boxShadow: `0 8px 32px ${tier.glow}, 0 0 60px ${tier.glow}`,
        }}
      >
        {/* 粒子效果 */}
        {isVisible && !isExiting && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: anim.particles }).map((_, i) => (
              <span
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full animate-particle"
                style={{
                  backgroundColor: tier.border,
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                  animationDelay: `${Math.random() * 0.8}s`,
                  animationDuration: `${1 + Math.random() * 0.5}s`,
                  opacity: 0.6 + Math.random() * 0.4,
                }}
              />
            ))}
          </div>
        )}

        {/* 成就 icon */}
        <div className="relative flex-shrink-0">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${anim.bounceClass}`}
            style={{
              background: `linear-gradient(135deg, ${tier.bg}, ${tier.border}30)`,
              border: `2px solid ${tier.border}`,
            }}
          >
            <AchievementIcon achievementKey={current.achievement.key} emoji={current.achievement.icon} size={28} />
          </div>
          {/* 光環脈衝效果 */}
          <div
            className="absolute inset-0 rounded-full animate-ping-slow"
            style={{ backgroundColor: tier.border, opacity: 0.15 }}
          />
          {/* 第二層光環（金色更強） */}
          {current.achievement.tier === 'gold' && (
            <div
              className="absolute -inset-1 rounded-full animate-ping-slower"
              style={{ backgroundColor: tier.border, opacity: 0.1 }}
            />
          )}
        </div>

        {/* 文字 */}
        <div className="flex-1 min-w-0 text-left">
          <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: tier.border }}>
            🎉 成就解鎖！
          </div>
          <div className="text-sm font-bold text-text-main truncate">
            {current.achievement.name_zh}
          </div>
          <div className="text-xs text-text-secondary truncate">
            {current.achievement.description_zh}
          </div>
        </div>

        {/* +X 分飛行動畫 */}
        <div className="flex-shrink-0 relative">
          <div
            className={`text-sm font-extrabold transition-all duration-700 ${
              showPoints && isVisible && !isExiting
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-3'
            }`}
            style={{ color: tier.border }}
          >
            +{current.achievement.points}
          </div>
          {/* 飛行的分數複製 */}
          {showPoints && isVisible && !isExiting && (
            <div
              className="absolute inset-0 text-sm font-extrabold animate-points-fly"
              style={{ color: tier.border }}
            >
              +{current.achievement.points}
            </div>
          )}
        </div>

        {/* 計數（多個成就時） */}
        {achievements.length > 1 && (
          <div className="absolute bottom-1 right-3 text-[9px] text-text-secondary bg-surface-alt/80 rounded-full px-1.5 py-0.5">
            {currentIndex + 1}/{achievements.length}
          </div>
        )}
      </button>

      {/* 全域自訂動畫 CSS */}
      <style jsx global>{`
        @keyframes particle {
          0% {
            transform: scale(0) translateY(0);
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5) translateY(-20px);
            opacity: 0;
          }
        }
        .animate-particle {
          animation: particle 1.2s ease-out forwards;
        }

        @keyframes bounce-sm {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-3px); }
          75% { transform: translateY(1px); }
        }
        .animate-bounce-sm {
          animation: bounce-sm 0.6s ease-in-out 2;
        }

        @keyframes bounce-md {
          0%, 100% { transform: translateY(0) scale(1); }
          20% { transform: translateY(-6px) scale(1.05); }
          60% { transform: translateY(2px) scale(0.98); }
        }
        .animate-bounce-md {
          animation: bounce-md 0.7s ease-in-out 2;
        }

        @keyframes bounce-lg {
          0%, 100% { transform: translateY(0) scale(1); }
          15% { transform: translateY(-10px) scale(1.1); }
          45% { transform: translateY(3px) scale(0.95); }
          70% { transform: translateY(-4px) scale(1.03); }
        }
        .animate-bounce-lg {
          animation: bounce-lg 0.9s ease-in-out 2;
        }

        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.15; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .animate-ping-slow {
          animation: ping-slow 1.5s ease-out infinite;
        }

        @keyframes ping-slower {
          0% { transform: scale(1); opacity: 0.1; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .animate-ping-slower {
          animation: ping-slower 2s ease-out infinite;
        }

        @keyframes points-fly {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-30px);
            opacity: 0;
          }
        }
        .animate-points-fly {
          animation: points-fly 1s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
