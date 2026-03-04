'use client'

import { useState, useEffect, useCallback } from 'react'
import { type Spot, CATEGORY_EMOJI, CATEGORY_LABEL } from '@/lib/supabase'
import { fetchSpotFeatures, type GroupedFeatures } from '@/lib/features'
import { useAuth } from '@/lib/auth-context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS, getFeatureIcon } from '@/lib/icons'
import { faCircleQuestion, faCircleCheck, faPhone, faGlobe, faComment, faEnvelope, faMapLocationDot, faShieldHalved } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons'
import FeatureIcons from './FeatureIcons'
import FeatureVoting from './FeatureVoting'

interface Props {
  spot: Spot
  onClose: () => void
}

type Tab = 'info' | 'vote'

const QUALITY_BADGE: Record<string, { label: string; color: string; bgColor: string }> = {
  new: { label: '新建', color: '#EAB308', bgColor: '#EAB30820' },
  community_verified: { label: '社群驗證', color: '#22C55E', bgColor: '#22C55E20' },
  featured: { label: '精選', color: '#D4A843', bgColor: '#D4A84320' },
}

export default function SpotDetail({ spot, onClose }: Props) {
  const { user } = useAuth()
  const [groups, setGroups] = useState<GroupedFeatures[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('info')
  const [isClosing, setIsClosing] = useState(false)

  const loadFeatures = useCallback(async () => {
    setLoading(true)
    const result = await fetchSpotFeatures(spot.id, spot.category, user?.id)
    setGroups(result)
    setLoading(false)
  }, [spot.id, spot.category, user?.id])

  useEffect(() => {
    loadFeatures()
  }, [loadFeatures])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(onClose, 200)
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
                <h2 className="text-lg font-bold text-text-main truncate">{spot.name}</h2>
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
                  {spot.gov_certified && (
                    <span
                      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: '#2D6A4F',
                        color: '#FFFFFF',
                      }}
                    >
                      <FontAwesomeIcon icon={faShieldHalved} className="text-[10px]" />
                      政府登記 ✓
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-text-secondary hover:text-text-main p-1 cursor-pointer"
            >
              <FontAwesomeIcon icon={NAV_ICONS.close} />
            </button>
          </div>

          {/* Description */}
          {spot.description && (
            <p className="text-sm text-text-secondary mt-2 line-clamp-3">{spot.description}</p>
          )}

          {/* Coordinates */}
          <p className="text-xs text-text-secondary/60 mt-2 flex items-center gap-1">
            <FontAwesomeIcon icon={NAV_ICONS.location} className="text-primary text-[10px]" />
            {spot.latitude.toFixed(4)}, {spot.longitude.toFixed(4)}
          </p>

          {/* Contact icons */}
          <ContactIcons spot={spot} />

          {/* Compact feature icons */}
          {!loading && groups.length > 0 && (
            <div className="mt-3">
              <FeatureIcons groups={groups} compact />
            </div>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-border px-5">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2.5 text-sm font-medium text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'info'
                ? 'border-primary text-primary-dark'
                : 'border-transparent text-text-secondary hover:text-text-main'
            }`}
          >
            特性一覽
          </button>
          <button
            onClick={() => setActiveTab('vote')}
            className={`flex-1 py-2.5 text-sm font-medium text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'vote'
                ? 'border-primary text-primary-dark'
                : 'border-transparent text-text-secondary hover:text-text-main'
            }`}
          >
            投票特性 {user ? '' : ''}
            {!user && <FontAwesomeIcon icon={NAV_ICONS.lock} className="ml-1 text-xs" />}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <FontAwesomeIcon icon={NAV_ICONS.spinner} className="text-primary animate-spin mr-2" />
              <span className="text-sm text-text-secondary">載入特性資料...</span>
            </div>
          ) : activeTab === 'info' ? (
            <InfoTab groups={groups} />
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
    </div>
  )
}

// === Contact Icons ===

function ContactIcons({ spot }: { spot: Spot }) {
  const [showLineId, setShowLineId] = useState(false)

  const contacts: { key: string; icon: typeof faPhone; href?: string; label: string; onClick?: () => void }[] = []

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
    contacts.push({ key: 'line', icon: faComment, label: `LINE: ${spot.line_id}`, onClick: () => setShowLineId(!showLineId) })
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
                backgroundColor: '#2D6A4F15',
                color: '#2D6A4F',
              }}
              title={c.label}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2D6A4F'
                e.currentTarget.style.color = '#FFFFFF'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2D6A4F15'
                e.currentTarget.style.color = '#2D6A4F'
              }}
              onClick={c.onClick}
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
      {showLineId && spot.line_id && (
        <p className="text-xs text-text-secondary mt-1.5 pl-0.5">
          LINE ID：<span className="font-medium text-text-main">{spot.line_id}</span>
        </p>
      )}
    </div>
  )
}

// === Info Tab: Read-only feature display ===

function InfoTab({ groups }: { groups: GroupedFeatures[] }) {
  const hasAnyFeature = groups.some(g => g.features.some(f => f.status !== 'absent'))

  if (!hasAnyFeature) {
    return (
      <div className="text-center py-8">
        <p className="text-4xl mb-2">🤷</p>
        <p className="text-sm text-text-secondary">尚無特性資料</p>
        <p className="text-xs text-text-secondary/60 mt-1">切換到「投票特性」幫忙回報吧！</p>
      </div>
    )
  }

  return (
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
