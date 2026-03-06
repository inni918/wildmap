'use client'

import { useState } from 'react'
import { supabase, type Spot } from '@/lib/supabase'
import { useAchievements } from '@/lib/achievement-context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'

interface Props {
  spot: Spot
  onClose: () => void
  onSaved: () => void
}

export default function EditSpotModal({ spot, onClose, onSaved }: Props) {
  const { earnAction } = useAchievements()
  const [name, setName] = useState(spot.name)
  const [description, setDescription] = useState(spot.description || '')
  const [address, setAddress] = useState(spot.address || '')
  const [phone, setPhone] = useState(spot.phone || '')
  const [website, setWebsite] = useState(spot.website || '')
  const [facebook, setFacebook] = useState(spot.facebook || '')
  const [instagram, setInstagram] = useState(spot.instagram || '')
  const [lineId, setLineId] = useState(spot.line_id || '')
  const [email, setEmail] = useState(spot.email || '')
  const [googleMapsUrl, setGoogleMapsUrl] = useState(spot.google_maps_url || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('地點名稱不可為空')
      return
    }

    setLoading(true)
    setError('')

    const updateData: Record<string, unknown> = {
      name: name.trim(),
      description: description.trim() || null,
      address: address.trim() || null,
      phone: phone.trim() || null,
      website: website.trim() || null,
      facebook: facebook.trim() || null,
      instagram: instagram.trim() || null,
      line_id: lineId.trim() || null,
      email: email.trim() || null,
      google_maps_url: googleMapsUrl.trim() || null,
    }

    const { error: err } = await supabase
      .from('spots')
      .update(updateData)
      .eq('id', spot.id)

    if (err) {
      setError('儲存失敗，請再試一次')
      setLoading(false)
    } else {
      setSuccess(true)
      earnAction('edit_spot')
      setTimeout(() => {
        onSaved()
      }, 500)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-surface rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <h2 className="text-lg font-bold text-text-main">編輯地點</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-main p-2 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
          >
            <FontAwesomeIcon icon={NAV_ICONS.close} className="text-base" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* 名稱 */}
          <div>
            <label className="text-sm font-medium text-text-main mb-1 block">地點名稱 *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-border rounded-[10px] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light bg-surface"
            />
          </div>

          {/* 描述 */}
          <div>
            <label className="text-sm font-medium text-text-main mb-1 block">簡介</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-border rounded-[10px] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light resize-none bg-surface"
            />
          </div>

          {/* 地址 */}
          <div>
            <label className="text-sm font-medium text-text-main mb-1 block">地址</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full border border-border rounded-[10px] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light bg-surface"
            />
          </div>

          {/* 電話 */}
          <div>
            <label className="text-sm font-medium text-text-main mb-1 block">聯絡電話</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full border border-border rounded-[10px] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light bg-surface"
            />
          </div>

          {/* 網站 */}
          <div>
            <label className="text-sm font-medium text-text-main mb-1 block">官方網站</label>
            <input
              type="url"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="https://..."
              className="w-full border border-border rounded-[10px] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light bg-surface"
            />
          </div>

          {/* Facebook */}
          <div>
            <label className="text-sm font-medium text-text-main mb-1 block">Facebook</label>
            <input
              type="url"
              value={facebook}
              onChange={e => setFacebook(e.target.value)}
              placeholder="https://facebook.com/..."
              className="w-full border border-border rounded-[10px] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light bg-surface"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="text-sm font-medium text-text-main mb-1 block">Instagram</label>
            <input
              type="url"
              value={instagram}
              onChange={e => setInstagram(e.target.value)}
              placeholder="https://instagram.com/..."
              className="w-full border border-border rounded-[10px] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light bg-surface"
            />
          </div>

          {/* LINE ID */}
          <div>
            <label className="text-sm font-medium text-text-main mb-1 block">LINE ID</label>
            <input
              type="text"
              value={lineId}
              onChange={e => setLineId(e.target.value)}
              className="w-full border border-border rounded-[10px] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light bg-surface"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-text-main mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-border rounded-[10px] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light bg-surface"
            />
          </div>

          {/* Google Maps URL */}
          <div>
            <label className="text-sm font-medium text-text-main mb-1 block">Google Maps 連結</label>
            <input
              type="url"
              value={googleMapsUrl}
              onChange={e => setGoogleMapsUrl(e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full border border-border rounded-[10px] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light bg-surface"
            />
          </div>

          {error && (
            <p className="text-error text-sm flex items-center gap-1">
              <FontAwesomeIcon icon={NAV_ICONS.warning} className="text-xs" />
              {error}
            </p>
          )}

          {success && (
            <p className="text-success text-sm flex items-center gap-1">
              <FontAwesomeIcon icon={NAV_ICONS.check} className="text-xs" />
              已儲存！
            </p>
          )}
        </form>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border flex-shrink-0 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-border text-text-secondary font-medium hover:bg-surface-alt transition-colors cursor-pointer min-h-[48px]"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-dark disabled:bg-border text-text-on-primary font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 min-h-[48px]"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={NAV_ICONS.spinner} className="animate-spin" />
                儲存中...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={NAV_ICONS.check} />
                儲存
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
