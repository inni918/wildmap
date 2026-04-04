import { requireAuth } from '@/lib/api/auth'
import { createClient } from '@/lib/supabase/server'
import { apiSuccess, apiError } from '@/lib/api/response'
import { triggerAchievements } from '@/lib/achievements/trigger'
import { checkRateLimit } from '@/lib/api/rate-limit'

export async function POST(request: Request) {
  const { user, error } = await requireAuth()
  if (error) return error

  const allowed = checkRateLimit(`comment:${user!.id}`, 5, 10 * 60 * 1000) // 10分鐘內最多5則留言
  if (!allowed) return apiError('留言太頻繁，請稍後再試', 429)

  const { spot_id, content, parent_id } = await request.json()
  if (!spot_id || !content) return apiError('缺少必要欄位')
  if (content.trim().length < 10) return apiError('留言至少需要 10 個字')

  const supabase = await createClient()
  const { data, error: dbError } = await supabase
    .from('comments')
    .insert({ spot_id, user_id: user!.id, content: content.trim(), parent_id: parent_id || null })
    .select()
    .single()

  if (dbError) return apiError('留言失敗')

  // fire-and-forget 成就觸發
  triggerAchievements({ userId: user!.id, event: 'comment' })

  return apiSuccess({ comment: data }, 201)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const spot_id = searchParams.get('spot_id')
  if (!spot_id) return apiError('缺少 spot_id')

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('comments')
    .select('*, users(id, display_name, avatar_url, level)')
    .eq('spot_id', spot_id)
    .eq('is_hidden', false)
    .is('parent_id', null)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return apiError('取得留言失敗')
  return apiSuccess({ comments: data })
}
