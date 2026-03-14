'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { checkProfileComplete, recalcPermissions } from '@/lib/stats-service'

interface Props {
  onComplete: () => void
  onClose: () => void
}

export default function ProfileCompleteModal({ onComplete, onClose }: Props) {
  const { user, profile } = useAuth()
  const [displayName, setDisplayName] = useState(profile?.display_name || '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 檢查條件
  const hasAvatar = !!avatarUrl
  const hasName = displayName.trim().length > 0
  // NOTE: 目前 users 表沒有 bio 欄位，所以暫時只檢查頭像+暱稱
  const allComplete = hasAvatar && hasName

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    // 檢查檔案大小和類型
    if (file.size > 2 * 1024 * 1024) {
      setError('照片不能超過 2MB')
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('只接受 JPG、PNG、WebP 格式')
      return
    }

    setUploading(true)
    setError(null)

    try {
      // 預覽
      const previewUrl = URL.createObjectURL(file)
      setAvatarPreview(previewUrl)

      // 上傳到 Supabase Storage
      const ext = file.name.split('.').pop()
      const path = `avatars/${user.id}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(path, file, { upsert: true })

      if (uploadError) {
        setError('上傳失敗，請再試一次')
        setAvatarPreview(avatarUrl)
        return
      }

      // 取得公開 URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(path)

      setAvatarUrl(publicUrl)
    } catch {
      setError('上傳失敗')
      setAvatarPreview(avatarUrl)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!user || !allComplete || saving) return
    setSaving(true)
    setError(null)

    try {
      // 更新 users 表
      const { error: updateError } = await supabase
        .from('users')
        .update({
          display_name: displayName.trim(),
          avatar_url: avatarUrl,
          profile_completed: true,
        })
        .eq('id', user.id)

      if (updateError) {
        setError('儲存失敗，請再試一次')
        return
      }

      // 重算權限快取
      await recalcPermissions(user.id)

      // 顯示成就解鎖 Toast
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
        onComplete()
      }, 2500)
    } catch {
      setError('儲存失敗')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4"
        onClick={onClose}
      >
        <div
          className="bg-surface rounded-2xl border border-border w-full max-w-sm shadow-2xl animate-fade-in overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2D6A4F] to-[#52B788] px-6 py-4 text-center">
            <span className="text-3xl">🏕️</span>
            <h2 className="text-lg font-bold text-white mt-2">完善你的冒險者檔案</h2>
            <p className="text-xs text-white/80 mt-1">
              完成後即可解鎖評分、留言、上傳照片！
            </p>
          </div>

          {/* 內容 */}
          <div className="p-6 space-y-5">
            {/* 頭像 */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="relative w-20 h-20 rounded-full border-3 border-dashed border-border hover:border-primary transition-colors cursor-pointer overflow-hidden group"
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="頭像"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-alt flex items-center justify-center">
                    <span className="text-2xl text-text-secondary/40 group-hover:text-primary/60 transition-colors">
                      📷
                    </span>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <div className="flex items-center gap-1.5">
                <CheckMark done={hasAvatar} />
                <span className="text-xs text-text-secondary">上傳頭像</span>
              </div>
            </div>

            {/* 暱稱 */}
            <div>
              <label className="text-xs font-medium text-text-secondary block mb-1.5">
                <CheckMark done={hasName} /> 暱稱
              </label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="取一個代表你的名字"
                maxLength={30}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-surface focus:border-primary focus:outline-none text-sm text-text-main placeholder:text-text-secondary/40"
              />
            </div>

            {/* 錯誤提示 */}
            {error && (
              <p className="text-xs text-error text-center bg-error/10 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* 提交 */}
            <button
              onClick={handleSubmit}
              disabled={!allComplete || saving}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                allComplete
                  ? 'bg-[#2D6A4F] hover:bg-[#245a42] text-white shadow-md cursor-pointer'
                  : 'bg-border/30 text-text-secondary/50 cursor-not-allowed'
              }`}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  儲存中...
                </span>
              ) : allComplete ? (
                '🎉 完成檔案'
              ) : (
                '請完成上方項目'
              )}
            </button>
          </div>

          {/* 關閉按鈕 */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 成就解鎖 Toast */}
      {showToast && (
        <div className="fixed top-4 left-0 right-0 z-[110] flex justify-center px-4 pointer-events-none">
          <div className="pointer-events-auto bg-[#2D6A4F]/95 text-white rounded-2xl border-2 border-[#52B788] px-5 py-3.5 shadow-2xl animate-bounce-in max-w-sm w-full">
            <div className="text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#52B788]">
                🎉 技能解鎖！
              </div>
              <div className="text-sm font-bold mt-1">
                評分、留言、上傳照片
              </div>
              <div className="text-xs text-white/70 mt-0.5">
                恭喜成為合格的冒險者！
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.8) translateY(-20px); }
          50% { transform: scale(1.05) translateY(0); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

function CheckMark({ done }: { done: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] ${
        done ? 'bg-[#2D6A4F] text-white' : 'bg-border/30 text-text-secondary/40'
      }`}
    >
      {done ? '✓' : '○'}
    </span>
  )
}
