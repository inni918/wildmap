import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import {
  verifyAdmin,
  parsePaginationParams,
  paginatedResponse,
  errorResponse,
  logAdminAction,
} from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  const auth = await verifyAdmin('moderator')
  if (!auth.authorized) {
    return errorResponse(auth.error, auth.message, auth.error === 'UNAUTHORIZED' ? 401 : 403)
  }

  const searchParams = request.nextUrl.searchParams
  const { page, pageSize, offset } = parsePaginationParams(searchParams)
  const search = searchParams.get('search') || ''
  const role = searchParams.get('role') || ''
  const level = searchParams.get('level') || ''
  const status = searchParams.get('status') || ''
  const sort = searchParams.get('sort') || 'created_at'
  const order = searchParams.get('order') || 'desc'

  try {
    // 建立查詢
    let query = supabaseAdmin
      .from('users')
      .select('id, display_name, email, avatar_url, role, level, points, credit_score, is_banned, created_at', {
        count: 'exact',
      })

    // 篩選
    if (search) {
      query = query.or(`display_name.ilike.%${search}%,email.ilike.%${search}%`)
    }
    if (role) {
      query = query.eq('role', role)
    }
    if (level) {
      query = query.eq('level', parseInt(level))
    }
    if (status === 'banned') {
      query = query.eq('is_banned', true)
    } else if (status === 'active') {
      query = query.or('is_banned.is.null,is_banned.eq.false')
    }

    // 排序 + 分頁
    query = query
      .order(sort, { ascending: order === 'asc' })
      .range(offset, offset + pageSize - 1)

    const { data, count, error } = await query

    if (error) {
      console.error('Users query error:', error)
      return errorResponse('QUERY_ERROR', error.message, 500)
    }

    return NextResponse.json(paginatedResponse(data || [], count || 0, page, pageSize))
  } catch (err) {
    console.error('Users API error:', err)
    return errorResponse('INTERNAL_ERROR', '取得用戶列表失敗', 500)
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await verifyAdmin('admin')
  if (!auth.authorized) {
    return errorResponse(auth.error, auth.message, auth.error === 'UNAUTHORIZED' ? 401 : 403)
  }

  try {
    const body = await request.json()
    const { userId, action, value, reason } = body

    if (!userId || !action) {
      return errorResponse('VALIDATION_ERROR', '缺少必要參數', 400)
    }

    switch (action) {
      case 'changeRole': {
        const validRoles = ['user', 'business', 'moderator', 'admin']
        if (!validRoles.includes(value)) {
          return errorResponse('VALIDATION_ERROR', '無效的角色', 400)
        }
        const { error } = await supabaseAdmin
          .from('users')
          .update({ role: value })
          .eq('id', userId)
        if (error) return errorResponse('UPDATE_ERROR', error.message, 500)

        await logAdminAction({
          adminId: auth.user.id,
          action: 'change_role',
          targetType: 'user',
          targetId: userId,
          details: { newRole: value },
        })
        break
      }

      case 'ban': {
        const { error } = await supabaseAdmin
          .from('users')
          .update({ is_banned: true, ban_reason: reason || '違反使用條款' })
          .eq('id', userId)
        if (error) return errorResponse('UPDATE_ERROR', error.message, 500)

        await logAdminAction({
          adminId: auth.user.id,
          action: 'ban_user',
          targetType: 'user',
          targetId: userId,
          details: { reason },
        })
        break
      }

      case 'unban': {
        const { error } = await supabaseAdmin
          .from('users')
          .update({ is_banned: false, ban_reason: null })
          .eq('id', userId)
        if (error) return errorResponse('UPDATE_ERROR', error.message, 500)

        await logAdminAction({
          adminId: auth.user.id,
          action: 'unban_user',
          targetType: 'user',
          targetId: userId,
        })
        break
      }

      default:
        return errorResponse('VALIDATION_ERROR', '不支援的操作', 400)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Users PATCH error:', err)
    return errorResponse('INTERNAL_ERROR', '操作失敗', 500)
  }
}
