'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, type Spot, CATEGORY_EMOJI, CATEGORY_LABEL } from '@/lib/supabase'
import { fetchSpotFeatures, type GroupedFeatures } from '@/lib/features'
import { useAuth } from '@/lib/auth-context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS, getFeatureIcon } from '@/lib/icons'
import { faCircleQuestion, faCircleCheck, faPhone, faGlobe, faEnvelope, faMapLocationDot, faShieldHalved, faTriangleExclamation, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faInstagram, faLine } from '@fortawesome/free-brands-svg-icons'
import FeatureIcons from './FeatureIcons'
import FeatureVoting from './FeatureVoting'
import StarRating from './StarRating'
import PhotoGrid from './PhotoGrid'
import CommentsTab from './CommentsTab'
import FavoriteButton from './FavoriteButton'
import EditSpotModal from './EditSpotModal'
import ClaimButton from './ClaimButton'

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
  // 露營場：未登記
  if (spot.category === 'camping' && !spot.gov_certified) {
    return {
      label: '⚠️ 未登記場地',
      icon: faTriangleExclamation,
      color: '#D97706',
      bgColor: '#D9770615',
      borderColor: '#D9770630',
    }
  }
  return null
}

/** 取得地點免責提示文字 */
function getDisclaimerText(spot: Spot): string | null {
  if (spot.category === 'carcamp') {
    return '本泊點資訊由社群回報，Wildmap 未實地查核。車宿前請確認當地法規，注意停車規定及安全。本平台不保證此地點可合法進行車宿活動。'
  }
  if (spot.category === 'camping' && !spot.gov_certified) {
    return '本露營場尚未取得合法登記。未登記露營場可能存在安全設施不足、用地不合法等風險。前往前請自行評估風險，並注意自身安全。本平台僅提供資訊彙整，不構成推薦或保證。'
  }
  return null
}

