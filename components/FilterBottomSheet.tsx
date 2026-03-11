'use client'

import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS, FEATURE_ICON_MAP } from '@/lib/icons'
import { supabase } from '@/lib/supabase'

// ── 付費類型相關型別與 state 暫時保留（預留架構），待有多個分類時再開啟 ──
// export type SpotTypeFilter = 'all' | 'campsite' | 'wild_camping'
// const SPOT_TYPE_OPTIONS: { value: SpotTypeFilter; label: string; emoji: string }[] = [
//   { value: 'all', label: '全部', emoji: '🏕' },
//   { value: 'campsite', label: '付費露營地', emoji: '💰' },
//   { value: 'wild_camping', label: '免費野營', emoji: '🌿' },
// ]

export interface FilterState {
  featureIds: string[]
  // spotType: SpotTypeFilter  // 暫時隱藏付費類型篩選
}

interface FilterBottomSheetProps {
  open: boolean
  onClose: () => void
  filter: FilterState
  onApply: (filter: FilterState) => void
}

// 六大分類定義（group_key 排序用）
const GROUP_ORDER = [
  'camp_traits',
  'facilities',
  'environment',
  'activities',
  'restrictions',
  'warnings',
] as const

const GROUP_LABEL: Record<string, string> = {
  camp_traits:  '營地特性',
  facilities:   '設施與服務',
  environment:  '周邊環境',
  activities:   '可進行活動',
  restrictions: '區域與限制',
  warnings:     '注意事項',
}

interface FeatureDef {
  id: string
  key: string
  name_zh: string
  group_key: string
  group_name: string
  sort_order: number
}

