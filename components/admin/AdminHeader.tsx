'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

export default function AdminHeader() {
  const { profile, signOut } = useAuth()
  const router = useRouter()
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

  const handleSignOut = async () => {
    await signOut()
    router.push('/admin/login')
  }

  return (
    <header className="h-14 bg-white border-b border-[var(--color-border)] flex items-center justify-between px-6">
      <div className="text-sm text-[var(--color-text-secondary)]">
        {/* 麵包屑會在各頁面自行設定 */}
      </div>

      <div className="flex items-center gap-4">
        {/* 管理員資訊 */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-bold">
              {profile?.display_name?.[0] || 'A'}
            </div>
            <span className="text-sm font-medium hidden sm:inline">
              {profile?.display_name || '管理員'}
            </span>
            <span className="text-xs text-[var(--color-text-secondary)]">▾</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[var(--color-border)] py-1 z-50">
              <div className="px-3 py-2 border-b border-[var(--color-border)]">
                <div className="text-sm font-medium">{profile?.display_name}</div>
                <div className="text-xs text-[var(--color-text-secondary)]">{profile?.email}</div>
                <div className="text-xs text-[var(--color-primary)] mt-0.5 capitalize">
                  {profile?.role || 'user'}
                </div>
              </div>
              <button
                onClick={() => router.push('/')}
                className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--color-surface-alt)] transition-colors cursor-pointer"
              >
                ← 回到前台
              </button>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 text-sm text-[var(--color-error)] hover:bg-red-50 transition-colors cursor-pointer"
              >
                登出
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
