'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { useAchievements } from '@/lib/achievement-context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'

interface Props {
  spotId: string
}

export default function StarRating({ spotId }: Props) {
  const { user } = useAuth()
  const { triggerCheck } = useAchievements()
  const [avgScore, setAvgScore] = useState<number>(0)
  const [ratingCount, setRatingCount] = useState<number>(0)
  const [userScore, setUserScore] = useState<number | null>(null)
  const [hoverScore, setHoverScore] = useState<number>(0)
  const [submitting, setSubmitting] = useState(false)

  const fetchRatings = useCallback(async () => {
    // Fetch all ratings for this spot
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

    // Find user's own rating
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
    setSubmitting(true)

    try {
      if (userScore !== null) {
        // Update existing rating
        await supabase
          .from('ratings')
          .update({ score })
          .eq('spot_id', spotId)
          .eq('user_id', user.id)
      } else {
        // Insert new rating
        await supabase
          .from('ratings')
          .insert({ spot_id: spotId, user_id: user.id, score })
      }
      await fetchRatings()
      // 觸發成就檢查
      triggerCheck()
    } finally {
      setSubmitting(false)
    }
  }

  const displayScore = hoverScore || userScore || 0

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
          <span className="text-xs text-text-secondary">你的評分：</span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHoverScore(star)}
                onMouseLeave={() => setHoverScore(0)}
                disabled={submitting}
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
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
        </div>
      ) : (
        <p className="text-xs text-text-secondary">
          <FontAwesomeIcon icon={NAV_ICONS.lock} className="mr-1" />
          登入後即可評分
        </p>
      )}
    </div>
  )
}
