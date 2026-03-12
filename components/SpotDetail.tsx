'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, type Spot, CATEGORY_EMOJI, CATEGORY_LABEL, SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase'
import { fetchSpotFeatures, type GroupedFeatures } from '@/lib/features'
import { useAuth } from '@/lib/auth-context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'
import {
  faPhone,
  faGlobe,
  faEnvelope,
  faMapLocationDot,
  faShieldHalved,
  faLocationDot,
  faShareNodes,
} from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faInstagram, faLine } from '@fortawesome/free-brands-svg-icons'
import PhotoGrid from './PhotoGrid'
import FeatureVoting from './FeatureVoting'
import FavoriteButton from './FavoriteButton'
import EditSpotModal from './EditSpotModal'
import ClaimButton from './ClaimButton'
import DiscussionTab from './DiscussionTab'
import { usePermission } from './PermissionGate'
import { track } from '@/lib/tracker'

interface Props {
  spotId: string
  onClose: () => void
  onSpotUpdated?: () => void
  onOpenSpot?: (spotId: string) => void
}

type Tab = 'info' | 'discussion'

const QUALITY_BADGE: Record<string, { label: string; color: string; bgColor: string }> = {
  new: { label: '待驗證', color: '#EAB308', bgColor: '#EAB30820' },
  community_verified: { label: '社群驗證', color: '#22C55E', bgColor: '#22C55E20' },
  featured: { label: '精選', color: '#D4A843', bgColor: '#D4A84320' },
}

function getRegistrationBadge(
  spot: Spot
): { label: string; icon: typeof faShieldHalved; color: string; bgColor: string; borderColor: string } | null {
  if (spot.category === 'carcamp') {
    return {
      label: '📍 社群回報',
      icon: faLocationDot,
      color: '#2563EB',
      bgColor: '#2563EB15',
      borderColor: '#2563EB30',
    }
  }
  if (spot.gov_certified) {
    return {
      label: '✅ 政府登記',
      icon: faShieldHalved,
      color: '#16A34A',
      bgColor: '#16A34A15',
      borderColor: '#16A34A30',
    }
  }
  return null
}

function getDisclaimerText(spot: Spot): string | null {
  if (spot.category === 'carcamp') {
    return '本泊點資訊由社群回報，Wildmap 未實地查核。車宿前請確認當地法規，注意停車規定及安全。本平台不保證此地點可合法進行車宿活動。'
  }
  return null
}

// ─── Weather helpers ─────────────────────────

interface WeatherDay {
  date: string
  weathercode: number
  maxTemp: number
  minTemp: number
}

function weatherEmoji(code: number): string {
  if (code === 0) return '☀️'
  if (code <= 2) return '⛅'
  if (code <= 3) return '☁️'
  if (code <= 48) return '🌫️'
  if (code <= 67) return '🌧️'
  if (code <= 77) return '❄️'
  if (code <= 82) return '🌦️'
  if (code <= 86) return '🌨️'
  if (code <= 99) return '⛈️'
  return '🌡️'
}

function weatherLabel(code: number): string {
  if (code === 0) return '晴天'
  if (code <= 2) return '多雲'
  if (code <= 3) return '陰天'
  if (code <= 48) return '霧'
  if (code <= 67) return '雨天'
  if (code <= 77) return '下雪'
  if (code <= 82) return '陣雨'
  if (code <= 86) return '陣雪'
  if (code <= 99) return '雷雨'
  return '不明'
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

function formatWeatherDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000)
  if (diff === 0) return '今天'
  if (diff === 1) return '明天'
  return `週${WEEKDAYS[d.getDay()]}`
}

// ─── Haversine ───────────────────────────────

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(a))
}

// ─── Main Component ──────────────────────────

