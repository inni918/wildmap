/**
 * 權限矩陣系統
 * 根據等級控制功能存取，完整 28 項功能 × 5 等級權限對照
 */

import { getLevel } from './levels'

// ============================================
// 權限功能定義
// ============================================

export type Permission =
  // 瀏覽
  | 'browse_map'
  | 'view_spot_detail'
  | 'view_reviews'
  | 'view_trails'
  | 'download_gpx'
  // 評論
  | 'write_review'
  | 'review_with_links'
  | 'rate_spot'
  | 'edit_own_review'
  // 照片/影片
  | 'upload_photo'
  | 'upload_video'
  // 互動
  | 'vote_helpful'
  | 'reply_comment'
  | 'answer_question'
  | 'send_message'
  | 'report_content'
  // 地標
  | 'fact_check'
  | 'report_error'
  | 'edit_spot_info'
  | 'add_spot'
  | 'add_trail'
  | 'upload_gpx'
  // 社區
  | 'start_discussion'
  | 'community_vote'
  | 'advanced_forum'
  | 'pioneer_forum'
  // 管理
  | 'mark_helpful'
  | 'vote_close'
  | 'review_edits'
  | 'review_spots'

// ============================================
// 權限配置
// ============================================

export interface PermissionConfig {
  /** 最低等級需求 */
  minLevel: number
  /** 需要審核才能執行 */
  requiresReview?: boolean
  /** 每日次數限制（依等級不同） */
  dailyLimits?: Record<number, number | null>
  /** 權限描述 */
  description: string
  /** 權限分類 */
  category: 'browse' | 'review' | 'media' | 'interact' | 'landmark' | 'community' | 'manage'
}

// ============================================
// 完整權限矩陣
// ============================================

export const PERMISSION_MATRIX: Record<Permission, PermissionConfig> = {
  // === 瀏覽 ===
  browse_map: {
    minLevel: 1,
    description: '瀏覽地圖/搜尋地點',
    category: 'browse',
  },
  view_spot_detail: {
    minLevel: 1,
    description: '查看地點詳情',
    category: 'browse',
  },
  view_reviews: {
    minLevel: 1,
    description: '查看評論/照片',
    category: 'browse',
  },
  view_trails: {
    minLevel: 1,
    description: '查看路線軌跡',
    category: 'browse',
  },
  download_gpx: {
    minLevel: 2,
    description: '下載 GPX 路線',
    category: 'browse',
  },

  // === 評論 ===
  write_review: {
    minLevel: 1,
    dailyLimits: { 1: 3, 2: 10, 3: null, 4: null, 5: null },
    description: '撰寫評論',
    category: 'review',
  },
  review_with_links: {
    minLevel: 3,
    dailyLimits: { 3: 2, 4: null, 5: null },
    description: '評論中加入超連結',
    category: 'review',
  },
  rate_spot: {
    minLevel: 1,
    description: '為地點評分',
    category: 'review',
  },
  edit_own_review: {
    minLevel: 1,
    description: '編輯自己的評論',
    category: 'review',
  },

  // === 照片/影片 ===
  upload_photo: {
    minLevel: 1,
    dailyLimits: { 1: 5, 2: 20, 3: null, 4: null, 5: null },
    description: '上傳照片',
    category: 'media',
  },
  upload_video: {
    minLevel: 2,
    dailyLimits: { 2: 3, 3: 5, 4: null, 5: null },
    description: '上傳影片',
    category: 'media',
  },

  // === 互動 ===
  vote_helpful: {
    minLevel: 2,
    description: '投有用/沒用票',
    category: 'interact',
  },
  reply_comment: {
    minLevel: 1,
    dailyLimits: { 1: 5, 2: 20, 3: null, 4: null, 5: null },
    description: '留言/回覆評論',
    category: 'interact',
  },
  answer_question: {
    minLevel: 2,
    description: '回答問題',
    category: 'interact',
  },
  send_message: {
    minLevel: 3,
    description: '私訊其他用戶',
    category: 'interact',
  },
  report_content: {
    minLevel: 2,
    description: '檢舉違規內容',
    category: 'interact',
  },

  // === 地標 ===
  fact_check: {
    minLevel: 2,
    description: '事實查核（確認資訊）',
    category: 'landmark',
  },
  report_error: {
    minLevel: 2,
    description: '回報錯誤資訊',
    category: 'landmark',
  },
  edit_spot_info: {
    minLevel: 3,
    requiresReview: true, // Lv3 需審核, Lv4+ 免審核
    description: '編輯地點基本資訊',
    category: 'landmark',
  },
  add_spot: {
    minLevel: 3,
    requiresReview: true, // Lv3-4 需審核, Lv5 免審核
    description: '新增地點',
    category: 'landmark',
  },
  add_trail: {
    minLevel: 3,
    requiresReview: true,
    description: '新增路線',
    category: 'landmark',
  },
  upload_gpx: {
    minLevel: 3,
    description: '上傳 GPX 軌跡',
    category: 'landmark',
  },

  // === 社區 ===
  start_discussion: {
    minLevel: 2,
    description: '發起討論話題',
    category: 'community',
  },
  community_vote: {
    minLevel: 2,
    description: '參加社區投票',
    category: 'community',
  },
  advanced_forum: {
    minLevel: 4,
    description: '進入進階討論區',
    category: 'community',
  },
  pioneer_forum: {
    minLevel: 5,
    description: '進入先驅者專屬區',
    category: 'community',
  },

  // === 管理 ===
  mark_helpful: {
    minLevel: 2,
    description: '標記評論為有用',
    category: 'manage',
  },
  vote_close: {
    minLevel: 4,
    description: '投票關閉不當問題',
    category: 'manage',
  },
  review_edits: {
    minLevel: 4,
    description: '審核他人的編輯',
    category: 'manage',
  },
  review_spots: {
    minLevel: 5,
    description: '審核新增的地點',
    category: 'manage',
  },
}

