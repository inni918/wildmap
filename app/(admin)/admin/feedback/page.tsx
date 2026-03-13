'use client'

import { useEffect, useState, useCallback } from 'react'
import { adminFetch } from '@/lib/admin-fetch'

type Feedback = {
  id: string
  user_id: string | null
  user_name: string
  type: string
  description: string
  status: string
  admin_note: string | null
  created_at: string
  updated_at: string
}

type Pagination = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

const TYPE_LABELS: Record<string, { label: string; icon: string }> = {
  bug: { label: 'Bug 回報', icon: '🐛' },
  suggestion: { label: '改進建議', icon: '💡' },
  other: { label: '其他', icon: '💬' },
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: '待處理', color: 'text-[var(--color-warning)]' },
  in_progress: { label: '處理中', color: 'text-blue-500' },
  resolved: { label: '已修復', color: 'text-[var(--color-success)]' },
  adopted: { label: '已採納', color: 'text-purple-500' },
  ignored: { label: '忽略', color: 'text-[var(--color-text-secondary)]' },
}

const STATUS_OPTIONS = [
  { value: 'pending', label: '待處理' },
  { value: 'in_progress', label: '處理中' },
  { value: 'resolved', label: '已修復' },
  { value: 'adopted', label: '已採納' },
  { value: 'ignored', label: '忽略' },
]

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 25,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterType, setFilterType] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [detailModal, setDetailModal] = useState<Feedback | null>(null)
  const [adminNote, setAdminNote] = useState('')

  const fetchFeedbacks = useCallback(
    async (page = 1) => {
      setLoading(true)
      const params = new URLSearchParams({
        page: String(page),
        pageSize: '25',
      })
      if (filterStatus) params.set('status', filterStatus)
      if (filterType) params.set('type', filterType)

      const res = await adminFetch(`/api/admin/feedback?${params}`)
      const data = await res.json()
      if (data.data) {
        setFeedbacks(data.data)
        setPagination(data.pagination)
      }
      setLoading(false)
    },
    [filterStatus, filterType]
  )

  useEffect(() => {
    fetchFeedbacks(1)
  }, [fetchFeedbacks])

  const handleStatusChange = async (feedbackId: string, newStatus: string) => {
    setUpdatingId(feedbackId)

    const res = await adminFetch('/api/admin/feedback', {
      method: 'PATCH',
      body: JSON.stringify({
        feedbackId,
        status: newStatus,
      }),
    })
    const data = await res.json()
    if (data.success) {
      // 更新本地狀態
      setFeedbacks(prev =>
        prev.map(f => f.id === feedbackId ? { ...f, status: newStatus } : f)
      )
    }
    setUpdatingId(null)
  }

  const handleSaveNote = async () => {
    if (!detailModal) return
    setUpdatingId(detailModal.id)

    const res = await adminFetch('/api/admin/feedback', {
      method: 'PATCH',
      body: JSON.stringify({
        feedbackId: detailModal.id,
        status: detailModal.status,
        adminNote,
      }),
    })
    const data = await res.json()
    if (data.success) {
      setFeedbacks(prev =>
        prev.map(f => f.id === detailModal.id ? { ...f, admin_note: adminNote } : f)
      )
      setDetailModal(null)
    }
    setUpdatingId(null)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">💬 用戶回饋</h1>

      {/* 篩選列 */}
      <div className="flex flex-wrap gap-2">
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm cursor-pointer"
        >
          <option value="">全部狀態</option>
          {STATUS_OPTIONS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm cursor-pointer"
        >
          <option value="">全部類型</option>
          <option value="bug">🐛 Bug 回報</option>
          <option value="suggestion">💡 改進建議</option>
          <option value="other">💬 其他</option>
        </select>
      </div>

      {/* 表格 */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]">
                <th className="text-left px-4 py-3 font-medium">類型</th>
                <th className="text-left px-4 py-3 font-medium">內容</th>
                <th className="text-left px-4 py-3 font-medium">用戶</th>
                <th className="text-left px-4 py-3 font-medium">時間</th>
                <th className="text-left px-4 py-3 font-medium">狀態</th>
                <th className="text-left px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[var(--color-text-secondary)]">
                    載入中...
                  </td>
                </tr>
              ) : feedbacks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[var(--color-text-secondary)]">
                    {filterStatus || filterType ? '沒有符合條件的回饋' : '尚無用戶回饋'}
                  </td>
                </tr>
              ) : (
                feedbacks.map(feedback => (
                  <tr
                    key={feedback.id}
                    className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-alt)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5">
                        <span>{TYPE_LABELS[feedback.type]?.icon || '💬'}</span>
                        <span className="text-xs font-medium">
                          {TYPE_LABELS[feedback.type]?.label || feedback.type}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p
                        className="text-sm text-[var(--color-text)] truncate max-w-[300px] cursor-pointer hover:text-[var(--color-primary)]"
                        title={feedback.description}
                        onClick={() => {
                          setDetailModal(feedback)
                          setAdminNote(feedback.admin_note || '')
                        }}
                      >
                        {feedback.description.length > 80
                          ? feedback.description.slice(0, 80) + '...'
                          : feedback.description}
                      </p>
                      {feedback.admin_note && (
                        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 truncate max-w-[300px]">
                          📝 {feedback.admin_note}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {feedback.user_name}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {formatTimeAgo(feedback.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={feedback.status}
                        onChange={e => handleStatusChange(feedback.id, e.target.value)}
                        disabled={updatingId === feedback.id}
                        className={`px-2 py-1 rounded-md border border-[var(--color-border)] text-xs font-medium cursor-pointer ${
                          STATUS_LABELS[feedback.status]?.color || ''
                        } ${updatingId === feedback.id ? 'opacity-50' : ''}`}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setDetailModal(feedback)
                          setAdminNote(feedback.admin_note || '')
                        }}
                        className="px-3 py-1.5 bg-[var(--color-surface-alt)] text-[var(--color-text)] rounded-lg text-xs font-medium hover:bg-[var(--color-border)] transition-colors cursor-pointer"
                      >
                        詳情
                      </button>
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
                onClick={() => fetchFeedbacks(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1 rounded border border-[var(--color-border)] text-sm disabled:opacity-30 hover:bg-[var(--color-surface-alt)] cursor-pointer"
              >
                ‹ 上一頁
              </button>
              <button
                onClick={() => fetchFeedbacks(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1 rounded border border-[var(--color-border)] text-sm disabled:opacity-30 hover:bg-[var(--color-surface-alt)] cursor-pointer"
              >
                下一頁 ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 詳情 Modal */}
      {detailModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setDetailModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 m-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                {TYPE_LABELS[detailModal.type]?.icon} 回饋詳情
              </h3>
              <button
                onClick={() => setDetailModal(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* 回饋資訊 */}
            <div className="bg-[var(--color-surface-alt)] rounded-lg p-4 mb-4 text-sm space-y-2">
              <div>
                <span className="text-[var(--color-text-secondary)]">類型：</span>
                {TYPE_LABELS[detailModal.type]?.label || detailModal.type}
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">用戶：</span>
                {detailModal.user_name}
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">時間：</span>
                {new Date(detailModal.created_at).toLocaleString('zh-TW')}
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">狀態：</span>
                <span className={STATUS_LABELS[detailModal.status]?.color}>
                  {STATUS_LABELS[detailModal.status]?.label || detailModal.status}
                </span>
              </div>
            </div>

            {/* 完整描述 */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">回饋內容</label>
              <div className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-sm whitespace-pre-wrap">
                {detailModal.description}
              </div>
            </div>

            {/* 管理員備註 */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">管理員備註</label>
              <textarea
                value={adminNote}
                onChange={e => setAdminNote(e.target.value)}
                placeholder="備註處理情況..."
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm h-20 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDetailModal(null)}
                className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm hover:bg-[var(--color-surface-alt)] cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleSaveNote}
                disabled={updatingId === detailModal.id}
                className="px-4 py-2 rounded-lg text-sm text-white font-medium bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] disabled:opacity-50 cursor-pointer"
              >
                {updatingId === detailModal.id ? '儲存中...' : '儲存備註'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
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
