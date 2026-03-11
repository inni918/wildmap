'use client'

import { useState } from 'react'

// 付費/免費篩選
export type FreeFilter = 'all' | 'free' | 'paid'

// 設施 chip 定義
export interface FacilityChip {
  key: string
  label: string
  emoji: string
}

export const FACILITY_CHIPS: FacilityChip[] = [
  { key: 'flush_toilet', label: '有衛浴', emoji: '🚿' },
  { key: 'power_outlet', label: '有電源', emoji: '🔌' },
  { key: 'pet_friendly', label: '寵物友善', emoji: '🐾' },
  { key: 'campfire', label: '可生火', emoji: '🔥' },
  { key: 'swimming_pool', label: '有泳池', emoji: '🏊' },
]

interface FilterChipsProps {
  freeFilter: FreeFilter
  onFreeFilterChange: (v: FreeFilter) => void
  selectedFacilities: string[]
  onFacilitiesChange: (keys: string[]) => void
}

export default function FilterChips({
  freeFilter,
  onFreeFilterChange,
  selectedFacilities,
  onFacilitiesChange,
}: FilterChipsProps) {
  const [chipsExpanded, setChipsExpanded] = useState(true)

  function toggleFacility(key: string) {
    if (selectedFacilities.includes(key)) {
      onFacilitiesChange(selectedFacilities.filter((k) => k !== key))
    } else {
      onFacilitiesChange([...selectedFacilities, key])
    }
  }

  const activeCount =
    (freeFilter !== 'all' ? 1 : 0) + selectedFacilities.length

  return (
    <div className="bg-surface/95 backdrop-blur-sm border-b border-border">
      {/* 收起/展開 toggle 列 */}
      <div className="flex items-center justify-end px-3 pt-1 pb-0.5">
        <button
          onClick={() => setChipsExpanded((v) => !v)}
          className="flex items-center gap-1 text-xs text-text-secondary hover:text-primary transition-colors cursor-pointer py-0.5"
        >
          {activeCount > 0 && (
            <span className="bg-primary text-white text-[10px] rounded-full px-1.5 py-0.5 font-medium mr-0.5">
              {activeCount}
            </span>
          )}
          篩選 {chipsExpanded ? '▲' : '▼'}
        </button>
      </div>

      {/* Chips 列 */}
      {chipsExpanded && (
        <div
          className="flex items-center gap-2 px-3 pb-2 overflow-x-auto scrollbar-hide"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* 暫時隱藏，未來加車宿/釣魚分類時再開啟 */}
          {/* ── 分類 Chips（單選） ── */}
          {/*
          <ChipButton
            label="🏕 全部"
            selected={freeFilter === 'all'}
            onClick={() => onFreeFilterChange('all')}
          />
          <ChipButton
            label="🏕 付費露營地"
            selected={freeFilter === 'paid'}
            onClick={() =>
              onFreeFilterChange(freeFilter === 'paid' ? 'all' : 'paid')
            }
          />
          <ChipButton
            label="🏕 免費露營地"
            selected={freeFilter === 'free'}
            onClick={() =>
              onFreeFilterChange(freeFilter === 'free' ? 'all' : 'free')
            }
          />
          */}
          {/* 暫時隱藏結束 */}

          {/* ── 設施 Chips（多選） ── */}
          {FACILITY_CHIPS.map((chip) => (
            <ChipButton
              key={chip.key}
              label={`${chip.emoji} ${chip.label}`}
              selected={selectedFacilities.includes(chip.key)}
              onClick={() => toggleFacility(chip.key)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── 單個 Chip 按鈕 ──
function ChipButton({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer active:scale-95 whitespace-nowrap ${
        selected
          ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]'
          : 'bg-white text-gray-500 border-gray-300 hover:border-[#2D6A4F] hover:text-[#2D6A4F]'
      }`}
    >
      {label}
    </button>
  )
}
