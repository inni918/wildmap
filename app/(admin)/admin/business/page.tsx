'use client'

import { useEffect, useState, useCallback } from 'react'
import { adminFetch } from '@/lib/admin-fetch'

type BusinessClaim = {
  id: string
  business_name: string
  contact_phone: string | null
  contact_email: string | null
  proof_url: string | null
  notes: string | null
  status: string
  rejection_reason: string | null
  created_at: string
  reviewed_at: string | null
  spot_name: string
  applicant_name: string
  wait_days: number
}

type Pagination = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export default function AdminBusinessPage() {
  const [claims, setClaims] = useState<BusinessClaim[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 25,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'pending' | 'approved'>('pending')
  const [actionModal, setActionModal] = useState<{
    claim: BusinessClaim
    type: 'approve' | 'reject'
  } | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const fetchClaims = useCallback(
    async (page = 1) => {
      setLoading(true)
      const params = new URLSearchParams({
        page: String(page),
        pageSize: '25',
        tab,
      })

      const res = await adminFetch(`/api/admin/business?${params}`)
      const data = await res.json()
      if (data.data) {
        setClaims(data.data)
        setPagination(data.pagination)
      }
      setLoading(false)
    },
    [tab]
  )

  useEffect(() => {
    fetchClaims(1)
  }, [fetchClaims])

  const handleAction = async () => {
    if (!actionModal) return
    setActionLoading(true)

    const body: Record<string, string> = {
      claimId: actionModal.claim.id,
      action: actionModal.type,
    }
    if (actionModal.type === 'reject') body.reason = rejectReason

    const res = await adminFetch('/api/admin/business', {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (data.success) {
      setActionModal(null)
      setRejectReason('')
      fetchClaims(pagination.page)
    }
    setActionLoading(false)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">🏪 商家管理</h1>

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
          待審核
        </button>
        <button
          onClick={() => setTab('approved')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            tab === 'approved'
              ? 'bg-white text-[var(--color-primary)] shadow-sm'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
          }`}
        >
          已認證
        </button>
      </div>

      {/* 表格 */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]">
                <th className="text-left px-4 py-3 font-medium">商家名稱</th>
                <th className="text-left px-4 py-3 font-medium">聲明地標</th>
                <th className="text-left px-4 py-3 font-medium">申請人</th>
                <th className="text-left px-4 py-3 font-medium">證明文件</th>
                {tab === 'pending' && (
                  <th className="text-left px-4 py-3 font-medium">等待天數</th>
                )}
                <th className="text-left px-4 py-3 font-medium">申請日期</th>
                <th className="text-left px-4 py-3 font-medium">操作</th>
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
              ) : claims.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-[var(--color-text-secondary)]"
                  >
                    {tab === 'pending' ? '✅ 無待審核申請' : '尚無已認證商家'}
                  </td>
                </tr>
              ) : (
                claims.map((claim) => (
                  <tr
                    key={claim.id}
                    className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-alt)] transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{claim.business_name}</td>
                    <td className="px-4 py-3 text-[var(--color-primary)]">{claim.spot_name}</td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {claim.applicant_name}
                    </td>
                    <td className="px-4 py-3">
                      {claim.proof_url ? (
                        <a
                          href={claim.proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--color-primary)] hover:underline"
                        >
                          📎 查看
                        </a>
                      ) : (
                        <span className="text-[var(--color-text-secondary)]">無</span>
                      )}
                    </td>
                    {tab === 'pending' && (
                      <td className="px-4 py-3">
                        <span
                          className={
                            claim.wait_days > 3
                              ? 'text-[var(--color-error)] font-medium'
                              : 'text-[var(--color-text-secondary)]'
                          }
                        >
                          {claim.wait_days} 天
                        </span>
                      </td>
                    )}
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {new Date(claim.created_at).toLocaleDateString('zh-TW')}
                    </td>
                    <td className="px-4 py-3">
                      {tab === 'pending' ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() =>
                              setActionModal({ claim, type: 'approve' })
                            }
                            className="px-2.5 py-1 bg-[var(--color-success)] text-white rounded text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
                          >
                            核准
                          </button>
                          <button
                            onClick={() =>
                              setActionModal({ claim, type: 'reject' })
                            }
                            className="px-2.5 py-1 bg-[var(--color-error)] text-white rounded text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
                          >
                            拒絕
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-[var(--color-success)]">✅ 已認證</span>
                      )}
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
                onClick={() => fetchClaims(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1 rounded border border-[var(--color-border)] text-sm disabled:opacity-30 hover:bg-[var(--color-surface-alt)] cursor-pointer"
              >
                ‹ 上一頁
              </button>
              <button
                onClick={() => fetchClaims(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1 rounded border border-[var(--color-border)] text-sm disabled:opacity-30 hover:bg-[var(--color-surface-alt)] cursor-pointer"
              >
                下一頁 ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 審核 Modal */}
      {actionModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 m-4">
            <h3 className="text-lg font-bold mb-4">
              {actionModal.type === 'approve' ? '核准商家認證' : '拒絕商家認證'}
            </h3>

            {/* 申請資訊 */}
            <div className="bg-[var(--color-surface-alt)] rounded-lg p-4 mb-4 text-sm space-y-1">
              <div>
                <span className="text-[var(--color-text-secondary)]">商家名稱：</span>
                <strong>{actionModal.claim.business_name}</strong>
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">聲明地標：</span>
                {actionModal.claim.spot_name}
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">申請人：</span>
                {actionModal.claim.applicant_name}
              </div>
              {actionModal.claim.contact_email && (
                <div>
                  <span className="text-[var(--color-text-secondary)]">Email：</span>
                  {actionModal.claim.contact_email}
                </div>
              )}
              {actionModal.claim.contact_phone && (
                <div>
                  <span className="text-[var(--color-text-secondary)]">電話：</span>
                  {actionModal.claim.contact_phone}
                </div>
              )}
              {actionModal.claim.notes && (
                <div>
                  <span className="text-[var(--color-text-secondary)]">備註：</span>
                  {actionModal.claim.notes}
                </div>
              )}
            </div>

            {actionModal.type === 'approve' ? (
              <div className="mb-4 p-3 bg-green-50 rounded-lg text-sm text-[var(--color-success)]">
                核准後，該用戶將獲得「商家」角色，並能管理聲明的地標。
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">拒絕原因</label>
                <textarea
                  placeholder="請填寫拒絕原因..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm h-24 resize-none"
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setActionModal(null)
                  setRejectReason('')
                }}
                className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm hover:bg-[var(--color-surface-alt)] cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleAction}
                disabled={actionLoading || (actionModal.type === 'reject' && !rejectReason.trim())}
                className={`px-4 py-2 rounded-lg text-sm text-white font-medium cursor-pointer disabled:opacity-50 ${
                  actionModal.type === 'approve'
                    ? 'bg-[var(--color-success)] hover:opacity-90'
                    : 'bg-[var(--color-error)] hover:opacity-90'
                }`}
              >
                {actionLoading
                  ? '處理中...'
                  : actionModal.type === 'approve'
                  ? '確認核准'
                  : '確認拒絕'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
