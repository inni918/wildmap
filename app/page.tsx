'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'
import { faCampground, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

// 預載地圖頁的 JS chunk — 用戶看 Landing Page 時就背景下載
if (typeof window !== 'undefined') {
  setTimeout(() => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = '/map'
    link.as = 'document'
    document.head.appendChild(link)
  }, 2000) // 2 秒後才 prefetch，不影響首頁載入
}

// 動態數字計數動畫
function AnimatedCounter({ target, duration = 2000, suffix = '' }: { target: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const startTime = Date.now()
          const step = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            // easeOutCubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

const FEATURES = [
  {
    icon: '🗺️',
    title: '1,900+ 個露營場',
    description: '涵蓋全台灣合法登記與社群回報的露營場地，持續新增中',
  },
  {
    icon: '⭐',
    title: '社群投票的真實評價',
    description: '設施、環境、活動等 106 項特性，由用戶投票確認',
  },
  {
    icon: '🏕️',
    title: '找營地，就這麼簡單',
    description: '篩選特性、查看評價、收藏比較，輕鬆找到理想營地',
  },
  {
    icon: '📱',
    title: '手機隨時查看',
    description: '響應式設計，出門在外也能輕鬆查找附近營地',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo/wildmap-logo.svg" alt="Wildmap" className="w-8 h-8" />
            <span className="text-xl font-bold text-primary-dark">Wildmap</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-text-secondary hover:text-primary transition-colors no-underline hidden sm:inline"
            >
              登入
            </Link>
            <Link
              href="/map"
              className="bg-primary hover:bg-primary-dark text-text-on-primary rounded-[10px] px-4 py-2 text-sm font-semibold shadow-sm transition-colors no-underline"
            >
              開始探索
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-primary-light/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-light/10 text-primary-dark rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            🌲 台灣最完整的露營地圖平台
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-main leading-tight mb-4">
            探索台灣
            <span className="text-primary">露營秘境</span>
          </h1>

          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
            從露營開始，探索台灣每一個角落
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/map"
              className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-text-on-primary rounded-xl px-8 py-3.5 text-base font-bold shadow-lg hover:shadow-xl transition-all no-underline flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-sm" />
              開始探索
            </Link>
            <Link
              href="/map"
              className="w-full sm:w-auto bg-surface hover:bg-surface-alt text-text-main border border-border rounded-xl px-8 py-3.5 text-base font-semibold transition-all no-underline flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={NAV_ICONS.map} className="text-sm text-primary" />
              查看地圖
            </Link>
          </div>

          {/* Hero visual - Category pills */}
          <div className="flex items-center justify-center gap-3 mt-10 flex-wrap">
            {[
              { emoji: '🏕️', label: '營地搜尋', color: 'bg-green-50 text-green-700 border-green-200' },
              { emoji: '⭐', label: '特性投票', color: 'bg-amber-50 text-amber-700 border-amber-200' },
              { emoji: '📸', label: '照片分享', color: 'bg-blue-50 text-blue-700 border-blue-200' },
              { emoji: '💬', label: '真實評價', color: 'bg-purple-50 text-purple-700 border-purple-200' },
            ].map(cat => (
              <span
                key={cat.label}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${cat.color}`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary-dark">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                <AnimatedCounter target={1900} suffix="+" />
              </div>
              <div className="flex items-center justify-center gap-1 text-sm text-white/70">
                <FontAwesomeIcon icon={faCampground} className="text-xs" />
                <span>露營場</span>
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                <AnimatedCounter target={106} />
              </div>
              <p className="text-sm text-white/70">項特性投票</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-main mb-3">
              為什麼選擇 Wildmap？
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto">
              我們致力於打造台灣最完整、最好用的露營地圖平台
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((feat, i) => (
              <div
                key={i}
                className="bg-surface rounded-2xl p-6 border border-border hover:border-primary-light hover:shadow-md transition-all group"
              >
                <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </span>
                <h3 className="text-lg font-bold text-text-main mb-2">{feat.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-surface border-t border-border">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-main mb-4">
            準備好出發了嗎？
          </h2>
          <p className="text-text-secondary mb-8 max-w-lg mx-auto">
            超過 1,900 個露營場等你探索，找到屬於你的秘境
          </p>
          <Link
            href="/map"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-text-on-primary rounded-xl px-10 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all no-underline"
          >
            <FontAwesomeIcon icon={NAV_ICONS.map} />
            開始探索地圖
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-primary-dark text-white/60">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo/wildmap-logo.svg" alt="Wildmap" className="w-7 h-7 opacity-80" />
              <span className="font-bold text-white/80">Wildmap</span>
            </div>
            <p className="text-sm">
              © {new Date().getFullYear()} Wildmap. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm flex-wrap justify-center sm:justify-end">
              <Link href="/map" className="text-white/60 hover:text-white transition-colors no-underline">
                地圖
              </Link>
              <Link href="/login" className="text-white/60 hover:text-white transition-colors no-underline">
                登入
              </Link>
              <span className="text-white/30 hidden sm:inline">|</span>
              <Link href="/privacy" className="text-white/60 hover:text-white transition-colors no-underline">
                隱私權政策
              </Link>
              <Link href="/terms" className="text-white/60 hover:text-white transition-colors no-underline">
                服務條款
              </Link>
              <Link href="/disclaimer" className="text-white/60 hover:text-white transition-colors no-underline">
                免責聲明
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