export default function SpotDetail({ spotId, onClose, onSpotUpdated, onOpenSpot }: Props) {
  const { user } = useAuth()
  const editPerm = usePermission('edit_spot_info')
  const [spot, setSpot] = useState<Spot | null>(null)
  const [spotLoading, setSpotLoading] = useState(true)
  const [groups, setGroups] = useState<GroupedFeatures[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('info')
  const [isClosing, setIsClosing] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [discussionCount, setDiscussionCount] = useState(0)
  const [ratingInfo, setRatingInfo] = useState<{ avg: number; count: number; dist: number[] }>({
    avg: 0,
    count: 0,
    dist: [0, 0, 0, 0, 0],
  })

  useEffect(() => {
    let cancelled = false
    async function fetchAll() {
      setSpotLoading(true)
      setLoading(true)

      // 用 native fetch 繞開 Supabase auth lock
      let fullSpot: Spot | null = null
      try {
        const spotUrl = `${SUPABASE_URL}/rest/v1/spots?id=eq.${encodeURIComponent(spotId)}&limit=1`
        const spotRes = await fetch(spotUrl, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Accept': 'application/json',
          },
        })
        if (!spotRes.ok) throw new Error(`HTTP ${spotRes.status}`)
        const spotArr = await spotRes.json()
        if (!spotArr || spotArr.length === 0 || cancelled) {
          setSpotLoading(false)
          setLoading(false)
          return
        }
        fullSpot = spotArr[0] as Spot
      } catch {
        setSpotLoading(false)
        setLoading(false)
        return
      }

      if (!fullSpot) {
        setSpotLoading(false)
        setLoading(false)
        return
      }
      if (!cancelled) {
        setSpot(fullSpot)
        setSpotLoading(false)
      }

      const nativeFetchHeaders = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Accept': 'application/json',
      }

      const [featureResult, commentData, ratingData] = await Promise.all([
        fetchSpotFeatures(fullSpot.id, fullSpot.category, user?.id),
        fetch(
          `${SUPABASE_URL}/rest/v1/comments?spot_id=eq.${encodeURIComponent(fullSpot.id)}&select=id`,
          { headers: nativeFetchHeaders }
        ).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(
          `${SUPABASE_URL}/rest/v1/ratings?spot_id=eq.${encodeURIComponent(fullSpot.id)}&select=score`,
          { headers: nativeFetchHeaders }
        ).then(r => r.ok ? r.json() : []).catch(() => []),
      ])

      if (!cancelled) {
        setGroups(featureResult)
        setDiscussionCount(Array.isArray(commentData) ? commentData.length : 0)
        if (Array.isArray(ratingData) && ratingData.length > 0) {
          const total = ratingData.reduce((sum: number, r: { score: number }) => sum + r.score, 0)
          const dist = [0, 0, 0, 0, 0]
          for (const r of ratingData as { score: number }[]) {
            const idx = Math.min(Math.max(Math.round(r.score), 1), 5) - 1
            dist[idx]++
          }
          setRatingInfo({ avg: total / ratingData.length, count: ratingData.length, dist })
        } else {
          setRatingInfo({ avg: 0, count: 0, dist: [0, 0, 0, 0, 0] })
        }
        setLoading(false)
      }
    }
    fetchAll()
    return () => { cancelled = true }
  }, [spotId, user?.id])

  useEffect(() => {
    const startTime = Date.now()
    track({ event_type: 'spot_view', spot_id: spotId, metadata: { source: 'map' } })
    return () => {
      const dwellSeconds = Math.round((Date.now() - startTime) / 1000)
      track({ event_type: 'spot_dwell', spot_id: spotId, metadata: { dwell_seconds: dwellSeconds } })
    }
  }, [spotId])

  const loadFeatures = useCallback(async () => {
    if (!spot) return
    setLoading(true)
    const result = await fetchSpotFeatures(spot.id, spot.category, user?.id)
    setGroups(result)
    setLoading(false)
  }, [spot, user?.id])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(onClose, 200)
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/spot/${spotId}`
    if (navigator.share) {
      try {
        await navigator.share({ title: spot?.name, url })
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url)
    }
  }

  if (spotLoading || !spot) {
    return (
      <div
        className="fixed inset-0 z-40 flex items-end justify-center bg-black/20 backdrop-blur-[2px]"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <div className="bg-surface rounded-t-2xl w-full max-w-lg shadow-2xl flex flex-col items-center justify-center py-16">
          <FontAwesomeIcon icon={NAV_ICONS.spinner} className="text-primary animate-spin text-2xl mb-3" />
          <p className="text-sm text-text-secondary">載入地點資料中...</p>
        </div>
      </div>
    )
  }

  const regBadge = getRegistrationBadge(spot)

  const badgeChips: { key: string; label: string; color: string; bgColor: string; borderColor?: string }[] = []
  if (spot.status === 'suspended') {
    badgeChips.push({ key: 'suspended', label: '⚠️ 暫停營業', color: '#6B7280', bgColor: '#F3F4F6', borderColor: '#D1D5DB' })
  }
  if (spot.quality === 'community_verified') {
    badgeChips.push({ key: 'quality', label: '✅ 社群驗證', color: '#22C55E', bgColor: '#22C55E15', borderColor: '#22C55E30' })
  }
  if (regBadge) {
    badgeChips.push({ key: 'reg', label: regBadge.label, color: regBadge.color, bgColor: regBadge.bgColor, borderColor: regBadge.borderColor })
  }
  if (spot.is_claimed) {
    badgeChips.push({ key: 'claimed', label: '✅ 認證商家', color: '#3B82F6', bgColor: '#3B82F615', borderColor: '#3B82F630' })
  }

  const regionName = spot.address || CATEGORY_LABEL[spot.category]

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/20 backdrop-blur-[2px]"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div
        className={`bg-surface rounded-t-2xl w-full max-w-lg shadow-2xl flex flex-col transition-transform duration-200 ${
          isClosing ? 'translate-y-full' : 'translate-y-0 animate-slide-up'
        }`}
        style={{ maxHeight: '92vh' }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* === 1. Photo Strip === */}
        <PhotoStrip spotId={spot.id} />

        {/* === 2. Header === */}
        <div className="px-5 pb-3 border-b border-border">
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-bold text-text-main line-clamp-2 flex-1 mr-2" title={spot.name}>
              {CATEGORY_EMOJI[spot.category]} {spot.name}
            </h2>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              {user && editPerm.allowed && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="text-text-secondary hover:text-primary p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer active:scale-90 transition-all"
                  title="編輯地點"
                >
                  <FontAwesomeIcon icon={NAV_ICONS.edit} className="text-sm" />
                </button>
              )}
              {user && !editPerm.allowed && (
                <button
                  className="text-text-secondary/30 p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  title={`需要 Lv.${editPerm.requiredLevel} 才能編輯`}
                  disabled
                >
                  <FontAwesomeIcon icon={NAV_ICONS.edit} className="text-sm" />
                </button>
              )}
              <FavoriteButton spotId={spot.id} />
              <button
                onClick={handleShare}
                className="text-text-secondary hover:text-primary p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer active:scale-90 transition-all"
                title="分享"
              >
                <FontAwesomeIcon icon={faShareNodes} className="text-sm" />
              </button>
              <button
                onClick={handleClose}
                className="text-text-secondary hover:text-text-main p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
              >
                <FontAwesomeIcon icon={NAV_ICONS.close} className="text-lg" />
              </button>
            </div>
          </div>

          {/* 評分 + 地址 */}
          <div className="flex items-center gap-1.5 mt-1 text-sm text-text-secondary">
            {ratingInfo.count > 0 ? (
              <>
                <FontAwesomeIcon icon={NAV_ICONS.starSolid} className="text-accent text-xs" />
                <span className="font-medium text-text-main">{ratingInfo.avg.toFixed(1)}</span>
                <span className="text-xs">({ratingInfo.count}則評論)</span>
              </>
            ) : (
              <span className="text-xs">尚無評分</span>
            )}
            <span className="text-text-secondary/40 mx-0.5">·</span>
            <span className="text-xs truncate">{regionName}</span>
          </div>

          {/* 徽章 */}
          {badgeChips.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {badgeChips.slice(0, 3).map((chip) => (
                <span
                  key={chip.key}
                  className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: chip.bgColor,
                    color: chip.color,
                    border: chip.borderColor ? `1px solid ${chip.borderColor}` : undefined,
                  }}
                >
                  {chip.label}
                </span>
              ))}
            </div>
          )}

          {spot.description && (
            <p className="text-sm text-text-secondary mt-2 line-clamp-3">{spot.description}</p>
          )}

          <CreatedByLabel spot={spot} />

          <div className="mt-2">
            <ClaimButton spot={spot} />
          </div>
        </div>

        {/* === 3. 導航 CTA === */}
        <div className="px-5 py-2.5 border-b border-border">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-md"
            style={{ backgroundColor: '#2D6A4F' }}
          >
            🧭 導航到這裡
          </a>
        </div>

        {/* === 4. Tab bar（兩個 Tab）=== */}
        <div className="flex border-b border-border px-5">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2.5 text-sm font-medium text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'info'
                ? 'border-primary text-primary-dark'
                : 'border-transparent text-text-secondary hover:text-text-main'
            }`}
          >
            📋 資訊
          </button>
          <button
            onClick={() => setActiveTab('discussion')}
            className={`flex-1 py-2.5 text-sm font-medium text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'discussion'
                ? 'border-primary text-primary-dark'
                : 'border-transparent text-text-secondary hover:text-text-main'
            }`}
          >
            💬 討論{discussionCount > 0 ? ` (${discussionCount})` : ''}
          </button>
        </div>

        {/* === 5. Content === */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {activeTab === 'info' ? (
            loading ? (
              <div className="flex items-center justify-center py-8">
                <FontAwesomeIcon icon={NAV_ICONS.spinner} className="text-primary animate-spin mr-2" />
                <span className="text-sm text-text-secondary">載入中...</span>
              </div>
            ) : (
              <InfoTab
                spotId={spot.id}
                spot={spot}
                groups={groups}
                ratingInfo={ratingInfo}
                userId={user?.id ?? null}
                onVoted={loadFeatures}
                onOpenSpot={onOpenSpot}
              />
            )
          ) : (
            <DiscussionTab spotId={spot.id} />
          )}
        </div>
      </div>

      {showEditModal && (
        <EditSpotModal
          spot={spot}
          onClose={() => setShowEditModal(false)}
          onSaved={() => {
            setShowEditModal(false)
            onSpotUpdated?.()
          }}
        />
      )}
    </div>
  )
}

