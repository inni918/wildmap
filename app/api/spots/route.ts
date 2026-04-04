import { createClient } from '@/lib/supabase/server'
import { apiSuccess, apiError } from '@/lib/api/response'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'camping'
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = await createClient()
    const { data, error, count } = await supabase
      .from('spots')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .eq('category', category)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (error) throw error

    return apiSuccess({ spots: data, total: count, offset, limit })
  } catch (err) {
    return apiError('取得地標失敗')
  }
}
