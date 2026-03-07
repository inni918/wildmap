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
  const quality = searchParams.get('quality') || ''
  const status = searchParams.get('status') || ''
  const source = searchParams.get('source') || ''
  const sort = searchParams.get('sort') || 'created_at'
  const order = searchParams.get('order') || 'desc'

  try {
    let query = supabaseAdmin
      .from('spots')
      .select(
        'id, name, address, category, status, quality, created_by, created_at, view_count, gov_certified, users(display_name)',
        { count: 'exact' }
      )

    // 篩選
    if (search) {
      query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%`)
    }
    if (quality) {
      query = query.eq('quality', quality)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (source === 'seed') {
      query = query.is('created_by', null)
    } else if (source === 'user') {
      query = query.not('created_by', 'is', null)
    }

    query = query
      .order(sort, { ascending: order === 'asc' })
      .range(offset, offset + pageSize - 1)

    const { data, count, error } = await query

    if (error) {
      console.error('Spots query error:', error)
      return errorResponse('QUERY_ERROR', error.message, 500)
    }

    // 取得平均評分（用個別查詢）
    const spotIds = (data || []).map((s) => s.id)
    let ratingsMap: Record<string, { avg: number; count: number }> = {}

    if (spotIds.length > 0) {
      const { data: comments } = await supabaseAdmin
        .from('comments')
        .select('spot_id, rating')
        .in('spot_id', spotIds)
        .not('rating', 'is', null)

      if (comments) {
        const grouped: Record<string, number[]> = {}
        comments.forEach((c) => {
          if (!grouped[c.spot_id]) grouped[c.spot_id] = []
          grouped[c.spot_id].push(c.rating)
        })
        ratingsMap = Object.fromEntries(
          Object.entries(grouped).map(([id, ratings]) => [
            id,
            {
              avg: Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10,
              count: ratings.length,
            },
          ])
        )
      }
    }

    // 從 address 提取縣市
    const enrichedData = (data || []).map((spot) => {
      const cityMatch = spot.address?.match(
        /(台北市|新北市|桃園市|台中市|台南市|高雄市|基隆市|新竹市|嘉義市|新竹縣|苗栗縣|彰化縣|南投縣|雲林縣|嘉義縣|屏東縣|宜蘭縣|花蓮縣|台東縣|澎湖縣|金門縣|連江縣)/
      )
      // Supabase join 可能回傳 object 或 array，安全取值
      const usersData = spot.users as unknown
      const creatorName =
        usersData && typeof usersData === 'object' && !Array.isArray(usersData)
          ? (usersData as { display_name: string }).display_name
          : Array.isArray(usersData) && usersData.length > 0
          ? (usersData[0] as { display_name: string }).display_name
          : null
      return {
        ...spot,
        city: cityMatch?.[1] || '—',
        rating: ratingsMap[spot.id] || null,
        creator_name: creatorName,
      }
    })

    return NextResponse.json(paginatedResponse(enrichedData, count || 0, page, pageSize))
  } catch (err) {
    console.error('Spots API error:', err)
    return errorResponse('INTERNAL_ERROR', '取得地標列表失敗', 500)
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await verifyAdmin('moderator')
  if (!auth.authorized) {
    return errorResponse(auth.error, auth.message, auth.error === 'UNAUTHORIZED' ? 401 : 403)
  }

  try {
    const body = await request.json()
    const { spotId, action, value } = body

    if (!spotId || !action) {
      return errorResponse('VALIDATION_ERROR', '缺少必要參數', 400)
    }

    switch (action) {
      case 'changeStatus': {
        const validStatuses = ['published', 'hidden', 'closed']
        if (!validStatuses.includes(value)) {
          return errorResponse('VALIDATION_ERROR', '無效的狀態', 400)
        }
        const { error } = await supabaseAdmin
          .from('spots')
          .update({ status: value })
          .eq('id', spotId)
        if (error) return errorResponse('UPDATE_ERROR', error.message, 500)

        await logAdminAction({
          adminId: auth.user.id,
          action: 'change_spot_status',
          targetType: 'spot',
          targetId: spotId,
          details: { newStatus: value },
        })
        break
      }

      case 'changeQuality': {
        const validQualities = ['new', 'verified', 'featured']
        if (!validQualities.includes(value)) {
          return errorResponse('VALIDATION_ERROR', '無效的品質等級', 400)
        }
        const { error } = await supabaseAdmin
          .from('spots')
          .update({ quality: value })
          .eq('id', spotId)
        if (error) return errorResponse('UPDATE_ERROR', error.message, 500)

        await logAdminAction({
          adminId: auth.user.id,
          action: 'change_spot_quality',
          targetType: 'spot',
          targetId: spotId,
          details: { newQuality: value },
        })
        break
      }

      default:
        return errorResponse('VALIDATION_ERROR', '不支援的操作', 400)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Spots PATCH error:', err)
    return errorResponse('INTERNAL_ERROR', '操作失敗', 500)
  }
}
