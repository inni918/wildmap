/**
 * 成就系統核心邏輯
 * - checkAchievements(userId): 檢查所有未解鎖成就
 * - 回傳新解鎖的成就列表供 Toast 顯示
 */
import { supabase } from './supabase'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase'
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

/** @deprecated 使用 CATEGORY_SVG_ICONS from '@/lib/achievement-icons' */
export const CATEGORY_ICONS: Record<AchievementCategory, string> = {
  exploration: '🗺️',
  contribution: '📝',
  community: '🤝',
  special: '🎪',
}

// === native fetch headers（繞開 auth lock）===
const readHeaders = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Accept': 'application/json',
}

const countHeaders = {
  ...readHeaders,
  'Prefer': 'count=exact',
}

// 解析 content-range header 取得 count，格式：0-N/COUNT 或 * /COUNT
function parseCount(res: Response): number {
  const cr = res.headers.get('content-range')
  if (!cr) return 0
  const parts = cr.split('/')
  if (parts.length < 2) return 0
  const n = parseInt(parts[1], 10)
  return isNaN(n) ? 0 : n
}

/**
 * 取得所有成就定義
 */
export async function getAllAchievements(): Promise<Achievement[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/achievements?select=*&order=sort_order.asc`,
    { headers: readHeaders }
  )
  if (!res.ok) return []
  const data = await res.json()
  return Array.isArray(data) ? (data as Achievement[]) : []
}

/**
 * 取得用戶已解鎖的成就
 */
export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/user_achievements?select=*,achievement:achievements(*)&user_id=eq.${encodeURIComponent(userId)}&order=unlocked_at.desc`,
    { headers: readHeaders }
  )
  if (!res.ok) return []
  const data = await res.json()
  if (!Array.isArray(data)) return []
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
  const uaRes = await fetch(
    `${SUPABASE_URL}/rest/v1/user_achievements?select=achievement_id&user_id=eq.${encodeURIComponent(userId)}`,
    { headers: readHeaders }
  )
  const userAchievements: { achievement_id: string }[] = uaRes.ok ? await uaRes.json() : []

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
  feedbackBugs: number
  feedbackTotal: number
  feedbackAdopted: number
}

async function fetchCount(url: string): Promise<number> {
  const res = await fetch(url, { headers: countHeaders })
  if (!res.ok) return 0
  return parseCount(res)
}

