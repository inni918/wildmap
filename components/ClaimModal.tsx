'use client'

import { useState, useRef } from 'react'
import { supabase, type Spot } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'
import { faStore, faUpload, faFile, faCircleCheck } from '@fortawesome/free-solid-svg-icons'

interface Props {
  spot: Spot
  onClose: () => void
  onSubmitted: () => void
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']

export default function ClaimModal({ spot, onClose, onSubmitted }: Props) {
  const { user } = useAuth()
  const [businessName, setBusinessName] = useState(spot.name || '')
  const [contactPhone, setContactPhone] = useState(spot.phone || '')
  const [contactEmail, setContactEmail] = useState(spot.email || '')
  const [notes, setNotes] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError('僅支援 JPG、PNG、WebP 或 PDF 格式')
      setTimeout(() => setError(null), 3000)
      return
    }

    if (selected.size > MAX_FILE_SIZE) {
      setError('檔案大小不可超過 10MB')
      setTimeout(() => setError(null), 3000)
      return
    }

    setFile(selected)
    setError(null)
  }

  const handleSubmit = async () => {
    if (!user) return

    // 驗證必填
    if (!businessName.trim()) {
      setError('請填寫商家名稱')
      return
    }

    if (!contactPhone.trim() && !contactEmail.trim()) {
      setError('請至少填寫聯繫電話或 Email 其中一項')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      let proofUrl: string | null = null

      // 上傳證明文件
      if (file) {
        const ext = file.name.split('.').pop() || 'jpg'
        const tempId = crypto.randomUUID()
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const filePath = `${user.id}/${tempId}/${sanitizedName}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('business-proofs')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          setError('證明文件上傳失敗，請稍後再試')
          setSubmitting(false)
          return
        }

        // 取得 signed URL（私有 bucket）
        const { data: signedData } = await supabase.storage
          .from('business-proofs')
          .createSignedUrl(filePath, 60 * 60 * 24 * 365) // 1 年有效

        proofUrl = signedData?.signedUrl || filePath
      }

      // 建立申請
      const { error: insertError } = await supabase
        .from('business_claims')
        .insert({
          spot_id: spot.id,
          user_id: user.id,
          business_name: businessName.trim(),
          contact_phone: contactPhone.trim() || null,
          contact_email: contactEmail.trim() || null,
          proof_url: proofUrl,
          notes: notes.trim() || null,
        })

      if (insertError) {
        setError('提交失敗，請稍後再試')
        setSubmitting(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        onSubmitted()
      }, 2000)
    } catch {
      setError('發生錯誤，請稍後再試')
      setSubmitting(false)
    }
  }

  // 提交成功畫面
  if (success) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
        onClick={onClose}
      >
        <div
          className="bg-surface rounded-2xl w-full max-w-md shadow-2xl p-8 text-center animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#22C55E20' }}
          >
            <FontAwesomeIcon icon={faCircleCheck} className="text-3xl" style={{ color: '#22C55E' }} />
          </div>
          <h3 className="text-lg font-bold text-text-main mb-2">申請已送出！</h3>
          <p className="text-sm text-text-secondary">我們會盡快審核您的商家認證申請，請耐心等候。</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl w-full max-w-md shadow-2xl flex flex-col animate-slide-up"
        style={{ maxHeight: '85vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faStore} className="text-primary" />
            <h3 className="text-base font-bold text-text-main">聲明擁有權</h3>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-main p-2 cursor-pointer"
          >
            <FontAwesomeIcon icon={NAV_ICONS.close} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <p className="text-xs text-text-secondary">
            聲明您是「{spot.name}」的擁有者或經營者。通過認證後，您可以直接編輯地點資訊。
          </p>

          {/* 商家名稱 */}
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              商家名稱 <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="例：陽光露營區"
              className="w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              maxLength={100}
            />
          </div>

          {/* 聯繫電話 */}
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              聯繫電話
            </label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="例：0912-345-678"
              className="w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              maxLength={20}
            />
          </div>

          {/* 聯繫 Email */}
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              聯繫 Email
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="例：owner@example.com"
              className="w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              maxLength={100}
            />
            <p className="text-xs text-text-secondary/60 mt-1">
              電話或 Email 至少填寫一項
            </p>
          </div>

          {/* 證明文件上傳 */}
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              證明文件（選填）
            </label>
            <p className="text-xs text-text-secondary/60 mb-2">
              營業登記證、統編證明等文件，有助加速審核
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="proof-upload"
            />
            {file ? (
              <div className="flex items-center gap-2 p-3 bg-surface-alt rounded-xl border border-border">
                <FontAwesomeIcon icon={faFile} className="text-primary text-sm" />
                <span className="text-sm text-text-main flex-1 truncate">{file.name}</span>
                <button
                  onClick={() => {
                    setFile(null)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  className="text-text-secondary hover:text-error text-xs cursor-pointer p-1"
                >
                  <FontAwesomeIcon icon={NAV_ICONS.close} />
                </button>
              </div>
            ) : (
              <label
                htmlFor="proof-upload"
                className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
              >
                <FontAwesomeIcon icon={faUpload} className="text-text-secondary" />
                <span className="text-sm text-text-secondary">點擊上傳證明文件</span>
              </label>
            )}
            <p className="text-xs text-text-secondary/60 mt-1">
              支援 JPG、PNG、WebP、PDF，最大 10MB
            </p>
          </div>

          {/* 備註說明 */}
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              備註說明（選填）
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="其他補充說明..."
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
              maxLength={500}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-error bg-error/10 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3 bg-primary text-text-on-primary rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <FontAwesomeIcon icon={NAV_ICONS.spinner} className="animate-spin text-xs" />
                提交中...
              </>
            ) : (
              '提交申請'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
