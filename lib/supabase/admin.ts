import { createClient } from '@supabase/supabase-js'

// ⚠️ service_role client — 只能在 Server Side 使用
// 繞過 RLS，用於後台 API routes
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