async function getUserStats(userId: string): Promise<UserStats> {
  const uid = encodeURIComponent(userId)
  const base = `${SUPABASE_URL}/rest/v1`

  // 批次查詢各項統計
  const [
    addedSpots,
    photos,
    comments,
    replies,
    votes,
    edits,
    ratings,
    favorites,
    reports,
    fiveStarRatings,
    oneStarRatings,
    feedbackBugs,
    feedbackTotal,
    feedbackAdopted,
  ] = await Promise.all([
    fetchCount(`${base}/spots?created_by=eq.${uid}&select=id`),
    fetchCount(`${base}/spot_images?user_id=eq.${uid}&select=id`),
    fetchCount(`${base}/comments?user_id=eq.${uid}&parent_id=is.null&select=id`),
    fetchCount(`${base}/comments?user_id=eq.${uid}&parent_id=not.is.null&select=id`),
    fetchCount(`${base}/feature_votes?user_id=eq.${uid}&select=id`),
    fetchCount(`${base}/spot_edits?user_id=eq.${uid}&select=id`),
    fetchCount(`${base}/ratings?user_id=eq.${uid}&select=id`),
    fetchCount(`${base}/favorites?user_id=eq.${uid}&select=id`),
    fetchCount(`${base}/reports?user_id=eq.${uid}&select=id`),
    fetchCount(`${base}/ratings?user_id=eq.${uid}&score=eq.5&select=id`),
    fetchCount(`${base}/ratings?user_id=eq.${uid}&score=eq.1&select=id`),
    fetchCount(`${base}/feedback?user_id=eq.${uid}&type=eq.bug&select=id`),
    fetchCount(`${base}/feedback?user_id=eq.${uid}&select=id`),
    fetchCount(`${base}/feedback?user_id=eq.${uid}&status=eq.adopted&select=id`),
  ])

  const now = new Date()
  // 用台灣時間
  const taiwanHour = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Taipei' })).getHours()

  return {
    viewedSpots: 0, // 需要由呼叫端傳入或從 view_count 追蹤
    addedSpots,
    photos,
    comments,
    replies,
    votes,
    edits,
    ratings,
    favorites,
    reports,
    fiveStarRatings,
    oneStarRatings,
    currentHour: taiwanHour,
    feedbackBugs,
    feedbackTotal,
    feedbackAdopted,
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

    // === 回饋類 ===
    case 'feedback_bugs':
      return stats.feedbackBugs >= threshold

    case 'feedback_total':
      return stats.feedbackTotal >= threshold

    case 'feedback_adopted':
      return stats.feedbackAdopted >= threshold

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
  const uid = encodeURIComponent(userId)
  const base = `${SUPABASE_URL}/rest/v1`
  const spotIds = new Set<string>()

  const [ratingsRes, commentsRes, votesRes, favoritesRes] = await Promise.all([
    fetch(`${base}/ratings?user_id=eq.${uid}&select=spot_id`, { headers: readHeaders }),
    fetch(`${base}/comments?user_id=eq.${uid}&select=spot_id`, { headers: readHeaders }),
    fetch(`${base}/feature_votes?user_id=eq.${uid}&select=spot_id`, { headers: readHeaders }),
    fetch(`${base}/favorites?user_id=eq.${uid}&select=spot_id`, { headers: readHeaders }),
  ])

  type SpotRow = { spot_id: string }
  const [ratData, comData, votData, favData] = await Promise.all([
    ratingsRes.ok ? ratingsRes.json() as Promise<SpotRow[]> : Promise.resolve([]),
    commentsRes.ok ? commentsRes.json() as Promise<SpotRow[]> : Promise.resolve([]),
    votesRes.ok ? votesRes.json() as Promise<SpotRow[]> : Promise.resolve([]),
    favoritesRes.ok ? favoritesRes.json() as Promise<SpotRow[]> : Promise.resolve([]),
  ])

  for (const r of ratData) spotIds.add(r.spot_id)
  for (const c of comData) spotIds.add(c.spot_id)
  for (const v of votData) spotIds.add(v.spot_id)
  for (const f of favData) spotIds.add(f.spot_id)

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
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/spots?select=id,address&id=in.(${batch.map(encodeURIComponent).join(',')})`,
      { headers: readHeaders }
    )
    if (res.ok) {
      const data: { id: string; address: string }[] = await res.json()
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
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/spots?select=address&id=in.(${batch.map(encodeURIComponent).join(',')})`,
      { headers: readHeaders }
    )
    if (res.ok) {
      const data: { address: string }[] = await res.json()
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
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/spots?select=id&id=in.(${batch.map(encodeURIComponent).join(',')})&category=eq.${encodeURIComponent(category)}`,
      { headers: countHeaders }
    )
    count += parseCount(res)
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
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/spots?select=id&id=in.(${batch.map(encodeURIComponent).join(',')})&elevation=gte.${minElevation}`,
      { headers: countHeaders }
    )
    count += parseCount(res)
  }

  return count
}

async function getSpotFavoritedCount(userId: string): Promise<number> {
  // 用戶新增的地點被多少不同用戶收藏
  const uid = encodeURIComponent(userId)
  const spotsRes = await fetch(
    `${SUPABASE_URL}/rest/v1/spots?select=id&created_by=eq.${uid}`,
    { headers: readHeaders }
  )
  if (!spotsRes.ok) return 0
  const userSpots: { id: string }[] = await spotsRes.json()

  if (!userSpots || userSpots.length === 0) return 0

  const spotIds = userSpots.map(s => s.id)
  const favRes = await fetch(
    `${SUPABASE_URL}/rest/v1/favorites?select=id&spot_id=in.(${spotIds.map(encodeURIComponent).join(',')})&user_id=neq.${uid}`,
    { headers: countHeaders }
  )
  return parseCount(favRes)
}

async function isEarlyUser(userId: string, threshold: number): Promise<boolean> {
  const uid = encodeURIComponent(userId)
  const userRes = await fetch(
    `${SUPABASE_URL}/rest/v1/users?select=created_at&id=eq.${uid}&limit=1`,
    { headers: readHeaders }
  )
  if (!userRes.ok) return false
  const userData: { created_at: string }[] = await userRes.json()
  if (!userData || userData.length === 0) return false

  const createdAt = userData[0].created_at
  const countRes = await fetch(
    `${SUPABASE_URL}/rest/v1/users?select=id&created_at=lt.${encodeURIComponent(createdAt)}`,
    { headers: countHeaders }
  )
  const count = parseCount(countRes)
  return count < threshold
}