// ============================================
// 權限檢查 API
// ============================================

export interface PermissionCheckResult {
  allowed: boolean
  /** 需要的等級（權限不足時顯示） */
  requiredLevel: number
  /** 是否需要審核 */
  requiresReview: boolean
  /** 每日剩餘次數（null = 不限制） */
  dailyRemaining?: number | null
  /** 權限描述 */
  description: string
}

/**
 * 檢查用戶是否有某項權限
 */
export function checkPermission(
  permission: Permission,
  userLevel: number,
): PermissionCheckResult {
  const config = PERMISSION_MATRIX[permission]

  const allowed = userLevel >= config.minLevel
  const requiresReview = config.requiresReview
    ? (permission === 'edit_spot_info' && userLevel >= 4) ? false
    : (permission === 'add_spot' && userLevel >= 5) ? false
    : (permission === 'add_trail' && userLevel >= 5) ? false
    : true
    : false

  return {
    allowed,
    requiredLevel: config.minLevel,
    requiresReview: allowed ? requiresReview : false,
    description: config.description,
  }
}

/**
 * 取得某權限的每日限制次數
 */
export function getDailyLimit(
  permission: Permission,
  userLevel: number,
): number | null {
  const config = PERMISSION_MATRIX[permission]
  if (!config.dailyLimits) return null
  // 找用戶等級或以下最接近的限制
  for (let lv = userLevel; lv >= 1; lv--) {
    if (lv in config.dailyLimits) return config.dailyLimits[lv]
  }
  return null
}

/**
 * 取得用戶在某等級可用的所有功能列表
 */
export function getPermissionsForLevel(level: number): Permission[] {
  return (Object.entries(PERMISSION_MATRIX) as [Permission, PermissionConfig][])
    .filter(([, config]) => config.minLevel <= level)
    .map(([perm]) => perm)
}

/**
 * 取得升級到某等級新解鎖的功能
 */
export function getNewPermissionsAtLevel(level: number): Permission[] {
  return (Object.entries(PERMISSION_MATRIX) as [Permission, PermissionConfig][])
    .filter(([, config]) => config.minLevel === level)
    .map(([perm]) => perm)
}

/**
 * 取得升級到某等級新解鎖的功能描述（給 UI 顯示用）
 */
export function getNewPermissionDescriptions(level: number): string[] {
  return getNewPermissionsAtLevel(level).map(perm => PERMISSION_MATRIX[perm].description)
}

/**
 * 根據積分取得用戶等級並檢查權限（便利函式）
 */
export function canUserDo(permission: Permission, userPoints: number): PermissionCheckResult {
  const level = getLevel(userPoints)
  return checkPermission(permission, level.level)
}

/**
 * 編輯自己評論的時限（依等級）
 * 回傳可編輯的天數，null = 不限
 */
export function getEditWindowDays(userLevel: number): number | null {
  switch (userLevel) {
    case 1: return 1    // 24 小時
    case 2: return 7    // 7 天
    case 3: return 30   // 30 天
    default: return null // 不限
  }
}
