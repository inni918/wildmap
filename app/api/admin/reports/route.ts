import { createClient } from '@/lib/supabase/server'
import { adminSupabase } from '@/lib/supabase/admin'
import { apiSuccess, apiError } from '@/lib/api/response'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return apiError('未登入', 401)

  const { data: profile } = await adminSupabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') return apiError('權限不足', 403)

  const { data: reports, error } = await adminSupabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return apiError(error.message, 500)
  return apiSuccess(reports)
}
