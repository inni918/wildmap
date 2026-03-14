/**
 * 成就系統 v2 — 權限服務
 * 
 * 權限完全由成就解鎖控制，不再靠等級。
 * permissions_cache 是 JSONB 快取，由 recalcPermissions() 更新。
 */
import { supabase } from './supabase'

// ============================================
// 權限類型定義
// ============================================

export type AchievementPermission =
  // 入門（profile_complete 解鎖）
  | 'rate_spot'
  | 'write_comment'
  | 'upload_photo'
  // 探索類解鎖
  | 'vote_feature'        // checkin_starter 銅
  | 'reply_comment'       // comment_writer 銅 + checkin_starter
  | 'add_spot'            // checkin_explorer 銅（+帳號≥7天）
  | 'edit_spot'           // spot_creator 銅 + voter 銀（+帳號≥30天+無違規）
  | 'custom_spot'         // 3 個貢獻類銀牌（+帳號≥30天+無違規）
  // 探索類解鎖
  | 'create_route'        // checkin_master 銀 + region_explorer 銅
  | 'create_trip_plan'    // checkin_explorer 銀
  // 社群類解鎖
  | 'host_event'          // replier 銀 + checkin_explorer 銀
  | 'create_group'        // 2 個探索類銀牌 + replier 銅
  // 治理類解鎖
  | 'report_issue'        // checkin_explorer 銅
  | 'review_edits'        // 編輯 30 + 回報 5
  // 帳號年齡
  | 'account_age_7d'
  | 'account_age_30d'
  | 'account_age_90d'
  // 個人資料完成
  | 'profile_complete'

// ============================================
// 權限→成就條件映射表
// ============================================

export interface PermissionRequirement {
  /** 需要的成就 key（全部滿足才可） */
  achievements?: Array<{
    key: string
    /** 最低等級（不指定 = 有就好） */
    minTier?: 'bronze' | 'silver' | 'gold'
  }>
  /** 需要 profile_completed */
  profileComplete?: boolean
  /** 需要帳號天數 */
  minAccountDays?: number
  /** 需要無違規記錄 */
  noViolations?: boolean
  /** 需要多少個某類成就的銀牌 */
  categorySilverCount?: {
    category: string  // achievement category_scope
    count: number
  }
  /** 需要多少個探索類銀牌 */
  exploreSilverCount?: number
  /** 描述 */
  description: string
}

/**
 * 權限→成就條件的完整映射表
 * 參考設計文件的「權限解鎖矩陣」
 */
