/**
 * adminFetch - 自動帶 Supabase Bearer token 的 fetch wrapper
 * 用於後台頁面呼叫 /api/admin/* 路由
 */

import { supabase } from '@/lib/supabase'

export async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  // 取得目前 session 的 access token
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  const headers = new Headers(options.headers)
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  return fetch(url, { ...options, headers })
}
