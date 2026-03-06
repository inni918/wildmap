/**
 * 積分系統配置
 * 定義每個行為對應的積分、每日上限、冷卻條件
 */

// ============================================
// 積分行為類型
// ============================================

export type PointAction =
  // 內容貢獻
  | 'review_short'       // 評論 ≤100 字
  | 'review_medium'      // 評論 100-300 字
  | 'review_long'        // 評論 ≥300 字
  | 'rating'             // 評分
  | 'upload_photo'       // 上傳照片
  | 'upload_video'       // 上傳影片
  | 'upload_gpx'         // 上傳 GPX 軌跡
  | 'answer_question'    // 回答問題
  | 'best_answer'        // 回答被標記為最佳
  // 地標管理
  | 'add_spot'           // 新增地點
  | 'add_trail'          // 新增路線
  | 'edit_spot'          // 編輯地點資訊
  | 'fact_check'         // 事實查核
  | 'report_error'       // 回報錯誤
  | 'spot_commented'     // 你的地點被評論（被動）
  // 社區互動
  | 'vote_helpful'       // 投有用票
  | 'received_helpful'   // 評論被投有用票
  | 'photo_helpful'      // 照片被標記有用
  | 'daily_checkin'      // 每日簽到
  | 'weekly_streak'      // 連續簽到 7 天
  | 'start_discussion'   // 發起討論
  | 'reply_discussion'   // 回覆討論
  // 里程碑（一次性）
  | 'milestone_profile'  // 完成個人資料
  | 'milestone_first_review'
  | 'milestone_first_photo'
  | 'milestone_review_10'
  | 'milestone_review_50'
  | 'milestone_review_100'
  | 'milestone_spot_view_100'
  | 'milestone_spot_view_1000'
  | 'milestone_landmark_admin'

// ============================================
// 積分配置定義
// ============================================

export interface PointConfig {
  action: PointAction
  points: number
  /** 每日最多獲得此行為的次數（null = 無限制） */
  dailyLimit: number | null
  /** 同一目標（如同一地點）的每日上限（null = 無限制） */
  perTargetDailyLimit: number | null
  /** 是否為一次性里程碑 */
  milestone: boolean
  /** 行為分類（用於顯示） */
  category: 'content' | 'landmark' | 'community' | 'milestone'
  /** 行為描述 */
  description: string
}

// ============================================
// 完整積分表
// ============================================

