'use client'

import { useAuth } from '@/lib/auth-context'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

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
    <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm shadow-sm px-4 py-3 flex items-center justify-between">
      <h1 className="text-xl font-bold text-green-700">🗺️ Wildmap</h1>

      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-500">
          {loading ? '載入中...' : `${spotCount} 個地點`}
        </p>

        {authLoading ? (
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
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
                  className="w-8 h-8 rounded-full border-2 border-green-500"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                  {(profile?.display_name || user.email || '?')[0].toUpperCase()}
                </div>
              )}
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border py-2 min-w-[180px]">
                <div className="px-4 py-2 border-b">
                  <p className="font-medium text-gray-800 text-sm truncate">
                    {profile?.display_name || user.email}
                  </p>
                  <p className="text-xs text-gray-400">
                    Lv.{profile?.level || 1} · {profile?.points || 0} 分
                  </p>
                </div>
                <button
                  onClick={() => { signOut(); setMenuOpen(false) }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  登出
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-1.5 text-sm font-medium shadow-sm transition-colors"
          >
            登入
          </Link>
        )}
      </div>
    </div>
  )
}