export default function FilterBottomSheet({
  open,
  onClose,
  filter,
  onApply,
}: FilterBottomSheetProps) {
  // ── local state ──
  // const [localSpotType, setLocalSpotType] = useState<SpotTypeFilter>('all')  // 暫時隱藏付費類型
  const [localFeatureIds, setLocalFeatureIds] = useState<string[]>([])

  // ── feature_definitions from Supabase ──
  const [featureDefs, setFeatureDefs] = useState<FeatureDef[]>([])
  const [featureLoading, setFeatureLoading] = useState(false)

  // ── 每個分類的展開狀態（預設全部收合） ──
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

  const sheetRef = useRef<HTMLDivElement>(null)

  // ── 開啟時同步外部 filter + 撈 feature_definitions ──
  useEffect(() => {
    if (!open) return

    // 同步 filter state
    setLocalFeatureIds(filter.featureIds)
    // setLocalSpotType(filter.spotType ?? 'all')  // 暫時隱藏付費類型

    // 撈 feature_definitions（只撈一次）
    if (featureDefs.length === 0) {
      setFeatureLoading(true)
      supabase
        .from('feature_definitions')
        .select('id, key, name_zh, group_key, group_name, sort_order')
        .order('group_key')
        .order('sort_order')
        .then(({ data, error }) => {
          if (!error && data) {
            setFeatureDefs(data as FeatureDef[])
          }
          setFeatureLoading(false)
        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

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

  // ── Toggle feature id ──
  function toggleFeatureId(id: string) {
    setLocalFeatureIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  // ── Toggle group expand ──
  function toggleGroup(groupKey: string) {
    setExpandedGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }))
  }

  // ── 清除 ──
  function handleClear() {
    const cleared: FilterState = {
      featureIds: [],
      // spotType: 'all',  // 暫時隱藏付費類型
    }
    setLocalFeatureIds([])
    // setLocalSpotType('all')  // 暫時隱藏付費類型
    onApply(cleared)
    onClose()
  }

  // ── 套用 ──
  function handleApply() {
    onApply({
      featureIds: localFeatureIds,
      // spotType: localSpotType,  // 暫時隱藏付費類型
    })
    onClose()
  }

  // 按 group_key 分組（依照 GROUP_ORDER 排序）
  const grouped = GROUP_ORDER.reduce<Record<string, FeatureDef[]>>((acc, gk) => {
    acc[gk] = featureDefs.filter(f => f.group_key === gk)
    return acc
  }, {} as Record<string, FeatureDef[]>)

  // activeCount：選中 featureIds 數量
  // const spotTypeCount = localSpotType !== 'all' ? 1 : 0  // 暫時隱藏付費類型
  const activeCount = localFeatureIds.length /* + spotTypeCount */

  if (!open) return null

  return (
    <>
      {/* 遮罩 */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Bottom Sheet 容器 */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-2xl shadow-2xl border-t border-border flex flex-col"
        style={{ maxHeight: '85vh' }}
      >
        {/* 拖曳把手 */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header（固定） */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border flex-shrink-0">
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

        {/* 可滾動內容區 */}
        <div
          className="flex-1 overflow-y-auto px-5 py-4 space-y-2"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* 暫時隱藏付費類型區塊，預留架構，未來多分類時再開啟 */}
          {/*
          <section>
            <h3 className="text-sm font-semibold text-text-main mb-3">付費類型</h3>
            <div className="flex gap-2 flex-wrap">
              {SPOT_TYPE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setLocalSpotType(opt.value)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-full text-sm font-medium border transition-colors cursor-pointer active:scale-95 ${
                    localSpotType === opt.value
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
          */}
          {/* 付費類型區塊結束 */}

          {/* ── 特性：六大分類展開式 ── */}
          <section>
            <h3 className="text-sm font-semibold text-text-main mb-3">營地特性</h3>

            {featureLoading ? (
              <div className="flex items-center justify-center py-8 text-text-secondary">
                <FontAwesomeIcon icon={NAV_ICONS.spinner} className="animate-spin mr-2" />
                <span className="text-sm">載入特性中…</span>
              </div>
            ) : (
              <div className="space-y-2">
                {GROUP_ORDER.map(groupKey => {
                  const items = grouped[groupKey]
                  if (!items || items.length === 0) return null
                  const isExpanded = !!expandedGroups[groupKey]
                  const selectedInGroup = items.filter(f => localFeatureIds.includes(f.id)).length

                  return (
                    <div key={groupKey} className="border border-border rounded-xl overflow-hidden">
                      {/* 分類標題（可點擊展開/收合） */}
                      <button
                        onClick={() => toggleGroup(groupKey)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-surface-alt hover:bg-surface-alt/80 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-text-main">
                            {GROUP_LABEL[groupKey] ?? groupKey}
                          </span>
                          {selectedInGroup > 0 && (
                            <span className="bg-primary text-white text-[10px] rounded-full px-1.5 py-0.5 font-medium">
                              {selectedInGroup}
                            </span>
                          )}
                        </div>
                        <FontAwesomeIcon
                          icon={isExpanded ? NAV_ICONS.chevronUp : NAV_ICONS.chevronDown}
                          className="text-text-secondary text-xs"
                        />
                      </button>

                      {/* 展開後的特性清單 */}
                      {isExpanded && (
                        <div className="grid grid-cols-2 gap-2 p-3 bg-surface">
                          {items.map(feat => {
                            const icon = FEATURE_ICON_MAP[feat.key] ?? NAV_ICONS.filter
                            const selected = localFeatureIds.includes(feat.id)
                            return (
                              <button
                                key={feat.id}
                                onClick={() => toggleFeatureId(feat.id)}
                                className="flex items-center gap-2 px-3 py-2.5 min-h-[44px] rounded-xl text-sm font-medium border transition-colors cursor-pointer active:scale-95"
                                style={selected ? {
                                  backgroundColor: '#D1FAE5',
                                  color: '#065F46',
                                  borderColor: '#2D6A4F',
                                } : {}}
                              >
                                <FontAwesomeIcon
                                  icon={icon}
                                  className="text-sm flex-shrink-0"
                                  style={{ color: selected ? '#065F46' : undefined }}
                                />
                                <span className="leading-tight text-left">{feat.name_zh}</span>
                                {selected && (
                                  <FontAwesomeIcon
                                    icon={NAV_ICONS.check}
                                    className="ml-auto text-xs flex-shrink-0"
                                    style={{ color: '#065F46' }}
                                  />
                                )}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>

        {/* 底部按鈕（固定在底部） */}
        <div className="flex-shrink-0 px-5 pb-8 pt-3 flex gap-3 border-t border-border bg-surface">
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
