import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import {
  verifyAdmin,
  parsePaginationParams,
  paginatedResponse,
  errorResponse,
  logAdminAction,
} from '@/lib/admin-auth'

// 自動優先度判斷
function getPriority(type: string): 'high' | 'medium' | 'low' {
  if (['illegal', 'harassment'].includes(type)) return 'high'
  if (['misinformation', 'spam'].includes(type)) return 'medium'
  return 'low'
}

export async function GET(request: NextRequest) {
  const auth = await verifyAdmin('moderator')
  if (!auth.authorized) {
    return errorResponse(auth.error, auth.message, auth.error === 'UNAUTHORIZED' ? 401 : 403)
  }

  const searchParams = request.nextUrl.searchParams
  const { page, pageSize, offset } = parsePaginationParams(searchParams)
  const tab = searchParams.get('tab') || 'pending' // pending | resolved
  const reportType = searchParams.get('type') || ''
  const targetType = searchParams.get('targetType') || ''

  try {
    // 不使用 FK JOIN 查詢 users，避免 FK relationship 不存在時 500
    let query = supabaseAdmin
      .from('reports')
      .select(
        'id, reason, description, target_type, target_id, status, created_at, resolved_at, resolution, reporter_id, resolved_by',
        { count: 'exact' }
      )

    // Tab 篩選
    if (tab === 'pending') {
      query = query.eq('status', 'pending')
    } else {
      query = query.in('status', ['resolved', 'rejected'])
    }

    if (reportType) {
      query = query.eq('reason', reportType)
    }
    if (targetType) {
      query = query.eq('target_type', targetType)
    }

    query = query
      .order('created_at', { ascending: tab === 'pending' }) // 待處理：最早優先
      .range(offset, offset + pageSize - 1)

    const { data, count, error } = await query

    if (error) {
      console.error('Reports query error:', error)
      return errorResponse('QUERY_ERROR', error.message, 500)
    }

    // 批次查詢所有相關 user display_name
    const userIds = new Set<string>()
    for (const r of data || []) {
      if (r.reporter_id) userIds.add(r.reporter_id)
      if (r.resolved_by) userIds.add(r.resolved_by)
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

    // 取得被檢舉目標名稱
    const enrichedData = await Promise.all(
      (data || []).map(async (report) => {
        let targetName = '—'
        if (report.target_type === 'spot' && report.target_id) {
          const { data: spot } = await supabaseAdmin
            .from('spots')
            .select('name')
            .eq('id', report.target_id)
            .single()
          targetName = spot?.name || '已刪除地標'
        } else if (report.target_type === 'comment' && report.target_id) {
          const { data: comment } = await supabaseAdmin
            .from('comments')
            .select('content')
            .eq('id', report.target_id)
            .single()
          targetName = comment?.content?.slice(0, 50) || '已刪除評論'
        } else if (report.target_type === 'user' && report.target_id) {
          const { data: user } = await supabaseAdmin
            .from('users')
            .select('display_name')
            .eq('id', report.target_id)
            .single()
          targetName = user?.display_name || '已刪除用戶'
        }

        return {
          ...report,
          target_name: targetName,
          priority: getPriority(report.reason),
          reporter_name: userMap[report.reporter_id] || '匿名',
          resolver_name: report.resolved_by ? (userMap[report.resolved_by] || null) : null,
        }
      })
    )

    return NextResponse.json(paginatedResponse(enrichedData, count || 0, page, pageSize))
  } catch (err) {
    console.error('Reports API error:', err)
    return errorResponse('INTERNAL_ERROR', '取得檢舉列表失敗', 500)
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await verifyAdmin('moderator')
  if (!auth.authorized) {
    return errorResponse(auth.error, auth.message, auth.error === 'UNAUTHORIZED' ? 401 : 403)
  }

  try {
    const body = await request.json()
    const { reportId, action, note } = body

    if (!reportId || !action) {
      return errorResponse('VALIDATION_ERROR', '缺少必要參數', 400)
    }

    const validActions = ['dismiss', 'delete_content', 'warn_user']
    if (!validActions.includes(action)) {
      return errorResponse('VALIDATION_ERROR', '不支援的處理方式', 400)
    }

    // 更新檢舉狀態
    const status = action === 'dismiss' ? 'rejected' : 'resolved'
    const { error } = await supabaseAdmin
      .from('reports')
      .update({
        status,
        resolution: action,
        resolution_note: note || null,
        resolved_by: auth.user.id,
        resolved_at: new Date().toISOString(),
      })
      .eq('id', reportId)

    if (error) return errorResponse('UPDATE_ERROR', error.message, 500)

    // 如果是刪除內容，額外處理
    if (action === 'delete_content') {
      const { data: report } = await supabaseAdmin
        .from('reports')
        .select('target_type, target_id')
        .eq('id', reportId)
        .single()

      if (report?.target_type === 'comment' && report?.target_id) {
        await supabaseAdmin
          .from('comments')
          .update({ is_hidden: true })
          .eq('id', report.target_id)
      } else if (report?.target_type === 'spot' && report?.target_id) {
        await supabaseAdmin
          .from('spots')
          .update({ status: 'hidden' })
          .eq('id', report.target_id)
      }
    }

    await logAdminAction({
      adminId: auth.user.id,
      action: `resolve_report_${action}`,
      targetType: 'report',
      targetId: reportId,
      details: { resolution: action, note },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Reports PATCH error:', err)
    return errorResponse('INTERNAL_ERROR', '操作失敗', 500)
  }
}
