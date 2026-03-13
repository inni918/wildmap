import { NextRequest, NextResponse } from 'next/server'
import { cookies, headers } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { supabaseAdmin } from '@/lib/supabase/admin'

/**
 * POST /api/feedback
 * 接收 type, description，插入 feedback 表
 * user_id 從 session 取（未登入也允許，user_id 為 null）
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, description } = body

    // 驗證 type
    const validTypes = ['bug', 'suggestion', 'other']
    if (!type || !validTypes.includes(type)) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: '請選擇回饋類型' } },
        { status: 400 }
      )
    }

    // 驗證 description
    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: '請填寫描述' } },
        { status: 400 }
      )
    }

    const trimmed = description.trim()
    if (trimmed.length < 10 || trimmed.length > 500) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: '描述長度需在 10-500 字之間' } },
        { status: 400 }
      )
    }

    // 嘗試取得當前用戶（可能未登入）
    let userId: string | null = null

    // 優先從 Authorization header 讀取
    const headerStore = await headers()
    const authHeader = headerStore.get('authorization') || headerStore.get('Authorization')
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (bearerToken) {
      const { data, error } = await supabaseAdmin.auth.getUser(bearerToken)
      if (!error && data.user) {
        userId = data.user.id
      }
    }

    // Fallback：從 cookies 讀取
    if (!userId) {
      const cookieStore = await cookies()
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll()
            },
            setAll() {},
          },
        }
      )
      const { data, error } = await supabase.auth.getUser()
      if (!error && data.user) {
        userId = data.user.id
      }
    }

    // 插入 feedback
    const { data: feedback, error: insertError } = await supabaseAdmin
      .from('feedback')
      .insert({
        user_id: userId,
        type,
        description: trimmed,
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('Feedback insert error:', insertError)
      return NextResponse.json(
        { error: { code: 'INSERT_ERROR', message: '送出失敗，請稍後再試' } },
        { status: 500 }
      )
    }

    // 成就檢查提示（前端會自行觸發 checkAchievements）
    // 這裡回傳 feedbackCount 讓前端判斷是否要觸發成就
    let feedbackCount = 0
    if (userId) {
      const { count } = await supabaseAdmin
        .from('feedback')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)

      feedbackCount = count || 0
    }

    return NextResponse.json({
      success: true,
      id: feedback.id,
      feedbackCount,
      isBugReport: type === 'bug',
    })
  } catch (err) {
    console.error('Feedback API error:', err)
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } },
      { status: 500 }
    )
  }
}
