'use client'

import { useAuth } from '@/lib/auth-context'
import { useState, useRef, useEffect } from 'react'

export default function Header({ spotCount, loading }: { spotCount: number; loading: boolean }) {
  const { user, profile, loading: authLoading, signInWithGoogle, signOut } = useAuth()
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
          <button
            onClick={signInWithGoogle}
            className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            登入
          </button>
        )}
      </div>
    </div>
  )
}
