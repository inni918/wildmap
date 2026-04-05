'use client'

import { useEffect, useState } from 'react'

interface User {
  id: string
  display_name: string | null
  username: string | null
  level: number
  role: string
  is_active: boolean
  created_at: string
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(json => {
        if (json.success) setUsers(json.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleAction = async (userId: string, action: 'ban' | 'unban') => {
    setActionLoading(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      const json = await res.json()
      if (json.success) {
        setUsers(prev => prev.map(u =>
          u.id === userId ? { ...u, is_active: json.data.is_active } : u
        ))
      }
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) return <div className="text-gray-400 p-8">載入中...</div>

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">用戶管理</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['名稱', '帳號', '等級', '角色', '狀態', '加入時間', '操作'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-gray-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{u.display_name || '-'}</td>
                <td className="px-4 py-3 text-gray-500">{u.username || '-'}</td>
                <td className="px-4 py-3">Lv{u.level}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                  }`}>{u.role}</span>
                </td>
                <td className="px-4 py-3">
                  {u.is_active ? '✅' : <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs">已封鎖</span>}
                </td>
                <td className="px-4 py-3 text-gray-400">{new Date(u.created_at).toLocaleDateString('zh-TW')}</td>
                <td className="px-4 py-3">
                  {u.role !== 'admin' && (
                    u.is_active ? (
                      <button
                        onClick={() => handleAction(u.id, 'ban')}
                        disabled={actionLoading === u.id}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 disabled:opacity-50"
                      >
                        {actionLoading === u.id ? '處理中...' : '封鎖'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction(u.id, 'unban')}
                        disabled={actionLoading === u.id}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 disabled:opacity-50"
                      >
                        {actionLoading === u.id ? '處理中...' : '解封'}
                      </button>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
