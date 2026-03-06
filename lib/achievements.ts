/**
 * 成就系統核心邏輯
 * - checkAchievements(userId): 檢查所有未解鎖成就
 * - 回傳新解鎖的成就列表供 Toast 顯示
 */
import { supabase } from './supabase'
// 等級定義從 levels.ts 引入（共用模組）
export { LEVELS, getLevel, getNextLevel } from './levels'

export type AchievementCategory = 'exploration' | 'contribution' | 'community' | 'special'
export type AchievementTier = 'bronze' | 'silver' | 'gold'

export interface Achievement {
  id: string
  key: string
  name_zh: string
  name_en?: string
  description_zh?: string
  icon: string
  category: AchievementCategory
  points: number
  tier: AchievementTier
  criteria: Record<string, unknown>
  sort_order: number
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  unlocked_at: string
  achievement?: Achievement
}

export interface UnlockedAchievement {
  achievement: Achievement
  unlocked_at: string
}

// 分類顯示名稱
export const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  exploration: '探索',
  contribution: '貢獻',
  community: '社群',
  special: '特殊',
}

export const CATEGORY_ICONS: Record<AchievementCategory, string> = {
  exploration: '🗺️',
  contribution: '📝',
  community: '🤝',
  special: '🎪',
}

/**
 * 取得所有成就定義
 */
export async function getAllAchievements(): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error || !data) return []
  return data as Achievement[]
}

/**
 * 取得用戶已解鎖的成就
 */
export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*, achievement:achievements(*)')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false })

  if (error || !data) return []
  return data.map((d: Record<string, unknown>) => ({
    id: d.id as string,
    user_id: d.user_id as string,
    achievement_id: d.achievement_id as string,
    unlocked_at: d.unlocked_at as string,
    achievement: d.achievement as Achievement,
  }))
}

/**
 * 計算用戶總成就點數
 */
export async function getUserAchievementPoints(userId: string): Promise<number> {
  const achievements = await getUserAchievements(userId)
  return achievements.reduce((sum, ua) => sum + (ua.achievement?.points || 0), 0)
}

/**
 * 核心：檢查並解鎖成就
 * 回傳新解鎖的成就列表
 */
export async function checkAchievements(userId: string): Promise<UnlockedAchievement[]> {
  if (!userId) return []

  // 1. 取得所有成就定義
  const allAchievements = await getAllAchievements()

  // 2. 取得已解鎖的成就 keys
  const { data: userAchievements } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', userId)

  const unlockedIds = new Set((userAchievements || []).map((ua: { achievement_id: string }) => ua.achievement_id))

  // 3. 過濾未解鎖的成就
  const locked = allAchievements.filter(a => !unlockedIds.has(a.id))
  if (locked.length === 0) return []

  // 4. 取得用戶統計資料（批次查詢）
  const stats = await getUserStats(userId)

  // 5. 逐一檢查每個未解鎖成就
  const newlyUnlocked: UnlockedAchievement[] = []

  for (const achievement of locked) {
    const criteria = achievement.criteria as Record<string, unknown>
    if (!criteria || !criteria.type) continue

    // 預留功能跳過
    if (criteria.reserved) continue

    const met = await checkCriteria(criteria, stats, userId)
    if (met) {
      // 解鎖！
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: achievement.id,
        })

      if (!error) {
        newlyUnlocked.push({
          achievement,
          unlocked_at: new Date().toISOString(),
        })
      }
    }
  }

  return newlyUnlocked
}

// === 用戶統計資料 ===

interface UserStats {
  viewedSpots: number
  addedSpots: number
  photos: number
  comments: number
  replies: number
  votes: number
  edits: number
  ratings: number
  favorites: number
  reports: number
  fiveStarRatings: number
  oneStarRatings: number
  currentHour: number
}

