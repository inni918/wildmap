'use client'

import { useEffect, useState, useCallback } from 'react'
import { adminFetch } from '@/lib/admin-fetch'

type User = {
  id: string
  display_name: string
  email: string
  avatar_url: string | null
  role: string
  level: number
  points: number
  credit_score: number
  is_banned?: boolean | null
  created_at: string
}

type Pagination = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  user: { label: '用戶', color: 'bg-gray-100 text-gray-700' },
  business: { label: '商家', color: 'bg-blue-100 text-blue-700' },
  moderator: { label: '版主', color: 'bg-purple-100 text-purple-700' },
  admin: { label: '管理員', color: 'bg-orange-100 text-orange-700' },
  super_admin: { label: '超級管理員', color: 'bg-red-100 text-red-700' },
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 25,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [fetchError, setFetchError] = useState('')
  const [actionModal, setActionModal] = useState<{
    type: 'role' | 'ban' | 'unban'
    user: User
  } | null>(null)
  const [actionValue, setActionValue] = useState('')
  const [actionReason, setActionReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const fetchUsers = useCallback(
    async (page = 1) => {
      setLoading(true)
      const params = new URLSearchParams({
        page: String(page),
        pageSize: '25',
      })
      if (search) params.set('search', search)
      if (roleFilter) params.set('role', roleFilter)
      if (levelFilter) params.set('level', levelFilter)
      if (statusFilter) params.set('status', statusFilter)

      const res = await adminFetch(`/api/admin/users?${params}`)
      const data = await res.json()
      if (data.error) {
        setFetchError(`${data.error.code}: ${data.error.message}`)
        setLoading(false)
        return
      }
      if (data.data) {
        setFetchError('')
        setUsers(data.data)
        setPagination(data.pagination)
      }
      setLoading(false)
    },
    [search, roleFilter, levelFilter, statusFilter]
  )

  useEffect(() => {
    fetchUsers(1)
  }, [fetchUsers])

  const handleAction = async () => {
    if (!actionModal) return
    setActionLoading(true)

    const body: Record<string, string> = {
      userId: actionModal.user.id,
      action: actionModal.type === 'role' ? 'changeRole' : actionModal.type,
    }
    if (actionModal.type === 'role') body.value = actionValue
    if (actionModal.type === 'ban') body.reason = actionReason

    const res = await adminFetch('/api/admin/users', {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (data.success) {
      setActionModal(null)
      setActionValue('')
      setActionReason('')
      fetchUsers(pagination.page)
    }
    setActionLoading(false)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">👥 用戶管理</h1>

      {/* 篩選列 */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="🔍 搜尋用戶名稱或 Email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm cursor-pointer"
        >
          <option value="">全部角色</option>
          <option value="user">用戶</option>
          <option value="business">商家</option>
          <option value="moderator">版主</option>
          <option value="admin">管理員</option>
        </select>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm cursor-pointer"
        >
          <option value="">全部等級</option>
          {[1, 2, 3, 4, 5].map((l) => (
            <option key={l} value={l}>
              Lv{l}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm cursor-pointer"
        >
          <option value="">全部狀態</option>
          <option value="active">正常</option>
          <option value="banned">封禁</option>
        </select>
      </div>

      {/* 表格 */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]">
                <th className="text-left px-4 py-3 font-medium">用戶</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">角色</th>
                <th className="text-left px-4 py-3 font-medium">等級</th>
                <th className="text-left px-4 py-3 font-medium">積分</th>
                <th className="text-left px-4 py-3 font-medium">狀態</th>
                <th className="text-left px-4 py-3 font-medium">註冊日期</th>
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
                    <button onClick={() => { setFetchError(''); fetchUsers(1); }} className="mt-2 text-sm text-[var(--color-primary)] hover:underline cursor-pointer">重試</button>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[var(--color-text-secondary)]">
                    沒有找到符合條件的用戶
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-alt)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[var(--color-primary-light)] text-white flex items-center justify-center text-xs font-bold">
                            {user.display_name?.[0] || '?'}
                          </div>
                        )}
                        <span className="font-medium">{user.display_name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          ROLE_LABELS[user.role]?.color || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {ROLE_LABELS[user.role]?.label || user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">Lv{user.level}</td>
                    <td className="px-4 py-3">{user.points}</td>
                    <td className="px-4 py-3">
                      {user.is_banned ? (
                        <span className="text-[var(--color-error)] font-medium">🔴 封禁</span>
                      ) : (
                        <span className="text-[var(--color-success)]">🟢 正常</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {new Date(user.created_at).toLocaleDateString('zh-TW')}
                    </td>
                    <td className="px-4 py-3">
                      <UserActions
                        user={user}
                        onAction={(type) => {
                          setActionModal({ type, user })
                          if (type === 'role') setActionValue(user.role)
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
                onClick={() => fetchUsers(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1 rounded border border-[var(--color-border)] text-sm disabled:opacity-30 hover:bg-[var(--color-surface-alt)] cursor-pointer"
              >
                ‹ 上一頁
              </button>
              <button
                onClick={() => fetchUsers(pagination.page + 1)}
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
              {actionModal.type === 'role' && '修改角色'}
              {actionModal.type === 'ban' && '封禁用戶'}
              {actionModal.type === 'unban' && '解除封禁'}
            </h3>

            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              用戶：<strong>{actionModal.user.display_name}</strong>（{actionModal.user.email}）
            </p>

            {actionModal.type === 'role' && (
              <select
                value={actionValue}
                onChange={(e) => setActionValue(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm mb-4 cursor-pointer"
              >
                <option value="user">用戶</option>
                <option value="business">商家</option>
                <option value="moderator">版主</option>
                <option value="admin">管理員</option>
              </select>
            )}

            {actionModal.type === 'ban' && (
              <textarea
                placeholder="封禁原因..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm mb-4 h-24 resize-none"
              />
            )}

            {actionModal.type === 'unban' && (
              <p className="text-sm mb-4">確定要解除此用戶的封禁狀態嗎？</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setActionModal(null)
                  setActionValue('')
                  setActionReason('')
                }}
                className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm hover:bg-[var(--color-surface-alt)] cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleAction}
                disabled={actionLoading}
                className={`px-4 py-2 rounded-lg text-sm text-white font-medium cursor-pointer ${
                  actionModal.type === 'ban'
                    ? 'bg-[var(--color-error)] hover:bg-red-700'
                    : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]'
                } disabled:opacity-50`}
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

function UserActions({
  user,
  onAction,
}: {
  user: User
  onAction: (type: 'role' | 'ban' | 'unban') => void
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
                onAction('role')
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--color-surface-alt)] cursor-pointer"
            >
              修改角色
            </button>
            {user.is_banned ? (
              <button
                onClick={() => {
                  setOpen(false)
                  onAction('unban')
                }}
                className="w-full text-left px-3 py-2 text-sm text-[var(--color-success)] hover:bg-green-50 cursor-pointer"
              >
                解除封禁
              </button>
            ) : (
              <button
                onClick={() => {
                  setOpen(false)
                  onAction('ban')
                }}
                className="w-full text-left px-3 py-2 text-sm text-[var(--color-error)] hover:bg-red-50 cursor-pointer"
              >
                封禁用戶
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
