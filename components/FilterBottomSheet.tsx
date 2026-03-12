'use client'

import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS, FEATURE_ICON_MAP } from '@/lib/icons'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

// ── v1.0 只有特性篩選，付費類型暫時隱藏（未來開放）
export interface FilterState {
  featureKeys: string[]   // feature_definitions.key 陣列
  // spotType: SpotTypeFilter  // 預留：未來付費/免費篩選
}

const GROUP_NAMES: Record<string, string> = {
  camp_traits: '營地特性',
  facilities: '設施與服務',
  environment: '周邊環境',
  activities: '可進行活動',
  restrictions: '區域與限制',
  warnings: '注意事項',
}

const GROUP_COLORS: Record<string, string> = {
  camp_traits: '#d97706',
  facilities: '#2D6A4F',
  environment: '#388e3c',
  activities: '#1565c0',
  restrictions: '#7b1fa2',
  warnings: '#c62828',
}

const GROUP_ORDER = ['camp_traits', 'facilities', 'environment', 'activities', 'restrictions', 'warnings']

interface FeatureDef {
  id: string
  key: string
  name_zh: string
  group_key: string
  sort_order: number
}

interface FilterBottomSheetProps {
  open: boolean
  onClose: () => void
  filter: FilterState
  onApply: (filter: FilterState) => void
}

export default function FilterBottomSheet({
  open,
  onClose,
  filter,
  onApply,
}: FilterBottomSheetProps) {
  const [localFilter, setLocalFilter] = useState<FilterState>(filter)
  const [allDefs, setAllDefs] = useState<FeatureDef[]>([])
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

  // 同步外部 filter
  useEffect(() => {
    if (open) setLocalFilter(filter)
  }, [open, filter])

  // 撈 feature_definitions（用 native fetch 繞過 Supabase auth lock 問題）
  useEffect(() => {
    if (!open || allDefs.length > 0) return
    const url = `${SUPABASE_URL}/rest/v1/feature_definitions?select=id,key,name_zh,group_key,sort_order&order=group_key,sort_order`
    fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Accept': 'application/json',
      },
    })
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then((data: FeatureDef[]) => { if (data) setAllDefs(data) })
      .catch(err => console.error('feature_definitions fetch failed:', err))
  }, [open, allDefs.length])

  // Esc 關閉
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  function toggleFeature(key: string) {
    setLocalFilter(prev => ({
      ...prev,
      featureKeys: prev.featureKeys.includes(key)
        ? prev.featureKeys.filter(k => k !== key)
        : [...prev.featureKeys, key],
    }))
  }

  function toggleGroup(group: string) {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }))
  }

  function handleClear() {
    const cleared: FilterState = { featureKeys: [] }
    setLocalFilter(cleared)
    onApply(cleared)
    onClose()
  }

  function handleApply() {
    onApply(localFilter)
    onClose()
  }

  const activeCount = localFilter.featureKeys.length

  // 分組
  const grouped = GROUP_ORDER.map(gk => ({
    group_key: gk,
    group_name: GROUP_NAMES[gk] ?? gk,
    features: allDefs.filter(d => d.group_key === gk),
  })).filter(g => g.features.length > 0)

  if (!open) return null

  return (
    <>
      {/* 遮罩 */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Bottom Sheet — flex 結構讓按鈕固定在底部 */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-2xl shadow-2xl border-t border-border flex flex-col"
        style={{ maxHeight: '85vh' }}
      >
        {/* 拖曳把手 */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-text-main">篩選特性</h2>
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

        {/* 可滾動內容區 */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">

          {/* ── 付費類型（v1.0 暫時隱藏，未來開放）──
          <section>
            付費/免費篩選
          </section>
          */}

          {allDefs.length === 0 && (
            <div className="text-center text-text-secondary text-sm py-8">載入中...</div>
          )}

          {/* ── 六大分類展開式 ── */}
          {grouped.map(group => {
            const isExpanded = !!expandedGroups[group.group_key]
            const color = GROUP_COLORS[group.group_key] ?? '#2D6A4F'
            const selectedInGroup = group.features.filter(f => localFilter.featureKeys.includes(f.key)).length
            return (
              <div key={group.group_key} className="border rounded-xl overflow-hidden" style={{ borderColor: color + '40' }}>
                {/* 分類 Header */}
                <button
                  onClick={() => toggleGroup(group.group_key)}
                  className="w-full flex items-center justify-between px-4 py-3 transition-colors cursor-pointer"
                  style={{ background: color + '10' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="text-sm font-semibold" style={{ color }}>{group.group_name}</span>
                    {selectedInGroup > 0 && (
                      <span className="text-white text-[10px] rounded-full px-1.5 py-0.5 font-medium" style={{ background: color }}>
                        {selectedInGroup}
                      </span>
                    )}
                  </div>
                  <FontAwesomeIcon
                    icon={isExpanded ? faChevronUp : faChevronDown}
                    style={{ color }}
                    className="text-xs"
                  />
                </button>

                {/* 特性列表 */}
                {isExpanded && (
                  <div className="grid grid-cols-2 gap-2 px-3 pb-3 pt-2 border-t bg-surface-alt/30" style={{ borderColor: color + '30' }}>
                    {group.features.map(f => {
                      const icon = FEATURE_ICON_MAP[f.key] ?? NAV_ICONS.filter
                      const selected = localFilter.featureKeys.includes(f.key)
                      return (
                        <button
                          key={f.key}
                          onClick={() => toggleFeature(f.key)}
                          className="flex items-center gap-2 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-medium border transition-colors cursor-pointer active:scale-95"
                          style={selected ? {
                            background: color + '18',
                            color: color,
                            borderColor: color,
                          } : {
                            background: 'white',
                            color: '#6b7280',
                            borderColor: '#e5e7eb',
                          }}
                        >
                          <FontAwesomeIcon icon={icon} className="text-xs flex-shrink-0" style={{ color: selected ? color : '#9ca3af' }} />
                          <span className="truncate">{f.name_zh}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* 底部按鈕 — flex-shrink-0 固定不滾動，pb-safe 保留底部安全區 */}
        <div className="px-5 pt-3 flex gap-3 border-t border-border bg-surface flex-shrink-0" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 80px)' }}>
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
