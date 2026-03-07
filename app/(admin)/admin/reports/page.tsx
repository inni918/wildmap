'use client'

import { useEffect, useState, useCallback } from 'react'

type Report = {
  id: string
  reason: string
  description: string | null
  target_type: string
  target_id: string
  target_name: string
  status: string
  priority: 'high' | 'medium' | 'low'
  reporter_name: string
  resolver_name: string | null
  resolution: string | null
  created_at: string
  resolved_at: string | null
}

type Pagination = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

const PRIORITY_LABELS: Record<string, { label: string; icon: string }> = {
  high: { label: '高', icon: '🔴' },
  medium: { label: '中', icon: '🟡' },
  low: { label: '低', icon: '🔵' },
}

const REASON_LABELS: Record<string, string> = {
  misinformation: '不實資訊',
  spam: '垃圾內容',
  harassment: '騷擾',
  illegal: '違法',
  other: '其他',
}

const TARGET_TYPE_LABELS: Record<string, string> = {
  spot: '地標',
  comment: '評論',
  user: '用戶',
  photo: '照片',
}

const RESOLUTION_LABELS: Record<string, string> = {
  dismiss: '駁回（保留）',
  delete_content: '刪除內容',
  warn_user: '警告用戶',
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 25,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'pending' | 'resolved'>('pending')
  const [actionModal, setActionModal] = useState<Report | null>(null)
  const [actionType, setActionType] = useState('dismiss')
  const [actionNote, setActionNote] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const fetchReports = useCallback(
    async (page = 1) => {
      setLoading(true)
      const params = new URLSearchParams({
        page: String(page),
        pageSize: '25',
        tab,
      })

      const res = await fetch(`/api/admin/reports?${params}`)
      const data = await res.json()
      if (data.data) {
        setReports(data.data)
        setPagination(data.pagination)
      }
      setLoading(false)
    },
    [tab]
  )

  useEffect(() => {
    fetchReports(1)
  }, [fetchReports])

  const handleResolve = async () => {
    if (!actionModal) return
    setActionLoading(true)

    const res = await fetch('/api/admin/reports', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reportId: actionModal.id,
        action: actionType,
        note: actionNote,
      }),
    })
    const data = await res.json()
    if (data.success) {
      setActionModal(null)
      setActionType('dismiss')
      setActionNote('')
      fetchReports(pagination.page)
    }
    setActionLoading(false)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">🚩 檢舉處理</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--color-surface-alt)] p-1 rounded-lg w-fit">
        <button
          onClick={() => setTab('pending')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            tab === 'pending'
              ? 'bg-white text-[var(--color-primary)] shadow-sm'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
          }`}
        >
          待處理
        </button>
        <button
          onClick={() => setTab('resolved')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            tab === 'resolved'
              ? 'bg-white text-[var(--color-primary)] shadow-sm'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
          }`}
        >
          已處理
        </button>
      </div>

      {/* 表格 */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]">
                <th className="text-left px-4 py-3 font-medium">優先度</th>
                <th className="text-left px-4 py-3 font-medium">類型</th>
                <th className="text-left px-4 py-3 font-medium">被檢舉目標</th>
                <th className="text-left px-4 py-3 font-medium">檢舉人</th>
                <th className="text-left px-4 py-3 font-medium">狀態</th>
                <th className="text-left px-4 py-3 font-medium">時間</th>
                {tab === 'pending' && (
                  <th className="text-left px-4 py-3 font-medium">操作</th>
                )}
                {tab === 'resolved' && (
                  <th className="text-left px-4 py-3 font-medium">處理結果</th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-[var(--color-text-secondary)]"
                  >
                    載入中...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-[var(--color-text-secondary)]"
                  >
                    {tab === 'pending' ? '✅ 無待處理檢舉' : '尚無已處理記錄'}
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-alt)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1">
                        {PRIORITY_LABELS[report.priority]?.icon}
                        <span className="text-xs">
                          {PRIORITY_LABELS[report.priority]?.label}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {REASON_LABELS[report.reason] || report.reason}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <span className="text-xs text-[var(--color-text-secondary)]">
                          [{TARGET_TYPE_LABELS[report.target_type] || report.target_type}]
                        </span>{' '}
                        <span className="font-medium">{report.target_name}</span>
                      </div>
                      {report.description && (
                        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 truncate max-w-[250px]">
                          {report.description}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {report.reporter_name}
                    </td>
                    <td className="px-4 py-3">
                      {report.status === 'pending' && (
                        <span className="text-[var(--color-warning)]">🟡 待處理</span>
                      )}
                      {report.status === 'resolved' && (
                        <span className="text-[var(--color-success)]">🟢 已解決</span>
                      )}
                      {report.status === 'rejected' && (
                        <span className="text-[var(--color-text-secondary)]">⚪ 已駁回</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {formatTimeAgo(report.created_at)}
                    </td>
                    {tab === 'pending' && (
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setActionModal(report)}
                          className="px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-lg text-xs font-medium hover:bg-[var(--color-primary-dark)] transition-colors cursor-pointer"
                        >
                          處理
                        </button>
                      </td>
                    )}
                    {tab === 'resolved' && (
                      <td className="px-4 py-3 text-xs text-[var(--color-text-secondary)]">
                        {RESOLUTION_LABELS[report.resolution || ''] || report.resolution}
                        {report.resolver_name && (
                          <span className="block">by {report.resolver_name}</span>
                        )}
                      </td>
                    )}
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
                onClick={() => fetchReports(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1 rounded border border-[var(--color-border)] text-sm disabled:opacity-30 hover:bg-[var(--color-surface-alt)] cursor-pointer"
              >
                ‹ 上一頁
              </button>
              <button
                onClick={() => fetchReports(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1 rounded border border-[var(--color-border)] text-sm disabled:opacity-30 hover:bg-[var(--color-surface-alt)] cursor-pointer"
              >
                下一頁 ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 處理 Modal */}
      {actionModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 m-4">
            <h3 className="text-lg font-bold mb-4">處理檢舉</h3>

            {/* 檢舉資訊 */}
            <div className="bg-[var(--color-surface-alt)] rounded-lg p-4 mb-4 text-sm space-y-1">
              <div>
                <span className="text-[var(--color-text-secondary)]">類型：</span>
                {REASON_LABELS[actionModal.reason] || actionModal.reason}
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">目標：</span>
                [{TARGET_TYPE_LABELS[actionModal.target_type] || actionModal.target_type}]{' '}
                {actionModal.target_name}
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">檢舉人：</span>
                {actionModal.reporter_name}
              </div>
              {actionModal.description && (
                <div>
                  <span className="text-[var(--color-text-secondary)]">描述：</span>
                  {actionModal.description}
                </div>
              )}
            </div>

            {/* 處理方式 */}
            <div className="space-y-2 mb-4">
              <label className="block text-sm font-medium">處理方式</label>
              {[
                { value: 'dismiss', label: '保留內容（駁回檢舉）', desc: '檢舉無效，內容正常' },
                {
                  value: 'delete_content',
                  label: '刪除/隱藏內容',
                  desc: '內容確實違規，將隱藏被檢舉的內容',
                },
                {
                  value: 'warn_user',
                  label: '警告用戶',
                  desc: '記錄警告，通知違規用戶',
                },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    actionType === opt.value
                      ? 'border-[var(--color-primary)] bg-green-50'
                      : 'border-[var(--color-border)] hover:bg-[var(--color-surface-alt)]'
                  }`}
                >
                  <input
                    type="radio"
                    name="action"
                    value={opt.value}
                    checked={actionType === opt.value}
                    onChange={(e) => setActionType(e.target.value)}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="text-sm font-medium">{opt.label}</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            {/* 備註 */}
            <textarea
              placeholder="處理備註（選填）..."
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm mb-4 h-20 resize-none"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setActionModal(null)
                  setActionType('dismiss')
                  setActionNote('')
                }}
                className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm hover:bg-[var(--color-surface-alt)] cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleResolve}
                disabled={actionLoading}
                className="px-4 py-2 rounded-lg text-sm text-white font-medium bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] disabled:opacity-50 cursor-pointer"
              >
                {actionLoading ? '處理中...' : '確認處理'}
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
