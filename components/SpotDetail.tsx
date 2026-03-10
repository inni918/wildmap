'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, type Spot, CATEGORY_EMOJI, CATEGORY_LABEL } from '@/lib/supabase'
import { fetchSpotFeatures, type GroupedFeatures } from '@/lib/features'
import { useAuth } from '@/lib/auth-context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS, getFeatureIcon } from '@/lib/icons'
import { faCircleQuestion, faCircleCheck, faPhone, faGlobe, faEnvelope, faMapLocationDot, faShieldHalved, faTriangleExclamation, faLocationDot, faShareNodes } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faInstagram, faLine } from '@fortawesome/free-brands-svg-icons'
import FeatureIcons from './FeatureIcons'
import FeatureVoting from './FeatureVoting'
import StarRating from './StarRating'
import PhotoGrid from './PhotoGrid'
import CommentsTab from './CommentsTab'
import FavoriteButton from './FavoriteButton'
import EditSpotModal from './EditSpotModal'
import ClaimButton from './ClaimButton'
import { usePermission } from './PermissionGate'
import { track } from '@/lib/tracker'

interface Props {
  spotId: string
  onClose: () => void
  onSpotUpdated?: () => void
}

type Tab = 'overview' | 'comments' | 'vote'

const QUALITY_BADGE: Record<string, { label: string; color: string; bgColor: string }> = {
  new: { label: '待驗證', color: '#EAB308', bgColor: '#EAB30820' },
  community_verified: { label: '社群驗證', color: '#22C55E', bgColor: '#22C55E20' },
  featured: { label: '精選', color: '#D4A843', bgColor: '#D4A84320' },
}

/** 地點分類標示：合法登記 / 未登記場地 / 社群回報 */
function getRegistrationBadge(spot: Spot): { label: string; icon: typeof faShieldHalved; color: string; bgColor: string; borderColor: string } | null {
  // 車宿泊點 → 社群回報
  if (spot.category === 'carcamp') {
    return {
      label: '📍 社群回報',
      icon: faLocationDot,
      color: '#2563EB',
      bgColor: '#2563EB15',
      borderColor: '#2563EB30',
    }
  }
  // 露營場：有政府登記
  if (spot.gov_certified) {
    return {
      label: '✅ 政府登記',
      icon: faShieldHalved,
      color: '#16A34A',
      bgColor: '#16A34A15',
      borderColor: '#16A34A30',
    }
  }
  // 未登記的不標任何東西
  return null
}

/** 取得地點免責提示文字 */
function getDisclaimerText(spot: Spot): string | null {
  if (spot.category === 'carcamp') {
    return '本泊點資訊由社群回報，Wildmap 未實地查核。車宿前請確認當地法規，注意停車規定及安全。本平台不保證此地點可合法進行車宿活動。'
  }
  return null
}

