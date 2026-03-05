'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

interface TabItem {
  href: string
  icon: IconDefinition
  label: string
}

const TABS: TabItem[] = [
  { href: '/map', icon: NAV_ICONS.map, label: '地圖' },
  { href: '/map?search=1', icon: NAV_ICONS.search, label: '搜尋' },
  { href: '/map?favorites=1', icon: NAV_ICONS.heartSolid, label: '收藏' },
  { href: '/profile', icon: NAV_ICONS.user, label: '我的' },
]

export default function MobileTabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-t border-border md:hidden safe-area-bottom">
      <div className="flex items-stretch">
        {TABS.map(tab => {
          const isActive = pathname === tab.href || 
            (tab.href === '/map' && pathname === '/map' && !tab.href.includes('?'))
          
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex-1 flex flex-col items-center justify-center py-2 pt-2.5 min-h-[56px] no-underline transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="text-lg mb-0.5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
