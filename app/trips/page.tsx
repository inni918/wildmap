'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'
import MobileTabBar from '@/components/MobileTabBar'

export default function TripsPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#f9fafb', paddingBottom: '80px' }}
    >
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 safe-area-top">
        <h1 className="text-xl font-bold text-gray-900">我的行程</h1>
      </header>

      {/* Empty State */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mb-6">
          <FontAwesomeIcon
            icon={NAV_ICONS.calendar}
            className="text-4xl text-green-600"
          />
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2">
          行程規劃功能即將推出
        </h2>

        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
          可以先把喜歡的地點加入收藏 ❤️
        </p>

        <a
          href="/map?favorites=1"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-[#2D6A4F] text-white rounded-xl text-sm font-semibold hover:bg-[#1f4d38] transition-colors no-underline shadow-md active:scale-95"
        >
          <FontAwesomeIcon icon={NAV_ICONS.heartSolid} className="text-sm" />
          查看我的收藏
        </a>
      </main>

      <MobileTabBar />
    </div>
  )
}