async function getInteractedSpotIds(userId: string): Promise<string[]> {
  const uid = encodeURIComponent(userId)
  const base = `${SUPABASE_URL}/rest/v1`
  const spotIds = new Set<string>()

  const [ratingsRes, commentsRes, votesRes, favoritesRes] = await Promise.all([
    fetch(`${base}/ratings?user_id=eq.${uid}&select=spot_id`, { headers: readHeaders }),
    fetch(`${base}/comments?user_id=eq.${uid}&select=spot_id`, { headers: readHeaders }),
    fetch(`${base}/feature_votes?user_id=eq.${uid}&select=spot_id`, { headers: readHeaders }),
    fetch(`${base}/favorites?user_id=eq.${uid}&select=spot_id`, { headers: readHeaders }),
  ])

  type SpotRow = { spot_id: string }
  const [ratData, comData, votData, favData] = await Promise.all([
    ratingsRes.ok ? ratingsRes.json() as Promise<SpotRow[]> : Promise.resolve([]),
    commentsRes.ok ? commentsRes.json() as Promise<SpotRow[]> : Promise.resolve([]),
    votesRes.ok ? votesRes.json() as Promise<SpotRow[]> : Promise.resolve([]),
    favoritesRes.ok ? favoritesRes.json() as Promise<SpotRow[]> : Promise.resolve([]),
  ])

  for (const r of ratData) spotIds.add(r.spot_id)
  for (const c of comData) spotIds.add(c.spot_id)
  for (const v of votData) spotIds.add(v.spot_id)
  for (const f of favData) spotIds.add(f.spot_id)

  return Array.from(spotIds)
}

// === 新增成就輔助函式 ===

/**
 * Meta 成就：檢查一組子成就是否全部解鎖
 */
async function checkMetaAchievement(userId: string, requiredKeys: string[]): Promise<boolean> {
  // 取得所有 required keys 對應的 achievement ids
  const keysParam = requiredKeys.map(encodeURIComponent).join(',')
  const achRes = await fetch(
    `${SUPABASE_URL}/rest/v1/achievements?select=id,key&key=in.(${keysParam})`,
    { headers: readHeaders }
  )
  if (!achRes.ok) return false
  const requiredAchievements: { id: string; key: string }[] = await achRes.json()

  if (!requiredAchievements || requiredAchievements.length !== requiredKeys.length) return false

  const requiredIds = requiredAchievements.map(a => a.id)
  const uid = encodeURIComponent(userId)

  // 檢查用戶是否已解鎖這些成就
  const unlockedRes = await fetch(
    `${SUPABASE_URL}/rest/v1/user_achievements?select=achievement_id&user_id=eq.${uid}&achievement_id=in.(${requiredIds.map(encodeURIComponent).join(',')})`,
    { headers: countHeaders }
  )
  const count = parseCount(unlockedRes)
  return count >= requiredIds.length
}

/**
 * 海拔收集者：各海拔帶至少有一個互動地點
 * bands: [0, 500, 1500, 3000] → 0-500, 500-1500, 1500-3000, 3000+
 */
async function checkAltitudeVariety(userId: string, bands: number[]): Promise<boolean> {
  const spotIds = await getInteractedSpotIds(userId)
  if (spotIds.length === 0) return false

  // 取得所有互動地點的海拔
  const elevations: number[] = []
  const batchSize = 50
  for (let i = 0; i < spotIds.length; i += batchSize) {
    const batch = spotIds.slice(i, i + batchSize)
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/spots?select=elevation&id=in.(${batch.map(encodeURIComponent).join(',')})&elevation=not.is.null`,
      { headers: readHeaders }
    )
    if (res.ok) {
      const data: { elevation: number }[] = await res.json()
      elevations.push(...data.map(s => s.elevation))
    }
  }

  if (elevations.length === 0) return false

  // 檢查每個海拔帶是否至少有一個
  for (let i = 0; i < bands.length; i++) {
    const lower = bands[i]
    const upper = i < bands.length - 1 ? bands[i + 1] : Infinity
    const hasSpot = elevations.some(e => e >= lower && e < upper)
    if (!hasSpot) return false
  }

  return true
}

/**
 * 詳細評論：字數 >= minLength 的評論數
 */
async function getDetailedCommentCount(userId: string, minLength: number): Promise<number> {
  const uid = encodeURIComponent(userId)
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/comments?select=content&user_id=eq.${uid}&parent_id=is.null`,
    { headers: readHeaders }
  )
  if (!res.ok) return 0
  const data: { content: string }[] = await res.json()
  return data.filter(c => c.content && c.content.length >= minLength).length
}

