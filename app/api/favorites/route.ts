import { requireAuth } from '@/lib/api/auth'
import { createClient } from '@/lib/supabase/server'
import { apiSuccess, apiError } from '@/lib/api/response'

// POST /api/favorites — 收藏/取消收藏
export async function POST(request: Request) {
  const { user, error } = await requireAuth()
  if (error) return error

  const { spot_id } = await request.json()
  if (!spot_id) return apiError('缺少 spot_id')

  const supabase = await createClient()

  // 檢查是否已收藏
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('spot_id', spot_id)
    .eq('user_id', user!.id)
    .single()

  if (existing) {
    // 已收藏 → 取消
    await supabase.from('favorites').delete().eq('id', existing.id)
    return apiSuccess({ favorited: false })
  } else {
    // 未收藏 → 新增
    await supabase.from('favorites').insert({ spot_id, user_id: user!.id })
    return apiSuccess({ favorited: true })
  }
}

// GET /api/favorites?spot_id=xxx — 查詢是否已收藏
export async function GET(request: Request) {
  const { user, error } = await requireAuth()
  if (error) return apiSuccess({ favorited: false })

  const { searchParams } = new URL(request.url)
  const spot_id = searchParams.get('spot_id')
  if (!spot_id) return apiError('缺少 spot_id')

  const supabase = await createClient()
  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('spot_id', spot_id)
    .eq('user_id', user!.id)
    .single()

  return apiSuccess({ favorited: !!data })
}