// ─── Photo Strip ─────────────────────────────

function PhotoStrip({ spotId }: { spotId: string }) {
  const [photos, setPhotos] = useState<{ id: string; url: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchPhotos() {
      const { data, error } = await supabase
        .from('spot_images')
        .select('id, url')
        .eq('spot_id', spotId)
        .order('created_at', { ascending: false })
        .limit(20)
      if (!cancelled) {
        setPhotos(data && !error ? data : [])
        setLoading(false)
      }
    }
    fetchPhotos()
    return () => { cancelled = true }
  }, [spotId])

  if (loading) {
    return (
      <div className="h-[160px] flex items-center justify-center" style={{ backgroundColor: '#FEFAF3' }}>
        <FontAwesomeIcon icon={NAV_ICONS.spinner} className="text-primary animate-spin text-lg" />
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div
        className="h-[120px] flex flex-col items-center justify-center gap-2 mx-5 mt-1 mb-2 rounded-xl border-2 border-dashed"
        style={{ borderColor: '#2D6A4F40', backgroundColor: '#2D6A4F08' }}
      >
        <FontAwesomeIcon icon={NAV_ICONS.camera} className="text-2xl" style={{ color: '#2D6A4F80' }} />
        <span className="text-xs font-medium" style={{ color: '#2D6A4F' }}>📸 上傳第一張照片</span>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto flex gap-1.5 px-5 py-2 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
      {photos.map((photo) => (
        <img
          key={photo.id}
          src={photo.url}
          alt=""
          className="h-[140px] w-auto rounded-lg object-cover flex-shrink-0"
          loading="lazy"
        />
      ))}
    </div>
  )
}

