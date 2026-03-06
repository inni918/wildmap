/**
 * 防刷分機制（基礎版）
 * Layer 1: 行為限制
 * Layer 2: 規則引擎
 */

import { supabase } from './supabase'
import { DAILY_POINTS_CAP, type PointAction, POINT_CONFIGS } from './points'

// ============================================
// 類型定義
// ============================================

export interface AbuseCheckResult {
  allowed: boolean
  reason?: string
  /** 今日已獲得積分 */
  dailyPointsEarned: number
  /** 今日剩餘可獲得積分 */
  dailyPointsRemaining: number
}

export interface RateLimitResult {
  allowed: boolean
  reason?: string
  /** 需要等待的秒數 */
  waitSeconds?: number
}

// ============================================
// 每日積分上限檢查
// ============================================

/**
 * 檢查用戶今日是否還能獲得積分
 * 使用 users 表的 daily_points + daily_points_date 欄位
 */
export async function checkDailyPointsCap(
  userId: string,
): Promise<AbuseCheckResult> {
  const { data: user } = await supabase
    .from('users')
    .select('daily_points, daily_points_date')
    .eq('id', userId)
    .single()

  if (!user) {
    return { allowed: false, reason: '用戶不存在', dailyPointsEarned: 0, dailyPointsRemaining: 0 }
  }

  const today = getTaiwanDateStr()
  const dailyPoints = user.daily_points_date === today ? (user.daily_points || 0) : 0

  return {
    allowed: dailyPoints < DAILY_POINTS_CAP,
    reason: dailyPoints >= DAILY_POINTS_CAP ? '今日積分已達上限' : undefined,
    dailyPointsEarned: dailyPoints,
    dailyPointsRemaining: Math.max(0, DAILY_POINTS_CAP - dailyPoints),
  }
}

/**
 * 更新用戶每日積分計數
 * 回傳實際獲得的積分（可能因上限而減少）
 */
export async function addDailyPoints(
  userId: string,
  points: number,
): Promise<{ actualPoints: number; newDailyTotal: number }> {
  const today = getTaiwanDateStr()

  // 先讀取現有值
  const { data: user } = await supabase
    .from('users')
    .select('daily_points, daily_points_date, points')
    .eq('id', userId)
    .single()

  if (!user) return { actualPoints: 0, newDailyTotal: 0 }

  // 如果是新的一天，重置
  const currentDailyPoints = user.daily_points_date === today ? (user.daily_points || 0) : 0

  // 計算實際可獲得的積分
  const actualPoints = Math.min(points, Math.max(0, DAILY_POINTS_CAP - currentDailyPoints))
  if (actualPoints <= 0) return { actualPoints: 0, newDailyTotal: currentDailyPoints }

  const newDailyTotal = currentDailyPoints + actualPoints
  const newTotalPoints = (user.points || 0) + actualPoints

  // 更新 users 表
  await supabase
    .from('users')
    .update({
      daily_points: newDailyTotal,
      daily_points_date: today,
      points: newTotalPoints,
    })
    .eq('id', userId)

  return { actualPoints, newDailyTotal }
}

// ============================================
// 同一地點重複操作檢查
// ============================================

/**
 * 檢查同一地點今日是否已達此行為的上限
 */
