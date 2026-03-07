import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// ⚠️ service_role client — 只能在 Server Side 使用
// 繞過 RLS，用於後台 API routes

// 使用 lazy init 避免 build 時因缺少 env 而崩潰
let _supabaseAdmin: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
    }
    _supabaseAdmin = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }
  return _supabaseAdmin
}

// 向下相容：直接 import { supabaseAdmin }
// 注意：只能在 runtime（API route handler 內）使用，不能在 top-level module scope 用
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return Reflect.get(getSupabaseAdmin(), prop)
  },
})
