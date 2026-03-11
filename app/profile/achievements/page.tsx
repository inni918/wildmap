'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'
import AchievementGrid from '@/components/AchievementGrid'
import MobileTabBar from '@/components/MobileTabBar'
import type { User } from '@supabase/supabase-js'

export default function AchievementsPage() {
  const { user: contextUser, loading: authLoading } = useAuth()

  // 直接 URL 導航時，AuthProvider 的 safety timeout 可能在 session 尚未完全
  // 恢復前就將 loading 設為 false（user 仍為 null）。這裡用 client-side
  // getUser() 做二次確認，避免誤判為未登入。
  const [localUser, setLocalUser] = useState<User | null>(null)
  const [localLoading, setLocalLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) {
        setLocalUser(data.user ?? null)
        setLocalLoading(false)
      }
    }).catch(() => {
      if (!cancelled) setLocalLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  const user = contextUser ?? localUser
  const loading = authLoading && localLoading

  if (loading) {
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
        <p className="text-sm text-text-secondary text-center">登入後即可查看成就徽章</p>
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

  return (
    <div className="min-h-screen bg-bg pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/profile" className="flex items-center gap-2 no-underline">
            <FontAwesomeIcon icon={NAV_ICONS.back} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">返回個人頁面</span>
          </Link>
          <h1 className="text-base font-bold text-text-main">🏅 成就徽章</h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <AchievementGrid />
      </div>

      <MobileTabBar />
    </div>
  )
}
