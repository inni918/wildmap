'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'
import { faTrophy, faChartLine, faPen } from '@fortawesome/free-solid-svg-icons'
import MobileTabBar from '@/components/MobileTabBar'
import AchievementGrid from '@/components/AchievementGrid'
import FeaturedBadges from '@/components/FeaturedBadges'
import ClaimStatus from '@/components/ClaimStatus'

// 等級名稱
function getLevelTitle(level: number): string {
  if (level >= 10) return '探險大師'
  if (level >= 7) return '資深玩家'
  if (level >= 5) return '戶外達人'
  if (level >= 3) return '冒險新手'
  return '初來乍到'
}

// 等級顏色
function getLevelColor(level: number): string {
  if (level >= 10) return '#D4A843'
  if (level >= 7) return '#2D6A4F'
  if (level >= 5) return '#52B788'
  if (level >= 3) return '#8B6914'
  return '#5C5C5C'
}

interface UserStats {
  ratingsCount: number
  commentsCount: number
  favoritesCount: number
  photosCount: number
}

interface FavoriteSpot {
  id: string
  spot_id: string
  spot_name: string
  spot_category: string
  spot_address?: string
  created_at: string
}

interface RatingRecord {
  id: string
  spot_id: string
  spot_name: string
  score: number
  created_at: string
}

interface CommentRecord {
  id: string
  spot_id: string
  spot_name: string
  content: string
  created_at: string
}

