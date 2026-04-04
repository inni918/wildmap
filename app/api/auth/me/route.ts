import { requireAuth } from '@/lib/api/auth'
import { createClient } from '@/lib/supabase/server'
import { apiSuccess, apiError } from '@/lib/api/response'

export async function GET() {
  const { user, error } = await requireAuth()
  if (error) return error

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user!.id)
    .single()

  return apiSuccess({ user, profile })
}
