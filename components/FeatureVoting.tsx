'use client'

import { useState, useCallback, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion, faPlus, faXmark, faChevronDown, faChevronUp, faThumbsUp, faThumbsDown, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import type { GroupedFeatures, FeatureWithVotes } from '@/lib/features'
import { getFeatureIcon } from '@/lib/icons'
import { supabase } from '@/lib/supabase'
import type { FeatureGroup } from '@/lib/supabase'
import { useAchievements } from '@/lib/achievement-context'

// ─── Constants ───────────────────────────────

const CATEGORY_ORDER: FeatureGroup[] = [
  'camp_traits',
  'facilities',
  'environment',
  'activities',
  'restrictions',
  'warnings',
]

const CATEGORY_COLOR: Record<FeatureGroup, string> = {
  camp_traits:  '#d97706',
  facilities:   '#2D6A4F',
  environment:  '#388e3c',
  activities:   '#1565c0',
  restrictions: '#7b1fa2',
  warnings:     '#c62828',
}

const CATEGORY_EMOJI: Record<FeatureGroup, string> = {
  camp_traits:  '🏕️',
  facilities:   '🛁',
  environment:  '🌿',
  activities:   '🏃',
  restrictions: '📋',
  warnings:     '⚠️',
}

// ─── Types ───────────────────────────────────

interface Props {
  spotId: string
  groups: GroupedFeatures[]
  userId: string | null
  onVoted: () => void
  onLoginRequired?: () => void
}

interface VoteState {
  yes_count: number
  no_count: number
  weighted_yes: number
  weighted_no: number
  user_vote: boolean | null
}

// ─── Helper ──────────────────────────────────

function isConfirmed(f: FeatureWithVotes): boolean {
  // true 票 ≥ false 票（且有人投票）
  return f.yes_count > 0 && f.yes_count >= f.no_count
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

// ─── Mini Toast ──────────────────────────────

function MiniToast({ message, onHide }: { message: string; onHide: () => void }) {
  useEffect(() => {
    const t = setTimeout(onHide, 2500)
    return () => clearTimeout(t)
  }, [onHide])

  return (
    <div
      className="fixed bottom-24 left-1/2 z-[100] pointer-events-none"
      style={{ transform: 'translateX(-50%)' }}
    >
      <div
        className="px-4 py-2 rounded-full text-white text-sm font-medium shadow-lg"
        style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      >
        {message}
      </div>
    </div>
  )
}

// ─── Icon Grid Item ───────────────────────────

function FeatureIconItem({
  feature,
  color,
  onClick,
}: {
  feature: FeatureWithVotes
  color: string
  onClick: () => void
}) {
  const faIcon = getFeatureIcon(feature.key)
  const confirmed = isConfirmed(feature)
  const iconColor = confirmed ? color : hexToRgba(color, 0.3)
  const label = feature.name_zh.slice(0, 4)

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 p-2 rounded-xl transition-colors active:scale-95 cursor-pointer"
      style={{ minWidth: 52 }}
    >
      <span style={{ color: iconColor, fontSize: 30, lineHeight: 1 }}>
        {faIcon ? (
          <FontAwesomeIcon icon={faIcon} style={{ fontSize: 30 }} />
        ) : (
          <span style={{ fontSize: 24 }}>{feature.icon}</span>
        )}
      </span>
      <span
        className="text-center leading-tight"
        style={{ fontSize: 10, color: '#9CA3AF', maxWidth: 52 }}
      >
        {label}
      </span>
    </button>
  )
}

// ─── Vote Buttons (in sheet) ──────────────────

function VoteButtons({
  feature,
  voteState,
  spotId,
  userId,
  onVoteChange,
  onLoginRequired,
}: {
  feature: FeatureWithVotes
  voteState: VoteState
  spotId: string
  userId: string | null
  onVoteChange: (featureId: string, newState: VoteState) => void
  onLoginRequired?: () => void
}) {
  const [voting, setVoting] = useState(false)
  const { earnAction } = useAchievements()

  const handleVote = useCallback(async (vote: boolean) => {
    if (!userId) {
      onLoginRequired?.()
      return
    }
    if (voting) return
    setVoting(true)

    // Optimistic update
    const prev = { ...voteState }
    let newState: VoteState

    if (voteState.user_vote === vote) {
      // Toggle off (cancel)
      newState = {
        yes_count: vote ? voteState.yes_count - 1 : voteState.yes_count,
        no_count: !vote ? voteState.no_count - 1 : voteState.no_count,
        weighted_yes: vote ? voteState.weighted_yes - 1 : voteState.weighted_yes,
        weighted_no: !vote ? voteState.weighted_no - 1 : voteState.weighted_no,
        user_vote: null,
      }
    } else if (voteState.user_vote === null) {
      // New vote
      newState = {
        yes_count: vote ? voteState.yes_count + 1 : voteState.yes_count,
        no_count: !vote ? voteState.no_count + 1 : voteState.no_count,
        weighted_yes: vote ? voteState.weighted_yes + 1 : voteState.weighted_yes,
        weighted_no: !vote ? voteState.weighted_no + 1 : voteState.weighted_no,
        user_vote: vote,
      }
    } else {
      // Switch vote
      newState = {
        yes_count: vote ? voteState.yes_count + 1 : voteState.yes_count - 1,
        no_count: !vote ? voteState.no_count + 1 : voteState.no_count - 1,
        weighted_yes: vote ? voteState.weighted_yes + 1 : voteState.weighted_yes - 1,
        weighted_no: !vote ? voteState.weighted_no + 1 : voteState.weighted_no - 1,
        user_vote: vote,
      }
    }

    onVoteChange(feature.id, newState)

    try {
      // Find existing vote
      const { data: existing } = await supabase
        .from('feature_votes')
        .select('id, vote')
        .eq('spot_id', spotId)
        .eq('feature_id', feature.id)
        .eq('user_id', userId)
        .maybeSingle()

      if (existing) {
        if (existing.vote === vote) {
          await supabase.from('feature_votes').delete().eq('id', existing.id)
        } else {
          await supabase.from('feature_votes').update({ vote }).eq('id', existing.id)
          earnAction('vote_helpful', feature.id)
        }
      } else {
        await supabase.from('feature_votes').insert({
          spot_id: spotId,
          feature_id: feature.id,
          user_id: userId,
          vote,
        })
        earnAction('vote_helpful', feature.id)
      }
    } catch {
      // Revert on error
      onVoteChange(feature.id, prev)
    } finally {
      setVoting(false)
    }
  }, [userId, voting, voteState, feature.id, spotId, onVoteChange, onLoginRequired, earnAction])

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleVote(true)}
        disabled={voting}
        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95 disabled:opacity-60"
        style={
          voteState.user_vote === true
            ? { backgroundColor: '#16A34A', color: '#fff' }
            : { backgroundColor: '#F0FDF4', color: '#16A34A', border: '1px solid #86EFAC' }
        }
      >
        <FontAwesomeIcon icon={faThumbsUp} className="text-[10px]" />
        {voteState.yes_count}
      </button>
      <button
        onClick={() => handleVote(false)}
        disabled={voting}
        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95 disabled:opacity-60"
        style={
          voteState.user_vote === false
            ? { backgroundColor: '#DC2626', color: '#fff' }
            : { backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5' }
        }
      >
        <FontAwesomeIcon icon={faThumbsDown} className="text-[10px]" />
        {voteState.no_count}
      </button>
    </div>
  )
}