/**
 * 在地達人：用戶在單一縣市的最大貢獻數（新增地點 + 評論 + 投票等）
 */
async function getMaxCountyContributions(userId: string): Promise<number> {
  const spotIds = await getInteractedSpotIds(userId)
  if (spotIds.length === 0) return 0

  const countyCount: Record<string, number> = {}
  const allCounties = [
    '台北市', '臺北市', '新北市', '基隆市', '桃園市', '新竹市', '新竹縣',
    '宜蘭縣', '苗栗縣', '台中市', '臺中市', '彰化縣', '南投縣', '雲林縣',
    '嘉義市', '嘉義縣', '台南市', '臺南市', '高雄市', '屏東縣',
    '花蓮縣', '台東縣', '臺東縣', '澎湖縣', '金門縣', '連江縣',
  ]

  const batchSize = 50
  for (let i = 0; i < spotIds.length; i += batchSize) {
    const batch = spotIds.slice(i, i + batchSize)
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/spots?select=address&id=in.(${batch.map(encodeURIComponent).join(',')})`,
      { headers: readHeaders }
    )
    if (res.ok) {
      const data: { address: string }[] = await res.json()
      for (const spot of data) {
        if (spot.address) {
          for (const county of allCounties) {
            if (spot.address.includes(county)) {
              const normalized = county.replace('臺', '台')
              countyCount[normalized] = (countyCount[normalized] || 0) + 1
            }
          }
        }
      }
    }
  }

  return Math.max(0, ...Object.values(countyCount))
}

/**
 * 連續使用天數（基於互動紀錄）
 */
async function getConsecutiveDays(userId: string): Promise<number> {
  const uid = encodeURIComponent(userId)
  const base = `${SUPABASE_URL}/rest/v1`

  // 從各表取得最近的活動日期
  const [ratingsRes, commentsRes, votesRes] = await Promise.all([
    fetch(`${base}/ratings?user_id=eq.${uid}&select=created_at&order=created_at.desc&limit=60`, { headers: readHeaders }),
    fetch(`${base}/comments?user_id=eq.${uid}&select=created_at&order=created_at.desc&limit=60`, { headers: readHeaders }),
    fetch(`${base}/feature_votes?user_id=eq.${uid}&select=created_at&order=created_at.desc&limit=60`, { headers: readHeaders }),
  ])

  type DateRow = { created_at: string }
  const [ratData, comData, votData] = await Promise.all([
    ratingsRes.ok ? ratingsRes.json() as Promise<DateRow[]> : Promise.resolve([]),
    commentsRes.ok ? commentsRes.json() as Promise<DateRow[]> : Promise.resolve([]),
    votesRes.ok ? votesRes.json() as Promise<DateRow[]> : Promise.resolve([]),
  ])

  // 收集所有活動日期（以台灣時間的日期為單位）
  const daySet = new Set<string>()
  const allDates = [
    ...ratData.map(r => r.created_at),
    ...comData.map(c => c.created_at),
    ...votData.map(v => v.created_at),
  ]

  for (const dateStr of allDates) {
    const d = new Date(dateStr)
    const twDate = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Taipei' }) // YYYY-MM-DD
    daySet.add(twDate)
  }

  if (daySet.size === 0) return 0

  // 排序日期，從最近開始倒數連續天數
  const sortedDays = Array.from(daySet).sort().reverse()
  let streak = 1
  for (let i = 1; i < sortedDays.length; i++) {
    const prev = new Date(sortedDays[i - 1])
    const curr = new Date(sortedDays[i])
    const diffMs = prev.getTime() - curr.getTime()
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays === 1) {
      streak++
    } else {
      break
    }
  }

  return streak
}

/**
 * 四季探索者：春夏秋冬都使用過
 */
async function hasAllSeasons(userId: string): Promise<boolean> {
  const uid = encodeURIComponent(userId)
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/ratings?select=created_at&user_id=eq.${uid}`,
    { headers: readHeaders }
  )
  if (!res.ok) return false
  const data: { created_at: string }[] = await res.json()
  if (!data || data.length === 0) return false

  const seasons = new Set<number>()
  for (const row of data) {
    const month = new Date(row.created_at).getMonth() + 1
    if (month >= 3 && month <= 5) seasons.add(0) // 春
    else if (month >= 6 && month <= 8) seasons.add(1) // 夏
    else if (month >= 9 && month <= 11) seasons.add(2) // 秋
    else seasons.add(3) // 冬
  }

  return seasons.size >= 4
}

