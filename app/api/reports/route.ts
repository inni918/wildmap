import { requireAuth } from '@/lib/api/auth'
import { createClient } from '@/lib/supabase/server'
import { apiSuccess, apiError } from '@/lib/api/response'
import { checkRateLimit } from '@/lib/api/rate-limit'

export async function POST(request: Request) {
  const { user, error } = await requireAuth()
  if (error) return error

  const allowed = checkRateLimit(`report:${user!.id}`, 3, 60 * 60 * 1000) // 1小時最多3則
  if (!allowed) return apiError('檢舉太頻繁', 429)

  const { target_type, target_id, reason } = await request.json()
  if (!target_type || !target_id || !reason) return apiError('缺少必要欄位')
  if (reason.trim().length < 5) return apiError('請說明檢舉原因（至少5字）')

  const supabase = await createClient()
  const { error: dbError } = await supabase
    .from('reports')
    .insert({ reporter_id: user!.id, target_type, target_id, reason: reason.trim() })

  if (dbError) return apiError('檢舉失敗')
  return apiSuccess({ message: '已收到您的檢舉，我們會盡快處理' }, 201)
}
