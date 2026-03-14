'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import {
  getAllPermissions,
  PERMISSION_REQUIREMENTS,
  BASE_PERMISSIONS,
  isBasePermission,
  type PermissionRequirement,
} from '@/lib/permission-service'
import { supabase } from '@/lib/supabase'

// ============================================
// 技能樹定義
// ============================================

interface SkillNode {
  key: string
  label: string
  icon: string
  /** 未解鎖時的模糊提示 */
  hint: string
  group: 'starter' | 'profile' | 'explore' | 'contribute'
}

const SKILL_GROUPS: { key: string; label: string; icon: string }[] = [
  { key: 'starter', label: '起始技能', icon: '🌱' },
  { key: 'profile', label: '完成冒險者檔案即可解鎖', icon: '📋' },
  { key: 'explore', label: '探索後解鎖', icon: '🗺️' },
  { key: 'contribute', label: '貢獻後解鎖', icon: '⚔️' },
]

const SKILL_NODES: SkillNode[] = [
  // 起始技能（註冊即有）
  { key: 'browse_map', label: '瀏覽地圖', icon: '🗺️', hint: '註冊即可使用', group: 'starter' },
  { key: 'add_favorite', label: '收藏地點', icon: '❤️', hint: '註冊即可使用', group: 'starter' },
  { key: 'gps_checkin', label: 'GPS 打卡', icon: '📍', hint: '註冊即可使用', group: 'starter' },

  // 完成個人資料解鎖
  { key: 'rate_spot', label: '評分', icon: '⭐', hint: '完善你的探險者身份', group: 'profile' },
  { key: 'write_comment', label: '留言', icon: '💬', hint: '完善你的探險者身份', group: 'profile' },
  { key: 'upload_photo', label: '上傳照片', icon: '📷', hint: '完善你的探險者身份', group: 'profile' },

  // 探索後解鎖
  { key: 'vote_feature', label: '特性投票', icon: '🗳️', hint: '到第一個目的地探險', group: 'explore' },
  { key: 'add_spot', label: '新增地點', icon: '📌', hint: '持續探索更多秘境', group: 'explore' },
  { key: 'create_route', label: '建立路線', icon: '🛤️', hint: '走遍更多營地吧', group: 'explore' },

  // 貢獻後解鎖
  { key: 'reply_comment', label: '回覆留言', icon: '💭', hint: '成為活躍社群成員', group: 'contribute' },
  { key: 'edit_spot', label: '編輯地標', icon: '✏️', hint: '深入貢獻平台內容', group: 'contribute' },
  { key: 'review_edits', label: '審核編輯', icon: '🛡️', hint: '成為平台的守護者', group: 'contribute' },
]

// ============================================
// 進度計算
// ============================================

interface SkillStatus {
  unlocked: boolean
  /** 是否即將解鎖（進度 ≥ 70%） */
  nearlyUnlocked: boolean
  /** 進度百分比 0-100（只有有成就條件的才有進度） */
  progress: number | null
  /** 描述文字 */
  description: string
}

function getSkillDescription(key: string, unlocked: boolean): string {
  if (isBasePermission(key)) {
    return '註冊即可使用'
  }
  const req = PERMISSION_REQUIREMENTS[key]
  if (!req) return ''
  if (unlocked) return req.description
  // 未解鎖：回傳對應 hint
  const node = SKILL_NODES.find(n => n.key === key)
  return node?.hint || '繼續探索以解鎖'
}