export default function ProfilePage() {
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<UserStats>({ ratingsCount: 0, commentsCount: 0, favoritesCount: 0, photosCount: 0 })
  const [favorites, setFavorites] = useState<FavoriteSpot[]>([])
  const [ratings, setRatings] = useState<RatingRecord[]>([])
  const [comments, setComments] = useState<CommentRecord[]>([])
  const [activeSection, setActiveSection] = useState<'favorites' | 'ratings' | 'comments'>('favorites')
  const [loading, setLoading] = useState(true)
  const [editingName, setEditingName] = useState(false)
  const [newDisplayName, setNewDisplayName] = useState('')
  const [savingName, setSavingName] = useState(false)

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)

    // Fetch stats in parallel
    const [favResult, ratingResult, commentResult, photoResult] = await Promise.all([
      supabase.from('favorites').select('id, spot_id, created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('ratings').select('id, spot_id, score, created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('comments').select('id, spot_id, content, created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('photos').select('id').eq('user_id', user.id),
    ])

    setStats({
      ratingsCount: ratingResult.data?.length || 0,
      commentsCount: commentResult.data?.length || 0,
      favoritesCount: favResult.data?.length || 0,
      photosCount: photoResult.data?.length || 0,
    })

    // Enrich favorites with spot names
    if (favResult.data && favResult.data.length > 0) {
      const spotIds = [...new Set(favResult.data.map(f => f.spot_id))]
      const { data: spots } = await supabase
        .from('spots')
        .select('id, name, category, address')
        .in('id', spotIds)

      const spotMap = new Map(spots?.map(s => [s.id, s]) || [])
      setFavorites(favResult.data.map(f => {
        const spot = spotMap.get(f.spot_id)
        return {
          id: f.id,
          spot_id: f.spot_id,
          spot_name: spot?.name || '未知地點',
          spot_category: spot?.category || 'camping',
          spot_address: spot?.address,
          created_at: f.created_at,
        }
      }))
    } else {
      setFavorites([])
    }

    // Enrich ratings with spot names
    if (ratingResult.data && ratingResult.data.length > 0) {
      const spotIds = [...new Set(ratingResult.data.map(r => r.spot_id))]
      const { data: spots } = await supabase
        .from('spots')
        .select('id, name')
        .in('id', spotIds)

      const spotMap = new Map(spots?.map(s => [s.id, s.name]) || [])
      setRatings(ratingResult.data.map(r => ({
        id: r.id,
        spot_id: r.spot_id,
        spot_name: spotMap.get(r.spot_id) || '未知地點',
        score: r.score,
        created_at: r.created_at,
      })))
    } else {
      setRatings([])
    }

    // Enrich comments with spot names
    if (commentResult.data && commentResult.data.length > 0) {
      const spotIds = [...new Set(commentResult.data.map(c => c.spot_id))]
      const { data: spots } = await supabase
        .from('spots')
        .select('id, name')
        .in('id', spotIds)

      const spotMap = new Map(spots?.map(s => [s.id, s.name]) || [])
      setComments(commentResult.data.map(c => ({
        id: c.id,
        spot_id: c.spot_id,
        spot_name: spotMap.get(c.spot_id) || '未知地點',
        content: c.content,
        created_at: c.created_at,
      })))
    } else {
      setComments([])
    }

    setLoading(false)
  }, [user])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }
    if (user) {
      fetchData()
      setNewDisplayName(profile?.display_name || '')
    }
  }, [user, authLoading, fetchData, profile?.display_name, router])

  const handleSaveName = async () => {
    if (!user || !newDisplayName.trim() || savingName) return
    setSavingName(true)
    await supabase
      .from('users')
      .update({ display_name: newDisplayName.trim() })
      .eq('id', user.id)
    setEditingName(false)
    setSavingName(false)
    // Reload page to refresh profile
    window.location.reload()
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-4">
        <FontAwesomeIcon icon={NAV_ICONS.spinner} className="text-primary text-2xl animate-spin" />
        <p className="text-sm text-text-secondary">載入中...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-4 px-4">
        <FontAwesomeIcon icon={NAV_ICONS.map} className="text-primary text-4xl" />
        <h2 className="text-lg font-bold text-text-main">請先登入</h2>
        <p className="text-sm text-text-secondary text-center">登入後即可查看個人頁面、收藏地點和活動紀錄</p>
        <Link
          href="/login"
          className="bg-primary hover:bg-primary-dark text-text-on-primary rounded-xl px-6 py-3 text-sm font-bold shadow-sm transition-colors no-underline"
        >
          前往登入
        </Link>
        <Link
          href="/map"
          className="text-sm text-text-secondary hover:text-primary transition-colors no-underline"
        >
          ← 返回地圖
        </Link>
      </div>
    )
  }

  const levelColor = getLevelColor(profile?.level || 1)
  const levelTitle = getLevelTitle(profile?.level || 1)

  return (
    <div className="min-h-screen bg-bg pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/map" className="flex items-center gap-2 no-underline">
            <FontAwesomeIcon icon={NAV_ICONS.back} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">返回地圖</span>
          </Link>
          <h1 className="text-base font-bold text-text-main">個人頁面</h1>
          <div className="w-16" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* User Info Card */}
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name || ''}
                  className="w-16 h-16 rounded-full border-3 object-cover"
                  style={{ borderColor: levelColor }}
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold border-3"
                  style={{ backgroundColor: levelColor, borderColor: levelColor }}
                >
                  {(profile?.display_name || user.email || '?')[0].toUpperCase()}
                </div>
              )}
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-surface"
                style={{ backgroundColor: levelColor }}
              >
                {profile?.level || 1}
              </div>
            </div>

            {/* Name & Level */}
            <div className="flex-1 min-w-0">
              {editingName ? (
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="text"
                    value={newDisplayName}
                    onChange={e => setNewDisplayName(e.target.value)}
                    className="text-lg font-bold text-text-main border border-border rounded-lg px-2 py-1 focus:outline-none focus:border-primary w-full"
                    maxLength={30}
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={savingName}
                    className="text-primary text-sm font-medium whitespace-nowrap"
                  >
                    {savingName ? '...' : '儲存'}
                  </button>
                  <button
                    onClick={() => { setEditingName(false); setNewDisplayName(profile?.display_name || '') }}
                    className="text-text-secondary text-sm"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold text-text-main truncate">
                    {profile?.display_name || user.email}
                  </h2>
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-text-secondary hover:text-primary transition-colors p-1"
                  >
                    <FontAwesomeIcon icon={faPen} className="text-xs" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: levelColor }}
                >
                  <FontAwesomeIcon icon={faTrophy} className="text-[10px]" />
                  {levelTitle}
                </span>
                <span className="text-xs text-text-secondary flex items-center gap-1">
                  <FontAwesomeIcon icon={faChartLine} className="text-[10px]" />
                  {profile?.points || 0} 積分
                </span>
              </div>

              <p className="text-xs text-text-secondary/60 mt-1">
                加入於 {profile?.created_at ? formatDate(profile.created_at) : '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: '評分', value: stats.ratingsCount, icon: NAV_ICONS.starSolid, color: '#D4A843' },
            { label: '留言', value: stats.commentsCount, icon: NAV_ICONS.commentDots, color: '#2D6A4F' },
            { label: '照片', value: stats.photosCount, icon: NAV_ICONS.camera, color: '#52B788' },
            { label: '收藏', value: stats.favoritesCount, icon: NAV_ICONS.heartSolid, color: '#C1292E' },
          ].map(stat => (
            <div
              key={stat.label}
              className="bg-surface rounded-xl border border-border p-3 text-center"
            >
              <FontAwesomeIcon icon={stat.icon} className="text-sm mb-1" style={{ color: stat.color }} />
              <div className="text-lg font-bold text-text-main">{stat.value}</div>
              <div className="text-[10px] text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 商家認證狀態 */}
        <ClaimStatus />

        {/* 精選徽章 */}
        <div className="bg-surface rounded-2xl border border-border p-4 shadow-sm">
          <FeaturedBadges />
        </div>

        {/* 成就區域 */}
        <div className="bg-surface rounded-2xl border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-text-main flex items-center gap-1.5">
              <span>🏅</span>
              成就徽章
            </h3>
            <Link
              href="/profile/achievements"
              className="text-xs text-primary hover:text-primary-dark transition-colors no-underline font-medium"
            >
              查看全部 →
            </Link>
          </div>
          <AchievementGrid summary />
        </div>

        {/* Content Sections */}
        <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
          {/* Section Tabs */}
          <div className="flex border-b border-border">
            {[
              { key: 'favorites' as const, label: '收藏', count: stats.favoritesCount },
              { key: 'ratings' as const, label: '評分', count: stats.ratingsCount },
              { key: 'comments' as const, label: '留言', count: stats.commentsCount },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveSection(tab.key)}
                className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors cursor-pointer min-h-[44px] ${
                  activeSection === tab.key
                    ? 'border-primary text-primary-dark'
                    : 'border-transparent text-text-secondary hover:text-text-main'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-1 text-xs opacity-60">({tab.count})</span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <FontAwesomeIcon icon={NAV_ICONS.spinner} className="text-primary animate-spin mr-2" />
                <span className="text-sm text-text-secondary">載入中...</span>
              </div>
            ) : activeSection === 'favorites' ? (
              favorites.length === 0 ? (
                <EmptyState
                  icon={NAV_ICONS.heartRegular}
                  title="還沒有收藏"
                  description="在地圖上找到喜歡的地點，按下愛心收藏吧！"
                />
              ) : (
                <div className="space-y-2">
                  {favorites.map(fav => (
                    <Link
                      key={fav.id}
                      href={`/map?spot=${fav.spot_id}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-alt transition-colors no-underline group"
                    >
                      <span className="text-xl flex-shrink-0">
                        {fav.spot_category === 'camping' ? '🏕️' : '🚐'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-text-main truncate group-hover:text-primary transition-colors">
                          {fav.spot_name}
                        </h4>
                        {fav.spot_address && (
                          <p className="text-xs text-text-secondary truncate">{fav.spot_address}</p>
                        )}
                      </div>
                      <FontAwesomeIcon icon={NAV_ICONS.chevronRight} className="text-xs text-text-secondary/40 group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              )
            ) : activeSection === 'ratings' ? (
              ratings.length === 0 ? (
                <EmptyState
                  icon={NAV_ICONS.starRegular}
                  title="還沒有評分"
                  description="到地點詳情頁幫忙評分，讓其他人知道好不好！"
                />
              ) : (
                <div className="space-y-2">
                  {ratings.map(r => (
                    <Link
                      key={r.id}
                      href={`/map?spot=${r.spot_id}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-alt transition-colors no-underline group"
                    >
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        {[1, 2, 3, 4, 5].map(star => (
                          <FontAwesomeIcon
                            key={star}
                            icon={star <= r.score ? NAV_ICONS.starSolid : NAV_ICONS.starRegular}
                            className={`text-xs ${star <= r.score ? 'text-accent' : 'text-border'}`}
                          />
                        ))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-text-main truncate group-hover:text-primary transition-colors">
                          {r.spot_name}
                        </h4>
                        <p className="text-xs text-text-secondary">{formatDate(r.created_at)}</p>
                      </div>
                      <FontAwesomeIcon icon={NAV_ICONS.chevronRight} className="text-xs text-text-secondary/40" />
                    </Link>
                  ))}
                </div>
              )
            ) : (
              comments.length === 0 ? (
                <EmptyState
                  icon={NAV_ICONS.commentDots}
                  title="還沒有留言"
                  description="去地點詳情頁分享你的露營體驗吧！"
                />
              ) : (
                <div className="space-y-3">
                  {comments.map(c => (
                    <Link
                      key={c.id}
                      href={`/map?spot=${c.spot_id}`}
                      className="block p-3 rounded-xl hover:bg-surface-alt transition-colors no-underline group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-text-main truncate group-hover:text-primary transition-colors">
                          {c.spot_name}
                        </h4>
                        <span className="text-xs text-text-secondary flex-shrink-0 ml-2">{formatDate(c.created_at)}</span>
                      </div>
                      <p className="text-sm text-text-secondary line-clamp-2">{c.content}</p>
                    </Link>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleSignOut}
          className="w-full bg-surface rounded-2xl border border-border p-4 text-center text-error hover:bg-error/5 transition-colors cursor-pointer flex items-center justify-center gap-2 min-h-[48px]"
        >
          <FontAwesomeIcon icon={NAV_ICONS.logout} />
          <span className="font-medium">登出</span>
        </button>
      </div>

      <MobileTabBar />
    </div>
  )
}

// Empty state component
function EmptyState({ icon, title, description }: { icon: typeof NAV_ICONS.heartRegular; title: string; description: string }) {
  return (
    <div className="text-center py-8">
      <FontAwesomeIcon icon={icon} className="text-3xl text-border mb-3" />
      <p className="text-sm font-medium text-text-secondary">{title}</p>
      <p className="text-xs text-text-secondary/60 mt-1">{description}</p>
    </div>
  )
}
