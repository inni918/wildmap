'use client'

import { useAuth } from '@/lib/auth-context'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'

interface HeaderProps {
  spotCount: number
  loading: boolean
  searchQuery?: string
  searchExpanded?: boolean
  onSearchChange?: (query: string) => void
  onSearchExpandedChange?: (expanded: boolean) => void
}

export default function Header({ spotCount, loading, searchQuery = '', searchExpanded: searchExpandedProp, onSearchChange, onSearchExpandedChange }: HeaderProps) {
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchExpandedLocal, setSearchExpandedLocal] = useState(false)
  // 使用 controlled prop 或 local state
  const searchExpanded = searchExpandedProp !== undefined ? searchExpandedProp : searchExpandedLocal
  const searchInputRef = useRef<HTMLInputElement>(null)
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

  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchExpanded])

  const handleSearchToggle = () => {
    if (searchExpanded && searchQuery) {
      // If search is open with text, clear it
      onSearchChange?.('')
    } else {
      const next = !searchExpanded
      setSearchExpandedLocal(next)
      onSearchExpandedChange?.(next)
      if (!next) {
        onSearchChange?.('')
      }
    }
  }

  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-surface/90 backdrop-blur-sm shadow-sm border-b border-border">
      <div className="px-4 py-3 flex items-center justify-between">
        <Link href="/map" className="flex items-center gap-2 no-underline flex-shrink-0">
          <img src="/logo/wildmap-logo.svg" alt="Wildmap" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-primary-dark">Wildmap</h1>
        </Link>

        <div className="flex items-center gap-3">
          {/* Search button */}
          {onSearchChange && (
            <button
              onClick={handleSearchToggle}
              className="text-text-secondary hover:text-primary transition-colors cursor-pointer p-1"
              title="搜尋地點"
            >
              <FontAwesomeIcon icon={NAV_ICONS.search} className="text-sm" />
            </button>
          )}

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
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-left px-4 py-2 text-sm text-text-main hover:bg-surface-alt cursor-pointer flex items-center gap-2 no-underline"
                  >
                    <FontAwesomeIcon icon={NAV_ICONS.user} className="text-xs" />
                    個人頁面
                  </Link>
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

      {/* Search bar - expandable */}
      {searchExpanded && onSearchChange && (
        <div className="px-4 pb-3">
          <div className="relative">
            <FontAwesomeIcon
              icon={NAV_ICONS.search}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm"
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="搜尋地點名稱或地區（如：苗栗、日月潭）..."
              className="w-full pl-9 pr-9 py-2 text-sm border border-border rounded-xl bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main cursor-pointer"
              >
                <FontAwesomeIcon icon={NAV_ICONS.close} className="text-sm" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
