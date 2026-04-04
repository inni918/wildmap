import { requireAuth } from '@/lib/api/auth'
import { createClient } from '@/lib/supabase/server'
import { apiSuccess, apiError } from '@/lib/api/response'
import { triggerAchievements } from '@/lib/achievements/trigger'

export async function POST(request: Request) {
  const { user, error } = await requireAuth()
  if (error) return error

  const { spot_id, score } = await request.json()
  if (!spot_id) return apiError('缺少 spot_id')
  if (score === undefined || score === null) return apiError('缺少評分')
  if (score < 1 || score > 5) return apiError('評分必須在 1-5 之間')

  const supabase = await createClient()

  const { data, error: dbError } = await supabase
    .from('ratings')
    .upsert({ spot_id, user_id: user!.id, score }, { onConflict: 'spot_id,user_id' })
    .select()
    .single()

  if (dbError) return apiError('評分失敗')

  // fire-and-forget 成就觸發
  triggerAchievements({ userId: user!.id, event: 'rating' })

  return apiSuccess({ rating: data })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const spot_id = searchParams.get('spot_id')
  if (!spot_id) return apiError('缺少 spot_id')

  const supabase = await createClient()
  const { data } = await supabase
    .from('ratings')
    .select('score')
    .eq('spot_id', spot_id)

  if (!data || data.length === 0) return apiSuccess({ average: 0, count: 0 })

  const average = data.reduce((sum, r) => sum + r.score, 0) / data.length
  return apiSuccess({ average: Math.round(average * 10) / 10, count: data.length })
}
