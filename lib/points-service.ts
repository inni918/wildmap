/**
 * 積分發放服務
 * 統一入口：earnPoints() 會自動處理防刷檢查、每日上限、等級升級
 */

import { supabase } from './supabase'
import { POINT_CONFIGS, type PointAction } from './points'
import { preflightPointsCheck, addDailyPoints, isLowQualityReview } from './anti-abuse'
import { checkLevelUp, type LevelDefinition } from './levels'

// ============================================
// 積分發放結果
// ============================================

export interface EarnPointsResult {
  success: boolean
  /** 實際獲得的積分 */
  pointsEarned: number
  /** 用戶新的總積分 */
  newTotal: number
  /** 是否升級（回傳新等級，無升級為 null） */
  levelUp: LevelDefinition | null
  /** 失敗/限制原因 */
  reason?: string
}

// ============================================
// 核心：發放積分
// ============================================

/**
 * 給用戶積分（統一入口）
 *
 * @param userId - 用戶 ID
 * @param action - 行為類型（對應 points.ts 的 PointAction）
 * @param targetId - 相關目標 ID（如 spot_id, comment_id）
 * @param metadata - 額外資訊
 */
export async function earnPoints(
  userId: string,
  action: PointAction,
  targetId?: string,
  metadata?: Record<string, unknown>,
): Promise<EarnPointsResult> {
  const config = POINT_CONFIGS[action]
  if (!config) {
    return { success: false, pointsEarned: 0, newTotal: 0, levelUp: null, reason: '未知行為' }
  }

  // 1. 防刷預檢
  const check = await preflightPointsCheck(userId, action, targetId)
  if (!check.allowed) {
    return { success: false, pointsEarned: 0, newTotal: 0, levelUp: null, reason: check.reason }
  }

  // 2. 讀取用戶現有積分
  const { data: user } = await supabase
    .from('users')
    .select('points')
    .eq('id', userId)
    .single()

  if (!user) {
    return { success: false, pointsEarned: 0, newTotal: 0, levelUp: null, reason: '用戶不存在' }
  }

  const oldPoints = user.points || 0

  // 3. 加入每日上限的積分
  const { actualPoints, newDailyTotal: _ } = await addDailyPoints(userId, config.points)

  if (actualPoints <= 0) {
    return {
      success: false,
      pointsEarned: 0,
      newTotal: oldPoints,
      levelUp: null,
      reason: '今日積分已達上限',
    }
  }

  // 4. 記錄交易
  await supabase.from('point_transactions').insert({
    user_id: userId,
    action,
    points: actualPoints,
    target_id: targetId || null,
    metadata: metadata || {},
  })

  // 5. 檢查是否升級
  const newTotal = oldPoints + actualPoints
  const levelUp = checkLevelUp(oldPoints, newTotal)

  return {
    success: true,
    pointsEarned: actualPoints,
    newTotal,
    levelUp,
  }
}

/**
 * 評論專用的積分發放
 * 自動根據字數決定行為類型 + 低品質檢查
 */
export async function earnReviewPoints(
  userId: string,
  spotId: string,
  content: string,
): Promise<EarnPointsResult> {
  // 低品質檢查
  if (isLowQualityReview(content)) {
    return {
      success: false,
      pointsEarned: 0,
      newTotal: 0,
      levelUp: null,
      reason: '評論太短，至少需要 10 個字',
    }
  }

  // 根據字數決定行為
  const charCount = content.trim().length
  let action: PointAction
  if (charCount >= 300) action = 'review_long'
  else if (charCount >= 100) action = 'review_medium'
  else action = 'review_short'

  return earnPoints(userId, action, spotId, { charCount })
}

/**
 * 取得用戶的積分歷史記錄
 */
export async function getPointHistory(
  userId: string,
  limit = 20,
  offset = 0,
): Promise<{ action: string; points: number; target_id: string | null; created_at: string }[]> {
  const { data } = await supabase
    .from('point_transactions')
    .select('action, points, target_id, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  return data || []
}
