import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { verifyAdmin, errorResponse } from '@/lib/admin-auth'

export async function GET() {
  const auth = await verifyAdmin('moderator')
  if (!auth.authorized) {
    return errorResponse(auth.error, auth.message, auth.error === 'UNAUTHORIZED' ? 401 : 403)
  }

  try {
    // 並行查詢所有統計
    const [
      usersCount,
      spotsCount,
      pendingBusiness,
      pendingReports,
      userGrowth,
      recentComments,
    ] = await Promise.all([
      // 總用戶數
      supabaseAdmin.from('users').select('id', { count: 'exact', head: true }),

      // 總地標數（已發布）
      supabaseAdmin
        .from('spots')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published'),

      // 待審商家
      supabaseAdmin
        .from('business_claims')
        .select('id, created_at', { count: 'exact' })
        .eq('status', 'pending'),

      // 待處理檢舉
      supabaseAdmin
        .from('reports')
        .select('id, created_at', { count: 'exact' })
        .eq('status', 'pending'),

      // 30 天用戶增長
      supabaseAdmin
        .from('users')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true }),

      // 最新 5 筆評論
      supabaseAdmin
        .from('comments')
        .select('id, content, rating, created_at, user_id, spot_id, users(display_name), spots(name)')
        .order('created_at', { ascending: false })
        .limit(5),
    ])

    // 整理 30 天用戶增長資料（按日分組）
    const growthMap: Record<string, number> = {}
    const now = new Date()
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      growthMap[d.toISOString().split('T')[0]] = 0
    }
    userGrowth.data?.forEach((u) => {
      const day = u.created_at.split('T')[0]
      if (growthMap[day] !== undefined) growthMap[day]++
    })
    const growthData = Object.entries(growthMap).map(([date, count]) => ({
      date,
      count,
    }))

    // 待審商家最早等待天數
    let oldestBusinessDays = 0
    if (pendingBusiness.data && pendingBusiness.data.length > 0) {
      const oldest = pendingBusiness.data.reduce((a, b) =>
        new Date(a.created_at) < new Date(b.created_at) ? a : b
      )
      oldestBusinessDays = Math.ceil(
        (Date.now() - new Date(oldest.created_at).getTime()) / (1000 * 60 * 60 * 24)
      )
    }

    // 待處理檢舉最早天數
    let oldestReportDays = 0
    if (pendingReports.data && pendingReports.data.length > 0) {
      const oldest = pendingReports.data.reduce((a, b) =>
        new Date(a.created_at) < new Date(b.created_at) ? a : b
      )
      oldestReportDays = Math.ceil(
        (Date.now() - new Date(oldest.created_at).getTime()) / (1000 * 60 * 60 * 24)
      )
    }

    return NextResponse.json({
      kpi: {
        totalUsers: usersCount.count || 0,
        totalSpots: spotsCount.count || 0,
        pendingBusiness: pendingBusiness.count || 0,
        pendingReports: pendingReports.count || 0,
        oldestBusinessDays,
        oldestReportDays,
      },
      userGrowth: growthData,
      recentComments: recentComments.data || [],
    })
  } catch (err) {
    console.error('Dashboard stats error:', err)
    return errorResponse('INTERNAL_ERROR', '取得統計資料失敗', 500)
  }
}
