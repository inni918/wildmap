'use client'

import { useEffect, useState } from 'react'

interface Comment {
  id: string
  content: string
  is_hidden: boolean
  created_at: string
  user_id: string
  spot_id: string
  users: { display_name: string } | null
  spots: { name: string } | null
}

export default function AdminComments() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/comments')
      .then(res => res.json())
      .then(json => {
        if (json.success) setComments(json.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleAction = async (commentId: string, action: 'hide' | 'show') => {
    setActionLoading(commentId)
    try {
      const res = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      const json = await res.json()
      if (json.success) {
        setComments(prev => prev.map(c =>
          c.id === commentId ? { ...c, is_hidden: json.data.is_hidden } : c
        ))
      }
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) return <div className="text-gray-400 p-8">載入中...</div>

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">留言管理</h1>
      {!comments.length ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-400">目前沒有留言</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['地標', '用戶', '內容', '狀態', '時間', '操作'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-gray-600 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {comments.map(c => (
                <tr key={c.id} className={`hover:bg-gray-50 ${c.is_hidden ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3 text-gray-700">{c.spots?.name || '-'}</td>
                  <td className="px-4 py-3 text-gray-500">{c.users?.display_name || '-'}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{c.content}</td>
                  <td className="px-4 py-3">
                    {c.is_hidden ? (
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs">已隱藏</span>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">顯示中</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{new Date(c.created_at).toLocaleDateString('zh-TW')}</td>
                  <td className="px-4 py-3">
                    {c.is_hidden ? (
                      <button
                        onClick={() => handleAction(c.id, 'show')}
                        disabled={actionLoading === c.id}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 disabled:opacity-50"
                      >
                        {actionLoading === c.id ? '處理中...' : '顯示'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction(c.id, 'hide')}
                        disabled={actionLoading === c.id}
                        className="px-3 py-1 bg-orange-500 text-white rounded-lg text-xs hover:bg-orange-600 disabled:opacity-50"
                      >
                        {actionLoading === c.id ? '處理中...' : '隱藏'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