// === 成就進度計算（即將解鎖提示用）===

export interface AchievementProgress {
  achievement: Achievement
  current: number
  target: number
  percent: number
}

/**
 * 計算用戶未解鎖成就的進度（用於「即將解鎖」提示）
 * 只回傳進度 >= 70% 的成就
 */
export async function getNearlyUnlockedAchievements(userId: string): Promise<AchievementProgress[]> {
  if (!userId) return []

  const allAchievements = await getAllAchievements()
  const uaRes = await fetch(
    `${SUPABASE_URL}/rest/v1/user_achievements?select=achievement_id&user_id=eq.${encodeURIComponent(userId)}`,
    { headers: readHeaders }
  )
  const userAchievements: { achievement_id: string }[] = uaRes.ok ? await uaRes.json() : []

  const unlockedIds = new Set((userAchievements || []).map((ua: { achievement_id: string }) => ua.achievement_id))
  const locked = allAchievements.filter(a => !unlockedIds.has(a.id))
  if (locked.length === 0) return []

  const stats = await getUserStats(userId)
  const results: AchievementProgress[] = []

  for (const achievement of locked) {
    const criteria = achievement.criteria as Record<string, unknown>
    if (!criteria || !criteria.type) continue
    if (criteria.reserved) continue

    const threshold = (criteria.threshold as number) || 0
    if (threshold <= 0) continue

    const type = criteria.type as string
    let current = 0

    // 計算當前進度
    switch (type) {
      case 'view_spots':
        current = await getViewedSpotCount(userId)
        break
      case 'add_spots':
        current = stats.addedSpots
        break
      case 'upload_photos':
        current = stats.photos
        break
      case 'comments':
        current = stats.comments
        break
      case 'votes':
        current = stats.votes
        break
      case 'edits':
        current = stats.edits
        break
      case 'ratings':
        current = stats.ratings
        break
      case 'replies':
        current = stats.replies
        break
      case 'favorites':
        current = stats.favorites
        break
      case 'reports':
        current = stats.reports
        break
      case 'spot_favorited':
        current = await getSpotFavoritedCount(userId)
        break
      case 'view_all_counties':
        current = await getViewedCountiesCount(userId)
        break
      case 'detailed_comments':
        current = await getDetailedCommentCount(userId, (criteria.min_length as number) || 200)
        break
      case 'consecutive_days':
        current = await getConsecutiveDays(userId)
        break
      case 'feedback_bugs':
        current = stats.feedbackBugs
        break
      case 'feedback_total':
        current = stats.feedbackTotal
        break
      case 'feedback_adopted':
        current = stats.feedbackAdopted
        break
      default:
        continue // 跳過無法計算進度的類型
    }

    const percent = Math.min(100, (current / threshold) * 100)
    if (percent >= 70 && percent < 100) {
      results.push({ achievement, current, target: threshold, percent })
    }
  }

  // 按進度排序（最接近的排前面）
  results.sort((a, b) => b.percent - a.percent)
  return results.slice(0, 3) // 最多顯示 3 個
}

// === 精選徽章 API ===

export async function getFeaturedAchievements(userId: string): Promise<Achievement[]> {
  const { data } = await supabase
    .from('featured_achievements')
    .select('slot, achievement:achievements(*)')
    .eq('user_id', userId)
    .order('slot', { ascending: true })

  if (!data) return []
  return data
    .map((d: Record<string, unknown>) => d.achievement as Achievement)
    .filter(Boolean)
}

export async function setFeaturedAchievement(userId: string, achievementId: string, slot: number): Promise<boolean> {
  const { error } = await supabase
    .from('featured_achievements')
    .upsert({
      user_id: userId,
      achievement_id: achievementId,
      slot,
    }, {
      onConflict: 'user_id,slot',
    })

  return !error
}

export async function removeFeaturedAchievement(userId: string, slot: number): Promise<boolean> {
  const { error } = await supabase
    .from('featured_achievements')
    .delete()
    .eq('user_id', userId)
    .eq('slot', slot)

  return !error
}
