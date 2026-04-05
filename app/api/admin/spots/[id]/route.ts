import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { adminSupabase } from '@/lib/supabase/admin'
import { apiSuccess, apiError } from '@/lib/api/response'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // 驗證 admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return apiError('未登入', 401)

  const { data: profile } = await adminSupabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') return apiError('權限不足', 403)

  const body = await req.json()
  const { action } = body as { action: 'close' | 'reopen' }

  if (action !== 'close' && action !== 'reopen') {
    return apiError('無效的操作', 400)
  }

  const status = action === 'close' ? 'closed' : 'active'

  const { error } = await adminSupabase
    .from('spots')
    .update({ status })
    .eq('id', id)

  if (error) return apiError(error.message, 500)

  // audit log (skip if table doesn't exist)
  try {
    await adminSupabase.from('admin_audit_log').insert({
      admin_id: user.id,
      action_type: action === 'close' ? 'close_spot' : 'reopen_spot',
      target_type: 'spot',
      target_id: id,
      details: { action }
    })
  } catch {
    // table may not exist yet
  }

  return apiSuccess({ id, status })
}