export async function checkPerTargetLimit(
  userId: string,
  action: PointAction,
  targetId: string,
): Promise<{ allowed: boolean; reason?: string }> {
  const config = POINT_CONFIGS[action]
  if (!config.perTargetDailyLimit) return { allowed: true }

  const today = getTaiwanDateStr()
  const { count } = await supabase
    .from('point_transactions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('action', action)
    .eq('target_id', targetId)
    .gte('created_at', `${today}T00:00:00+08:00`)

  const currentCount = count || 0
  if (currentCount >= config.perTargetDailyLimit) {
    return {
      allowed: false,
      reason: `同一地點今日已達「${config.description}」上限`,
    }
  }

  return { allowed: true }
}

/**
 * 檢查此行為今日是否已達每日上限
 */
export async function checkActionDailyLimit(
  userId: string,
  action: PointAction,
): Promise<{ allowed: boolean; reason?: string }> {
  const config = POINT_CONFIGS[action]
  if (!config.dailyLimit) return { allowed: true }

  const today = getTaiwanDateStr()
  const { count } = await supabase
    .from('point_transactions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('action', action)
    .gte('created_at', `${today}T00:00:00+08:00`)

  const currentCount = count || 0
  if (currentCount >= config.dailyLimit) {
    return {
      allowed: false,
      reason: `今日「${config.description}」已達上限（${config.dailyLimit} 次）`,
    }
  }

  return { allowed: true }
}

// ============================================
// 高頻行為偵測（Layer 2）
// ============================================

/** 短時間大量操作的限速規則 */
const RATE_LIMITS = {
  /** 10 分鐘內最多幾次評論 */
  comments_per_10min: 5,
  /** 5 分鐘內最多幾次評分 */
  ratings_per_5min: 10,
  /** 5 分鐘內最多幾次投票 */
  votes_per_5min: 15,
  /** 10 分鐘內最多上傳幾張照片 */
  photos_per_10min: 15,
} as const

/**
 * 檢查短時間內的操作頻率
 */
export async function checkRateLimit(
  userId: string,
  actionType: 'comment' | 'rating' | 'vote' | 'photo',
): Promise<RateLimitResult> {
  const now = new Date()
  let windowMinutes: number
  let maxActions: number
  let tableName: string
  let userField = 'user_id'

  switch (actionType) {
    case 'comment':
      windowMinutes = 10
      maxActions = RATE_LIMITS.comments_per_10min
      tableName = 'comments'
      break
    case 'rating':
      windowMinutes = 5
      maxActions = RATE_LIMITS.ratings_per_5min
      tableName = 'ratings'
      break
    case 'vote':
      windowMinutes = 5
      maxActions = RATE_LIMITS.votes_per_5min
      tableName = 'feature_votes'
      break
    case 'photo':
      windowMinutes = 10
      maxActions = RATE_LIMITS.photos_per_10min
      tableName = 'spot_images'
      userField = 'user_id'
      break
    default:
      return { allowed: true }
  }

  const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000).toISOString()

  const { count } = await supabase
    .from(tableName)
    .select('id', { count: 'exact', head: true })
    .eq(userField, userId)
    .gte('created_at', windowStart)

  const currentCount = count || 0
  if (currentCount >= maxActions) {
    return {
      allowed: false,
      reason: `操作太頻繁，請稍後再試`,
      waitSeconds: windowMinutes * 60,
    }
  }

  return { allowed: true }
}

// ============================================
// 低品質偵測
// ============================================

/**
 * 檢查是否為低品質評論
 * 規則：評論至少 10 字才計分
 */
export function isLowQualityReview(content: string): boolean {
  const trimmed = content.trim()
  return trimmed.length < 10
}

/**
 * 檢查連續低品質評論
 * 連續 3 篇 <20 字的評論標記為待審核
 */
export async function checkConsecutiveLowQuality(
  userId: string,
): Promise<{ flagged: boolean }> {
  const { data } = await supabase
    .from('comments')
    .select('content')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(3)

  if (!data || data.length < 3) return { flagged: false }

  const allShort = data.every(
    (c: { content: string }) => c.content.trim().length < 20,
  )
  return { flagged: allShort }
}

// ============================================
// 里程碑重複檢查
// ============================================

/**
 * 檢查里程碑是否已經獲得
 */
export async function checkMilestoneEarned(
  userId: string,
  action: PointAction,
): Promise<boolean> {
  const { count } = await supabase
    .from('point_transactions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('action', action)

  return (count || 0) > 0
}

// ============================================
// 綜合預檢
// ============================================

/**
 * 在給積分前執行所有防刷檢查
 */
export async function preflightPointsCheck(
  userId: string,
  action: PointAction,
  targetId?: string,
): Promise<AbuseCheckResult> {
  // 1. 每日總積分上限
  const dailyCheck = await checkDailyPointsCap(userId)
  if (!dailyCheck.allowed) return dailyCheck

  // 2. 里程碑重複檢查
  const config = POINT_CONFIGS[action]
  if (config.milestone) {
    const already = await checkMilestoneEarned(userId, action)
    if (already) {
      return {
        allowed: false,
        reason: '此里程碑已獲得',
        dailyPointsEarned: dailyCheck.dailyPointsEarned,
        dailyPointsRemaining: dailyCheck.dailyPointsRemaining,
      }
    }
  }

  // 3. 每日行為次數上限
  const actionCheck = await checkActionDailyLimit(userId, action)
  if (!actionCheck.allowed) {
    return {
      allowed: false,
      reason: actionCheck.reason,
      dailyPointsEarned: dailyCheck.dailyPointsEarned,
      dailyPointsRemaining: dailyCheck.dailyPointsRemaining,
    }
  }

  // 4. 同一目標重複操作
  if (targetId) {
    const targetCheck = await checkPerTargetLimit(userId, action, targetId)
    if (!targetCheck.allowed) {
      return {
        allowed: false,
        reason: targetCheck.reason,
        dailyPointsEarned: dailyCheck.dailyPointsEarned,
        dailyPointsRemaining: dailyCheck.dailyPointsRemaining,
      }
    }
  }

  return dailyCheck
}

// ============================================
// 工具函式
// ============================================

/**
 * 取得台灣時區的日期字串 (YYYY-MM-DD)
 */
function getTaiwanDateStr(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Taipei' })
}
