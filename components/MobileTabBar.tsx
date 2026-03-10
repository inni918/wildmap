'use client'

import { Suspense } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

interface TabItem {
  key: string
  href: string
  icon: IconDefinition
  label: string
}

const TABS: TabItem[] = [
  { key: 'map', href: '/map?view=map', icon: NAV_ICONS.map, label: '地圖' },
  { key: 'search', href: '/map?search=1', icon: NAV_ICONS.search, label: '搜尋' },
  { key: 'favorites', href: '/map?favorites=1', icon: NAV_ICONS.heartSolid, label: '收藏' },
  { key: 'profile', href: '/profile', icon: NAV_ICONS.user, label: '我的' },
]

// Inner component that uses useSearchParams (must be in Suspense)
function MobileTabBarInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const getIsActive = (tab: TabItem) => {
    if (tab.key === 'map') return pathname === '/map' && !searchParams.get('favorites') && !searchParams.get('search')
    if (tab.key === 'search') return pathname === '/map' && searchParams.get('search') === '1'
    if (tab.key === 'favorites') return pathname === '/map' && searchParams.get('favorites') === '1'
    if (tab.key === 'profile') return pathname.startsWith('/profile')
    return false
  }

  const handleTabClick = (tab: TabItem) => {
    console.log(`[MobileTabBar] clicked ${tab.key} → navigating to ${tab.href}`)
    router.push(tab.href)
  }

  return (
    <div className="flex items-stretch">
      {TABS.map(tab => {
        const isActive = getIsActive(tab)
        return (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab)}
            className={`flex-1 flex flex-col items-center justify-center py-2 pt-2.5 min-h-[56px] transition-colors cursor-pointer ${
              isActive
                ? 'text-primary'
                : 'text-text-secondary hover:text-primary'
            }`}
          >
            <FontAwesomeIcon icon={tab.icon} className="text-lg mb-0.5" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// Fallback that doesn't need searchParams
function MobileTabBarFallback() {
  const pathname = usePathname()

  const getIsActive = (tab: TabItem) => {
    if (tab.key === 'map') return pathname === '/map'
    if (tab.key === 'profile') return pathname.startsWith('/profile')
    return false
  }

  return (
    <div className="flex items-stretch">
      {TABS.map(tab => {
        const isActive = getIsActive(tab)
        return (
          <a
            key={tab.key}
            href={tab.href}
            className={`flex-1 flex flex-col items-center justify-center py-2 pt-2.5 min-h-[56px] no-underline transition-colors ${
              isActive ? 'text-primary' : 'text-text-secondary hover:text-primary'
            }`}
          >
            <FontAwesomeIcon icon={tab.icon} className="text-lg mb-0.5" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </a>
        )
      })}
    </div>
  )
}

export default function MobileTabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-t border-border md:hidden safe-area-bottom">
      <Suspense fallback={<MobileTabBarFallback />}>
        <MobileTabBarInner />
      </Suspense>
    </nav>
  )
}
