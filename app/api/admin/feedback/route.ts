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
  const status = searchParams.get('status') || ''
  const type = searchParams.get('type') || ''

  try {
    let query = supabaseAdmin
      .from('feedback')
      .select(
        'id, user_id, type, description, status, admin_note, created_at, updated_at',
        { count: 'exact' }
      )

    if (status) {
      query = query.eq('status', status)
    }
    if (type) {
      query = query.eq('type', type)
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    const { data, count, error } = await query

    if (error) {
      console.error('Feedback query error:', error)
      return errorResponse('QUERY_ERROR', error.message, 500)
    }

    // 批次查詢相關用戶名稱
    const userIds = new Set<string>()
    for (const f of data || []) {
      if (f.user_id) userIds.add(f.user_id)
    }
    const userMap: Record<string, string> = {}
    if (userIds.size > 0) {
      const { data: users } = await supabaseAdmin
        .from('users')
        .select('id, display_name')
        .in('id', Array.from(userIds))
      for (const u of users || []) {
        if (u.display_name) userMap[u.id] = u.display_name
      }
    }

    const enrichedData = (data || []).map((f) => ({
      ...f,
      user_name: f.user_id ? (userMap[f.user_id] || '未知用戶') : '匿名',
    }))

    return NextResponse.json(paginatedResponse(enrichedData, count || 0, page, pageSize))
  } catch (err) {
    console.error('Feedback API error:', err)
    return errorResponse('INTERNAL_ERROR', '取得回饋列表失敗', 500)
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await verifyAdmin('moderator')
  if (!auth.authorized) {
    return errorResponse(auth.error, auth.message, auth.error === 'UNAUTHORIZED' ? 401 : 403)
  }

  try {
    const body = await request.json()
    const { feedbackId, status, adminNote } = body

    if (!feedbackId || !status) {
      return errorResponse('VALIDATION_ERROR', '缺少必要參數', 400)
    }

    const validStatuses = ['pending', 'in_progress', 'resolved', 'adopted', 'ignored']
    if (!validStatuses.includes(status)) {
      return errorResponse('VALIDATION_ERROR', '不支援的狀態', 400)
    }

    // 取得原始 feedback 資訊（用於成就觸發判斷）
    const { data: originalFeedback } = await supabaseAdmin
      .from('feedback')
      .select('user_id, type, status')
      .eq('id', feedbackId)
      .single()

    const { error } = await supabaseAdmin
      .from('feedback')
      .update({
        status,
        admin_note: adminNote || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', feedbackId)

    if (error) return errorResponse('UPDATE_ERROR', error.message, 500)

    await logAdminAction({
      adminId: auth.user.id,
      action: `update_feedback_status`,
      targetType: 'feedback',
      targetId: feedbackId,
      details: { status, adminNote },
    })

    // 如果建議被採納（adopted），且有 user_id，前端可以觸發成就檢查
    const adopted = status === 'adopted' &&
      originalFeedback?.type === 'suggestion' &&
      originalFeedback?.user_id &&
      originalFeedback?.status !== 'adopted'

    return NextResponse.json({ success: true, adopted })
  } catch (err) {
    console.error('Feedback PATCH error:', err)
    return errorResponse('INTERNAL_ERROR', '操作失敗', 500)
  }
}
