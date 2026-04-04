'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

interface FavoriteButtonProps {
  spotId: string
  className?: string
}

export default function FavoriteButton({ spotId, className = '' }: FavoriteButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [favorited, setFavorited] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    fetch(`/api/favorites?spot_id=${spotId}`)
      .then(r => r.json())
      .then(data => { if (data.success) setFavorited(data.data.favorited) })
  }, [spotId, user])

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) { router.push('/login'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spot_id: spotId })
      })
      const data = await res.json()
      if (data.success) setFavorited(data.data.favorited)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={toggle} disabled={loading}
      className={`p-2 rounded-full transition-colors ${favorited ? 'text-red-500' : 'text-gray-400 hover:text-red-400'} ${className}`}>
      <Heart size={20} fill={favorited ? 'currentColor' : 'none'} />
    </button>
  )
}
