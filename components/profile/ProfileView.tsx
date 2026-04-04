'use client'

import { User } from '@supabase/supabase-js'
import { MapPin, Star, MessageCircle, Camera, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const LEVEL_LABELS = ['', '探索者', '開拓者', '嚮導', '守護者', '先驅者']
const TIER_COLORS = {
  bronze: 'text-amber-600 bg-amber-50',
  silver: 'text-gray-500 bg-gray-50',
  gold: 'text-yellow-500 bg-yellow-50',
  none: 'text-gray-300 bg-gray-50'
}

interface ProfileViewProps {
  user: User
  profile: Record<string, unknown> | null
  achievements: Array<Record<string, unknown>>
  stats: Record<string, number> | null
}

export default function ProfileView({ user, profile, achievements, stats }: ProfileViewProps) {
  const level = (profile?.level as number) || 1
  const displayName = (profile?.display_name as string) || user.email?.split('@')[0] || '新用戶'
  const unlockedAchievements = achievements.filter(a => a.tier_unlocked !== 'none')

  return (
    <div className="min-h-screen bg-brand-beige">
      <div className="bg-white shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="text-gray-500 hover:text-gray-700">← 返回</Link>
          <h1 className="font-semibold text-gray-900">個人資料</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 基本資訊卡 */}
        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-beige flex items-center justify-center text-2xl">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url as string} className="w-full h-full rounded-full object-cover" alt="" />
              ) : '🏕️'}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900">{displayName}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs bg-brand-green text-white px-2 py-0.5 rounded-full">
                  Lv{level} {LEVEL_LABELS[level]}
                </span>
                <span className="text-xs text-gray-400">{(profile?.total_score as number) || 0} 積分</span>
              </div>
              {typeof profile?.bio === 'string' && profile.bio && <p className="text-sm text-gray-600 mt-1">{profile.bio}</p>}
            </div>
          </div>
        </div>

        {/* 統計 */}
        <div className="bg-white rounded-2xl p-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">貢獻統計</h3>
          <div className="grid grid-cols-4 gap-3 text-center">
            {[
              { icon: CheckCircle, label: '打卡', value: stats?.checkins_count || 0 },
              { icon: MessageCircle, label: '留言', value: stats?.comments_count || 0 },
              { icon: Star, label: '評分', value: stats?.ratings_count || 0 },
              { icon: Camera, label: '照片', value: stats?.photos_count || 0 },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <Icon size={20} className="mx-auto text-brand-green mb-1" />
                <div className="text-lg font-bold text-gray-900">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 成就牆 */}
        <div className="bg-white rounded-2xl p-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">
            成就 <span className="text-brand-green">{unlockedAchievements.length}</span>
          </h3>
          {unlockedAchievements.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">開始你的露營旅程來解鎖成就！</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {unlockedAchievements.map((ua) => {
                const ach = ua.achievements as Record<string, unknown>
                const tier = ua.tier_unlocked as string
                return (
                  <div key={ua.id as string}
                    className={`rounded-xl p-3 text-center ${TIER_COLORS[tier as keyof typeof TIER_COLORS] || TIER_COLORS.none}`}>
                    <div className="text-2xl mb-1">🏅</div>
                    <div className="text-xs font-medium leading-tight">{ach?.name as string}</div>
                    <div className="text-xs mt-0.5 capitalize opacity-70">{tier}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 登出按鈕 */}
        <form action="/api/auth/signout" method="POST">
          <button type="submit"
            className="w-full py-3 border border-red-200 text-red-500 rounded-xl text-sm hover:bg-red-50 transition-colors">
            登出
          </button>
        </form>
      </div>
    </div>
  )
}
