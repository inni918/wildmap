'use client'

import { useState, useEffect } from 'react'
import { supabase, type Spot } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStore, faCircleCheck, faClock } from '@fortawesome/free-solid-svg-icons'
import ClaimModal from './ClaimModal'

interface Props {
  spot: Spot
}

export default function ClaimButton({ spot }: Props) {
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [hasPendingClaim, setHasPendingClaim] = useState(false)

  useEffect(() => {
    if (!user) return
    // 檢查此用戶是否已有 pending 申請
    async function checkPending() {
      const { data } = await supabase
        .from('business_claims')
        .select('id, status')
        .eq('spot_id', spot.id)
        .eq('user_id', user!.id)
        .eq('status', 'pending')
        .limit(1)

      if (data && data.length > 0) {
        setHasPendingClaim(true)
      }
    }
    checkPending()
  }, [user, spot.id])

  // 已認證商家 → 顯示 badge
  if (spot.is_claimed) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
        style={{ backgroundColor: '#3B82F620', color: '#3B82F6' }}
      >
        <FontAwesomeIcon icon={faCircleCheck} className="text-[11px]" />
        認證商家
      </div>
    )
  }

  // 已有 pending 申請
  if (hasPendingClaim) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
        style={{ backgroundColor: '#EAB30820', color: '#EAB308' }}
      >
        <FontAwesomeIcon icon={faClock} className="text-[11px]" />
        認證審核中
      </div>
    )
  }

  // 未登入不顯示
  if (!user) return null

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer text-text-secondary hover:text-primary"
      >
        <FontAwesomeIcon icon={faStore} className="text-[11px]" />
        聲明擁有權
      </button>

      {showModal && (
        <ClaimModal
          spot={spot}
          onClose={() => setShowModal(false)}
          onSubmitted={() => {
            setShowModal(false)
            setHasPendingClaim(true)
          }}
        />
      )}
    </>
  )
}
