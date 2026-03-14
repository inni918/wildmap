'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { useAchievements } from '@/lib/achievement-context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'
import { incrementStat, updateStreak } from '@/lib/stats-service'

interface SpotImage {
  id: string
  spot_id: string
  user_id: string
  url: string
  caption: string | null
  created_at: string
}

interface Props {
  spotId: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function PhotoGrid({ spotId }: Props) {
  const { user } = useAuth()
  const { earnAction } = useAchievements()
  const [images, setImages] = useState<SpotImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchImages = useCallback(async () => {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('spot_images')
      .select('*')
      .eq('spot_id', spotId)
      .order('created_at', { ascending: false })

    if (!fetchError && data) {
      setImages(data as SpotImage[])
    }
    setLoading(false)
  }, [spotId])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    // Validate file type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('僅支援 JPG、PNG、WebP 格式')
      setTimeout(() => setError(null), 3000)
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('檔案大小不可超過 5MB')
      setTimeout(() => setError(null), 3000)
      return
    }

    setUploading(true)
    setError(null)

    try {
      // Upload to Supabase Storage
      const ext = file.name.split('.').pop() || 'jpg'
      const fileName = `${user.id}/${spotId}_${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('spot-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        setError('上傳失敗，請稍後再試')
        setTimeout(() => setError(null), 3000)
        return
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('spot-images')
        .getPublicUrl(fileName)

      // Save to spot_images table
      const { error: insertError } = await supabase
        .from('spot_images')
        .insert({
          spot_id: spotId,
          user_id: user.id,
          url: urlData.publicUrl,
        })

      if (insertError) {
        setError('儲存失敗，請稍後再試')
        setTimeout(() => setError(null), 3000)
        return
      }

      await fetchImages()
      earnAction('upload_photo', spotId)
      // 成就系統 v2：累加照片計數器
      if (user) {
        incrementStat(user.id, 'photos_total')
        updateStreak(user.id)
      }
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <FontAwesomeIcon icon={NAV_ICONS.spinner} className="text-primary animate-spin mr-2" />
        <span className="text-sm text-text-secondary">載入照片...</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Upload button */}
      {user ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleUpload}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className={`inline-flex items-center gap-2 px-4 py-2 bg-primary text-text-on-primary rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors cursor-pointer ${
              uploading ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            {uploading ? (
              <>
                <FontAwesomeIcon icon={NAV_ICONS.spinner} className="animate-spin text-xs" />
                上傳中...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={NAV_ICONS.camera} className="text-xs" />
                上傳照片
              </>
            )}
          </label>
          <span className="text-xs text-text-secondary ml-2">
            JPG / PNG / WebP，最大 5MB
          </span>
        </div>
      ) : (
        <div className="text-center py-2 bg-surface-alt rounded-xl border border-border">
          <p className="text-sm text-text-secondary">
            <FontAwesomeIcon icon={NAV_ICONS.lock} className="mr-1" />
            登入後即可上傳照片
          </p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="text-sm text-error bg-error/10 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Photo grid */}
      {images.length === 0 ? (
        <div className="text-center py-6 bg-surface-alt/50 rounded-xl border border-dashed border-border">
          <div className="text-3xl mb-2">📷</div>
          <p className="text-sm font-medium text-text-main mb-1">成為第一個上傳照片的人！</p>
          {user ? (
            <label
              htmlFor="photo-upload"
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-primary text-text-on-primary rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={NAV_ICONS.camera} className="text-xs" />
              上傳照片
            </label>
          ) : (
            <p className="text-xs text-text-secondary/60 mt-1">登入後即可上傳照片</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {images.map(img => (
            <button
              key={img.id}
              onClick={() => setLightboxUrl(img.url)}
              className="aspect-square rounded-lg overflow-hidden border border-border hover:border-primary-light transition-colors cursor-pointer"
            >
              <img
                src={img.url}
                alt={img.caption || '營地照片'}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl cursor-pointer z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70"
            onClick={() => setLightboxUrl(null)}
          >
            <FontAwesomeIcon icon={NAV_ICONS.close} />
          </button>
          <img
            src={lightboxUrl}
            alt="放大照片"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
