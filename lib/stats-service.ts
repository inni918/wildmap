/**
 * 成就系統 v2 — 計數器服務
 * 
 * 所有計數器都是「只增不減」的累計值。
 * 在用戶執行動作後呼叫對應的 increment 函式。
 */
import { supabase } from './supabase'

// ============================================
// user_stats 欄位類型
// ============================================

export type StatField =
  | 'checkins_total'
  | 'comments_total'
  | 'replies_total'
  | 'ratings_total'
  | 'votes_total'
  | 'photos_total'
  | 'spots_total'
  | 'edits_total'
  | 'reports_total'
  | 'shares_total'
  | 'favorites_unique'
  | 'detailed_comments'
  | 'comments_with_photo'

export type CategoryStatField =
  | 'checkins'
  | 'counties'
  | 'subtypes'
  | 'comments'
  | 'photos'
  | 'votes'
  | 'spots_created'

// ============================================
// 通用累加
// ============================================

/**
 * 累加 user_stats 中的某個欄位
 * 如果該用戶沒有 user_stats 記錄，會自動建立
 */
export async function incrementStat(
  userId: string,
  field: StatField,
  amount: number = 1
): Promise<void> {
  // 先嘗試 upsert，確保記錄存在
  const { error: upsertError } = await supabase
    .from('user_stats')
    .upsert(
      { user_id: userId },
      { onConflict: 'user_id', ignoreDuplicates: true }
    )

  if (upsertError) {
    console.error('[stats-service] upsert user_stats failed:', upsertError)
  }

  // 用 select + update 模式（Supabase 沒有原生 increment）
  const { data: current } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single()

  const currentVal = current ? ((current as Record<string, unknown>)[field] as number) || 0 : 0

  const { error } = await supabase
    .from('user_stats')
    .update({ 
      [field]: currentVal + amount,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (error) {
    console.error(`[stats-service] increment ${field} failed:`, error)
  }
}

// ============================================
// 分類累加
// ============================================

/**
 * 累加 user_category_stats 中的某個欄位
 * 如果該用戶+分類沒有記錄，會自動建立
 */
export async function incrementCategoryStat(
  userId: string,
  category: string,
  field: CategoryStatField,
  amount: number = 1
): Promise<void> {
  // 確保記錄存在
  const { error: upsertError } = await supabase
    .from('user_category_stats')
    .upsert(
      { user_id: userId, category },
      { onConflict: 'user_id,category', ignoreDuplicates: true }
    )

  if (upsertError) {
    console.error('[stats-service] upsert user_category_stats failed:', upsertError)
  }

  // 讀取當前值再 +1
  const { data: current } = await supabase
    .from('user_category_stats')
    .select('*')
    .eq('user_id', userId)
    .eq('category', category)
    .single()

  const currentVal = current ? ((current as Record<string, unknown>)[field] as number) || 0 : 0

  const { error } = await supabase
    .from('user_category_stats')
    .update({ [field]: currentVal + amount })
    .eq('user_id', userId)
    .eq('category', category)

  if (error) {
    console.error(`[stats-service] increment category ${field} failed:`, error)
  }
}

// ============================================
// 連續天數更新
// ============================================

/**
 * 更新連續使用天數
 * 比對 last_active_date，決定是否繼續連續或重置
 */
export async function updateStreak(userId: string): Promise<void> {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Taipei' }) // YYYY-MM-DD

  // 確保記錄存在
  await supabase
    .from('user_stats')
    .upsert(
      { user_id: userId },
      { onConflict: 'user_id', ignoreDuplicates: true }
    )

  const { data } = await supabase
    .from('user_stats')
    .select('streak_current, streak_longest, last_active_date')
    .eq('user_id', userId)
    .single()

  if (!data) return

  const lastDate = data.last_active_date
  let newStreak = data.streak_current || 0
  let newLongest = data.streak_longest || 0

  if (lastDate === today) {
    // 今天已更新過，不做任何事
    return
  }

  // 計算昨天日期
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toLocaleDateString('en-CA', { timeZone: 'Asia/Taipei' })

  if (lastDate === yesterdayStr) {
    // 連續天數 +1
    newStreak += 1
  } else {
    // 中斷，重新開始
    newStreak = 1
  }

  if (newStreak > newLongest) {
    newLongest = newStreak
  }

  const { error } = await supabase
    .from('user_stats')
    .update({
      streak_current: newStreak,
      streak_longest: newLongest,
      last_active_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (error) {
    console.error('[stats-service] updateStreak failed:', error)
  }
}

// ============================================
// 個人資料完成度檢查
// ============================================

/**
 * 檢查個人資料是否完成（頭像 + 暱稱 + 簡介 ≥ 10 字）
 * 如果完成，更新 users.profile_completed = true
 * 
 * 注意：目前 users 表沒有 bio 欄位，所以暫時只檢查頭像+暱稱
 * 未來加 bio 欄位後再擴充檢查邏輯
 */
export async function checkProfileComplete(userId: string): Promise<boolean> {
  const { data: user } = await supabase
    .from('users')
    .select('display_name, avatar_url, profile_completed')
    .eq('id', userId)
    .single()

  if (!user) return false

  // 目前條件：有暱稱 + 有頭像
  // TODO: 加入 bio ≥ 10 字的檢查
  const isComplete = !!(
    user.display_name && user.display_name.trim().length > 0 &&
    user.avatar_url && user.avatar_url.trim().length > 0
  )

  // 如果狀態改變，更新 DB
  if (isComplete !== user.profile_completed) {
    await supabase
      .from('users')
      .update({ profile_completed: isComplete })
      .eq('id', userId)
  }

  return isComplete
}

// ============================================
// 權限快取重算
// ============================================

/**
 * 根據用戶已解鎖的成就，重新計算權限快取
 * 寫入 users.permissions_cache
 */
export async function recalcPermissions(userId: string): Promise<void> {
  // 1. 取得用戶所有已解鎖成就的 unlock_permissions
  const { data: achievements } = await supabase
    .from('user_achievements')
    .select('achievement:achievements(key, unlock_permissions)')
    .eq('user_id', userId)

  if (!achievements) return

  // 2. 合併所有權限
  const permissions: Record<string, boolean> = {}

  for (const ua of achievements) {
    const ach = ua.achievement as unknown as { key: string; unlock_permissions: Record<string, boolean> | null }
    if (ach?.unlock_permissions) {
      for (const [perm, value] of Object.entries(ach.unlock_permissions)) {
        if (value) {
          permissions[perm] = true
        }
      }
    }
  }

  // 3. 檢查 profile_completed（很多基礎權限需要）
  const isProfileComplete = await checkProfileComplete(userId)
  if (isProfileComplete) {
    permissions['profile_complete'] = true
  }

  // 4. 檢查帳號年齡
  const { data: user } = await supabase
    .from('users')
    .select('created_at')
    .eq('id', userId)
    .single()

  if (user) {
    const ageDays = Math.floor(
      (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (ageDays >= 7) permissions['account_age_7d'] = true
    if (ageDays >= 30) permissions['account_age_30d'] = true
    if (ageDays >= 90) permissions['account_age_90d'] = true
  }

  // 5. 寫入快取
  const { error } = await supabase
    .from('users')
    .update({ permissions_cache: permissions })
    .eq('id', userId)

  if (error) {
    console.error('[stats-service] recalcPermissions failed:', error)
  }
}
