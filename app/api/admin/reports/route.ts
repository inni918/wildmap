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
    let query = supabaseAdmin
      .from('reports')
      .select(
        'id, reason, description, target_type, target_id, status, created_at, resolved_at, resolution, reporter:reporter_id(display_name), resolver:resolved_by(display_name)',
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

        // Supabase join 可能回傳 object 或 array
        const reporterData = report.reporter as unknown
        const resolverData = report.resolver as unknown
        const getDisplayName = (d: unknown): string | null => {
          if (d && typeof d === 'object' && !Array.isArray(d)) return (d as { display_name: string }).display_name
          if (Array.isArray(d) && d.length > 0) return (d[0] as { display_name: string }).display_name
          return null
        }

        return {
          ...report,
          target_name: targetName,
          priority: getPriority(report.reason),
          reporter_name: getDisplayName(reporterData) || '匿名',
          resolver_name: getDisplayName(resolverData),
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
