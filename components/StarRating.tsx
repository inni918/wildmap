'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { useAchievements } from '@/lib/achievement-context'
import { usePermissionV2 } from '@/components/PermissionGate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'
import { incrementStat, updateStreak } from '@/lib/stats-service'
import { useRouter } from 'next/navigation'

interface Props {
  spotId: string
}

export default function StarRating({ spotId }: Props) {
  const { user } = useAuth()
  const { earnAction } = useAchievements()
  const ratePermission = usePermissionV2('rate_spot')
  const router = useRouter()
  const [avgScore, setAvgScore] = useState<number>(0)
  const [ratingCount, setRatingCount] = useState<number>(0)
  const [userScore, setUserScore] = useState<number | null>(null)
  const [hoverScore, setHoverScore] = useState<number>(0)
  const [submitting, setSubmitting] = useState(false)
  const [showLockedToast, setShowLockedToast] = useState(false)

  const fetchRatings = useCallback(async () => {
    const { data, error } = await supabase
      .from('ratings')
      .select('score, user_id')
      .eq('spot_id', spotId)

    if (error || !data) return

    setRatingCount(data.length)
    if (data.length > 0) {
      const total = data.reduce((sum, r) => sum + r.score, 0)
      setAvgScore(total / data.length)
    } else {
      setAvgScore(0)
    }

    if (user) {
      const myRating = data.find(r => r.user_id === user.id)
      setUserScore(myRating?.score ?? null)
    }
  }, [spotId, user])

  useEffect(() => {
    fetchRatings()
  }, [fetchRatings])

  const handleRate = async (score: number) => {
    if (!user || submitting) return

    // 權限檢查：需要 profile_complete
    if (!ratePermission.allowed && !ratePermission.isLoading) {
      setShowLockedToast(true)
      setTimeout(() => {
        setShowLockedToast(false)
        router.push('/profile')
      }, 2000)
      return
    }

    setSubmitting(true)

    try {
      if (userScore !== null) {
        await supabase
          .from('ratings')
          .update({ score })
          .eq('spot_id', spotId)
          .eq('user_id', user.id)
      } else {
        await supabase
          .from('ratings')
          .insert({ spot_id: spotId, user_id: user.id, score })
        incrementStat(user.id, 'ratings_total')
        updateStreak(user.id)
      }
      await fetchRatings()
      earnAction('rating', spotId)
    } finally {
      setSubmitting(false)
    }
  }

  const displayScore = hoverScore || userScore || 0

  // 判斷評分按鈕是否可用
  const canRate = ratePermission.allowed || ratePermission.isLoading

  return (
    <div className="space-y-2">
      {/* Average display */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <FontAwesomeIcon
              key={star}
              icon={star <= Math.round(avgScore) ? NAV_ICONS.starSolid : NAV_ICONS.starRegular}
              className={`text-sm ${star <= Math.round(avgScore) ? 'text-accent' : 'text-border'}`}
            />
          ))}
        </div>
        <span className="text-sm font-semibold text-text-main">
          {avgScore > 0 ? avgScore.toFixed(1) : '—'}
        </span>
        <span className="text-xs text-text-secondary">
          ({ratingCount} 則評分)
        </span>
      </div>

      {/* User rating */}
      {user ? (
        <div className="flex items-center gap-2">
          <span className={`text-xs ${canRate ? 'text-text-secondary' : 'text-text-secondary/50'}`}>
            你的評分：
          </span>
          <div className={`flex items-center gap-0.5 ${canRate ? '' : 'opacity-50'}`}>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                onMouseEnter={() => canRate && setHoverScore(star)}
                onMouseLeave={() => setHoverScore(0)}
                disabled={submitting}
                className={`p-2 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer transition-transform ${
                  canRate ? 'hover:scale-110 active:scale-95' : ''
                } disabled:opacity-50`}
              >
                <FontAwesomeIcon
                  icon={star <= displayScore ? NAV_ICONS.starSolid : NAV_ICONS.starRegular}
                  className={`text-xl ${star <= displayScore ? 'text-accent' : 'text-border'}`}
                />
              </button>
            ))}
          </div>
          {userScore && (
            <span className="text-xs text-primary font-medium">
              已評 {userScore} 星
            </span>
          )}
          {/* 未解鎖提示 */}
          {!canRate && (
            <span className="text-[10px] text-text-secondary/50 flex items-center gap-1">
              🔒 {ratePermission.unlockHint || '完成個人資料即可評分'}
            </span>
          )}
        </div>
      ) : (
        <p className="text-xs text-text-secondary">
          <FontAwesomeIcon icon={NAV_ICONS.lock} className="mr-1" />
          登入後即可評分
        </p>
      )}

      {/* Locked Toast */}
      {showLockedToast && (
        <div className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
          <div className="bg-[#2D6A4F]/95 text-white rounded-xl px-4 py-3 shadow-lg max-w-sm w-full animate-slide-in">
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <div>
                <p className="text-xs font-bold">完成個人資料即可評分</p>
                <p className="text-[10px] text-white/70">正在跳轉到個人頁面...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
