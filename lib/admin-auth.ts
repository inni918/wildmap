import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { supabaseAdmin } from '@/lib/supabase/admin'

const ROLE_HIERARCHY = ['user', 'business', 'moderator', 'admin', 'super_admin'] as const
export type AdminRole = (typeof ROLE_HIERARCHY)[number]

/**
 * 驗證當前請求的管理員身份
 * 在 API route 開頭呼叫，確保只有足夠權限的管理員可存取
 */
export async function verifyAdmin(minRole: AdminRole = 'moderator') {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {
          // API route 不需要 set cookies
        },
      },
    }
  )

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { authorized: false as const, error: 'UNAUTHORIZED' as const, message: '請先登入' }
  }

  // 用 service_role 查角色（繞過 RLS）
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return { authorized: false as const, error: 'UNAUTHORIZED' as const, message: '找不到用戶資料' }
  }

  const userRoleIndex = ROLE_HIERARCHY.indexOf(profile.role as AdminRole)
  const minRoleIndex = ROLE_HIERARCHY.indexOf(minRole)

  if (userRoleIndex < minRoleIndex) {
    return { authorized: false as const, error: 'FORBIDDEN' as const, message: '權限不足' }
  }

  return {
    authorized: true as const,
    user,
    role: profile.role as AdminRole,
  }
}

/**
 * 記錄管理員操作到 admin_audit_log
 */
export async function logAdminAction(params: {
  adminId: string
  action: string
  targetType?: string
  targetId?: string
  details?: Record<string, unknown>
}) {
  await supabaseAdmin.from('admin_audit_log').insert({
    admin_id: params.adminId,
    action: params.action,
    target_type: params.targetType || null,
    target_id: params.targetId || null,
    details: params.details || {},
  })
}

/**
 * 統一分頁參數解析
 */
export function parsePaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '25')))
  const offset = (page - 1) * pageSize
  return { page, pageSize, offset }
}

/**
 * 統一分頁回應格式
 */
export function paginatedResponse<T>(data: T[], total: number, page: number, pageSize: number) {
  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  }
}

/**
 * 統一錯誤回應
 */
export function errorResponse(code: string, message: string, status: number = 400) {
  return Response.json({ error: { code, message } }, { status })
}
