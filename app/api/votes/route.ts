import { requireAuth } from '@/lib/api/auth'
import { createClient } from '@/lib/supabase/server'
import { apiSuccess, apiError } from '@/lib/api/response'
import { triggerAchievements } from '@/lib/achievements/trigger'

export async function POST(request: Request) {
  const { user, error } = await requireAuth()
  if (error) return error

  const { spot_id, feature_id, vote } = await request.json()
  if (!spot_id || !feature_id || vote === undefined) return apiError('缺少必要欄位')

  const supabase = await createClient()

  const { data, error: dbError } = await supabase
    .from('feature_votes')
    .upsert(
      { spot_id, feature_id, user_id: user!.id, vote },
      { onConflict: 'spot_id,feature_id,user_id' }
    )
    .select()
    .single()

  if (dbError) return apiError('投票失敗')

  // fire-and-forget 成就觸發
  triggerAchievements({ userId: user!.id, event: 'vote' })

  return apiSuccess({ vote: data })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const spot_id = searchParams.get('spot_id')
  if (!spot_id) return apiError('缺少 spot_id')

  const supabase = await createClient()
  const { data } = await supabase
    .from('feature_votes')
    .select('feature_id, vote')
    .eq('spot_id', spot_id)

  // 統計每個特性的投票數
  const stats: Record<string, { yes: number, no: number }> = {}
  data?.forEach(v => {
    if (!stats[v.feature_id]) stats[v.feature_id] = { yes: 0, no: 0 }
    if (v.vote) stats[v.feature_id].yes++
    else stats[v.feature_id].no++
  })

  return apiSuccess({ votes: stats })
}