// ─── Contact Icons ────────────────────────────

function ContactIcons({ spot }: { spot: Spot }) {
  function getLineUrl(lineId: string): string {
    return `https://line.me/R/ti/p/${lineId}`
  }

  const contacts: { key: string; icon: typeof faPhone; href?: string; label: string }[] = []
  if (spot.phone) contacts.push({ key: 'phone', icon: faPhone, href: `tel:${spot.phone}`, label: '電話' })
  if (spot.website) contacts.push({ key: 'website', icon: faGlobe, href: spot.website, label: '網站' })
  if (spot.facebook) contacts.push({ key: 'facebook', icon: faFacebookF, href: spot.facebook, label: 'Facebook' })
  if (spot.instagram) contacts.push({ key: 'instagram', icon: faInstagram, href: spot.instagram, label: 'Instagram' })
  if (spot.line_id) contacts.push({ key: 'line', icon: faLine, href: getLineUrl(spot.line_id), label: `LINE: ${spot.line_id}` })
  if (spot.email) contacts.push({ key: 'email', icon: faEnvelope, href: `mailto:${spot.email}`, label: 'Email' })
  if (spot.google_maps_url) contacts.push({ key: 'maps', icon: faMapLocationDot, href: spot.google_maps_url, label: 'Google Maps' })

  if (contacts.length === 0) return null

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {contacts.map((c) => {
        const iconEl = (
          <div
            key={c.key}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            style={{
              backgroundColor: c.key === 'line' ? '#06C75520' : '#2D6A4F15',
              color: c.key === 'line' ? '#06C755' : '#2D6A4F',
            }}
            title={c.label}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = c.key === 'line' ? '#06C755' : '#2D6A4F'
              e.currentTarget.style.color = '#FFFFFF'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = c.key === 'line' ? '#06C75520' : '#2D6A4F15'
              e.currentTarget.style.color = c.key === 'line' ? '#06C755' : '#2D6A4F'
            }}
          >
            <FontAwesomeIcon icon={c.icon} className="text-sm" />
          </div>
        )

        if (c.href) {
          return (
            <a key={c.key} href={c.href} target="_blank" rel="noopener noreferrer">
              {iconEl}
            </a>
          )
        }
        return iconEl
      })}
    </div>
  )
}

// ─── Created By Label ─────────────────────────

