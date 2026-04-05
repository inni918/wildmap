'use client'

import { useEffect, useState } from 'react'

interface Spot {
  id: string
  name: string
  city: string | null
  district: string | null
  status: string
  gov_certified: boolean
  created_at: string
}

export default function AdminSpots() {
  const [spots, setSpots] = useState<Spot[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/spots')
      .then(res => res.json())
      .then(json => {
        if (json.success) setSpots(json.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleAction = async (spotId: string, action: 'close' | 'reopen') => {
    setActionLoading(spotId)
    try {
      const res = await fetch(`/api/admin/spots/${spotId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      const json = await res.json()
      if (json.success) {
        setSpots(prev => prev.map(s =>
          s.id === spotId ? { ...s, status: json.data.status } : s
        ))
      }
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) return <div className="text-gray-400 p-8">載入中...</div>

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">地標管理</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['名稱', '縣市', '鄉鎮區', '狀態', '合法', '建立時間', '操作'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-gray-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {spots.map(spot => (
              <tr key={spot.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{spot.name}</td>
                <td className="px-4 py-3 text-gray-500">{spot.city || '-'}</td>
                <td className="px-4 py-3 text-gray-500">{spot.district || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    spot.status === 'active' || spot.status === 'published' ? 'bg-green-100 text-green-700' :
                    spot.status === 'closed' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{spot.status}</span>
                </td>
                <td className="px-4 py-3">{spot.gov_certified ? '🛡️' : '-'}</td>
                <td className="px-4 py-3 text-gray-400">{new Date(spot.created_at).toLocaleDateString('zh-TW')}</td>
                <td className="px-4 py-3">
                  {spot.status === 'closed' ? (
                    <button
                      onClick={() => handleAction(spot.id, 'reopen')}
                      disabled={actionLoading === spot.id}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 disabled:opacity-50"
                    >
                      {actionLoading === spot.id ? '處理中...' : '重開'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAction(spot.id, 'close')}
                      disabled={actionLoading === spot.id}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 disabled:opacity-50"
                    >
                      {actionLoading === spot.id ? '處理中...' : '關閉'}
                    </button>
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
