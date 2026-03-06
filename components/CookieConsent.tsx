'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const COOKIE_CONSENT_KEY = 'wildmap_cookie_consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // 只在客戶端檢查 localStorage
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      // 延遲顯示，避免影響首屏載入
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, new Date().toISOString())
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 animate-slide-up">
      <div className="max-w-lg mx-auto bg-surface border border-border rounded-2xl shadow-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex-1 text-sm text-text-secondary leading-relaxed">
          <span className="mr-1">🍪</span>
          本站使用 Cookie 改善使用體驗。繼續使用即表示同意。{' '}
          <Link
            href="/privacy"
            className="text-primary hover:text-primary-dark font-medium no-underline"
          >
            了解更多
          </Link>
        </div>
        <button
          onClick={handleAccept}
          className="bg-primary hover:bg-primary-dark text-text-on-primary text-sm font-semibold px-5 py-2 rounded-[10px] transition-colors cursor-pointer whitespace-nowrap active:scale-95"
        >
          我知道了
        </button>
      </div>
    </div>
  )
}