async function getUserStats(userId: string): Promise<UserStats> {
  // 批次查詢各項統計
  const [
    spotsResult,
    photosResult,
    commentsResult,
    repliesResult,
    votesResult,
    editsResult,
    ratingsResult,
    favoritesResult,
    reportsResult,
    fiveStarResult,
    oneStarResult,
  ] = await Promise.all([
    // 用戶新增的地點數
    supabase.from('spots').select('id', { count: 'exact', head: true }).eq('created_by', userId),
    // 照片數
    supabase.from('spot_images').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    // 評論數（頂層）
    supabase.from('comments').select('id', { count: 'exact', head: true }).eq('user_id', userId).is('parent_id', null),
    // 回覆數
    supabase.from('comments').select('id', { count: 'exact', head: true }).eq('user_id', userId).not('parent_id', 'is', null),
    // 投票數
    supabase.from('feature_votes').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    // 編輯數
    supabase.from('spot_edits').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    // 評分數
    supabase.from('ratings').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    // 收藏數
    supabase.from('favorites').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    // 回報數
    supabase.from('reports').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    // 5 星評分
    supabase.from('ratings').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('score', 5),
    // 1 星評分
    supabase.from('ratings').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('score', 1),
  ])

  const now = new Date()
  // 用台灣時間
  const taiwanHour = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Taipei' })).getHours()

  return {
    viewedSpots: 0, // 需要由呼叫端傳入或從 view_count 追蹤
    addedSpots: spotsResult.count || 0,
    photos: photosResult.count || 0,
    comments: commentsResult.count || 0,
    replies: repliesResult.count || 0,
    votes: votesResult.count || 0,
    edits: editsResult.count || 0,
    ratings: ratingsResult.count || 0,
    favorites: favoritesResult.count || 0,
    reports: reportsResult.count || 0,
    fiveStarRatings: fiveStarResult.count || 0,
    oneStarRatings: oneStarResult.count || 0,
    currentHour: taiwanHour,
  }
}

// === 條件檢查 ===

async function checkCriteria(
  criteria: Record<string, unknown>,
  stats: UserStats,
  userId: string
): Promise<boolean> {
  const type = criteria.type as string
  const threshold = (criteria.threshold as number) || 1

  switch (type) {
    // === 探索類 ===
    case 'view_spots':
      // 使用 check_ins 表或 view tracking（簡化版：用所有互動地點數）
      return await getViewedSpotCount(userId) >= threshold

    case 'view_region':
      return await getRegionViewCount(userId, criteria.region as string) >= threshold

    case 'view_all_counties':
      return await getViewedCountiesCount(userId) >= threshold

    case 'view_category':
      return await getCategoryViewCount(userId, criteria.category as string) >= threshold

    case 'view_elevation':
      return await getElevationViewCount(userId, criteria.min_elevation as number) >= threshold

    case 'view_feature':
      // 預留：查看有特定 feature 的地點
      return false

    // === 貢獻類 ===
    case 'add_spots':
      return stats.addedSpots >= threshold

    case 'upload_photos':
      return stats.photos >= threshold

    case 'comments':
      return stats.comments >= threshold

    case 'votes':
      return stats.votes >= threshold

    case 'edits':
      return stats.edits >= threshold

    case 'ratings':
      return stats.ratings >= threshold

    case 'rating_score': {
      const score = criteria.score as number
      if (score === 5) return stats.fiveStarRatings >= threshold
      if (score === 1) return stats.oneStarRatings >= threshold
      return false
    }

    // === 社群類 ===
    case 'replies':
      return stats.replies >= threshold

    case 'favorites':
      return stats.favorites >= threshold

    case 'spot_favorited':
      return await getSpotFavoritedCount(userId) >= threshold

    case 'reports':
      return stats.reports >= threshold

    // === 特殊類 ===
    case 'early_user':
      return await isEarlyUser(userId, threshold)

    case 'time_range': {
      const startHour = criteria.start_hour as number
      const endHour = criteria.end_hour as number
      return stats.currentHour >= startHour && stats.currentHour < endHour
    }

    case 'consecutive_weekends':
      // 需要 activity_log 追蹤，暫時 false
      return false

    case 'consecutive_days': {
      const days = await getConsecutiveDays(userId)
      return days >= threshold
    }

    case 'all_seasons':
      return await hasAllSeasons(userId)

    // === 新增成就類型 ===

    case 'meta_achievement': {
      // Meta 成就：檢查所有子成就是否已解鎖
      const requiredKeys = criteria.required_keys as string[]
      if (!requiredKeys || requiredKeys.length === 0) return false
      return await checkMetaAchievement(userId, requiredKeys)
    }

    case 'altitude_variety': {
      // 海拔收集者：各海拔帶至少一個
      const bands = criteria.bands as number[]
      if (!bands) return false
      return await checkAltitudeVariety(userId, bands)
    }

    case 'detailed_comments': {
      // 詳細評論家：長評論數量
      const minLength = (criteria.min_length as number) || 200
      return await getDetailedCommentCount(userId, minLength) >= threshold
    }

    case 'local_contributions': {
      // 在地達人：同一縣市貢獻數
      return await getMaxCountyContributions(userId) >= threshold
    }

    case 'time_category_checkin': {
      // 日出露營家等：特定時段 + 類別
      const startH = criteria.start_hour as number
      const endH = criteria.end_hour as number
      const cat = criteria.category as string
      // 簡化版：用 currentHour + 最近互動行為判斷
      if (stats.currentHour >= startH && stats.currentHour < endH) {
        return await getCategoryViewCount(userId, cat) >= 1
      }
      return false
    }

    case 'night_altitude_checkin': {
      // 觀星者：夜間 + 高海拔
      const minElev = criteria.min_elevation as number
      const sH = criteria.start_hour as number
      const eH = criteria.end_hour as number
      const isNight = stats.currentHour >= sH || stats.currentHour < eH
      if (isNight) {
        return await getElevationViewCount(userId, minElev) >= 1
      }
      return false
    }

    case 'vote_accuracy':
    case 'comment_helpful':
    case 'mentor_replies':
    case 'spot_views':
    case 'weather_checkin':
    case 'date_range_checkin':
    case 'group_checkins':
      // 預留功能（reserved: true 已在上層過濾，這裡雙重保護）
      return false

    default:
      return false
  }
}

