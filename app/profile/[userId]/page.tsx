'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faComment, faImage, faMapMarkerAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import MobileTabBar from '@/components/MobileTabBar'
import { getLevel } from '@/lib/levels'

interface PublicProfile {
  id: string
  display_name: string
  avatar_url: string | null
  level: number
  points: number
  created_at: string
  role: string
}

interface PublicStats {
  ratingsCount: number
  commentsCount: number
  photosCount: number
  spotsCount: number
}

export default function PublicProfilePage() {
  const params = useParams()
  const userId = params.userId as string
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [stats, setStats] = useState<PublicStats>({ ratingsCount: 0, commentsCount: 0, photosCount: 0, spotsCount: 0 })
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!userId) return
    async function fetchProfile() {
      setLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select('id, display_name, avatar_url, level, points, created_at, role')
        .eq('id', userId)
        .single()

      if (error || !data) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setProfile(data)

      // Fetch public stats in parallel
      const [ratingsRes, commentsRes, photosRes, spotsRes] = await Promise.all([
        supabase.from('ratings').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('comments').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('spot_images').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('spots').select('id', { count: 'exact', head: true }).eq('created_by', userId),
      ])

      setStats({
        ratingsCount: ratingsRes.count || 0,
        commentsCount: commentsRes.count || 0,
        photosCount: photosRes.count || 0,
        spotsCount: spotsRes.count || 0,
      })

      setLoading(false)
    }
    fetchProfile()
  }, [userId])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-warm flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-bg-warm flex flex-col items-center justify-center gap-4">
        <p className="text-text-secondary">找不到這位使用者 😢</p>
        <Link href="/map" className="text-primary hover:underline">← 回到地圖</Link>
      </div>
    )
  }

  if (!profile) return null

  const levelInfo = getLevel(profile.points ?? 0)
  const joinDate = new Date(profile.created_at).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' })
  const isSystemAccount = profile.id === '00000000-0000-0000-0000-000000000001'

  return (
    <div className="min-h-screen bg-bg-warm pb-20">
      {/* Header */}
      <div className="bg-primary text-white px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/map" className="text-white/70 hover:text-white text-sm mb-4 inline-flex items-center gap-1">
            <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
            回到地圖
          </Link>

          <div className="flex items-center gap-4 mt-2">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <span>{profile.display_name?.charAt(0) || '?'}</span>
              )}
            </div>

            <div>
              <h1 className="text-xl font-bold">{profile.display_name || '使用者'}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">
                  Lv{profile.level} {levelInfo?.name || '探索者'}
                </span>
                {profile.role === 'admin' && (
                  <span className="text-sm bg-yellow-400/30 px-2 py-0.5 rounded-full">
                    ⭐ 官方
                  </span>
                )}
              </div>
              <p className="text-sm text-white/60 mt-1">{joinDate} 加入</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-6">
        {/* System account bio */}
        {isSystemAccount && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-border-light">
            <p className="text-sm text-text-secondary">
              台灣最完整的露營地圖平台。部分地點資料來自政府資料開放平台（data.gov.tw），依政府資料開放授權條款（OGDL）使用。
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: faMapMarkerAlt, label: '地點', value: stats.spotsCount },
            { icon: faStar, label: '評分', value: stats.ratingsCount },
            { icon: faComment, label: '留言', value: stats.commentsCount },
            { icon: faImage, label: '照片', value: stats.photosCount },
          ].map(({ icon, label, value }) => (
            <div key={label} className="bg-white rounded-xl p-3 text-center shadow-sm border border-border-light">
              <FontAwesomeIcon icon={icon} className="w-4 h-4 text-primary mb-1" />
              <p className="text-lg font-bold text-text-primary">{value}</p>
              <p className="text-xs text-text-secondary">{label}</p>
            </div>
          ))}
        </div>

        {/* 積分資訊 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-border-light">
          <h2 className="font-semibold text-text-primary mb-3">📊 等級資訊</h2>
          <div className="flex items-center gap-4">
            <span className="text-3xl">{levelInfo?.icon || '🔍'}</span>
            <div>
              <p className="font-bold text-text-primary">Lv{profile.level} {levelInfo?.name || '探索者'}</p>
              <p className="text-sm text-text-secondary">{profile.points} 積分</p>
            </div>
          </div>
        </div>
      </div>

      <MobileTabBar />
    </div>
  )
}
