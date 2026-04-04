import { requireAuth } from '@/lib/api/auth'
import { createClient } from '@/lib/supabase/server'
import { apiSuccess, apiError } from '@/lib/api/response'
import { triggerAchievements } from '@/lib/achievements/trigger'

// Haversine 距離計算（公尺）
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

export async function POST(request: Request) {
  const { user, error } = await requireAuth()
  if (error) return error

  const { spot_id, lat, lng, accuracy } = await request.json()
  if (!spot_id || lat === undefined || lng === undefined) return apiError('缺少必要欄位')

  const supabase = await createClient()

  // 取得地標座標
  const { data: spot } = await supabase
    .from('spots')
    .select('lat, lng, name')
    .eq('id', spot_id)
    .single()

  if (!spot) return apiError('找不到地標')

  // 計算距離，驗證是否在 500m 內
  const distance = haversineDistance(lat, lng, spot.lat, spot.lng)
  const verified = distance <= 500

  // 記錄打卡
  const { data: checkin, error: dbError } = await supabase
    .from('check_ins')
    .insert({ spot_id, user_id: user!.id, lat, lng, accuracy: accuracy || null, verified })
    .select()
    .single()

  if (dbError) return apiError('打卡失敗')

  // fire-and-forget 成就觸發
  triggerAchievements({ userId: user!.id, event: 'checkin' })

  return apiSuccess({
    checkin,
    verified,
    distance: Math.round(distance),
    message: verified ? `打卡成功！距離 ${Math.round(distance)}m` : `距離太遠（${Math.round(distance)}m），需在 500m 內`
  }, 201)
}
