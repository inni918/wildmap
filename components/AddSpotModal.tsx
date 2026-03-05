'use client'

import { useState, useRef } from 'react'
import { supabase, type Spot } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'
import {
  faCampground, faVanShuttle,
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

interface Props {
  lat: number
  lng: number
  onClose: () => void
  onAdded: () => void
}

const MAX_PHOTOS = 5
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// MVP 先只開放露營和車宿，其他分類之後再開放
const CATEGORIES: { value: Spot['category']; label: string; emoji: string; icon: IconDefinition }[] = [
  { value: 'camping', label: '露營', emoji: '🏕️', icon: faCampground },
  { value: 'carcamp', label: '車宿', emoji: '🚐', icon: faVanShuttle },
]

interface PhotoPreview {
  file: File
  previewUrl: string
}

export default function AddSpotModal({ lat, lng, onClose, onAdded }: Props) {
  const { user, signInWithGoogle } = useAuth()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Spot['category']>('camping')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [socialLink, setSocialLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [photos, setPhotos] = useState<PhotoPreview[]>([])
  const photoInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // Reset file input
    if (photoInputRef.current) photoInputRef.current.value = ''

    const remaining = MAX_PHOTOS - photos.length
    const newFiles = Array.from(files).slice(0, remaining)

    for (const file of newFiles) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('僅支援 JPG、PNG、WebP 格式')
        setTimeout(() => setError(''), 3000)
        return
      }
      if (file.size > MAX_FILE_SIZE) {
        setError('每張照片不可超過 5MB')
        setTimeout(() => setError(''), 3000)
        return
      }
    }

    const newPreviews: PhotoPreview[] = newFiles.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }))

    setPhotos(prev => [...prev, ...newPreviews])
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].previewUrl)
      updated.splice(index, 1)
      return updated
    })
  }

  async function uploadPhotos(spotId: string, userId: string) {
    for (const photo of photos) {
      const ext = photo.file.name.split('.').pop() || 'jpg'
      const fileName = `${userId}/${spotId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('spot-images')
        .upload(fileName, photo.file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('Photo upload error:', uploadError)
        continue
      }

      const { data: urlData } = supabase.storage
        .from('spot-images')
        .getPublicUrl(fileName)

      await supabase
        .from('spot_images')
        .insert({
          spot_id: spotId,
          user_id: userId,
          url: urlData.publicUrl,
        })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('請輸入地點名稱'); return }
    if (!user) { setError('請先登入'); return }
    setLoading(true)
    setError('')

    const insertData: Record<string, unknown> = {
      name: name.trim(),
      description: description.trim() || null,
      category,
      latitude: lat,
      longitude: lng,
      created_by: user.id,
    }

    if (address.trim()) insertData.address = address.trim()
    if (phone.trim()) insertData.phone = phone.trim()
    if (socialLink.trim()) insertData.social_links = [socialLink.trim()]

    const { data, error: err } = await supabase
      .from('spots')
      .insert(insertData)
      .select('id')
      .single()

    if (err || !data) {
      setError('新增失敗，請再試一次')
      setLoading(false)
      return
    }

    // Upload photos after spot creation
    if (photos.length > 0) {
      await uploadPhotos(data.id, user.id)
    }

    // Cleanup preview URLs
    photos.forEach(p => URL.revokeObjectURL(p.previewUrl))

    onAdded()
  }

  // 未登入畫面
  if (!user) {
    return (
      <div
        className="absolute inset-0 z-20 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <div className="bg-surface rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary-light/20 flex items-center justify-center">
            <FontAwesomeIcon icon={NAV_ICONS.lock} className="text-primary text-xl" />
          </div>
          <h2 className="text-lg font-bold text-text-main mb-2">需要登入</h2>
          <p className="text-sm text-text-secondary mb-4">
            登入後即可新增地點、投票與累積積分
          </p>
          <button
            onClick={signInWithGoogle}
            className="flex items-center justify-center gap-2 w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm font-medium text-text-main hover:bg-surface-alt shadow-sm cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            使用 Google 登入
          </button>
          <button
            onClick={onClose}
            className="mt-3 text-sm text-text-secondary hover:text-text-main"
          >
            先不要
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="absolute inset-0 z-20 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-surface rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-main">新增地點</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-main text-2xl leading-none">
            <FontAwesomeIcon icon={NAV_ICONS.close} className="text-base" />
          </button>
        </div>

        <p className="text-xs text-text-secondary mb-4 flex items-center gap-1">
          <FontAwesomeIcon icon={NAV_ICONS.location} className="text-primary" />
          {lat.toFixed(5)}, {lng.toFixed(5)}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 類型選擇 */}
          <div>
            <label className="text-sm font-medium text-text-main mb-2 block">地點類型</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl border-2 text-sm transition-colors ${
                    category === cat.value
                      ? 'border-primary bg-primary-light/10 text-primary-dark'
                      : 'border-border text-text-secondary hover:border-primary-light'
                  }`}
                >
                  <FontAwesomeIcon icon={cat.icon} className="text-xl mb-1" />
                  <span className="text-xs">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 名稱 */}
          <div>
            <label className="text-sm font-medium text-text-main mb-1 block">地點名稱 *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例如：秘境小溪露營地"
              className="w-full border border-border rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light bg-surface"
            />
          </div>

          {/* 描述 */}
          <div>
            <label className="text-sm font-medium text-text-main mb-1 block">簡介（選填）</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="分享這個地點的特色、注意事項..."
              rows={3}
              className="w-full border border-border rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light resize-none bg-surface"
            />
          </div>

          {/* 地址 */}
          <div>
            <label className="text-sm font-medium text-text-main mb-1 block">地址（選填）</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="例如：新北市烏來區某某路"
              className="w-full border border-border rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light bg-surface"
            />
          </div>

          {/* 電話 */}
          <div>
            <label className="text-sm font-medium text-text-main mb-1 block">聯絡電話（選填）</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="例如：02-1234-5678"
              className="w-full border border-border rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light bg-surface"
            />
          </div>

          {/* 社群連結 */}
          <div>
            <label className="text-sm font-medium text-text-main mb-1 block">社群連結（選填）</label>
            <input
              type="url"
              value={socialLink}
              onChange={e => setSocialLink(e.target.value)}
              placeholder="Facebook、Instagram 或官方網站"
              className="w-full border border-border rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light bg-surface"
            />
          </div>

          {/* 照片上傳 */}
          <div>
            <label className="text-sm font-medium text-text-main mb-2 block">
              📷 新增照片（選填）
            </label>

            {/* Photo previews */}
            {photos.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-2">
                {photos.map((photo, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                    <img
                      src={photo.previewUrl}
                      alt={`預覽 ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-0 right-0 w-5 h-5 bg-black/60 text-white rounded-bl-lg flex items-center justify-center text-[10px] cursor-pointer hover:bg-error"
                    >
                      <FontAwesomeIcon icon={NAV_ICONS.close} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {photos.length < MAX_PHOTOS && (
              <div>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handlePhotoSelect}
                  className="hidden"
                  id="add-spot-photos"
                />
                <label
                  htmlFor="add-spot-photos"
                  className="inline-flex items-center gap-2 px-3 py-2 border border-dashed border-border rounded-xl text-sm text-text-secondary hover:border-primary hover:text-primary transition-colors cursor-pointer"
                >
                  <FontAwesomeIcon icon={NAV_ICONS.camera} className="text-xs" />
                  選擇照片（最多 {MAX_PHOTOS} 張）
                </label>
                <span className="text-xs text-text-secondary/60 ml-2">
                  {photos.length}/{MAX_PHOTOS}
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-text-secondary flex items-center gap-1">
            <FontAwesomeIcon icon={NAV_ICONS.info} className="text-primary" />
            地點建立後，可以在詳情頁為各項特性投票
          </p>

          {error && (
            <p className="text-error text-sm flex items-center gap-1">
              <FontAwesomeIcon icon={NAV_ICONS.warning} className="text-xs" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark disabled:bg-border text-text-on-primary font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={NAV_ICONS.spinner} className="animate-spin" />
                新增中...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={NAV_ICONS.check} />
                新增地點
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