// ─── Add Feature Panel ────────────────────────

function AddFeaturePanel({
  spotId,
  userId,
  votedFeatureIds,
  onAdded,
  onLoginRequired,
}: {
  spotId: string
  userId: string | null
  votedFeatureIds: Set<string>
  onAdded: () => void
  onLoginRequired?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [allDefs, setAllDefs] = useState<{ id: string; key: string; name_zh: string; group_key: FeatureGroup }[]>([])
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState<string | null>(null)
  const { earnAction } = useAchievements()

  const fetchDefs = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('feature_definitions')
      .select('id, key, name_zh, group_key')
      .order('sort_order')
    setAllDefs(data || [])
    setLoading(false)
  }, [])

  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  const handleOpen = () => {
    if (!userId) {
      setShowLoginPrompt(true)
      return
    }
    if (!open) fetchDefs()
    setOpen(true)
  }

  const available = allDefs.filter(
    (d) =>
      !votedFeatureIds.has(d.id) &&
      (search === '' || d.name_zh.includes(search) || d.key.includes(search))
  )

  const handleAdd = async (def: { id: string; key: string; name_zh: string }) => {
    if (!userId || adding) return
    setAdding(def.id)
    try {
      await supabase.from('feature_votes').insert({
        spot_id: spotId,
        feature_id: def.id,
        user_id: userId,
        vote: true,
      })
      earnAction('vote_helpful', def.id)
      onAdded()
      setOpen(false)
      setSearch('')
    } catch {
      // ignore
    } finally {
      setAdding(null)
    }
  }

  return (
    <div className="border-t border-border/40 pt-3 mt-1">
      {!open ? (
        <>
        <button
          onClick={handleOpen}
          className="flex items-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-colors cursor-pointer active:scale-[0.98]"
          style={{
            backgroundColor: '#2D6A4F10',
            color: '#2D6A4F',
            border: '1px dashed #2D6A4F40',
          }}
        >
          <FontAwesomeIcon icon={faPlus} className="text-xs" />
          新增我知道的特性
        </button>

        {/* 未登入提示 modal */}
        {showLoginPrompt && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            onClick={() => setShowLoginPrompt(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl p-6 mx-4 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🔒</div>
                <h3 className="text-lg font-bold text-text-main">需要登入</h3>
                <p className="text-sm text-text-secondary mt-1">
                  新增特性功能需要先登入才能使用
                </p>
              </div>
              <a
                href="/login"
                className="block w-full py-3 text-center rounded-xl font-semibold text-white text-sm"
                style={{ backgroundColor: '#2D6A4F' }}
              >
                前往登入
              </a>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="block w-full py-2 mt-2 text-center text-sm text-text-secondary cursor-pointer"
              >
                取消
              </button>
            </div>
          </div>
        )}
        </>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-text-main">選擇特性</span>
            <button
              onClick={() => { setOpen(false); setSearch('') }}
              className="p-1 text-text-secondary cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          <div className="relative mb-2">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/50 text-xs"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜尋特性..."
              className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-border bg-surface-alt outline-none focus:border-primary/40"
            />
          </div>
          {loading ? (
            <p className="text-xs text-text-secondary/60 text-center py-3">載入中...</p>
          ) : available.length === 0 ? (
            <p className="text-xs text-text-secondary/60 text-center py-3">沒有更多特性可新增</p>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-1">
              {available.map((def) => {
                const faIcon = getFeatureIcon(def.key)
                const color = CATEGORY_COLOR[def.group_key] || '#2D6A4F'
                return (
                  <button
                    key={def.id}
                    onClick={() => handleAdd(def)}
                    disabled={adding === def.id}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left text-sm transition-colors cursor-pointer active:scale-[0.98] hover:bg-surface-alt disabled:opacity-60"
                  >
                    <span style={{ color, width: 20, textAlign: 'center' }}>
                      {faIcon ? (
                        <FontAwesomeIcon icon={faIcon} className="text-sm" />
                      ) : (
                        '•'
                      )}
                    </span>
                    <span className="text-text-main">{def.name_zh}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Detail Bottom Sheet ──────────────────────

function DetailSheet({
  spotId,
  groups,
  userId,
  onClose,
  onVoted,
  onLoginRequired,
}: {
  spotId: string
  groups: GroupedFeatures[]
  userId: string | null
  onClose: () => void
  onVoted: () => void
  onLoginRequired?: () => void
}) {
  const [showHelp, setShowHelp] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [voteStates, setVoteStates] = useState<Record<string, VoteState>>(() => {
    const map: Record<string, VoteState> = {}
    for (const group of groups) {
      for (const f of group.features) {
        if (f.yes_count > 0 || f.no_count > 0) {
          map[f.id] = {
            yes_count: f.yes_count,
            no_count: f.no_count,
            weighted_yes: f.weighted_yes ?? f.yes_count,
            weighted_no: f.weighted_no ?? f.no_count,
            user_vote: f.user_vote ?? null,
          }
        }
      }
    }
    return map
  })

  // Collect all voted feature ids (for add panel)
  const votedFeatureIds = new Set(Object.keys(voteStates))

  const handleVoteChange = useCallback((featureId: string, newState: VoteState) => {
    setVoteStates((prev) => ({ ...prev, [featureId]: newState }))
  }, [])

  const handleLoginRequired = useCallback(() => {
    setToast('請先登入')
    onLoginRequired?.()
  }, [onLoginRequired])

  const handleAdded = useCallback(() => {
    onVoted()
    setToast('已新增特性！')
    setTimeout(onClose, 1200)
  }, [onVoted, onClose])

  // Sorted groups with only voted features
  const sortedGroups = CATEGORY_ORDER
    .map((key) => groups.find((g) => g.group_key === key))
    .filter(Boolean)
    .map((group) => ({
      ...group!,
      color: CATEGORY_COLOR[group!.group_key] || group!.color,
      votedFeatures: group!.features
        .filter((f) => (f.yes_count > 0 || f.no_count > 0))
        .sort((a, b) => a.sort_order - b.sort_order),
    }))
    .filter((g) => g.votedFeatures.length > 0)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
        style={{ pointerEvents: 'none' }}
      >
        <div
          className="bg-surface rounded-t-2xl w-full max-w-lg shadow-2xl flex flex-col animate-slide-up"
          style={{ maxHeight: '82vh', pointerEvents: 'auto' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle */}
          <div className="flex justify-center pt-2 pb-1 flex-shrink-0">
            <div className="w-10 h-1 rounded-full bg-border" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border flex-shrink-0">
            <h3 className="text-base font-bold text-text-main">特性詳情</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHelp((v) => !v)}
                className="text-text-secondary/70 hover:text-text-main p-1 cursor-pointer transition-colors"
                title="什麼是投票？"
              >
                <FontAwesomeIcon icon={faCircleQuestion} className="text-lg" />
              </button>
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-text-main p-1 cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} className="text-lg" />
              </button>
            </div>
          </div>

          {/* Help expand */}
          {showHelp && (
            <div
              className="mx-5 mt-3 px-4 py-3 rounded-xl text-sm leading-relaxed flex-shrink-0"
              style={{ backgroundColor: '#1565c010', color: '#1565c0', border: '1px solid #1565c030' }}
            >
              特性由社群投票決定。獲得 60% 以上「有」票的特性會顯示為確認。你的投票幫助其他露營者做決定！
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-5 py-3">
            {sortedGroups.length === 0 ? (
              <p className="text-sm text-text-secondary/60 text-center py-8">尚無特性記錄</p>
            ) : (
              <div className="space-y-1">
                {sortedGroups.map((group, gi) => (
                  <div key={group.group_key}>
                    {/* Category header */}
                    <div
                      className="flex items-center gap-2 py-2"
                      style={gi > 0 ? { borderTop: '1px solid #e5e7eb', marginTop: 8, paddingTop: 12 } : {}}
                    >
                      <span className="text-base">{CATEGORY_EMOJI[group.group_key]}</span>
                      <span className="text-sm font-bold" style={{ color: group.color }}>
                        {group.group_name}
                      </span>
                    </div>

                    {/* Feature rows */}
                    <div className="space-y-2">
                      {group.votedFeatures.map((feature) => {
                        const state = voteStates[feature.id] || {
                          yes_count: feature.yes_count,
                          no_count: feature.no_count,
                          weighted_yes: feature.weighted_yes ?? feature.yes_count,
                          weighted_no: feature.weighted_no ?? feature.no_count,
                          user_vote: feature.user_vote ?? null,
                        }
                        const faIcon = getFeatureIcon(feature.key)
                        const totalVotes = state.weighted_yes + state.weighted_no
                        const confirmed = state.weighted_yes >= state.weighted_no && state.weighted_yes > 0

                        return (
                          <div
                            key={feature.id}
                            className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl"
                            style={{
                              backgroundColor: confirmed
                                ? hexToRgba(group.color, 0.06)
                                : '#F9FAFB',
                            }}
                          >
                            {/* Left: icon + name + count */}
                            <div className="flex items-center gap-2 min-w-0">
                              <span style={{ color: confirmed ? group.color : hexToRgba(group.color, 0.4), fontSize: 18, width: 22, textAlign: 'center', flexShrink: 0 }}>
                                {faIcon ? (
                                  <FontAwesomeIcon icon={faIcon} />
                                ) : (
                                  <span>{feature.icon}</span>
                                )}
                              </span>
                              <div className="min-w-0">
                                <span className="text-sm font-medium text-text-main block truncate">
                                  {feature.name_zh}
                                </span>
                                <span className="text-[11px] text-text-secondary/60">
                                  {totalVotes > 0
                                    ? confirmed
                                      ? `${state.weighted_yes}票確認`
                                      : `${totalVotes}票投票`
                                    : '尚無投票'}
                                </span>
                              </div>
                            </div>

                            {/* Right: vote buttons */}
                            <VoteButtons
                              feature={feature}
                              voteState={state}
                              spotId={spotId}
                              userId={userId}
                              onVoteChange={handleVoteChange}
                              onLoginRequired={handleLoginRequired}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add feature */}
            <AddFeaturePanel
              spotId={spotId}
              userId={userId}
              votedFeatureIds={votedFeatureIds}
              onAdded={handleAdded}
              onLoginRequired={handleLoginRequired}
            />
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && <MiniToast message={toast} onHide={() => setToast(null)} />}
    </>
  )
}

// ─── Main Component ───────────────────────────

export default function FeatureVoting({
  spotId,
  groups,
  userId,
  onVoted,
  onLoginRequired,
}: Props) {
  const [sheetOpen, setSheetOpen] = useState(false)

  // All features with votes, sorted by category order then sort_order
  const votedFeatures: { feature: FeatureWithVotes; color: string }[] = []
  for (const catKey of CATEGORY_ORDER) {
    const group = groups.find((g) => g.group_key === catKey)
    if (!group) continue
    const color = CATEGORY_COLOR[catKey] || group.color
    const sorted = [...group.features]
      .filter((f) => f.yes_count > 0 || f.no_count > 0)
      .sort((a, b) => a.sort_order - b.sort_order)
    for (const feature of sorted) {
      votedFeatures.push({ feature, color })
    }
  }

  if (votedFeatures.length === 0) {
    return (
      <div className="flex flex-col items-start gap-1">
        <p className="text-xs text-text-secondary/60">尚無特性記錄</p>
        <button
          onClick={() => setSheetOpen(true)}
          className="text-xs text-primary hover:underline cursor-pointer flex items-center gap-1"
        >
          協助回報特性
          <FontAwesomeIcon icon={faChevronDown} className="text-[9px]" />
        </button>
        {sheetOpen && (
          <DetailSheet
            spotId={spotId}
            groups={groups}
            userId={userId}
            onClose={() => setSheetOpen(false)}
            onVoted={onVoted}
            onLoginRequired={onLoginRequired}
          />
        )}
      </div>
    )
  }

  return (
    <>
      {/* Icon Grid */}
      <div className="flex flex-wrap gap-1">
        {votedFeatures.map(({ feature, color }) => (
          <FeatureIconItem
            key={feature.id}
            feature={feature}
            color={color}
            onClick={() => setSheetOpen(true)}
          />
        ))}
      </div>

      {/* "View all" link */}
      <button
        onClick={() => setSheetOpen(true)}
        className="mt-2 text-xs text-primary hover:underline cursor-pointer flex items-center gap-1"
      >
        查看全部特性 &amp; 投票
        <FontAwesomeIcon icon={faChevronDown} className="text-[9px]" />
      </button>

      {/* Detail Bottom Sheet */}
      {sheetOpen && (
        <DetailSheet
          spotId={spotId}
          groups={groups}
          userId={userId}
          onClose={() => setSheetOpen(false)}
          onVoted={onVoted}
          onLoginRequired={onLoginRequired}
        />
      )}
    </>
  )
}
