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

export default function FavoriteButton({ spotId }: Props) {
  const { user } = useAuth()
  const { triggerCheck } = useAchievements()
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(false)

  const checkFavorite = useCallback(async () => {
    if (!user) {
      setIsFavorited(false)
      return
    }

    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('spot_id', spotId)
      .eq('user_id', user.id)
      .maybeSingle()

    setIsFavorited(!!data)
  }, [spotId, user])

  useEffect(() => {
    checkFavorite()
  }, [checkFavorite])

  const toggleFavorite = async () => {
    if (!user || loading) return
    setLoading(true)

    try {
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('spot_id', spotId)
          .eq('user_id', user.id)
        setIsFavorited(false)
      } else {
        await supabase
          .from('favorites')
          .insert({ spot_id: spotId, user_id: user.id })
        setIsFavorited(true)
        triggerCheck()
      }
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-all cursor-pointer active:scale-90 ${
        loading ? 'opacity-50' : ''
      } ${
        isFavorited
          ? 'text-error hover:text-error/80'
          : 'text-text-secondary/40 hover:text-error/60'
      }`}
      title={isFavorited ? '取消收藏' : '加入收藏'}
    >
      <FontAwesomeIcon
        icon={isFavorited ? NAV_ICONS.heartSolid : NAV_ICONS.heartRegular}
        className="text-xl"
      />
    </button>
  )
}