// === 輔助查詢函式 ===

/**
 * 用互動紀錄計算「查看過」的地點數
 * 計算方式：用戶有互動（評分 / 留言 / 投票 / 收藏）的不同 spot 數
 */
async function getViewedSpotCount(userId: string): Promise<number> {
  const spotIds = new Set<string>()

  const [ratings, comments, votes, favorites] = await Promise.all([
    supabase.from('ratings').select('spot_id').eq('user_id', userId),
    supabase.from('comments').select('spot_id').eq('user_id', userId),
    supabase.from('feature_votes').select('spot_id').eq('user_id', userId),
    supabase.from('favorites').select('spot_id').eq('user_id', userId),
  ])

  for (const r of ratings.data || []) spotIds.add(r.spot_id)
  for (const c of comments.data || []) spotIds.add(c.spot_id)
  for (const v of votes.data || []) spotIds.add(v.spot_id)
  for (const f of favorites.data || []) spotIds.add(f.spot_id)

  return spotIds.size
}

// 台灣地區定義（依縣市）
const REGION_COUNTIES: Record<string, string[]> = {
  north: ['台北市', '臺北市', '新北市', '基隆市', '桃園市', '新竹市', '新竹縣', '宜蘭縣'],
  central: ['苗栗縣', '台中市', '臺中市', '彰化縣', '南投縣', '雲林縣'],
  south: ['嘉義市', '嘉義縣', '台南市', '臺南市', '高雄市', '屏東縣'],
  east: ['花蓮縣', '台東縣', '臺東縣'],
  island: ['澎湖縣', '金門縣', '連江縣', '蘭嶼', '綠島', '小琉球'],
  mountain: [], // 高山用 elevation 判斷
}

async function getRegionViewCount(userId: string, region: string): Promise<number> {
  if (region === 'mountain') {
    // 高山：elevation >= 1000m 的地點
    return await getElevationViewCount(userId, 1000)
  }

  const counties = REGION_COUNTIES[region]
  if (!counties || counties.length === 0) return 0

  // 取得用戶互動的 spot_ids
  const spotIds = await getInteractedSpotIds(userId)
  if (spotIds.length === 0) return 0

  // 查看這些 spot 有多少在指定區域
  let count = 0
  // 分批查（Supabase in 限制）
  const batchSize = 50
  for (let i = 0; i < spotIds.length; i += batchSize) {
    const batch = spotIds.slice(i, i + batchSize)
    const { data } = await supabase
      .from('spots')
      .select('id, address')
      .in('id', batch)

    if (data) {
      for (const spot of data) {
        if (spot.address && counties.some(c => spot.address.includes(c))) {
          count++
        }
      }
    }
  }

  return count
}