function CreatedByLabel({ spot }: { spot: Spot }) {
  const [userInfo, setUserInfo] = useState<{
    display_name: string | null
    avatar_url: string | null
    level: number
    points: number
  } | null>(null)
  const [badgeCount, setBadgeCount] = useState(0)

  useEffect(() => {
    if (!spot.created_by) return
    let cancelled = false
    async function fetchUser() {
      const [userRes, badgeRes] = await Promise.all([
        supabase
          .from('users')
          .select('display_name, avatar_url, level, points')
          .eq('id', spot.created_by!)
          .single(),
        supabase
          .from('user_achievements')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', spot.created_by!),
      ])
      if (!cancelled && userRes.data) {
        setUserInfo(userRes.data)
        setBadgeCount(badgeRes.count || 0)
      }
    }
    fetchUser()
    return () => { cancelled = true }
  }, [spot.created_by])

  if (!spot.created_by || !userInfo) return null

  const levelNames: Record<number, string> = { 1: '探索者', 2: '開拓者', 3: '嚮導', 4: '守護者', 5: '先驅者' }
  const levelIcons: Record<number, string> = { 1: '🔍', 2: '🧭', 3: '🗺️', 4: '🛡️', 5: '⭐' }
  const initial = userInfo.display_name?.charAt(0) || '?'

  return (
    <a
      href={`/profile/${spot.created_by}`}
      className="flex items-center gap-2 mt-2 px-2 py-1.5 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer group"
      onClick={(e) => {
        e.preventDefault()
        window.open(`/profile/${spot.created_by}`, '_blank')
      }}
    >
      <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0 overflow-hidden">
        {userInfo.avatar_url ? (
          <img src={userInfo.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
        ) : (
          initial
        )}
      </div>
      <span className="text-xs text-text-secondary group-hover:text-primary transition-colors">
        {userInfo.display_name || '使用者'}
      </span>
      <span className="text-[10px] text-text-secondary/50">
        {levelIcons[userInfo.level] || '🔍'} Lv{userInfo.level} {levelNames[userInfo.level] || '探索者'}
      </span>
      {badgeCount > 0 && (
        <span className="text-[10px] text-amber-500/70">🏅×{badgeCount}</span>
      )}
    </a>
  )
}

// ─── Weather Section ──────────────────────────

function WeatherSection({ lat, lng }: { lat: number; lng: number }) {
  // null = 尚未載入, [] = 載入失敗, WeatherDay[] = 成功
  const [weather, setWeather] = useState<WeatherDay[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function fetchWeather() {
      setFetchError(false)
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Asia/Taipei&forecast_days=7`
        const res = await fetch(url)
        if (!res.ok) throw new Error(`fetch failed: ${res.status}`)
        const data = await res.json()
        if (!cancelled && data?.daily) {
          const days: WeatherDay[] = data.daily.time.map((date: string, i: number) => ({
            date,
            weathercode: data.daily.weathercode[i],
            maxTemp: Math.round(data.daily.temperature_2m_max[i]),
            minTemp: Math.round(data.daily.temperature_2m_min[i]),
          }))
          setWeather(days)
        } else if (!cancelled) {
          // API 回傳但無 daily 資料
          console.error('[WeatherSection] Open-Meteo API returned unexpected data:', data)
          setWeather([])
          setFetchError(true)
        }
      } catch (err) {
        console.error('[WeatherSection] 天氣 fetch 失敗:', err)
        if (!cancelled) {
          setWeather([])
          setFetchError(true)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchWeather()
    return () => { cancelled = true }
  }, [lat, lng])

  if (loading) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-text-main mb-3 flex items-center gap-1.5">
          <span>🌤️</span>
          本週天氣
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[72px] h-[88px] rounded-xl animate-pulse"
              style={{ backgroundColor: '#2D6A4F10' }}
            />
          ))}
        </div>
      </div>
    )
  }

  // 載入失敗：顯示提示而非完全隱藏（方便 QA 確認區塊存在）
  if (fetchError || !weather || weather.length === 0) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-text-main mb-3 flex items-center gap-1.5">
          <span>🌤️</span>
          本週天氣
        </h3>
        <p className="text-xs text-text-secondary/60 py-2">天氣資料暫時無法取得</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-text-main mb-3 flex items-center gap-1.5">
        <span>🌤️</span>
        本週天氣
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {weather.map((day) => (
          <div
            key={day.date}
            className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border border-border/40"
            style={{ backgroundColor: '#2D6A4F08', minWidth: '72px' }}
          >
            <span className="text-[11px] text-text-secondary font-medium">{formatWeatherDate(day.date)}</span>
            <span className="text-2xl" title={weatherLabel(day.weathercode)}>
              {weatherEmoji(day.weathercode)}
            </span>
            <span className="text-xs font-semibold text-text-main">{day.maxTemp}°</span>
            <span className="text-[10px] text-text-secondary/70">{day.minTemp}°</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Nearby Spots Section ─────────────────────

interface NearbySpot extends Spot {
  distance: number
  avgRating: number
  thumbUrl?: string
}

function NearbySection({
  currentSpot,
  onOpenSpot,
}: {
  currentSpot: Spot
  onOpenSpot?: (spotId: string) => void
}) {
  const [nearby, setNearby] = useState<NearbySpot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchNearby() {
      try {
        const lat = currentSpot.latitude
        const lng = currentSpot.longitude
        const delta = 0.5 // ~50km

        const { data, error } = await supabase
          .from('spots')
          .select('*')
          .eq('category', currentSpot.category)
          .neq('id', currentSpot.id)
          .gte('latitude', lat - delta)
          .lte('latitude', lat + delta)
          .gte('longitude', lng - delta)
          .lte('longitude', lng + delta)
          .limit(20)

        if (error || !data || cancelled) {
          if (error) console.error('[NearbySection] Supabase query error:', error)
          if (!cancelled) setNearby([])
          return
        }

        const withDist = data
          .map((s) => ({
            ...s,
            distance: haversine(lat, lng, s.latitude, s.longitude),
            avgRating: 0,
            thumbUrl: undefined as string | undefined,
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 3)

        if (cancelled) return

        const nearbyReadHeaders = {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Accept': 'application/json',
        }
        const enriched = await Promise.all(
          withDist.map(async (s) => {
            try {
              const sid = encodeURIComponent(s.id)
              const [ratingRes, imgRes] = await Promise.all([
                fetch(
                  `${SUPABASE_URL}/rest/v1/ratings?spot_id=eq.${sid}&select=score`,
                  { headers: nearbyReadHeaders }
                ),
                fetch(
                  `${SUPABASE_URL}/rest/v1/spot_images?spot_id=eq.${sid}&select=url&order=created_at.desc&limit=1`,
                  { headers: nearbyReadHeaders }
                ),
              ])
              const scores: { score: number }[] = ratingRes.ok ? await ratingRes.json() : []
              const imgData: { url: string }[] = imgRes.ok ? await imgRes.json() : []
              const avgRating =
                scores && scores.length > 0
                  ? scores.reduce((sum, r) => sum + r.score, 0) / scores.length
                  : 0
              const thumbUrl = imgData?.[0]?.url
              return { ...s, avgRating, thumbUrl }
            } catch {
              return s
            }
          })
        )

        if (!cancelled) setNearby(enriched)
      } catch (err) {
        console.error('[NearbySection] fetchNearby failed:', err)
        if (!cancelled) setNearby([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchNearby()
    return () => { cancelled = true }
  }, [currentSpot])

  if (loading) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-text-main mb-3 flex items-center gap-1.5">
          <span>📍</span>
          附近露營地
        </h3>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-xl animate-pulse"
              style={{ backgroundColor: '#2D6A4F10' }}
            />
          ))}
        </div>
      </div>
    )
  }

  // 載入完成但無資料：顯示 fallback 而非完全隱藏
  if (nearby.length === 0) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-text-main mb-3 flex items-center gap-1.5">
          <span>📍</span>
          附近露營地
        </h3>
        <p className="text-xs text-text-secondary/60 py-2">附近暫無其他露營地</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-text-main mb-3 flex items-center gap-1.5">
        <span>📍</span>
        附近露營地
      </h3>
      <div className="space-y-2">
        {nearby.map((s) => (
          <button
            key={s.id}
            onClick={() => onOpenSpot?.(s.id)}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer active:scale-[0.98] text-left"
            style={{ backgroundColor: '#2D6A4F06' }}
          >
            <div className="w-14 h-14 rounded-lg flex-shrink-0 overflow-hidden bg-primary/10 flex items-center justify-center">
              {s.thumbUrl ? (
                <img src={s.thumbUrl} alt={s.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">{CATEGORY_EMOJI[s.category]}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-main truncate">{s.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-text-secondary/70">
                  📏 {s.distance < 1 ? `${Math.round(s.distance * 1000)}m` : `${s.distance.toFixed(1)}km`}
                </span>
                {s.avgRating > 0 && (
                  <span className="text-xs text-text-secondary/70 flex items-center gap-0.5">
                    <FontAwesomeIcon icon={NAV_ICONS.starSolid} className="text-accent text-[9px]" />
                    {s.avgRating.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
            <FontAwesomeIcon icon={NAV_ICONS.chevronRight} className="text-text-secondary/30 text-xs flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Rating Block ─────────────────────────────

function RatingBlock({
  spotId,
  ratingInfo,
  userId,
}: {
  spotId: string
  ratingInfo: { avg: number; count: number; dist: number[] }
  userId: string | null
}) {
  const { user } = useAuth()
  const router = useRouter()
  const [userScore, setUserScore] = useState<number | null>(null)
  const [hoverScore, setHoverScore] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [localDist, setLocalDist] = useState(ratingInfo.dist)
  const [localAvg, setLocalAvg] = useState(ratingInfo.avg)
  const [localCount, setLocalCount] = useState(ratingInfo.count)
  const [recentReviews, setRecentReviews] = useState<
    { id: string; display_name: string; content: string; score: number; created_at: string }[]
  >([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    setLocalDist(ratingInfo.dist)
    setLocalAvg(ratingInfo.avg)
    setLocalCount(ratingInfo.count)
  }, [ratingInfo])

  useEffect(() => {
    if (!user) return
    let cancelled = false
    async function fetchMyRating() {
      const { data } = await supabase
        .from('ratings')
        .select('score')
        .eq('spot_id', spotId)
        .eq('user_id', user!.id)
        .maybeSingle()
      if (!cancelled) setUserScore(data?.score ?? null)
    }
    fetchMyRating()
    return () => { cancelled = true }
  }, [spotId, user])

  useEffect(() => {
    let cancelled = false
    async function fetchReviews() {
      try {
        const { data: comments } = await supabase
          .from('comments')
          .select('id, user_id, content, created_at')
          .eq('spot_id', spotId)
          .is('parent_id', null)
          .not('content', 'is', null)
          .order('created_at', { ascending: false })
          .limit(10)

        if (!comments || cancelled) return

        const userIds = [...new Set(comments.map((c) => c.user_id))]
        const userMap = new Map<string, string>()
        if (userIds.length > 0) {
          const { data: users } = await supabase
            .from('users')
            .select('id, display_name')
            .in('id', userIds)
          if (users) {
            for (const u of users) userMap.set(u.id, u.display_name || '匿名用戶')
          }
        }

        const { data: ratings } = await supabase
          .from('ratings')
          .select('user_id, score')
          .eq('spot_id', spotId)
          .in('user_id', userIds)

        const ratingMap = new Map<string, number>()
        if (ratings) {
          for (const r of ratings) ratingMap.set(r.user_id, r.score)
        }

        if (!cancelled) {
          setRecentReviews(
            comments.map((c) => ({
              id: c.id,
              display_name: userMap.get(c.user_id) || '匿名用戶',
              content: c.content,
              score: ratingMap.get(c.user_id) || 0,
              created_at: c.created_at,
            }))
          )
        }
      } catch {
        // 靜默失敗
      }
    }
    fetchReviews()
    return () => { cancelled = true }
  }, [spotId])

  const handleRate = async (score: number) => {
    if (!user || submitting) return
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
      }
      const prevScore = userScore
      setUserScore(score)
      setLocalDist((prev) => {
        const next = [...prev]
        if (prevScore !== null) next[prevScore - 1] = Math.max(0, next[prevScore - 1] - 1)
        next[score - 1]++
        return next
      })
      const newCount = userScore === null ? localCount + 1 : localCount
      const newTotal = localAvg * localCount - (userScore || 0) + score
      setLocalCount(newCount)
      setLocalAvg(newCount > 0 ? newTotal / newCount : 0)
    } finally {
      setSubmitting(false)
    }
  }

  const maxDist = Math.max(...localDist, 1)
  const displayScore = hoverScore || userScore || 0

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000)
    if (diffDays === 0) return '今天'
    if (diffDays < 30) return `${diffDays} 天前`
    return date.toLocaleDateString('zh-TW')
  }

  const visibleReviews = showAll ? recentReviews : recentReviews.slice(0, 5)

  return (
    <div className="space-y-4">
      {/* 平均評分 + 分佈圖 */}
      <div className="flex gap-4 items-start">
        <div className="flex flex-col items-center flex-shrink-0">
          <span className="text-4xl font-bold text-text-main">
            {localAvg > 0 ? localAvg.toFixed(1) : '—'}
          </span>
          <div className="flex items-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesomeIcon
                key={star}
                icon={star <= Math.round(localAvg) ? NAV_ICONS.starSolid : NAV_ICONS.starRegular}
                className={`text-xs ${star <= Math.round(localAvg) ? 'text-accent' : 'text-border'}`}
              />
            ))}
          </div>
          <span className="text-[11px] text-text-secondary/60 mt-0.5">{localCount} 則評分</span>
        </div>

        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = localDist[star - 1]
            const pct = Math.round((count / maxDist) * 100)
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-[10px] text-text-secondary/60 w-3 text-right">{star}</span>
                <FontAwesomeIcon icon={NAV_ICONS.starSolid} className="text-accent text-[9px] flex-shrink-0" />
                <div className="flex-1 h-2 rounded-full bg-border/40 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%`, backgroundColor: '#D4A843' }}
                  />
                </div>
                <span className="text-[10px] text-text-secondary/50 w-4 text-right">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 用戶評分 */}
      {user ? (
        <div className="flex items-center gap-2 py-3 px-4 rounded-xl bg-surface-alt border border-border/40">
          <span className="text-xs text-text-secondary">
            {userScore ? `你已評 ${userScore} 星` : '為這個地方評分'}
          </span>
          <div className="flex items-center gap-0.5 ml-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHoverScore(star)}
                onMouseLeave={() => setHoverScore(0)}
                disabled={submitting}
                className="p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
              >
                <FontAwesomeIcon
                  icon={star <= displayScore ? NAV_ICONS.starSolid : NAV_ICONS.starRegular}
                  className={`text-lg ${star <= displayScore ? 'text-accent' : 'text-border'}`}
                />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => router.push('/login')}
          className="w-full flex items-center justify-center py-3 rounded-xl border border-border/40 bg-surface-alt hover:bg-primary/5 hover:border-primary/30 transition-colors cursor-pointer active:scale-[0.98]"
        >
          <span className="text-sm text-text-secondary">
            <FontAwesomeIcon icon={NAV_ICONS.starSolid} className="text-accent mr-2 text-xs" />
            為這個地方評分（需要登入）
          </span>
        </button>
      )}

      {/* 評論列表 */}
      {recentReviews.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-text-secondary/70 uppercase tracking-wide mb-2">
            最新評論
          </h4>
          <div className="space-y-2">
            {visibleReviews.map((review) => (
              <div key={review.id} className="px-3 py-2.5 rounded-xl bg-surface-alt border border-border/30">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                    {(review.display_name || '?')[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-text-main">{review.display_name}</span>
                  {review.score > 0 && (
                    <div className="flex items-center gap-0.5 ml-auto">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <FontAwesomeIcon
                          key={s}
                          icon={s <= review.score ? NAV_ICONS.starSolid : NAV_ICONS.starRegular}
                          className={`text-[9px] ${s <= review.score ? 'text-accent' : 'text-border'}`}
                        />
                      ))}
                    </div>
                  )}
                  <span className="text-[10px] text-text-secondary/50">{formatTime(review.created_at)}</span>
                </div>
                <p className="text-xs text-text-main leading-relaxed pl-8">{review.content}</p>
              </div>
            ))}
          </div>
          {recentReviews.length > 5 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-2 text-xs text-primary hover:underline cursor-pointer w-full text-center py-1"
            >
              查看全部 {recentReviews.length} 則評論 →
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Features Section ─────────────────────────

function FeaturesSection({
  spotId,
  groups,
  userId,
  onVoted,
}: {
  spotId: string
  groups: GroupedFeatures[]
  userId: string | null
  onVoted: () => void
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-text-main mb-3 flex items-center gap-1.5">
        <span>🏕️</span>
        地標特性
      </h3>
      <FeatureVoting
        spotId={spotId}
        groups={groups}
        userId={userId}
        onVoted={onVoted}
      />
    </div>
  )
}

// ─── Info Tab ─────────────────────────────────

function InfoTab({
  spotId,
  spot,
  groups,
  ratingInfo,
  userId,
  onVoted,
  onOpenSpot,
}: {
  spotId: string
  spot: Spot
  groups: GroupedFeatures[]
  ratingInfo: { avg: number; count: number; dist: number[] }
  userId: string | null
  onVoted: () => void
  onOpenSpot?: (spotId: string) => void
}) {
  const disclaimerText = getDisclaimerText(spot)

  return (
    <div className="space-y-6 pb-4">
      {/* Disclaimer */}
      {disclaimerText && (
        <div
          className="rounded-xl p-3 text-xs leading-relaxed"
          style={{
            backgroundColor: spot.category === 'carcamp' ? '#2563EB10' : '#D9770610',
            border: `1px solid ${spot.category === 'carcamp' ? '#2563EB25' : '#D9770625'}`,
            color: spot.category === 'carcamp' ? '#1E40AF' : '#92400E',
          }}
        >
          <p className="font-semibold mb-1">
            {spot.category === 'carcamp' ? 'ℹ️ 社群回報地點' : '⚠️ 未登記場地提醒'}
          </p>
          <p>{disclaimerText}</p>
        </div>
      )}

      {/* 資料來源 */}
      {(spot.category === 'carcamp' || spot.gov_certified) && (
        <div className="flex items-center gap-1.5 text-[11px] text-text-secondary/70">
          <span>📋</span>
          <span>
            {spot.gov_certified
              ? '資料來源：交通部觀光署（政府資料開放授權條款）'
              : '資料來源：社群回報'}
          </span>
        </div>
      )}

      {/* 3. 基本資料 */}
      <div>
        <h3 className="text-sm font-semibold text-text-main mb-3 flex items-center gap-1.5">
          <FontAwesomeIcon icon={NAV_ICONS.info} className="text-primary text-xs" />
          基本資訊
        </h3>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-sm">
            <FontAwesomeIcon icon={NAV_ICONS.location} className="text-primary text-xs w-4" />
            <span className="text-text-secondary">
              {spot.latitude.toFixed(4)}, {spot.longitude.toFixed(4)}
            </span>
          </div>
          <ContactIcons spot={spot} />
        </div>
      </div>

      {/* 4. 地標特性 */}
      <FeaturesSection spotId={spotId} groups={groups} userId={userId} onVoted={onVoted} />

      {/* 5. 評分區塊 */}
      <div>
        <h3 className="text-sm font-semibold text-text-main mb-3 flex items-center gap-1.5">
          <FontAwesomeIcon icon={NAV_ICONS.starSolid} className="text-accent text-xs" />
          評分與評論
        </h3>
        <RatingBlock spotId={spotId} ratingInfo={ratingInfo} userId={userId} />
      </div>

      {/* 6. 位置 */}
      <div>
        <h3 className="text-sm font-semibold text-text-main mb-3 flex items-center gap-1.5">
          <FontAwesomeIcon icon={faMapLocationDot} className="text-primary text-xs" />
          位置
        </h3>
        <div className="space-y-2">
          {spot.address && (
            <p className="text-sm text-text-secondary">{spot.address}</p>
          )}
          <a
            href={
              spot.google_maps_url ||
              `https://www.google.com/maps/search/?api=1&query=${spot.latitude},${spot.longitude}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <FontAwesomeIcon icon={faMapLocationDot} className="text-xs" />
            在地圖上開啟（Google Maps）
          </a>
        </div>
      </div>

      {/* 7. 本週天氣 */}
      <WeatherSection lat={spot.latitude} lng={spot.longitude} />

      {/* 8. 附近露營地 */}
      <NearbySection currentSpot={spot} onOpenSpot={onOpenSpot} />

      {/* 照片 */}
      <div>
        <h3 className="text-sm font-semibold text-text-main mb-2 flex items-center gap-1.5">
          <FontAwesomeIcon icon={NAV_ICONS.camera} className="text-primary text-xs" />
          照片
        </h3>
        <PhotoGrid spotId={spotId} />
      </div>
    </div>
  )
}
