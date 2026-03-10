'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminFetch } from '@/lib/admin-fetch'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type DashboardStats = {
  kpi: {
    totalUsers: number
    totalSpots: number
    pendingBusiness: number
    pendingReports: number
    oldestBusinessDays: number
    oldestReportDays: number
  }
  userGrowth: { date: string; count: number }[]
  recentComments: {
    id: string
    content: string
    rating: number
    created_at: string
    users: { display_name: string } | null
    spots: { name: string } | null
  }[]
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminFetch('/api/admin/dashboard/stats')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error)
        } else {
          setStats(data)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--color-text-secondary)]">載入中...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-[var(--color-error)]">
        無法載入統計資料
      </div>
    )
  }

  const { kpi, userGrowth, recentComments } = stats

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon="👥"
          label="總用戶數"
          value={kpi.totalUsers.toLocaleString()}
        />
        <KpiCard
          icon="🏕️"
          label="總地標數"
          value={kpi.totalSpots.toLocaleString()}
        />
        <KpiCard
          icon="🏪"
          label="待審商家"
          value={`${kpi.pendingBusiness} 筆`}
          urgent={kpi.pendingBusiness > 0}
          sub={kpi.pendingBusiness > 0 ? `最早 ${kpi.oldestBusinessDays} 天前` : undefined}
        />
        <KpiCard
          icon="🚩"
          label="待處理檢舉"
          value={`${kpi.pendingReports} 件`}
          urgent={kpi.pendingReports > 0}
          sub={kpi.pendingReports > 0 ? `最早 ${kpi.oldestReportDays} 天前` : undefined}
        />
      </div>

      {/* 用戶增長圖表 + 待辦事項 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 用戶增長折線圖 */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--color-border)] p-5">
          <h2 className="text-base font-semibold mb-4">📈 用戶增長趨勢（30 天）</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v: string) => v.slice(5)}
                />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 待辦事項 */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
          <h2 className="text-base font-semibold mb-4">⚡ 待辦事項</h2>
          <div className="space-y-3">
            {kpi.pendingBusiness > 0 ? (
              <TodoItem
                icon="🏪"
                label={`${kpi.pendingBusiness} 筆商家認證等待審核`}
                sub={`最早 ${kpi.oldestBusinessDays} 天前`}
                href="/admin/business"
                urgent
              />
            ) : null}
            {kpi.pendingReports > 0 ? (
              <TodoItem
                icon="🚩"
                label={`${kpi.pendingReports} 件檢舉未處理`}
                sub={`最早 ${kpi.oldestReportDays} 天前`}
                href="/admin/reports"
                urgent
              />
            ) : null}
            {kpi.pendingBusiness === 0 && kpi.pendingReports === 0 && (
              <div className="text-center py-8 text-[var(--color-text-secondary)]">
                ✅ 無待辦事項
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 最新評論 */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
        <h2 className="text-base font-semibold mb-4">💬 最新評論</h2>
        {recentComments.length === 0 ? (
          <div className="text-center py-6 text-[var(--color-text-secondary)]">
            尚無評論
          </div>
        ) : (
          <div className="space-y-3">
            {recentComments.map((c) => (
              <div
                key={c.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">
                      {c.users?.display_name || '匿名'}
                    </span>
                    <span className="text-[var(--color-text-secondary)]">→</span>
                    <span className="text-[var(--color-primary)] truncate">
                      {c.spots?.name || '未知地標'}
                    </span>
                    {c.rating && (
                      <span className="text-yellow-500 text-xs">
                        {'⭐'.repeat(c.rating)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-0.5 truncate">
                    {c.content}
                  </p>
                </div>
                <span className="text-xs text-[var(--color-text-secondary)] whitespace-nowrap">
                  {formatTimeAgo(c.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function KpiCard({
  icon,
  label,
  value,
  urgent,
  sub,
}: {
  icon: string
  label: string
  value: string
  urgent?: boolean
  sub?: string
}) {
  return (
    <div
      className={`bg-white rounded-xl border p-5 ${
        urgent
          ? 'border-[var(--color-error)] bg-red-50'
          : 'border-[var(--color-border)]'
      }`}
    >
      <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mb-2">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {sub && (
        <div className="text-xs text-[var(--color-text-secondary)] mt-1">
          {sub}
        </div>
      )}
    </div>
  )
}

function TodoItem({
  icon,
  label,
  sub,
  href,
  urgent,
}: {
  icon: string
  label: string
  sub: string
  href: string
  urgent?: boolean
}) {
  return (
    <Link
      href={href}
      className={`block p-3 rounded-lg border no-underline transition-colors ${
        urgent
          ? 'border-[var(--color-error)] bg-red-50 hover:bg-red-100'
          : 'border-[var(--color-border)] hover:bg-[var(--color-surface-alt)]'
      }`}
    >
      <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text)]">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="text-xs text-[var(--color-text-secondary)] mt-0.5 ml-6">
        {sub}
      </div>
    </Link>
  )
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '剛才'
  if (mins < 60) return `${mins} 分鐘前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} 小時前`
  const days = Math.floor(hours / 24)
  return `${days} 天前`
}