async function getViewedCountiesCount(userId: string): Promise<number> {
  const spotIds = await getInteractedSpotIds(userId)
  if (spotIds.length === 0) return 0

  const counties = new Set<string>()
  const allCounties = [
    '台北市', '臺北市', '新北市', '基隆市', '桃園市', '新竹市', '新竹縣',
    '宜蘭縣', '苗栗縣', '台中市', '臺中市', '彰化縣', '南投縣', '雲林縣',
    '嘉義市', '嘉義縣', '台南市', '臺南市', '高雄市', '屏東縣',
    '花蓮縣', '台東縣', '臺東縣', '澎湖縣', '金門縣', '連江縣',
  ]

  const batchSize = 50
  for (let i = 0; i < spotIds.length; i += batchSize) {
    const batch = spotIds.slice(i, i + batchSize)
    const { data } = await supabase
      .from('spots')
      .select('address')
      .in('id', batch)

    if (data) {
      for (const spot of data) {
        if (spot.address) {
          for (const county of allCounties) {
            if (spot.address.includes(county)) {
              // 正規化（台/臺 合併）
              const normalized = county.replace('臺', '台')
              counties.add(normalized)
            }
          }
        }
      }
    }
  }

  return counties.size
}

async function getCategoryViewCount(userId: string, category: string): Promise<number> {
  const spotIds = await getInteractedSpotIds(userId)
  if (spotIds.length === 0) return 0

  let count = 0
  const batchSize = 50
  for (let i = 0; i < spotIds.length; i += batchSize) {
    const batch = spotIds.slice(i, i + batchSize)
    const { count: c } = await supabase
      .from('spots')
      .select('id', { count: 'exact', head: true })
      .in('id', batch)
      .eq('category', category)

    count += c || 0
  }

  return count
}

async function getElevationViewCount(userId: string, minElevation: number): Promise<number> {
  const spotIds = await getInteractedSpotIds(userId)
  if (spotIds.length === 0) return 0

  let count = 0
  const batchSize = 50
  for (let i = 0; i < spotIds.length; i += batchSize) {
    const batch = spotIds.slice(i, i + batchSize)
    const { count: c } = await supabase
      .from('spots')
      .select('id', { count: 'exact', head: true })
      .in('id', batch)
      .gte('elevation', minElevation)

    count += c || 0
  }

  return count
}

async function getSpotFavoritedCount(userId: string): Promise<number> {
  // 用戶新增的地點被多少不同用戶收藏
  const { data: userSpots } = await supabase
    .from('spots')
    .select('id')
    .eq('created_by', userId)

  if (!userSpots || userSpots.length === 0) return 0

  const spotIds = userSpots.map(s => s.id)
  const { count } = await supabase
    .from('favorites')
    .select('id', { count: 'exact', head: true })
    .in('spot_id', spotIds)
    .neq('user_id', userId) // 排除自己

  return count || 0
}

async function isEarlyUser(userId: string, threshold: number): Promise<boolean> {
  const { data } = await supabase
    .from('users')
    .select('created_at')
    .eq('id', userId)
    .single()

  if (!data) return false

  // 比自己早註冊的人數
  const { count } = await supabase
    .from('users')
    .select('id', { count: 'exact', head: true })
    .lt('created_at', data.created_at)

  return (count || 0) < threshold
}

async function getInteractedSpotIds(userId: string): Promise<string[]> {
  const spotIds = new Set<string>()

  const [ratings, comments, votes, favorites] = await Promise.all([
    supabase.from('ratings').select('spot_id').eq('user_id', userId),
    supabase.from('comments').select('spot_id').eq('user_id', userId),
    supabase.from('feature_votes').select('spot_id').eq('user_id', userId),
    supabase.from('favorites').select('spot_id').eq('user_id', userId),
  ])

  for (const r of ratings.data || []) spotIds.add(r.spot_id)
  for (const c of comments.data || []) spotIds.add(c.spot_id)
  for (const v of votes.data || []) spotIds.add(v.spot_id)
  for (const f of favorites.data || []) spotIds.add(f.spot_id)

  return Array.from(spotIds)
}