export const PERMISSION_REQUIREMENTS: Record<string, PermissionRequirement> = {
  // === 入門（profile_complete 即可）===
  rate_spot: {
    profileComplete: true,
    description: '評分（1-5 星） — 完成個人資料即可',
  },
  write_comment: {
    profileComplete: true,
    description: '留言 — 完成個人資料即可',
  },
  upload_photo: {
    profileComplete: true,
    description: '上傳照片 — 完成個人資料即可',
  },

  // === 貢獻類 ===
  vote_feature: {
    achievements: [{ key: 'checkin_starter', minTier: 'bronze' }],
    description: '特性投票 — 打卡 1 個地點',
  },
  reply_comment: {
    achievements: [
      { key: 'comment_writer', minTier: 'bronze' },
      { key: 'checkin_starter', minTier: 'bronze' },
    ],
    description: '回覆留言 — 留言 1 則 + 打卡 1 個地點',
  },
  add_spot: {
    achievements: [{ key: 'checkin_explorer', minTier: 'bronze' }],
    minAccountDays: 7,
    description: '新增地點 — 打卡 3 個地點 + 帳號 ≥ 7 天',
  },
  edit_spot: {
    achievements: [
      { key: 'spot_creator', minTier: 'bronze' },
      { key: 'voter', minTier: 'silver' },
    ],
    minAccountDays: 30,
    noViolations: true,
    description: '編輯地標 — 新增 1 個地點 + 投票 30 次 + 帳號 ≥ 30 天 + 無違規',
  },
  custom_spot: {
    categorySilverCount: { category: 'contribution', count: 3 },
    minAccountDays: 30,
    noViolations: true,
    description: '自訂地標 — 3 個貢獻類銀牌 + 帳號 ≥ 30 天 + 無違規',
  },

  // === 探索類 ===
  create_route: {
    achievements: [
      { key: 'checkin_master', minTier: 'silver' },
      { key: 'region_explorer', minTier: 'bronze' },
    ],
    description: '建立路線 — 打卡 60 個 + 探索 2 個區域',
  },
  create_trip_plan: {
    achievements: [{ key: 'checkin_explorer', minTier: 'silver' }],
    description: '建立行程規劃 — 打卡 10 個地點',
  },

  // === 社群類 ===
  host_event: {
    achievements: [
      { key: 'replier', minTier: 'silver' },
      { key: 'checkin_explorer', minTier: 'silver' },
    ],
    description: '舉辦活動 — 回覆 10 則 + 打卡 10 個',
  },
  create_group: {
    achievements: [{ key: 'replier', minTier: 'bronze' }],
    exploreSilverCount: 2,
    description: '建立群組 — 2 個探索類銀牌 + 回覆 1 則',
  },

  // === 治理類 ===
  report_issue: {
    achievements: [{ key: 'checkin_explorer', minTier: 'bronze' }],
    description: '回報問題 — 打卡 3 個地點',
  },
  review_edits: {
    achievements: [
      { key: 'spot_creator', minTier: 'gold' },  // 新增 10 個地點
      { key: 'reporter', minTier: 'bronze' },     // 回報 1 個問題
    ],
    minAccountDays: 90,
    noViolations: true,
    description: '審核編輯 — 新增 10 個地點 + 回報問題 + 帳號 ≥ 90 天 + 無違規',
  },
}

// ============================================
// 權限檢查 API
// ============================================

/**
 * 檢查用戶是否有某項權限
 * 優先讀取 permissions_cache（快速），避免每次都 JOIN
 */
export async function hasPermission(
  userId: string,
  permission: string
): Promise<boolean> {
  const { data: user } = await supabase
    .from('users')
    .select('permissions_cache')
    .eq('id', userId)
    .single()

  if (!user?.permissions_cache) return false

  const cache = user.permissions_cache as Record<string, boolean>
  return !!cache[permission]
}

/**
 * 批次檢查多個權限（減少 DB 查詢）
 */
export async function hasPermissions(
  userId: string,
  permissions: string[]
): Promise<Record<string, boolean>> {
  const { data: user } = await supabase
    .from('users')
    .select('permissions_cache')
    .eq('id', userId)
    .single()

  const cache = (user?.permissions_cache || {}) as Record<string, boolean>
  const result: Record<string, boolean> = {}

  for (const perm of permissions) {
    result[perm] = !!cache[perm]
  }

  return result
}

/**
 * 取得用戶所有已解鎖的權限清單
 */
export async function getAllPermissions(
  userId: string
): Promise<string[]> {
  const { data: user } = await supabase
    .from('users')
    .select('permissions_cache')
    .eq('id', userId)
    .single()

  if (!user?.permissions_cache) return []

  const cache = user.permissions_cache as Record<string, boolean>
  return Object.entries(cache)
    .filter(([, v]) => v)
    .map(([k]) => k)
}

/**
 * 取得某權限的解鎖條件描述（給 UI 顯示用）
 */
export function getPermissionDescription(permission: string): string {
  return PERMISSION_REQUIREMENTS[permission]?.description || '未知權限'
}

/**
 * 取得某權限的完整需求（給詳細 UI 用）
 */
export function getPermissionRequirements(permission: string): PermissionRequirement | null {
  return PERMISSION_REQUIREMENTS[permission] || null
}

// ============================================
// 基礎權限列表（註冊即有，不需要成就）
// ============================================

export const BASE_PERMISSIONS = [
  'browse_map',
  'view_spot_detail',
  'add_favorite',
  'gps_checkin',
] as const

/**
 * 檢查是否為基礎權限（不需要成就）
 */
export function isBasePermission(permission: string): boolean {
  return (BASE_PERMISSIONS as readonly string[]).includes(permission)
}