export default function SkillTree() {
  const { user } = useAuth()
  const [unlockedPerms, setUnlockedPerms] = useState<Set<string>>(new Set())
  const [userStats, setUserStats] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)

    try {
      // 取得已解鎖的權限
      const perms = await getAllPermissions(user.id)
      // 基礎權限永遠算已解鎖
      const permSet = new Set([...perms, ...BASE_PERMISSIONS])
      setUnlockedPerms(permSet)

      // 取得 user_stats（用於計算近似進度）
      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (stats) {
        setUserStats(stats as Record<string, number>)
      }
    } catch (err) {
      console.error('SkillTree fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const totalSkills = SKILL_NODES.length
  const unlockedCount = SKILL_NODES.filter(n => unlockedPerms.has(n.key)).length
  const progressPercent = Math.round((unlockedCount / totalSkills) * 100)

  return (
    <div className="space-y-4">
      {/* 標題 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚔️</span>
          <h3 className="text-base font-bold text-text-main">我的技能</h3>
        </div>
        <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
          解鎖 {unlockedCount}/{totalSkills}
        </span>
      </div>

      {/* 技能組 */}
      {SKILL_GROUPS.map(group => {
        const nodes = SKILL_NODES.filter(n => n.group === group.key)
        return (
          <div key={group.key} className="space-y-2">
            {/* 組標題 */}
            <div className="flex items-center gap-2 px-1">
              <span className="text-sm">{group.icon}</span>
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                {group.label}
              </span>
              <div className="flex-1 border-t border-border/50" />
            </div>

            {/* 技能節點 */}
            <div className="space-y-1.5">
              {nodes.map(node => {
                const unlocked = unlockedPerms.has(node.key)
                const nearUnlock = !unlocked && estimateProgress(node.key, userStats) >= 70
                const isExpanded = expandedSkill === node.key

                return (
                  <button
                    key={node.key}
                    onClick={() => setExpandedSkill(isExpanded ? null : node.key)}
                    className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-all cursor-pointer ${
                      unlocked
                        ? 'bg-[#2D6A4F]/10 border-[#2D6A4F]/30 hover:border-[#2D6A4F]/50'
                        : nearUnlock
                        ? 'bg-[#D4A843]/8 border-[#D4A843]/25 hover:border-[#D4A843]/40'
                        : 'bg-surface-alt/30 border-border/40 hover:border-border/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <span
                        className={`text-xl flex-shrink-0 ${
                          unlocked
                            ? ''
                            : nearUnlock
                            ? 'opacity-70'
                            : 'grayscale opacity-40'
                        }`}
                      >
                        {node.icon}
                      </span>

                      {/* Label + status */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-semibold ${
                              unlocked
                                ? 'text-text-main'
                                : nearUnlock
                                ? 'text-text-main/80'
                                : 'text-text-secondary/60'
                            }`}
                          >
                            {node.label}
                          </span>
                        </div>
                        {!unlocked && (
                          <span className="text-[10px] text-text-secondary/50 mt-0.5 block">
                            {nearUnlock ? '即將解鎖！' : node.hint}
                          </span>
                        )}
                      </div>

                      {/* Status badge */}
                      <div className="flex-shrink-0">
                        {unlocked ? (
                          <span className="text-xs font-bold text-[#2D6A4F] bg-[#2D6A4F]/15 px-2 py-0.5 rounded-full flex items-center gap-1">
                            ✅ 已解鎖
                          </span>
                        ) : nearUnlock ? (
                          <span className="text-xs font-bold text-[#D4A843] bg-[#D4A843]/15 px-2 py-0.5 rounded-full animate-pulse">
                            🔓 即將
                          </span>
                        ) : (
                          <span className="text-xs text-text-secondary/40">
                            🔒
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 展開詳情 */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-border/30">
                        <div className="text-xs text-text-secondary space-y-1.5">
                          <p className="font-medium text-text-main/80">
                            {unlocked ? '✅ ' : '🔒 '}{getSkillDescription(node.key, unlocked)}
                          </p>
                          {!unlocked && !isBasePermission(node.key) && (
                            <SkillProgress nodeKey={node.key} stats={userStats} />
                          )}
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* 底部進度條 */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-text-main">解鎖進度</span>
          <span className="text-xs font-bold text-primary">{progressPercent}%</span>
        </div>
        <div className="h-3 bg-border/20 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #2D6A4F, #52B788, #D4A843)',
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] text-text-secondary">
            {unlockedCount} 個技能已解鎖
          </span>
          <span className="text-[10px] text-text-secondary">
            {totalSkills - unlockedCount} 個待解鎖
          </span>
        </div>
      </div>
    </div>
  )
}

// ============================================
// 進度估算（基於 user_stats）
// ============================================

function estimateProgress(key: string, stats: Record<string, number>): number {
  const checkins = (stats.checkins_total as number) || 0
  const comments = (stats.comments_total as number) || 0
  const ratings = (stats.ratings_total as number) || 0
  const votes = (stats.votes_total as number) || 0
  const spots = (stats.spots_total as number) || 0
  const replies = (stats.replies_total as number) || 0
  const photos = (stats.photos_total as number) || 0
  const edits = (stats.edits_total as number) || 0
  const reports = (stats.reports_total as number) || 0

  switch (key) {
    case 'rate_spot':
    case 'write_comment':
    case 'upload_photo':
      // 這些需要 profile_complete，不用看 stats 進度
      return 0 // 由 profile_completed 控制

    case 'vote_feature':
      return Math.min(100, (checkins / 1) * 100)
    case 'reply_comment':
      return Math.min(100, ((comments >= 1 ? 50 : 0) + (checkins >= 1 ? 50 : 0)))
    case 'add_spot':
      return Math.min(100, (checkins / 3) * 100)
    case 'create_route':
      return Math.min(100, (checkins / 60) * 50 + Math.min(50, 50)) // 簡化
    case 'edit_spot':
      return Math.min(100, ((spots >= 1 ? 30 : 0) + (votes / 30) * 70))
    case 'review_edits':
      return Math.min(100, ((spots / 10) * 60 + (reports / 1) * 40))
    default:
      return 0
  }
}

function SkillProgress({ nodeKey, stats }: { nodeKey: string; stats: Record<string, number> }) {
  const progress = estimateProgress(nodeKey, stats)
  if (progress <= 0) return null

  return (
    <div className="mt-2">
      <div className="h-1.5 bg-border/20 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            background: progress >= 70
              ? 'linear-gradient(90deg, #D4A843, #F0C060)'
              : 'linear-gradient(90deg, #888, #aaa)',
          }}
        />
      </div>
      <span className="text-[10px] text-text-secondary/60 mt-0.5 block">
        進度 {Math.round(progress)}%
      </span>
    </div>
  )
}
