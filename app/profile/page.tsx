'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'
import { faTrophy, faChartLine, faPen, faLock, faUnlock } from '@fortawesome/free-solid-svg-icons'
import MobileTabBar from '@/components/MobileTabBar'
import AchievementGrid from '@/components/AchievementGrid'
import FeaturedBadges from '@/components/FeaturedBadges'
import ClaimStatus from '@/components/ClaimStatus'
import { LEVELS, getLevel, getNextLevel, getLevelProgress, getPointsToNextLevel } from '@/lib/levels'
import { getPermissionsForLevel, getNewPermissionsAtLevel, PERMISSION_MATRIX } from '@/lib/permissions'

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

    // 取得使用者的 session token（RLS 需要 auth.uid()）
    const { data: sessionData } = await supabase.auth.getSession()
    const accessToken = sessionData?.session?.access_token

    // Fetch stats in parallel using native fetch（繞開 auth lock）
    const uid = encodeURIComponent(user.id)
    const baseHeaders = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${accessToken || SUPABASE_ANON_KEY}`,
      'Accept': 'application/json',
    }
    const base = `${SUPABASE_URL}/rest/v1`

    const [favRes, ratingRes, commentRes, photoRes] = await Promise.all([
      fetch(`${base}/favorites?user_id=eq.${uid}&select=id,spot_id,created_at&order=created_at.desc`, { headers: baseHeaders }),
      fetch(`${base}/ratings?user_id=eq.${uid}&select=id,spot_id,score,created_at&order=created_at.desc`, { headers: baseHeaders }),
      fetch(`${base}/comments?user_id=eq.${uid}&select=id,spot_id,content,created_at&order=created_at.desc`, { headers: baseHeaders }),
      fetch(`${base}/spot_images?user_id=eq.${uid}&select=id`, { headers: baseHeaders }),
    ])

    type FavRow = { id: string; spot_id: string; created_at: string }
    type RatingRow = { id: string; spot_id: string; score: number; created_at: string }
    type CommentRow = { id: string; spot_id: string; content: string; created_at: string }
    type PhotoRow = { id: string }

    const [favData, ratingData, commentData, photoData] = await Promise.all([
      favRes.ok ? favRes.json() as Promise<FavRow[]> : Promise.resolve([]),
      ratingRes.ok ? ratingRes.json() as Promise<RatingRow[]> : Promise.resolve([]),
      commentRes.ok ? commentRes.json() as Promise<CommentRow[]> : Promise.resolve([]),
      photoRes.ok ? photoRes.json() as Promise<PhotoRow[]> : Promise.resolve([]),
    ])

    setStats({
      ratingsCount: ratingData.length || 0,
      commentsCount: commentData.length || 0,
      favoritesCount: favData.length || 0,
      photosCount: photoData.length || 0,
    })

    // Enrich favorites with spot names
    if (favData && favData.length > 0) {
      const spotIds = [...new Set(favData.map(f => f.spot_id))]
      const spotsRes = await fetch(
        `${base}/spots?select=id,name,category,address&id=in.(${spotIds.map(encodeURIComponent).join(',')})`,
        { headers: baseHeaders }
      )
      type SpotRow = { id: string; name: string; category: string; address?: string }
      const spots: SpotRow[] = spotsRes.ok ? await spotsRes.json() : []

      const spotMap = new Map(spots.map(s => [s.id, s]))
      setFavorites(favData.map(f => {
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
    if (ratingData && ratingData.length > 0) {
      const spotIds = [...new Set(ratingData.map(r => r.spot_id))]
      const spotsRes = await fetch(
        `${base}/spots?select=id,name&id=in.(${spotIds.map(encodeURIComponent).join(',')})`,
        { headers: baseHeaders }
      )
      type SpotNameRow = { id: string; name: string }
      const spots: SpotNameRow[] = spotsRes.ok ? await spotsRes.json() : []

      const spotMap = new Map(spots.map(s => [s.id, s.name]))
      setRatings(ratingData.map(r => ({
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
    if (commentData && commentData.length > 0) {
      const spotIds = [...new Set(commentData.map(c => c.spot_id))]
      const spotsRes = await fetch(
        `${base}/spots?select=id,name&id=in.(${spotIds.map(encodeURIComponent).join(',')})`,
        { headers: baseHeaders }
      )
      type SpotNameRow = { id: string; name: string }
      const spots: SpotNameRow[] = spotsRes.ok ? await spotsRes.json() : []

      const spotMap = new Map(spots.map(s => [s.id, s.name]))
      setComments(commentData.map(c => ({
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
    if (user) {
      fetchData()
      setNewDisplayName(profile?.display_name || '')
    }
  }, [user, fetchData, profile?.display_name])

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

  const userPoints = profile?.points || 0
  const currentLevel = getLevel(userPoints)
  const nextLevel = getNextLevel(userPoints)
  const progress = getLevelProgress(userPoints)
  const pointsNeeded = getPointsToNextLevel(userPoints)
  const levelColor = currentLevel.color
  const levelTitle = currentLevel.name

  // 已解鎖功能
  const unlockedPermissions = getPermissionsForLevel(currentLevel.level)

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
                {currentLevel.level}
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
                  <span>{currentLevel.icon}</span>
                  Lv.{currentLevel.level} {levelTitle}
                </span>
                <span className="text-xs text-text-secondary flex items-center gap-1">
                  <FontAwesomeIcon icon={faChartLine} className="text-[10px]" />
                  {userPoints} 積分
                </span>
              </div>

              <p className="text-xs text-text-secondary/60 mt-1">
                加入於 {profile?.created_at ? formatDate(profile.created_at) : '—'}
              </p>
            </div>
          </div>

          {/* 等級進度條 */}
          <div className="mt-5 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-text-secondary">
                {currentLevel.icon} Lv.{currentLevel.level} {currentLevel.name}
              </span>
              {nextLevel ? (
                <span className="text-xs text-text-secondary">
                  {nextLevel.icon} Lv.{nextLevel.level} {nextLevel.name}
                </span>
              ) : (
                <span className="text-xs font-medium" style={{ color: levelColor }}>
                  ⭐ 最高等級
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div className="relative h-3 bg-border/30 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${progress}%`,
                  backgroundColor: levelColor,
                  boxShadow: progress > 0 ? `0 0 8px ${levelColor}40` : undefined,
                }}
              />
            </div>

            {/* 進度文字 */}
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[10px] text-text-secondary">
                {progress}%
              </span>
              {pointsNeeded !== null ? (
                <span className="text-[10px] text-text-secondary">
                  還差 <span className="font-bold" style={{ color: levelColor }}>{pointsNeeded}</span> 分升級
                </span>
              ) : (
                <span className="text-[10px] font-medium" style={{ color: levelColor }}>
                  已達最高等級 🎉
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 已解鎖功能 */}
        <div className="bg-surface rounded-2xl border border-border p-4 shadow-sm">
          <h3 className="text-sm font-bold text-text-main flex items-center gap-1.5 mb-3">
            <FontAwesomeIcon icon={faUnlock} className="text-xs" style={{ color: levelColor }} />
            已解鎖功能
            <span className="text-xs text-text-secondary font-normal">
              （{unlockedPermissions.length} 項）
            </span>
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {LEVELS.map(lv => {
              const permsAtLevel = getNewPermissionsAtLevel(lv.level)
              if (permsAtLevel.length === 0) return null
              const isUnlocked = currentLevel.level >= lv.level

              return (
                <div key={lv.level} className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">{lv.icon}</span>
                    <span className={`text-[10px] font-bold ${isUnlocked ? 'text-text-main' : 'text-text-secondary/50'}`}>
                      Lv.{lv.level} {lv.name}
                    </span>
                  </div>
                  {permsAtLevel.slice(0, 4).map(perm => (
                    <div
                      key={perm}
                      className={`flex items-center gap-1.5 pl-4 ${isUnlocked ? '' : 'opacity-40'}`}
                    >
                      <FontAwesomeIcon
                        icon={isUnlocked ? faUnlock : faLock}
                        className="text-[8px]"
                        style={{ color: isUnlocked ? lv.color : undefined }}
                      />
                      <span className="text-[10px] text-text-secondary">
                        {PERMISSION_MATRIX[perm].description}
                      </span>
                    </div>
                  ))}
                  {permsAtLevel.length > 4 && (
                    <span className="text-[10px] text-text-secondary/60 pl-4">
                      +{permsAtLevel.length - 4} 項更多...
                    </span>
                  )}
                </div>
              )
            })}
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
