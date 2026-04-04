import { adminSupabase } from '@/lib/supabase/admin'

type TriggerEvent =
  | 'profile_complete'
  | 'checkin'
  | 'comment'
  | 'rating'
  | 'photo'
  | 'vote'
  | 'spot_created'

interface TriggerContext {
  userId: string
  event: TriggerEvent
  metadata?: Record<string, unknown>
}

export async function triggerAchievements({ userId, event, metadata }: TriggerContext) {
  try {
    // 取得用戶目前統計
    const { data: stats } = await adminSupabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single()

    // 更新統計計數
    await updateStats(userId, event, stats)

    // 取得最新統計
    const { data: newStats } = await adminSupabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single()

    // 取得所有成就定義
    const { data: achievements } = await adminSupabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)

    if (!achievements || !newStats) return

    // 取得用戶已有的成就
    const { data: userAchievements } = await adminSupabase
      .from('user_achievements')
      .select('achievement_id, tier_unlocked, progress')
      .eq('user_id', userId)

    const userAchMap = new Map(userAchievements?.map(ua => [ua.achievement_id, ua]) || [])

    // 檢查每個成就是否觸發
    const newPermissions: string[] = []

    for (const achievement of achievements) {
      const progress = getProgress(achievement.code, newStats, event)
      if (progress === null) continue

      const tiers = achievement.tiers as Array<{ tier: string; threshold: number; points: number }>
      if (!tiers.length) continue

      // 找到最高可解鎖的 tier
      let highestTier = 'none'
      for (const tier of tiers) {
        if (progress >= tier.threshold) highestTier = tier.tier
      }

      const existing = userAchMap.get(achievement.id)
      const currentTier = existing?.tier_unlocked || 'none'

      const tierOrder = ['none', 'bronze', 'silver', 'gold']
      const newTierIndex = tierOrder.indexOf(highestTier)
      const currentTierIndex = tierOrder.indexOf(currentTier)

      if (newTierIndex > currentTierIndex) {
        // 升級！更新成就
        await adminSupabase.from('user_achievements').upsert({
          user_id: userId,
          achievement_id: achievement.id,
          tier_unlocked: highestTier,
          progress,
          progress_max: tiers[tiers.length - 1].threshold,
          unlocked_at: new Date().toISOString()
        }, { onConflict: 'user_id,achievement_id' })

        // 收集新解鎖的權限
        const perms = achievement.unlock_permissions as string[]
        newPermissions.push(...perms)
      } else if (existing) {
        // 只更新進度
        await adminSupabase.from('user_achievements')
          .update({ progress })
          .eq('user_id', userId)
          .eq('achievement_id', achievement.id)
      } else {
        // 新建進度記錄
        await adminSupabase.from('user_achievements').insert({
          user_id: userId,
          achievement_id: achievement.id,
          tier_unlocked: 'none',
          progress,
          progress_max: tiers[tiers.length - 1].threshold
        })
      }
    }

    // 更新 permissions_cache
    if (newPermissions.length > 0) {
      const { data: user } = await adminSupabase
        .from('users')
        .select('permissions_cache')
        .eq('id', userId)
        .single()

      const currentPerms = (user?.permissions_cache || []) as string[]
      const updatedPerms = [...new Set([...currentPerms, ...newPermissions])]

      await adminSupabase
        .from('users')
        .update({ permissions_cache: updatedPerms })
        .eq('id', userId)
    }
  } catch (err) {
    console.error('Achievement trigger error:', err)
  }
}

function getProgress(code: string, stats: Record<string, number>, event: TriggerEvent): number | null {
  const map: Partial<Record<string, number | null>> = {
    'profile_complete': event === 'profile_complete' ? 1 : null,
    'first_checkin': stats.checkins_count || 0,
    'explorer_bronze': stats.checkins_unique_spots || 0,
    'contributor_bronze': stats.comments_count || 0,
    'photographer': stats.photos_count || 0,
    'voter': stats.votes_count || 0,
    'spot_creator': stats.spots_created || 0,
    'rater': stats.ratings_count || 0,
    'camping_novice': stats.checkins_count || 0,
    'camping_explorer': stats.checkins_unique_spots || 0,
  }
  const val = map[code]
  return val === undefined ? null : (val === null ? null : val)
}

async function updateStats(userId: string, event: TriggerEvent, current: Record<string, number> | null) {
  const updates: Record<string, number> = {}
  if (event === 'comment') updates.comments_count = (current?.comments_count || 0) + 1
  if (event === 'rating') updates.ratings_count = (current?.ratings_count || 0) + 1
  if (event === 'photo') updates.photos_count = (current?.photos_count || 0) + 1
  if (event === 'vote') updates.votes_count = (current?.votes_count || 0) + 1
  if (event === 'spot_created') updates.spots_created = (current?.spots_created || 0) + 1
  if (event === 'checkin') {
    updates.checkins_count = (current?.checkins_count || 0) + 1
  }

  if (Object.keys(updates).length === 0) return

  await adminSupabase.from('user_stats').upsert({
    user_id: userId,
    ...updates,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' })
}
