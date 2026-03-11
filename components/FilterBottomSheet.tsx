'use client'

import { useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS, FEATURE_ICON_MAP } from '@/lib/icons'

export type SpotTypeFilter = 'all' | 'campsite' | 'wild_camping'

export interface FilterState {
  spotType: SpotTypeFilter
  features: string[]
}

interface FilterBottomSheetProps {
  open: boolean
  onClose: () => void
  filter: FilterState
  onApply: (filter: FilterState) => void
}

const SPOT_TYPE_OPTIONS: { value: SpotTypeFilter; label: string; emoji: string }[] = [
  { value: 'all', label: '全部', emoji: '🏕' },
  { value: 'campsite', label: '付費露營地', emoji: '💰' },
  { value: 'wild_camping', label: '免費野營', emoji: '🌿' },
]

const FEATURE_OPTIONS: { key: string; label: string }[] = [
  { key: 'mountain_view', label: '山景' },
  { key: 'forest', label: '森林' },
  { key: 'river_stream', label: '溪流' },
  { key: 'sea_of_clouds', label: '雲海' },
  { key: 'stargazing', label: '觀星' },
  { key: 'fireflies', label: '螢火蟲' },
  { key: 'hot_spring', label: '溫泉' },
  { key: 'child_friendly', label: '親子友善' },
  { key: 'grassland', label: '大片草皮' },
  { key: 'ocean_view', label: '海景' },
  { key: 'accommodation', label: '提供住宿' },
  { key: 'glamping', label: '豪華露營' },
  { key: 'hiking_trails', label: '健行步道' },
  { key: 'seasonal_flowers', label: '季節賞花' },
  { key: 'playground', label: '遊樂設施' },
  { key: 'high_mountain', label: '高山百岳' },
]

import { useState } from 'react'

export default function FilterBottomSheet({
  open,
  onClose,
  filter,
  onApply,
}: FilterBottomSheetProps) {
  const [localFilter, setLocalFilter] = useState<FilterState>(filter)
  const sheetRef = useRef<HTMLDivElement>(null)

  // 同步外部 filter
  useEffect(() => {
    if (open) {
      setLocalFilter(filter)
    }
  }, [open, filter])

  // 按 Esc 關閉
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // 阻止 body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  function toggleFeature(key: string) {
    setLocalFilter(prev => ({
      ...prev,
      features: prev.features.includes(key)
        ? prev.features.filter(k => k !== key)
        : [...prev.features, key],
    }))
  }

  function handleClear() {
    const cleared: FilterState = { spotType: 'all', features: [] }
    setLocalFilter(cleared)
    onApply(cleared)
    onClose()
  }

  function handleApply() {
    onApply(localFilter)
    onClose()
  }

  const activeCount =
    (localFilter.spotType !== 'all' ? 1 : 0) + localFilter.features.length

  if (!open) return null

  return (
    <>
      {/* 遮罩 */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-2xl shadow-2xl border-t border-border"
        style={{ maxHeight: '85vh', overflowY: 'auto' }}
      >
        {/* 拖曳把手 */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-text-main">篩選</h2>
            {activeCount > 0 && (
              <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5 font-medium">
                {activeCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-alt transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={NAV_ICONS.close} className="text-text-secondary text-sm" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-6">
          {/* ── 付費類型 ── */}
          <section>
            <h3 className="text-sm font-semibold text-text-main mb-3">付費類型</h3>
            <div className="flex gap-2 flex-wrap">
              {SPOT_TYPE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setLocalFilter(prev => ({ ...prev, spotType: opt.value }))}
                  className={`flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-full text-sm font-medium border transition-colors cursor-pointer active:scale-95 ${
                    localFilter.spotType === opt.value
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface text-text-secondary border-border hover:border-primary hover:text-primary'
                  }`}
                >
                  <span>{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* ── 常用特性 ── */}
          <section>
            <h3 className="text-sm font-semibold text-text-main mb-3">常用特性</h3>
            <div className="grid grid-cols-2 gap-2">
              {FEATURE_OPTIONS.map(opt => {
                const icon = FEATURE_ICON_MAP[opt.key] ?? NAV_ICONS.filter
                const selected = localFilter.features.includes(opt.key)
                return (
                  <button
                    key={opt.key}
                    onClick={() => toggleFeature(opt.key)}
                    className={`flex items-center gap-2.5 px-4 py-3 min-h-[48px] rounded-xl text-sm font-medium border transition-colors cursor-pointer active:scale-95 ${
                      selected
                        ? 'bg-[#f0fdf4] text-primary border-primary'
                        : 'bg-surface text-text-secondary border-border hover:border-primary/50 hover:text-primary'
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={icon}
                      className={`text-sm flex-shrink-0 ${selected ? 'text-primary' : 'text-text-secondary'}`}
                    />
                    <span>{opt.label}</span>
                    {selected && (
                      <FontAwesomeIcon
                        icon={NAV_ICONS.check}
                        className="ml-auto text-xs text-primary flex-shrink-0"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </section>
        </div>

        {/* 底部按鈕 */}
        <div className="px-5 pb-8 pt-2 flex gap-3 border-t border-border bg-surface">
          <button
            onClick={handleClear}
            className="flex-1 py-3 min-h-[48px] rounded-xl text-sm font-semibold bg-surface-alt text-text-secondary border border-border hover:bg-surface-alt/80 transition-colors cursor-pointer active:scale-95"
          >
            清除篩選
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 min-h-[48px] rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors cursor-pointer active:scale-95 shadow-md"
          >
            套用篩選
          </button>
        </div>
      </div>
    </>
  )
}
