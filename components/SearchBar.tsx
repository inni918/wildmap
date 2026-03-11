'use client'

import { useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
}

export default function SearchBar({
  value,
  onChange,
  placeholder = '搜尋營地名稱或地區...',
  autoFocus = false,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  return (
    <div className="relative flex items-center">
      {/* 放大鏡 icon */}
      <FontAwesomeIcon
        icon={NAV_ICONS.search}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm pointer-events-none"
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            inputRef.current?.blur()
          }
        }}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2.5 text-sm border border-border rounded-2xl bg-surface shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
      />
      {/* 清除按鈕 */}
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main transition-colors cursor-pointer"
          aria-label="清除搜尋"
        >
          <FontAwesomeIcon icon={NAV_ICONS.close} className="text-sm" />
        </button>
      )}
    </div>
  )
}