export default function SpotDetail({ spotId, onClose, onSpotUpdated }: Props) {
  const { user } = useAuth()
  const [spot, setSpot] = useState<Spot | null>(null)
  const [spotLoading, setSpotLoading] = useState(true)
  const [groups, setGroups] = useState<GroupedFeatures[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [isClosing, setIsClosing] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  // 用 spotId 撈完整資料
  // 撈 spot + features 一氣呵成（減少等待）
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

      // spot 拿到後立刻撈 features（不等 React re-render）
      const result = await fetchSpotFeatures(fullSpot.id, fullSpot.category, user?.id)
      if (!cancelled) {
        setGroups(result)
        setLoading(false)
      }
    }
    fetchAll()
    return () => { cancelled = true }
  }, [spotId, user?.id])

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

        {/* Header */}
        <div className="px-5 pb-3 border-b border-border">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-3xl flex-shrink-0">
                {CATEGORY_EMOJI[spot.category]}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-text-main line-clamp-2" title={spot.name}>{spot.name}</h2>
                  {spot.is_claimed && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap"
                      style={{ backgroundColor: '#3B82F620', color: '#3B82F6' }}>
                      ✅ 認證商家
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-xs font-medium text-primary">
                    {CATEGORY_LABEL[spot.category]}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: qualityConfig.bgColor,
                      color: qualityConfig.color,
                    }}
                  >
                    {qualityConfig.label}
                  </span>
                  {(() => {
                    const regBadge = getRegistrationBadge(spot)
                    if (!regBadge) return null
                    return (
                      <span
                        className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: regBadge.bgColor,
                          color: regBadge.color,
                          border: `1px solid ${regBadge.borderColor}`,
                        }}
                      >
                        {regBadge.label}
                      </span>
                    )
                  })()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              {user && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="text-text-secondary hover:text-primary p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer active:scale-90 transition-all"
                  title="編輯地點"
                >
                  <FontAwesomeIcon icon={NAV_ICONS.edit} className="text-sm" />
                </button>
              )}
              <FavoriteButton spotId={spot.id} />
              <button
                onClick={handleClose}
                className="text-text-secondary hover:text-text-main p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
              >
                <FontAwesomeIcon icon={NAV_ICONS.close} className="text-lg" />
              </button>
            </div>
          </div>

          {/* Description */}
          {spot.description && (
            <p className="text-sm text-text-secondary mt-2 line-clamp-3">{spot.description}</p>
          )}

          {/* Coordinates + Navigation */}
          <div className="flex items-center gap-2 mt-2">
            <p className="text-xs text-text-secondary/60 flex items-center gap-1">
              <FontAwesomeIcon icon={NAV_ICONS.location} className="text-primary text-[10px]" />
              {spot.latitude.toFixed(4)}, {spot.longitude.toFixed(4)}
            </p>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[44px] h-[44px] rounded-full bg-primary text-text-on-primary flex items-center justify-center hover:bg-primary-dark active:scale-90 transition-all shadow-md"
              title="用 Google Maps 導航"
            >
              <FontAwesomeIcon icon={NAV_ICONS.navigate} className="text-base" />
            </a>
          </div>

          {/* Contact icons */}
          <ContactIcons spot={spot} />

          {/* Claim button */}
          <div className="mt-2">
            <ClaimButton spot={spot} />
          </div>

          {/* Compact feature icons */}
          {!loading && groups.length > 0 && (
            <div className="mt-3">
              <FeatureIcons groups={groups} compact />
            </div>
          )}
        </div>

        {/* Tab bar - 3 tabs */}
        <div className="flex border-b border-border px-5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2.5 text-sm font-medium text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-primary text-primary-dark'
                : 'border-transparent text-text-secondary hover:text-text-main'
            }`}
          >
            總覽
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex-1 py-2.5 text-sm font-medium text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'comments'
                ? 'border-primary text-primary-dark'
                : 'border-transparent text-text-secondary hover:text-text-main'
            }`}
          >
            評論
          </button>
          <button
            onClick={() => setActiveTab('vote')}
            className={`flex-1 py-2.5 text-sm font-medium text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'vote'
                ? 'border-primary text-primary-dark'
                : 'border-transparent text-text-secondary hover:text-text-main'
            }`}
          >
            投票特性 {!user && <FontAwesomeIcon icon={NAV_ICONS.lock} className="ml-1 text-xs" />}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {activeTab === 'overview' ? (
            loading ? (
              <div className="flex items-center justify-center py-8">
                <FontAwesomeIcon icon={NAV_ICONS.spinner} className="text-primary animate-spin mr-2" />
                <span className="text-sm text-text-secondary">載入中...</span>
              </div>
            ) : (
              <OverviewTab spotId={spot.id} spot={spot} groups={groups} />
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

// === Contact Icons ===

function ContactIcons({ spot }: { spot: Spot }) {
  // LINE 連結：@ 開頭的官方帳號用 /ti/p/，其他也用 /ti/p/
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
    <div className="mt-2.5">
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
    </div>
  )
}

// === Overview Tab: Features + Rating + Photos ===

function OverviewTab({ spotId, spot, groups }: { spotId: string; spot: Spot; groups: GroupedFeatures[] }) {
  const hasAnyFeature = groups.some(g => g.features.some(f => f.status !== 'absent'))
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

      {/* Rating Section */}
      <div>
        <h3 className="text-sm font-semibold text-text-main mb-2 flex items-center gap-1.5">
          <FontAwesomeIcon icon={NAV_ICONS.starSolid} className="text-accent text-xs" />
          評分
        </h3>
        <StarRating spotId={spotId} />
      </div>

      {/* Feature Info */}
      {hasAnyFeature ? (
        <div>
          <h3 className="text-sm font-semibold text-text-main mb-3 flex items-center gap-1.5">
            <FontAwesomeIcon icon={NAV_ICONS.info} className="text-primary text-xs" />
            特性一覽
          </h3>
          <div className="space-y-4">
            {groups.map((group) => {
              const visibleFeatures = group.features.filter(f => f.status !== 'absent')
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
                      const isConfirmed = f.status === 'confirmed'
                      const faIcon = getFeatureIcon(f.key)
                      return (
                        <span
                          key={f.id}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            isConfirmed ? '' : 'opacity-50'
                          }`}
                          style={
                            isConfirmed
                              ? {
                                  backgroundColor: group.color + '15',
                                  color: group.color,
                                  border: `1px solid ${group.color}40`,
                                }
                              : {
                                  backgroundColor: '#f3f4f6',
                                  color: '#9ca3af',
                                  border: '1px solid #e5e7eb',
                                }
                          }
                          title={
                            isConfirmed
                              ? `${f.yes_count}人確認`
                              : `待確認（${f.total}票）`
                          }
                        >
                          {faIcon ? (
                            <FontAwesomeIcon icon={faIcon} className="text-[10px]" />
                          ) : (
                            <span>{f.icon}</span>
                          )}
                          {f.name_zh}
                          {isConfirmed && (
                            <FontAwesomeIcon icon={faCircleCheck} className="text-[10px] opacity-70" />
                          )}
                          {f.status === 'pending' && (
                            <FontAwesomeIcon icon={faCircleQuestion} className="text-[10px]" />
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
          <p className="text-xs text-text-secondary/60 mt-1">切換到「投票特性」幫忙回報吧！</p>
        </div>
      )}

      {/* Photo Grid */}
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
