'use client'

import { useState } from 'react'
import { supabase, type Spot } from '@/lib/supabase'

interface Props {
  lat: number
  lng: number
  onClose: () => void
  onAdded: () => void
}

const CATEGORIES: { value: Spot['category']; label: string; emoji: string }[] = [
  { value: 'camping', label: '露營', emoji: '🏕️' },
  { value: 'carcamp', label: '車宿', emoji: '🚐' },
  { value: 'fishing', label: '釣魚', emoji: '🎣' },
  { value: 'diving', label: '潛水', emoji: '🤿' },
  { value: 'surfing', label: '衝浪', emoji: '🏄' },
  { value: 'hiking', label: '登山', emoji: '🏔️' },
]

export default function AddSpotModal({ lat, lng, onClose, onAdded }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Spot['category']>('camping')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('請輸入地點名稱'); return }
    setLoading(true)
    setError('')

    const { error: err } = await supabase.from('spots').insert({
      name: name.trim(),
      description: description.trim(),
      category,
      latitude: lat,
      longitude: lng,
    })

    if (err) {
      setError('新增失敗，請再試一次')
      setLoading(false)
    } else {
      onAdded()
    }
  }

  return (
    <div className="absolute inset-0 z-20 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">新增地點</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <p className="text-xs text-gray-400 mb-4">
          📍 {lat.toFixed(5)}, {lng.toFixed(5)}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 類型選擇 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">地點類型</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl border-2 text-sm transition-colors ${
                    category === cat.value
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl mb-1">{cat.emoji}</span>
                  <span className="text-xs">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 名稱 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">地點名稱 *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例如：秘境小溪露營地"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* 描述 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">簡介（選填）</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="分享這個地點的特色、注意事項..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium py-3 rounded-xl transition-colors"
          >
            {loading ? '新增中...' : '✅ 新增地點'}
          </button>
        </form>
      </div>
    </div>
  )
}
