'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'
import { supabase } from '@/lib/supabase'

interface SpotResult {
  id: string
  name: string
  address: string | null
  county: string | null
  latitude: number
  longitude: number
}

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
  onSelectSpot?: (spot: SpotResult) => void
}

export default function SearchBar({
  value,
  onChange,
  placeholder = '搜尋營地名稱...',
  autoFocus = false,
  onSelectSpot,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [results, setResults] = useState<SpotResult[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  // 點搜尋框外關閉下拉
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // debounce 搜尋
  const searchSpots = useCallback(async (query: string) => {
    if (!query.trim() || query.trim().length < 1) {
      setResults([])
      setShowDropdown(false)
      return
    }
    setSearching(true)
    try {
      const { data, error } = await supabase
        .from('spots')
        .select('id, name, address, county, latitude, longitude')
        .ilike('name', `%${query.trim()}%`)
        .limit(10)

      if (!error && data) {
        setResults(data as SpotResult[])
        setShowDropdown(true)
      }
    } catch {
      // silent
    } finally {
      setSearching(false)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    onChange(v)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!v.trim()) {
      setResults([])
      setShowDropdown(false)
      return
    }
    debounceRef.current = setTimeout(() => {
      searchSpots(v)
    }, 300)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowDropdown(false)
      inputRef.current?.blur()
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      inputRef.current?.blur()
    }
  }

  const handleSelectSpot = (spot: SpotResult) => {
    onChange(spot.name)
    setShowDropdown(false)
    onSelectSpot?.(spot)
  }

  return (
    <div ref={containerRef} className="relative flex-1">
      <div className="relative flex items-center">
        {/* 放大鏡 icon */}
        {searching ? (
          <FontAwesomeIcon
            icon={NAV_ICONS.spinner}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-sm pointer-events-none animate-spin"
          />
        ) : (
          <FontAwesomeIcon
            icon={NAV_ICONS.search}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm pointer-events-none"
          />
        )}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setShowDropdown(true)
          }}
          placeholder={placeholder}
          className="w-full pl-9 pr-9 py-2.5 text-sm border border-border rounded-2xl bg-surface shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
        {/* 清除按鈕 */}
        {value && (
          <button
            onClick={() => {
              onChange('')
              setResults([])
              setShowDropdown(false)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main transition-colors cursor-pointer"
            aria-label="清除搜尋"
          >
            <FontAwesomeIcon icon={NAV_ICONS.close} className="text-sm" />
          </button>
        )}
      </div>

      {/* 下拉清單 */}
      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
          {results.map((spot) => {
            const city = spot.county || null
            return (
              <button
                key={spot.id}
                onMouseDown={(e) => {
                  // 用 mousedown 避免 blur 先觸發
                  e.preventDefault()
                  handleSelectSpot(spot)
                }}
                className="w-full flex items-center justify-between px-4 py-3 min-h-[48px] text-left hover:bg-[#f0fdf4] transition-colors border-b border-border/50 last:border-b-0 cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FontAwesomeIcon
                    icon={NAV_ICONS.location}
                    className="text-primary text-xs flex-shrink-0"
                  />
                  <span className="text-sm font-medium text-text-main truncate">
                    {spot.name}
                  </span>
                </div>
                {city && (
                  <span className="text-xs text-text-secondary flex-shrink-0 ml-2">
                    {city}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* 無結果提示 */}
      {showDropdown && results.length === 0 && !searching && value.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-2xl shadow-xl z-50 px-4 py-3">
          <p className="text-sm text-text-secondary text-center">找不到符合的營地</p>
        </div>
      )}
    </div>
  )
}
