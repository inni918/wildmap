'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type NavItem = {
  label: string
  href: string
  icon: string
  badge?: number
  group?: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: '用戶管理', href: '/admin/users', icon: '👥', group: '內容管理' },
  { label: '地標管理', href: '/admin/spots', icon: '🏕️', group: '內容管理' },
  { label: '檢舉處理', href: '/admin/reports', icon: '🚩', group: '審核中心' },
  { label: '商家管理', href: '/admin/business', icon: '🏪', group: '審核中心' },
  { label: '用戶回饋', href: '/admin/feedback', icon: '💬', group: '審核中心' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [badges, setBadges] = useState<Record<string, number>>({})

  // 取得待處理數量
  useEffect(() => {
    async function fetchBadges() {
      const [reportsRes, businessRes, feedbackRes] = await Promise.all([
        supabase
          .from('reports')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabase
          .from('business_claims')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabase
          .from('feedback')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
      ])
      setBadges({
        '/admin/reports': reportsRes.count || 0,
        '/admin/business': businessRes.count || 0,
        '/admin/feedback': feedbackRes.count || 0,
      })
    }
    fetchBadges()
  }, [])

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  // 將項目分組
  const groups: Record<string, NavItem[]> = {}
  const ungrouped: NavItem[] = []
  NAV_ITEMS.forEach((item) => {
    if (item.group) {
      if (!groups[item.group]) groups[item.group] = []
      groups[item.group].push(item)
    } else {
      ungrouped.push(item)
    }
  })

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-[var(--color-border)] transition-all duration-200 z-40 flex flex-col ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-[var(--color-border)]">
        <Link href="/admin" className="flex items-center gap-2 no-underline">
          <span className="text-xl">🏕️</span>
          {!collapsed && (
            <span className="font-bold text-[var(--color-primary)] text-base">
              Wildmap 後台
            </span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {/* 無群組項目（Dashboard） */}
        {ungrouped.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(item.href)}
            collapsed={collapsed}
            badge={badges[item.href]}
          />
        ))}

        {/* 分組項目 */}
        {Object.entries(groups).map(([group, items]) => (
          <div key={group} className="mt-4">
            {!collapsed && (
              <div className="px-4 mb-1 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                {group}
              </div>
            )}
            {items.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={isActive(item.href)}
                collapsed={collapsed}
                badge={badges[item.href]}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* 折疊按鈕 */}
      <div className="border-t border-[var(--color-border)] p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] transition-colors cursor-pointer"
        >
          {collapsed ? '→' : '← 收合'}
        </button>
      </div>
    </aside>
  )
}

function NavLink({
  item,
  active,
  collapsed,
  badge,
}: {
  item: NavItem
  active: boolean
  collapsed: boolean
  badge?: number
}) {
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm no-underline transition-colors ${
        active
          ? 'bg-[var(--color-primary)] text-white font-medium'
          : 'text-[var(--color-text)] hover:bg-[var(--color-surface-alt)]'
      }`}
    >
      <span className="text-base flex-shrink-0">{item.icon}</span>
      {!collapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {badge !== undefined && badge > 0 && (
            <span className="bg-[var(--color-error)] text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  )
}
