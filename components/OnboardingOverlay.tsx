'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'wildmap_onboarded'

const TIPS = [
  { icon: '🗺️', text: '點擊地圖上的標記查看地點詳情' },
  { icon: '🔍', text: '用上方搜尋框尋找特定地點' },
  { icon: '🏕️', text: '用篩選按鈕篩選不同營地特性' },
  { icon: '➕', text: '點擊地圖空白處新增地點' },
]

export default function OnboardingOverlay() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      const onboarded = localStorage.getItem(STORAGE_KEY)
      if (!onboarded) {
        setShow(true)
      }
    } catch {
      // localStorage not available
    }
  }, [])

  const handleDismiss = () => {
    setShow(false)
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // ignore
    }
  }

  if (!show) return null

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]"
      onClick={handleDismiss}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 mx-4 max-w-sm w-full animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-text-main text-center mb-1">
          👋 歡迎來到 Wildmap！
        </h2>
        <p className="text-sm text-text-secondary text-center mb-5">
          探索台灣最完整的露營地圖
        </p>

        <div className="space-y-3 mb-6">
          {TIPS.map((tip, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-2xl flex-shrink-0 w-9 text-center">{tip.icon}</span>
              <p className="text-sm text-text-main">{tip.text}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleDismiss}
          className="w-full bg-primary text-text-on-primary font-semibold py-3 rounded-xl hover:bg-primary-dark transition-colors cursor-pointer active:scale-[0.98] text-sm"
        >
          開始探索 🚀
        </button>
      </div>
    </div>
  )
}
