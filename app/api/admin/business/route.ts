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
  const auth = await verifyAdmin('admin')
  if (!auth.authorized) {
    return errorResponse(auth.error, auth.message, auth.error === 'UNAUTHORIZED' ? 401 : 403)
  }

  const searchParams = request.nextUrl.searchParams
  const { page, pageSize, offset } = parsePaginationParams(searchParams)
  const tab = searchParams.get('tab') || 'pending' // pending | approved | rejected

  try {
    // 不使用 FK JOIN 查詢 users/spots，避免 FK 指向 auth.users 時 PostgREST 無法解析
    let query = supabaseAdmin
      .from('business_claims')
      .select(
        'id, business_name, contact_phone, contact_email, proof_url, notes, status, rejection_reason, created_at, reviewed_at, spot_id, user_id',
        { count: 'exact' }
      )

    if (tab === 'pending') {
      query = query.eq('status', 'pending')
    } else if (tab === 'approved') {
      query = query.eq('status', 'approved')
    } else {
      query = query.eq('status', 'rejected')
    }

    query = query
      .order('created_at', { ascending: tab === 'pending' }) // 待審：最早優先
      .range(offset, offset + pageSize - 1)

    const { data, count, error } = await query

    if (error) {
      console.error('Business query error:', error)
      return errorResponse('QUERY_ERROR', error.message, 500)
    }

    // 批次查詢關聯的 spots 和 users
    const spotIds = new Set<string>()
    const userIds = new Set<string>()
    for (const c of data || []) {
      if (c.spot_id) spotIds.add(c.spot_id)
      if (c.user_id) userIds.add(c.user_id)
    }

    const spotMap: Record<string, string> = {}
    if (spotIds.size > 0) {
      const { data: spots } = await supabaseAdmin
        .from('spots')
        .select('id, name')
        .in('id', Array.from(spotIds))
      for (const s of spots || []) {
        if (s.name) spotMap[s.id] = s.name
      }
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

    // 計算等待天數並合併資料
    const enrichedData = (data || []).map((claim) => {
      const waitDays = Math.ceil(
        (Date.now() - new Date(claim.created_at).getTime()) / (1000 * 60 * 60 * 24)
      )
      return {
        ...claim,
        wait_days: waitDays,
        spot_name: spotMap[claim.spot_id] || '—',
        applicant_name: userMap[claim.user_id] || '—',
      }
    })

    return NextResponse.json(paginatedResponse(enrichedData, count || 0, page, pageSize))
  } catch (err) {
    console.error('Business API error:', err)
    return errorResponse('INTERNAL_ERROR', '取得商家列表失敗', 500)
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await verifyAdmin('admin')
  if (!auth.authorized) {
    return errorResponse(auth.error, auth.message, auth.error === 'UNAUTHORIZED' ? 401 : 403)
  }

  try {
    const body = await request.json()
    const { claimId, action, reason } = body

    if (!claimId || !action) {
      return errorResponse('VALIDATION_ERROR', '缺少必要參數', 400)
    }

    if (!['approve', 'reject'].includes(action)) {
      return errorResponse('VALIDATION_ERROR', '不支援的操作', 400)
    }

    if (action === 'approve') {
      // 取得申請資料
      const { data: claim } = await supabaseAdmin
        .from('business_claims')
        .select('spot_id, user_id')
        .eq('id', claimId)
        .single()

      if (!claim) {
        return errorResponse('NOT_FOUND', '找不到該申請', 404)
      }

      // 更新申請狀態
      const { error: claimError } = await supabaseAdmin
        .from('business_claims')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: auth.user.id,
        })
        .eq('id', claimId)

      if (claimError) return errorResponse('UPDATE_ERROR', claimError.message, 500)

      // 更新地標的 claimed_by
      await supabaseAdmin
        .from('spots')
        .update({
          claimed_by: claim.user_id,
          claimed_at: new Date().toISOString(),
          is_claimed: true,
        })
        .eq('id', claim.spot_id)

      // 更新用戶角色為商家
      await supabaseAdmin
        .from('users')
        .update({ role: 'business' })
        .eq('id', claim.user_id)

      await logAdminAction({
        adminId: auth.user.id,
        action: 'approve_business',
        targetType: 'business_claim',
        targetId: claimId,
      })
    } else {
      // 拒絕
      if (!reason) {
        return errorResponse('VALIDATION_ERROR', '請填寫拒絕原因', 400)
      }

      const { error } = await supabaseAdmin
        .from('business_claims')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          reviewed_at: new Date().toISOString(),
          reviewed_by: auth.user.id,
        })
        .eq('id', claimId)

      if (error) return errorResponse('UPDATE_ERROR', error.message, 500)

      await logAdminAction({
        adminId: auth.user.id,
        action: 'reject_business',
        targetType: 'business_claim',
        targetId: claimId,
        details: { reason },
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Business PATCH error:', err)
    return errorResponse('INTERNAL_ERROR', '操作失敗', 500)
  }
}
