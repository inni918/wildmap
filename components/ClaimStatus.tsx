'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, type BusinessClaim } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'
import { faStore, faCircleCheck, faClock, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

interface ClaimWithSpot extends BusinessClaim {
  spot_name?: string
}

const STATUS_CONFIG = {
  pending: {
    label: '審核中',
    icon: faClock,
    color: '#EAB308',
    bgColor: '#EAB30815',
  },
  approved: {
    label: '已通過',
    icon: faCircleCheck,
    color: '#22C55E',
    bgColor: '#22C55E15',
  },
  rejected: {
    label: '未通過',
    icon: faCircleXmark,
    color: '#EF4444',
    bgColor: '#EF444415',
  },
}

export default function ClaimStatus() {
  const { user, loading: authLoading } = useAuth()
  const [claims, setClaims] = useState<ClaimWithSpot[]>([])
  const [loading, setLoading] = useState(true)

  const fetchClaims = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const { data, error } = await supabase
      .from('business_claims')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error || !data) {
      setLoading(false)
      return
    }

    // 取得 spot 名稱
    const spotIds = [...new Set(data.map(c => c.spot_id))]
    if (spotIds.length > 0) {
      const { data: spots } = await supabase
        .from('spots')
        .select('id, name')
        .in('id', spotIds)

      const spotMap = new Map(spots?.map(s => [s.id, s.name]) || [])
      setClaims(data.map(c => ({
        ...c,
        spot_name: spotMap.get(c.spot_id) || '未知地點',
      })))
    } else {
      setClaims([])
    }

    setLoading(false)
  }, [user])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setLoading(false)
      return
    }
    fetchClaims()
  }, [fetchClaims, authLoading, user])

  if (!user) return null

  if (loading) {
    return (
      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <FontAwesomeIcon icon={faStore} className="text-primary text-sm" />
          <h3 className="text-sm font-bold text-text-main">我的商家認證</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <FontAwesomeIcon icon={NAV_ICONS.spinner} className="text-primary animate-spin mr-2" />
          <span className="text-sm text-text-secondary">載入中...</span>
        </div>
      </div>
    )
  }

  if (claims.length === 0) return null

  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <FontAwesomeIcon icon={faStore} className="text-primary text-sm" />
        <h3 className="text-sm font-bold text-text-main">我的商家認證</h3>
      </div>
      <div className="p-4 space-y-2">
        {claims.map(claim => {
          const config = STATUS_CONFIG[claim.status]
          return (
            <div
              key={claim.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-border/50"
              style={{ backgroundColor: config.bgColor }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="text-sm font-semibold text-text-main truncate">
                    {claim.spot_name}
                  </h4>
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{ backgroundColor: config.color + '20', color: config.color }}
                  >
                    <FontAwesomeIcon icon={config.icon} className="text-[9px]" />
                    {config.label}
                  </span>
                </div>
                <p className="text-xs text-text-secondary truncate">
                  {claim.business_name}
                </p>
                {claim.status === 'rejected' && claim.rejection_reason && (
                  <p className="text-xs text-error mt-1">
                    原因：{claim.rejection_reason}
                  </p>
                )}
              </div>
              {claim.status === 'approved' && (
                <Link
                  href={`/map?spot=${claim.spot_id}`}
                  className="text-xs font-medium text-primary hover:text-primary-dark transition-colors whitespace-nowrap no-underline flex items-center gap-1"
                >
                  管理
                  <FontAwesomeIcon icon={NAV_ICONS.chevronRight} className="text-[10px]" />
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
