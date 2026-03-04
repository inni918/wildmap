'use client'

import { useAuth } from '@/lib/auth-context'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'

export default function Header({ spotCount, loading }: { spotCount: number; loading: boolean }) {
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-surface/90 backdrop-blur-sm shadow-sm px-4 py-3 flex items-center justify-between border-b border-border">
      <Link href="/" className="flex items-center gap-2 no-underline">
        <FontAwesomeIcon icon={NAV_ICONS.map} className="text-primary text-lg" />
        <h1 className="text-xl font-bold text-primary-dark">Wildmap</h1>
      </Link>

      <div className="flex items-center gap-3">
        <p className="text-sm text-text-secondary">
          {loading ? '載入中...' : `${spotCount} 個地點`}
        </p>

        {authLoading ? (
          <div className="w-8 h-8 rounded-full bg-surface-alt animate-pulse" />
        ) : user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 cursor-pointer"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name || ''}
                  className="w-8 h-8 rounded-full border-2 border-primary-light"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-text-on-primary text-sm font-bold">
                  {(profile?.display_name || user.email || '?')[0].toUpperCase()}
                </div>
              )}
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-10 bg-surface rounded-xl shadow-lg border border-border py-2 min-w-[180px]">
                <div className="px-4 py-2 border-b border-border">
                  <p className="font-medium text-text-main text-sm truncate">
                    {profile?.display_name || user.email}
                  </p>
                  <p className="text-xs text-text-secondary">
                    Lv.{profile?.level || 1} · {profile?.points || 0} 分
                  </p>
                </div>
                <button
                  onClick={() => { signOut(); setMenuOpen(false) }}
                  className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 cursor-pointer flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={NAV_ICONS.logout} className="text-xs" />
                  登出
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-primary hover:bg-primary-dark text-text-on-primary rounded-[10px] px-4 py-1.5 text-sm font-semibold shadow-sm transition-colors no-underline"
          >
            登入
          </Link>
        )}
      </div>
    </div>
  )
}
