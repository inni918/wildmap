'use client'

import { useEffect, useState, useCallback } from 'react'
import { adminFetch } from '@/lib/admin-fetch'

type Spot = {
  id: string
  name: string
  address: string | null
  city: string
  category: string
  status: string
  quality: string
  created_by: string | null
  creator_name: string | null
  created_at: string
  view_count: number
  gov_certified: boolean | null
  rating: { avg: number; count: number } | null
}

type Pagination = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

const QUALITY_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: '🟡 新建', color: 'bg-yellow-100 text-yellow-800' },
  verified: { label: '🟢 社群驗證', color: 'bg-green-100 text-green-800' },
  featured: { label: '⭐ 精選', color: 'bg-amber-100 text-amber-800' },
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  published: { label: '已發布', color: 'text-[var(--color-success)]' },
  hidden: { label: '隱藏', color: 'text-[var(--color-warning)]' },
  closed: { label: '關閉', color: 'text-[var(--color-error)]' },
}

export default function AdminSpotsPage() {
  const [spots, setSpots] = useState<Spot[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 25,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [qualityFilter, setQualityFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [fetchError, setFetchError] = useState('')
  const [actionModal, setActionModal] = useState<{
    type: 'status' | 'quality'
    spot: Spot
  } | null>(null)
  const [actionValue, setActionValue] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const fetchSpots = useCallback(
    async (page = 1) => {
      setLoading(true)
      const params = new URLSearchParams({
        page: String(page),
        pageSize: '25',
      })
      if (search) params.set('search', search)
      if (qualityFilter) params.set('quality', qualityFilter)
      if (statusFilter) params.set('status', statusFilter)
      if (sourceFilter) params.set('source', sourceFilter)

      const res = await adminFetch(`/api/admin/spots?${params}`)
      const data = await res.json()
      if (data.error) {
        setFetchError(`${data.error.code}: ${data.error.message}`)
        setLoading(false)
        return
      }
      if (data.data) {
        setFetchError('')
        setSpots(data.data)
        setPagination(data.pagination)
      }
      setLoading(false)
    },
    [search, qualityFilter, statusFilter, sourceFilter]
  )

  useEffect(() => {
    fetchSpots(1)
  }, [fetchSpots])

  const handleAction = async () => {
    if (!actionModal) return
    setActionLoading(true)

    const res = await adminFetch('/api/admin/spots', {
      method: 'PATCH',
      body: JSON.stringify({
        spotId: actionModal.spot.id,
        action: actionModal.type === 'status' ? 'changeStatus' : 'changeQuality',
        value: actionValue,
      }),
    })
    const data = await res.json()
    if (data.success) {
      setActionModal(null)
      setActionValue('')
      fetchSpots(pagination.page)
    }
    setActionLoading(false)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">🏕️ 地標管理</h1>

      {/* 篩選列 */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="🔍 搜尋地標名稱或地址..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        <select
          value={qualityFilter}
          onChange={(e) => setQualityFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm cursor-pointer"
        >
          <option value="">全部品質</option>
          <option value="new">新建</option>
          <option value="verified">社群驗證</option>
          <option value="featured">精選</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm cursor-pointer"
        >
          <option value="">全部狀態</option>
          <option value="published">已發布</option>
          <option value="hidden">隱藏</option>
          <option value="closed">關閉</option>
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm cursor-pointer"
        >
          <option value="">全部來源</option>
          <option value="user">用戶建立</option>
          <option value="seed">系統種子</option>
        </select>
      </div>

      {/* 表格 */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]">
                <th className="text-left px-4 py-3 font-medium">名稱</th>
                <th className="text-left px-4 py-3 font-medium">縣市</th>
                <th className="text-left px-4 py-3 font-medium">評分</th>
                <th className="text-left px-4 py-3 font-medium">品質</th>
                <th className="text-left px-4 py-3 font-medium">狀態</th>
                <th className="text-left px-4 py-3 font-medium">建立者</th>
                <th className="text-left px-4 py-3 font-medium">建立日期</th>
                <th className="text-left px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[var(--color-text-secondary)]">
                    載入中...
                  </td>
                </tr>
              ) : fetchError ? (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <div className="text-red-600 font-medium mb-2">⚠️ {fetchError}</div>
                    <p className="text-sm text-[var(--color-text-secondary)]">請確認已登入且具有管理員權限</p>
                    <button onClick={() => { setFetchError(''); fetchSpots(1); }} className="mt-2 text-sm text-[var(--color-primary)] hover:underline cursor-pointer">重試</button>
                  </td>
                </tr>
              ) : spots.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[var(--color-text-secondary)]">
                    沒有找到符合條件的地標
                  </td>
                </tr>
              ) : (
                spots.map((spot) => (
                  <tr
                    key={spot.id}
                    className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-alt)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium">{spot.name}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">{spot.city}</td>
                    <td className="px-4 py-3">
                      {spot.rating ? (
                        <span>
                          ⭐ {spot.rating.avg}
                          <span className="text-xs text-[var(--color-text-secondary)] ml-1">
                            ({spot.rating.count})
                          </span>
                        </span>
                      ) : (
                        <span className="text-[var(--color-text-secondary)]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          QUALITY_LABELS[spot.quality]?.color || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {QUALITY_LABELS[spot.quality]?.label || spot.quality}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={STATUS_LABELS[spot.status]?.color || ''}>
                        {STATUS_LABELS[spot.status]?.label || spot.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {spot.created_by ? spot.creator_name || '用戶' : '系統種子'}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {new Date(spot.created_at).toLocaleDateString('zh-TW')}
                    </td>
                    <td className="px-4 py-3">
                      <SpotActions
                        spot={spot}
                        onAction={(type) => {
                          setActionModal({ type, spot })
                          if (type === 'status') setActionValue(spot.status)
                          if (type === 'quality') setActionValue(spot.quality)
                        }}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分頁 */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)]">
            <span className="text-sm text-[var(--color-text-secondary)]">
              第 {(pagination.page - 1) * pagination.pageSize + 1}-
              {Math.min(pagination.page * pagination.pageSize, pagination.total)} 筆，共{' '}
              {pagination.total} 筆
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => fetchSpots(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1 rounded border border-[var(--color-border)] text-sm disabled:opacity-30 hover:bg-[var(--color-surface-alt)] cursor-pointer"
              >
                ‹ 上一頁
              </button>
              <button
                onClick={() => fetchSpots(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1 rounded border border-[var(--color-border)] text-sm disabled:opacity-30 hover:bg-[var(--color-surface-alt)] cursor-pointer"
              >
                下一頁 ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 操作 Modal */}
      {actionModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4">
            <h3 className="text-lg font-bold mb-4">
              {actionModal.type === 'status' ? '變更狀態' : '變更品質等級'}
            </h3>

            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              地標：<strong>{actionModal.spot.name}</strong>
            </p>

            {actionModal.type === 'status' ? (
              <select
                value={actionValue}
                onChange={(e) => setActionValue(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm mb-4 cursor-pointer"
              >
                <option value="published">已發布</option>
                <option value="hidden">隱藏</option>
                <option value="closed">關閉</option>
              </select>
            ) : (
              <select
                value={actionValue}
                onChange={(e) => setActionValue(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm mb-4 cursor-pointer"
              >
                <option value="new">新建</option>
                <option value="verified">社群驗證</option>
                <option value="featured">精選</option>
              </select>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setActionModal(null)
                  setActionValue('')
                }}
                className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm hover:bg-[var(--color-surface-alt)] cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleAction}
                disabled={actionLoading}
                className="px-4 py-2 rounded-lg text-sm text-white font-medium bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] disabled:opacity-50 cursor-pointer"
              >
                {actionLoading ? '處理中...' : '確認'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SpotActions({
  spot,
  onAction,
}: {
  spot: Spot
  onAction: (type: 'status' | 'quality') => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-2 py-1 rounded hover:bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] cursor-pointer"
      >
        ⋯
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-[var(--color-border)] py-1 z-40">
            <button
              onClick={() => {
                setOpen(false)
                onAction('status')
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--color-surface-alt)] cursor-pointer"
            >
              變更狀態
            </button>
            <button
              onClick={() => {
                setOpen(false)
                onAction('quality')
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--color-surface-alt)] cursor-pointer"
            >
              變更品質
            </button>
          </div>
        </>
      )}
    </div>
  )
}
