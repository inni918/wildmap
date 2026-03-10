'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import FavoriteButton from './FavoriteButton'

// 台灣縣市鄉鎮正規表達式
// 匹配「台灣新竹縣尖石鄉」中的「新竹縣尖石鄉」
function extractRegion(address?: string): string {
  if (!address) return ''
  // 移除開頭的「台灣」或「臺灣」
  const cleaned = address.replace(/^(台灣|臺灣)/, '')
  // 匹配「縣市 + 鄉鎮市區」兩層
  const match = cleaned.match(
    /([台臺]北市|新北市|桃園市|台中市|臺中市|台南市|臺南市|高雄市|基隆市|新竹市|嘉義市|新竹縣|苗栗縣|彰化縣|南投縣|雲林縣|嘉義縣|屏東縣|宜蘭縣|花蓮縣|台東縣|臺東縣|澎湖縣|金門縣|連江縣)([^\s\d,，、-]{2,5}[鄉鎮市區])/
  )
  if (match) return `${match[1]}${match[2]}`
  // fallback：取前兩個地名詞（最多 8 字）
  const fallback = cleaned.slice(0, 8).match(/^(.{3,8})/)
  return fallback ? fallback[1] : cleaned.slice(0, 6)
}

// 帳篷 SVG icon
function TentIcon({ size = 18, color = 'currentColor', strokeWidth = 1.5 }: { size?: number; color?: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9,1 1,15 17,15" />
      <line x1="1" y1="15" x2="17" y2="15" />
      <path d="M6.5,15 Q6.5,10 9,10 Q11.5,10 11.5,15" />
      <line x1="5" y1="15" x2="7" y2="10.5" />
      <line x1="13" y1="15" x2="11" y2="10.5" />
    </svg>
  )
}

// 導航箭頭 SVG
function NavigateIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3,11 22,2 13,21 11,13 3,11" />
    </svg>
  )
}

// 盾牌 SVG icon
function ShieldIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#15803d">
      <path d="M12 2L4 6v6c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V6l-8-4z" />
    </svg>
  )
}

type SpotSummary = {
  id: string
  name: string
  category: string
  latitude: number
  longitude: number
  is_free: boolean | null
  gov_certified: boolean | null
  quality: string
  status: string
  address?: string
}

interface Props {
  spot: SpotSummary
  onClose: () => void
  onOpenDetail: (spotId: string) => void
}

