'use client'

import { useEffect, useState } from 'react'

interface Report {
  id: string
  target_type: string
  reason: string
  status: string
  created_at: string
}

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/reports')
      .then(res => res.json())
      .then(json => {
        if (json.success) setReports(json.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleAction = async (reportId: string, action: 'resolve' | 'dismiss') => {
    setActionLoading(reportId)
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      const json = await res.json()
      if (json.success) {
        setReports(prev => prev.map(r =>
          r.id === reportId ? { ...r, status: json.data.status } : r
        ))
      }
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) return <div className="text-gray-400 p-8">載入中...</div>

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">檢舉管理</h1>
      {!reports.length ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-400">目前沒有檢舉 ✅</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['類型', '原因', '狀態', '時間', '操作'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-gray-600 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{r.target_type}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{r.reason}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      r.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{
                      r.status === 'pending' ? '待處理' :
                      r.status === 'resolved' ? '已處理' :
                      '已忽略'
                    }</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{new Date(r.created_at).toLocaleDateString('zh-TW')}</td>
                  <td className="px-4 py-3">
                    {r.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(r.id, 'resolve')}
                          disabled={actionLoading === r.id}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 disabled:opacity-50"
                        >
                          {actionLoading === r.id ? '...' : '已處理 ✓'}
                        </button>
                        <button
                          onClick={() => handleAction(r.id, 'dismiss')}
                          disabled={actionLoading === r.id}
                          className="px-3 py-1 bg-gray-400 text-white rounded-lg text-xs hover:bg-gray-500 disabled:opacity-50"
                        >
                          {actionLoading === r.id ? '...' : '忽略 ✗'}
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
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
