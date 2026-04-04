import { createClient } from '@/lib/supabase/server'
import { apiError } from './response'

export async function requireAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return { user: null, error: apiError('未登入', 401) }
  }
  
  return { user, error: null }
}