export default function SpotDetail({ spotId, onClose, onSpotUpdated }: Props) {
  const { user } = useAuth()
  const editPerm = usePermission('edit_spot_info')
  const [spot, setSpot] = useState<Spot | null>(null)
  const [spotLoading, setSpotLoading] = useState(true)
  const [groups, setGroups] = useState<GroupedFeatures[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [isClosing, setIsClosing] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [commentCount, setCommentCount] = useState(0)
  const [ratingInfo, setRatingInfo] = useState<{ avg: number; count: number }>({ avg: 0, count: 0 })

  // 撈 spot + features + comment count + rating 一氣呵成
  useEffect(() => {
    let cancelled = false
    async function fetchAll() {
      setSpotLoading(true)
      setLoading(true)

      const { data: spotData, error: spotError } = await supabase
        .from('spots')
        .select('*')
        .eq('id', spotId)
        .single()

      if (spotError || !spotData || cancelled) {
        setSpotLoading(false)
        setLoading(false)
        return
      }

      const fullSpot = spotData as Spot
      if (!cancelled) {
        setSpot(fullSpot)
        setSpotLoading(false)
      }

      // 同時撈 features、comments count、ratings
      const [featureResult, commentRes, ratingRes] = await Promise.all([
        fetchSpotFeatures(fullSpot.id, fullSpot.category, user?.id),
        supabase
          .from('comments')
          .select('id', { count: 'exact', head: true })
          .eq('spot_id', fullSpot.id),
        supabase
          .from('ratings')
          .select('score')
          .eq('spot_id', fullSpot.id),
      ])

      if (!cancelled) {
        setGroups(featureResult)
        setCommentCount(commentRes.count || 0)
        if (ratingRes.data && ratingRes.data.length > 0) {
          const total = ratingRes.data.reduce((sum, r) => sum + r.score, 0)
          setRatingInfo({ avg: total / ratingRes.data.length, count: ratingRes.data.length })
        } else {
          setRatingInfo({ avg: 0, count: 0 })
        }
        setLoading(false)
      }
    }
    fetchAll()
    return () => { cancelled = true }
  }, [spotId, user?.id])

  // 行為追蹤：spot_view + spot_dwell
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

  // 載入中的 placeholder
  if (spotLoading || !spot) {
    return (
      <div
        className="absolute inset-0 z-30 flex items-end justify-center bg-black/20 backdrop-blur-[2px]"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <div className="bg-surface rounded-t-2xl w-full max-w-lg shadow-2xl flex flex-col items-center justify-center py-16">
          <FontAwesomeIcon icon={NAV_ICONS.spinner} className="text-primary animate-spin text-2xl mb-3" />
          <p className="text-sm text-text-secondary">載入地點資料中...</p>
        </div>
      </div>
    )
  }

  const qualityConfig = QUALITY_BADGE[spot.quality] || QUALITY_BADGE.new
  const regBadge = getRegistrationBadge(spot)

  // 收集要顯示的徽章 chips（最多 3 個）
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

  // 地區名稱：用 address 或 category label
  const regionName = spot.address || CATEGORY_LABEL[spot.category]

  return (
    <div
      className="absolute inset-0 z-30 flex items-end justify-center bg-black/20 backdrop-blur-[2px]"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div
        className={`bg-surface rounded-t-2xl w-full max-w-lg shadow-2xl flex flex-col transition-transform duration-200 ${
          isClosing ? 'translate-y-full' : 'translate-y-0 animate-slide-up'
        }`}
        style={{ maxHeight: '80vh' }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* === 1. Photo Strip (橫向捲動縮圖列) === */}
        <PhotoStrip spotId={spot.id} />

        {/* === 2. Header 四層結構 === */}
        <div className="px-5 pb-3 border-b border-border">
          {/* 第一層：名稱 + 收藏/分享/關閉 */}
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

          {/* 第二層：★評分 (N則評論) · 地區名稱 */}
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
            <span className="text-xs">{regionName}</span>
          </div>

          {/* 第三層：徽章 chips */}
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

          {/* Description */}
          {spot.description && (
            <p className="text-sm text-text-secondary mt-2 line-clamp-3">{spot.description}</p>
          )}

          {/* 第四層：建立者卡片 */}
          <CreatedByLabel spot={spot} />

          {/* Claim button */}
          <div className="mt-2">
            <ClaimButton spot={spot} />
          </div>
        </div>

        {/* === 3. 導航 CTA 按鈕 === */}
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

        {/* === 4. Tab bar (改名) === */}
        <div className="flex border-b border-border px-5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2.5 text-sm font-medium text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-primary text-primary-dark'
                : 'border-transparent text-text-secondary hover:text-text-main'
            }`}
          >
            📋 資訊
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex-1 py-2.5 text-sm font-medium text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'comments'
                ? 'border-primary text-primary-dark'
                : 'border-transparent text-text-secondary hover:text-text-main'
            }`}
          >
            💬 評論{commentCount > 0 ? ` (${commentCount})` : ''}
          </button>
          <button
            onClick={() => setActiveTab('vote')}
            className={`flex-1 py-2.5 text-sm font-medium text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'vote'
                ? 'border-primary text-primary-dark'
                : 'border-transparent text-text-secondary hover:text-text-main'
            }`}
          >
            🗳️ 特性回報
          </button>
        </div>

        {/* === 5. Content === */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {activeTab === 'overview' ? (
            loading ? (
              <div className="flex items-center justify-center py-8">
                <FontAwesomeIcon icon={NAV_ICONS.spinner} className="text-primary animate-spin mr-2" />
                <span className="text-sm text-text-secondary">載入中...</span>
              </div>
            ) : (
              <InfoTab spotId={spot.id} spot={spot} groups={groups} />
            )
          ) : activeTab === 'comments' ? (
            <CommentsTab spotId={spot.id} claimedBy={spot.claimed_by} />
          ) : (
            <VoteTab
              spotId={spot.id}
              groups={groups}
              userId={user?.id ?? null}
              onVoted={loadFeatures}
            />
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

// === Photo Strip (橫向捲動縮圖列) ===

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

// === Contact Icons ===

function ContactIcons({ spot }: { spot: Spot }) {
  function getLineUrl(lineId: string): string {
    return `https://line.me/R/ti/p/${lineId}`
  }

  const contacts: { key: string; icon: typeof faPhone; href?: string; label: string }[] = []

  if (spot.phone) {
    contacts.push({ key: 'phone', icon: faPhone, href: `tel:${spot.phone}`, label: '電話' })
  }
  if (spot.website) {
    contacts.push({ key: 'website', icon: faGlobe, href: spot.website, label: '網站' })
  }
  if (spot.facebook) {
    contacts.push({ key: 'facebook', icon: faFacebookF, href: spot.facebook, label: 'Facebook' })
  }
  if (spot.instagram) {
    contacts.push({ key: 'instagram', icon: faInstagram, href: spot.instagram, label: 'Instagram' })
  }
  if (spot.line_id) {
    contacts.push({ key: 'line', icon: faLine, href: getLineUrl(spot.line_id), label: `LINE: ${spot.line_id}` })
  }
  if (spot.email) {
    contacts.push({ key: 'email', icon: faEnvelope, href: `mailto:${spot.email}`, label: 'Email' })
  }
  if (spot.google_maps_url) {
    contacts.push({ key: 'maps', icon: faMapLocationDot, href: spot.google_maps_url, label: 'Google Maps' })
  }

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

// === Created By Label ===

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
      {/* 頭像 */}
      <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0 overflow-hidden">
        {userInfo.avatar_url ? (
          <img src={userInfo.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
        ) : (
          initial
        )}
      </div>
      {/* 名字 + 等級 */}
      <span className="text-xs text-text-secondary group-hover:text-primary transition-colors">
        {userInfo.display_name || '使用者'}
      </span>
      <span className="text-[10px] text-text-secondary/50">
        {levelIcons[userInfo.level] || '🔍'} Lv{userInfo.level} {levelNames[userInfo.level] || '探索者'}
      </span>
      {/* 徽章數 */}
      {badgeCount > 0 && (
        <span className="text-[10px] text-amber-500/70">
          🏅×{badgeCount}
        </span>
      )}
    </a>
  )
}

// === Info Tab (原 Overview Tab，內容重組) ===

function InfoTab({ spotId, spot, groups }: { spotId: string; spot: Spot; groups: GroupedFeatures[] }) {
  const hasAnyFeature = groups.some(g => g.features.some(f => f.status !== 'hidden'))
  const [showFeatureHelp, setShowFeatureHelp] = useState(false)
  const disclaimerText = getDisclaimerText(spot)

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
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

      {/* Data Source */}
      {spot.category === 'carcamp' && (
        <div className="flex items-center gap-1.5 text-[11px] text-text-secondary/70">
          <span>📋</span>
          <span>資料來源：社群回報</span>
        </div>
      )}
      {spot.gov_certified && (
        <div className="flex items-center gap-1.5 text-[11px] text-text-secondary/70">
          <span>📋</span>
          <span>資料來源：交通部觀光署（政府資料開放授權條款）</span>
        </div>
      )}

      {/* === 基本資訊區塊 === */}
      <div>
        <h3 className="text-sm font-semibold text-text-main mb-3 flex items-center gap-1.5">
          <FontAwesomeIcon icon={NAV_ICONS.location} className="text-primary text-xs" />
          基本資訊
        </h3>
        <div className="space-y-2.5">
          {/* 座標 */}
          <div className="flex items-center gap-2 text-sm">
            <FontAwesomeIcon icon={NAV_ICONS.location} className="text-primary text-xs w-4" />
            <span className="text-text-secondary">
              {spot.latitude.toFixed(4)}, {spot.longitude.toFixed(4)}
            </span>
          </div>

          {/* Google Maps 連結 */}
          <div className="flex items-center gap-2 text-sm">
            <FontAwesomeIcon icon={faMapLocationDot} className="text-primary text-xs w-4" />
            <a
              href={spot.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${spot.latitude},${spot.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              在 Google Maps 上查看
            </a>
          </div>

          {/* 聯絡方式 */}
          <ContactIcons spot={spot} />
        </div>
      </div>

      {/* Rating Section */}
      <div>
        <h3 className="text-sm font-semibold text-text-main mb-2 flex items-center gap-1.5">
          <FontAwesomeIcon icon={NAV_ICONS.starSolid} className="text-accent text-xs" />
          評分
        </h3>
        <StarRating spotId={spotId} />
      </div>

      {/* === 設施特性區塊 === */}
      {hasAnyFeature ? (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold text-text-main flex items-center gap-1.5">
              <FontAwesomeIcon icon={NAV_ICONS.info} className="text-primary text-xs" />
              設施與特性
            </h3>
            <button
              onClick={() => setShowFeatureHelp(true)}
              className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-[10px] font-bold flex items-center justify-center hover:bg-gray-300 transition-colors"
              title="特性投票說明"
            >
              ?
            </button>
          </div>

          {/* 特性投票說明彈窗 */}
          {showFeatureHelp && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
              onClick={() => setShowFeatureHelp(false)}
            >
              <div
                className="bg-white rounded-2xl p-5 mx-4 max-w-sm shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h4 className="text-sm font-bold text-text-main mb-3">特性投票說明</h4>
                <div className="space-y-2 text-xs text-text-secondary leading-relaxed">
                  <p>✅ <strong>已確認</strong> — 社群多數認為此特性存在</p>
                  <p>❓ <strong>存疑中</strong> — 社群意見分歧，請自行判斷</p>
                  <p>🕐 <strong>待確認</strong> — 投票人數不足，歡迎協助確認</p>
                </div>
                <p className="text-[10px] text-text-secondary/60 mt-3">
                  特性資料由社群回報，僅供參考，以實際情況為準。
                </p>
                <button
                  onClick={() => setShowFeatureHelp(false)}
                  className="mt-4 w-full py-2 rounded-xl bg-primary text-white text-xs font-semibold"
                >
                  了解
                </button>
              </div>
            </div>
          )}
          <div className="space-y-4">
            {groups.map((group) => {
              const visibleFeatures = group.features.filter(f => f.status !== 'hidden')
              if (visibleFeatures.length === 0) return null

              return (
                <div key={group.group_key}>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: group.color }}
                    />
                    <span className="text-sm font-semibold" style={{ color: group.color }}>
                      {group.group_name}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {visibleFeatures.map((f) => {
                      const faIcon = getFeatureIcon(f.key)
                      const chipStyle =
                        f.status === 'confirmed'
                          ? {
                              backgroundColor: group.color + '15',
                              color: group.color,
                              border: `1px solid ${group.color}40`,
                            }
                          : f.status === 'disputed'
                          ? {
                              backgroundColor: '#fef9c3',
                              color: '#92400e',
                              border: '1px solid #fde68a',
                            }
                          : {
                              // pending
                              backgroundColor: '#f9fafb',
                              color: '#d1d5db',
                              border: '1px solid #e5e7eb',
                            }

                      const chipTitle =
                        f.status === 'confirmed'
                          ? `${f.weighted_yes}票確認`
                          : f.status === 'disputed'
                          ? `存疑中（${f.weighted_yes}✓ ${f.weighted_no}✗）`
                          : `待確認（加權票數 ${f.total_weight}）`

                      return (
                        <span
                          key={f.id}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                          style={chipStyle}
                          title={chipTitle}
                        >
                          {f.status === 'disputed' && <span>❓</span>}
                          {f.status === 'pending' && <span>🕐</span>}
                          {faIcon ? (
                            <FontAwesomeIcon icon={faIcon} className="text-[10px]" />
                          ) : (
                            <span>{f.icon}</span>
                          )}
                          {f.name_zh}
                          {f.status === 'confirmed' && (
                            <FontAwesomeIcon icon={faCircleCheck} className="text-[10px] opacity-70" />
                          )}
                          {f.status === 'disputed' && (
                            <span className="text-[10px] ml-0.5">{f.weighted_yes}✓{f.weighted_no}✗</span>
                          )}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-text-secondary">尚無特性資料</p>
          <p className="text-xs text-text-secondary/60 mt-1">切換到「🗳️ 特性回報」幫忙回報吧！</p>
        </div>
      )}

      {/* Photo Grid (保留完整上傳功能) */}
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

// === Vote Tab ===

function VoteTab({
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
  if (!userId) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary-light/20 flex items-center justify-center">
          <FontAwesomeIcon icon={NAV_ICONS.lock} className="text-primary text-xl" />
        </div>
        <p className="text-sm text-text-secondary">登入後即可投票</p>
        <p className="text-xs text-text-secondary/60 mt-1">你的回報能幫助其他用戶！</p>
      </div>
    )
  }

  return (
    <FeatureVoting
      spotId={spotId}
      groups={groups}
      userId={userId}
      onVoted={onVoted}
    />
  )
}