export const POINT_CONFIGS: Record<PointAction, PointConfig> = {
  // === 內容貢獻 ===
  review_short: {
    action: 'review_short',
    points: 5,
    dailyLimit: 10,
    perTargetDailyLimit: 1,
    milestone: false,
    category: 'content',
    description: '撰寫評論（≤100 字）',
  },
  review_medium: {
    action: 'review_medium',
    points: 10,
    dailyLimit: 10,
    perTargetDailyLimit: 1,
    milestone: false,
    category: 'content',
    description: '撰寫評論（100-300 字）',
  },
  review_long: {
    action: 'review_long',
    points: 15,
    dailyLimit: 10,
    perTargetDailyLimit: 1,
    milestone: false,
    category: 'content',
    description: '撰寫評論（≥300 字）',
  },
  rating: {
    action: 'rating',
    points: 1,
    dailyLimit: 20,
    perTargetDailyLimit: 1,
    milestone: false,
    category: 'content',
    description: '為地點評分',
  },
  upload_photo: {
    action: 'upload_photo',
    points: 3,
    dailyLimit: 20,
    perTargetDailyLimit: 10,
    milestone: false,
    category: 'content',
    description: '上傳照片',
  },
  upload_video: {
    action: 'upload_video',
    points: 5,
    dailyLimit: 5,
    perTargetDailyLimit: 2,
    milestone: false,
    category: 'content',
    description: '上傳影片',
  },
  upload_gpx: {
    action: 'upload_gpx',
    points: 10,
    dailyLimit: 3,
    perTargetDailyLimit: 1,
    milestone: false,
    category: 'content',
    description: '上傳 GPX 軌跡',
  },
  answer_question: {
    action: 'answer_question',
    points: 3,
    dailyLimit: 10,
    perTargetDailyLimit: null,
    milestone: false,
    category: 'content',
    description: '回答問題',
  },
  best_answer: {
    action: 'best_answer',
    points: 10,
    dailyLimit: null,
    perTargetDailyLimit: null,
    milestone: false,
    category: 'content',
    description: '回答被標記為最佳解答',
  },

  // === 地標管理 ===
  add_spot: {
    action: 'add_spot',
    points: 15,
    dailyLimit: 5,
    perTargetDailyLimit: null,
    milestone: false,
    category: 'landmark',
    description: '新增地點',
  },
  add_trail: {
    action: 'add_trail',
    points: 20,
    dailyLimit: 3,
    perTargetDailyLimit: null,
    milestone: false,
    category: 'landmark',
    description: '新增路線',
  },
  edit_spot: {
    action: 'edit_spot',
    points: 3,
    dailyLimit: 10,
    perTargetDailyLimit: 1,
    milestone: false,
    category: 'landmark',
    description: '編輯地點資訊',
  },
  fact_check: {
    action: 'fact_check',
    points: 1,
    dailyLimit: 20,
    perTargetDailyLimit: 1,
    milestone: false,
    category: 'landmark',
    description: '事實查核',
  },
  report_error: {
    action: 'report_error',
    points: 2,
    dailyLimit: 10,
    perTargetDailyLimit: 1,
    milestone: false,
    category: 'landmark',
    description: '回報錯誤資訊',
  },
  spot_commented: {
    action: 'spot_commented',
    points: 1,
    dailyLimit: null,
    perTargetDailyLimit: null,
    milestone: false,
    category: 'landmark',
    description: '你新增的地點被評論',
  },

  // === 社區互動 ===
  vote_helpful: {
    action: 'vote_helpful',
    points: 0.5,
    dailyLimit: 20,
    perTargetDailyLimit: 1,
    milestone: false,
    category: 'community',
    description: '對他人評論投有用票',
  },
  received_helpful: {
    action: 'received_helpful',
    points: 1,
    dailyLimit: null,
    perTargetDailyLimit: null,
    milestone: false,
    category: 'community',
    description: '你的評論被投有用票',
  },
  photo_helpful: {
    action: 'photo_helpful',
    points: 1,
    dailyLimit: null,
    perTargetDailyLimit: null,
    milestone: false,
    category: 'community',
    description: '你的照片被標記有用',
  },
  daily_checkin: {
    action: 'daily_checkin',
    points: 1,
    dailyLimit: 1,
    perTargetDailyLimit: null,
    milestone: false,
    category: 'community',
    description: '每日簽到',
  },
  weekly_streak: {
    action: 'weekly_streak',
    points: 5,
    dailyLimit: 1,
    perTargetDailyLimit: null,
    milestone: false,
    category: 'community',
    description: '連續簽到 7 天獎勵',
  },
  start_discussion: {
    action: 'start_discussion',
    points: 3,
    dailyLimit: 3,
    perTargetDailyLimit: null,
    milestone: false,
    category: 'community',
    description: '發起討論話題',
  },
  reply_discussion: {
    action: 'reply_discussion',
    points: 1,
    dailyLimit: 10,
    perTargetDailyLimit: null,
    milestone: false,
    category: 'community',
    description: '回覆討論',
  },

  // === 里程碑（一次性） ===
  milestone_profile: {
    action: 'milestone_profile',
    points: 10,
    dailyLimit: null,
    perTargetDailyLimit: null,
    milestone: true,
    category: 'milestone',
    description: '完成個人資料（含頭像、自介）',
  },
  milestone_first_review: {
    action: 'milestone_first_review',
    points: 5,
    dailyLimit: null,
    perTargetDailyLimit: null,
    milestone: true,
    category: 'milestone',
    description: '首篇評論',
  },
  milestone_first_photo: {
    action: 'milestone_first_photo',
    points: 5,
    dailyLimit: null,
    perTargetDailyLimit: null,
    milestone: true,
    category: 'milestone',
    description: '首次上傳照片',
  },
  milestone_review_10: {
    action: 'milestone_review_10',
    points: 10,
    dailyLimit: null,
    perTargetDailyLimit: null,
    milestone: true,
    category: 'milestone',
    description: '第 10 篇評論',
  },
  milestone_review_50: {
    action: 'milestone_review_50',
    points: 25,
    dailyLimit: null,
    perTargetDailyLimit: null,
    milestone: true,
    category: 'milestone',
    description: '第 50 篇評論',
  },
  milestone_review_100: {
    action: 'milestone_review_100',
    points: 50,
    dailyLimit: null,
    perTargetDailyLimit: null,
    milestone: true,
    category: 'milestone',
    description: '第 100 篇評論',
  },
  milestone_spot_view_100: {
    action: 'milestone_spot_view_100',
    points: 10,
    dailyLimit: null,
    perTargetDailyLimit: null,
    milestone: true,
    category: 'milestone',
    description: '新增的地點累計被 100 人瀏覽',
  },
  milestone_spot_view_1000: {
    action: 'milestone_spot_view_1000',
    points: 30,
    dailyLimit: null,
    perTargetDailyLimit: null,
    milestone: true,
    category: 'milestone',
    description: '新增的地點累計被 1,000 人瀏覽',
  },
  milestone_landmark_admin: {
    action: 'milestone_landmark_admin',
    points: 50,
    dailyLimit: null,
    perTargetDailyLimit: null,
    milestone: true,
    category: 'milestone',
    description: '成為地標管理員',
  },
} as const

// ============================================
// 每日積分上限
// ============================================

/** 每日最多可獲得的總積分 */
export const DAILY_POINTS_CAP = 50

// ============================================
// 積分扣除配置
// ============================================

export type DeductionReason =
  | 'review_violation'
  | 'photo_violation'
  | 'spam'
  | 'fake_spot'
  | 'duplicate_content'
  | 'inactivity'

export const DEDUCTION_CONFIGS: Record<DeductionReason, { points: number; description: string }> = {
  review_violation:   { points: -10, description: '評論違規' },
  photo_violation:    { points: -5,  description: '照片違規' },
  spam:              { points: -50, description: '垃圾訊息' },
  fake_spot:         { points: -30, description: '地點資訊造假' },
  duplicate_content: { points: -5,  description: '重複/灌水內容' },
  inactivity:        { points: -2,  description: '30 天未登入衰減' },
}

// ============================================
// 工具函式
// ============================================

/**
 * 根據評論字數決定評論類型
 */
export function getReviewAction(charCount: number): PointAction {
  if (charCount >= 300) return 'review_long'
  if (charCount >= 100) return 'review_medium'
  return 'review_short'
}

/**
 * 取得行為的積分配置
 */
export function getPointConfig(action: PointAction): PointConfig {
  return POINT_CONFIGS[action]
}

/**
 * 取得所有積分配置（依分類分組）
 */
export function getPointConfigsByCategory(): Record<string, PointConfig[]> {
  const grouped: Record<string, PointConfig[]> = {}
  for (const config of Object.values(POINT_CONFIGS)) {
    if (!grouped[config.category]) grouped[config.category] = []
    grouped[config.category].push(config)
  }
  return grouped
}