export default function BottomSheetCard({ spot, onClose, onOpenDetail }: Props) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [photoLoading, setPhotoLoading] = useState(true)
  const [ratingInfo, setRatingInfo] = useState<{ avg: number; count: number } | null>(null)
  const [visible, setVisible] = useState(false)

  // Animate in on mount
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  // Fetch first photo from spot_images
  useEffect(() => {
    let cancelled = false
    async function fetchPhoto() {
      setPhotoLoading(true)
      const { data } = await supabase
        .from('spot_images')
        .select('url')
        .eq('spot_id', spot.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle()
      if (!cancelled) {
        setPhotoUrl(data?.url ?? null)
        setPhotoLoading(false)
      }
    }
    fetchPhoto()
    return () => { cancelled = true }
  }, [spot.id])

  // Fetch rating
  useEffect(() => {
    let cancelled = false
    async function fetchRating() {
      const { data } = await supabase
        .from('ratings')
        .select('score')
        .eq('spot_id', spot.id)
      if (!cancelled && data && data.length > 0) {
        const total = data.reduce((sum: number, r: { score: number }) => sum + r.score, 0)
        setRatingInfo({ avg: total / data.length, count: data.length })
      } else if (!cancelled) {
        setRatingInfo({ avg: 0, count: 0 })
      }
    }
    fetchRating()
    return () => { cancelled = true }
  }, [spot.id])

  const isSuspended = spot.status === 'suspended'
  const isFree = spot.is_free === true
  const region = extractRegion(spot.address)

  const handleCardClick = () => {
    onOpenDetail(spot.id)
  }

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`,
      '_blank'
    )
  }

  return (
    <div
      className="fixed z-50"
      style={{
        bottom: 16,
        left: 24,
        right: 24,
        transform: visible ? 'translateY(0)' : 'translateY(110%)',
        transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
      }}
    >
      <div
        onClick={handleCardClick}
        className="bg-white rounded-[20px] overflow-hidden cursor-pointer"
        style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.18)' }}
      >
        {/* 拖曳把手 */}
        <div
          style={{
            width: 32,
            height: 3,
            background: photoUrl ? 'rgba(255,255,255,0.5)' : '#e5e7eb',
            borderRadius: 2,
            margin: '8px auto 0',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5,
          }}
        />

        {/* 照片橫幅 */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            height: 150,
            filter: isSuspended ? 'grayscale(1) opacity(0.55)' : undefined,
          }}
        >
          {photoLoading ? (
            // loading placeholder
            <div className="w-full h-full bg-gray-100 animate-pulse" />
          ) : photoUrl ? (
            <img
              src={photoUrl}
              alt={spot.name}
              className="w-full h-full object-cover"
            />
          ) : (
            // 無照片：品牌漸層
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #2D6A4F 0%, #40916C 50%, #52B788 100%)',
              }}
            >
              <div style={{ opacity: 0.4 }}>
                <TentIcon size={36} color="white" strokeWidth={1.4} />
              </div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                成為第一個上傳照片的人
              </span>
            </div>
          )}

          {/* 右上角愛心：毛玻璃圓形容器 + FavoriteButton */}
          <div
            className="absolute top-[10px] right-[10px] z-10"
            style={{ width: 36, height: 36 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: 'rgba(0,0,0,0.32)', backdropFilter: 'blur(4px)' }}
            />
            <div className="relative flex items-center justify-center w-full h-full">
              <FavoriteButton spotId={spot.id} />
            </div>
          </div>

          {/* 右下角導航按鈕 */}
          <button
            onClick={handleNavigate}
            className="absolute bottom-[10px] right-[10px] z-10 flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.32)',
              backdropFilter: 'blur(4px)',
              border: 'none',
              cursor: 'pointer',
            }}
            title="導航"
          >
            <NavigateIcon />
          </button>

          {/* 左下角分類標籤 */}
          {!isSuspended && (
            <div
              className="absolute bottom-[10px] left-[10px] z-10 flex items-center gap-1 px-[10px] py-1"
              style={{
                borderRadius: 20,
                background: isFree ? 'rgba(217,119,6,0.88)' : 'rgba(45,106,79,0.88)',
                fontSize: 11,
                fontWeight: 700,
                color: 'white',
                backdropFilter: 'blur(8px)',
              }}
            >
              <TentIcon size={13} color="white" strokeWidth={1.5} />
              {isFree ? '免費露營地' : '付費露營地'}
            </div>
          )}
          {isSuspended && (
            <div
              className="absolute bottom-[10px] left-[10px] z-10 flex items-center gap-1 px-[10px] py-1"
              style={{
                borderRadius: 20,
                background: 'rgba(107,114,128,0.75)',
                fontSize: 11,
                fontWeight: 700,
                color: 'white',
                backdropFilter: 'blur(8px)',
              }}
            >
              <TentIcon size={13} color="white" strokeWidth={1.5} />
              {isFree ? '免費露營地' : '付費露營地'}
            </div>
          )}
        </div>

        {/* 資訊區 */}
        <div style={{ padding: '10px 14px 14px' }}>
          {/* 地標名稱 */}
          <div
            className="font-bold text-base leading-snug mb-1"
            style={{ color: isSuspended ? '#9ca3af' : '#111' }}
          >
            {spot.name}
          </div>

          {/* 評分行 */}
          <div className="flex items-center gap-1.5 flex-wrap" style={{ fontSize: 12 }}>
            {isSuspended ? (
              <span style={{ color: '#ef4444', fontWeight: 600, fontSize: 12 }}>⚠️ 暫停營業</span>
            ) : ratingInfo === null ? (
              // loading
              <span style={{ color: '#9ca3af' }}>載入中…</span>
            ) : ratingInfo.count > 0 ? (
              <div className="flex items-center gap-1">
                <span style={{ fontSize: 15, fontWeight: 800, color: '#111' }}>{ratingInfo.avg.toFixed(1)}</span>
                <span style={{ color: '#f59e0b', fontSize: 13 }}>★</span>
                <span style={{ color: '#9ca3af', fontSize: 11 }}>({ratingInfo.count})</span>
              </div>
            ) : (
              <span style={{ color: '#9ca3af', fontSize: 12 }}>尚無評分</span>
            )}

            {/* 盾牌圖示（gov_certified） */}
            {spot.gov_certified && !isSuspended && (
              <>
                <span style={{ color: '#d1d5db', fontSize: 10 }}>·</span>
                <ShieldIcon />
              </>
            )}

            {/* 縣市鄉鎮 */}
            {region && (
              <>
                <span style={{ color: '#d1d5db', fontSize: 10 }}>·</span>
                <span style={{ color: '#6b7280', fontSize: 12 }}>{region}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
