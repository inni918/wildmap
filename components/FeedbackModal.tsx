'use client'

import { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'
import { useAuth } from '@/lib/auth-context'
import { useAchievements } from '@/lib/achievement-context'
import { supabase } from '@/lib/supabase'

type FeedbackType = 'bug' | 'suggestion' | 'other'

const FEEDBACK_TYPES: { value: FeedbackType; label: string; icon: string; description: string }[] = [
  { value: 'bug', label: 'Bug 回報', icon: '🐛', description: '遇到錯誤或異常' },
  { value: 'suggestion', label: '改進建議', icon: '💡', description: '功能建議或使用體驗' },
  { value: 'other', label: '其他', icon: '💬', description: '其他想說的話' },
]

interface FeedbackModalProps {
  open: boolean
  onClose: () => void
}

export default function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const { user } = useAuth()
  const { triggerCheck } = useAchievements()
  const [type, setType] = useState<FeedbackType | null>(null)
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const charCount = description.trim().length
  const isValid = type !== null && charCount >= 10 && charCount <= 500

  const handleSubmit = useCallback(async () => {
    if (!isValid || submitting) return
    setSubmitting(true)
    setError(null)

    try {
      // 取得 access token（如果已登入）
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData?.session?.access_token) {
        headers['Authorization'] = `Bearer ${sessionData.session.access_token}`
      }

      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers,
        body: JSON.stringify({ type, description: description.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error?.message || '送出失敗，請稍後再試')
        return
      }

      setSubmitted(true)

      // 觸發成就檢查（如果已登入）
      if (user) {
        triggerCheck()
      }
    } catch {
      setError('網路錯誤，請稍後再試')
    } finally {
      setSubmitting(false)
    }
  }, [isValid, submitting, type, description, user, triggerCheck])

  const handleClose = useCallback(() => {
    // 重置所有狀態
    setType(null)
    setDescription('')
    setSubmitted(false)
    setError(null)
    onClose()
  }, [onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="bg-surface rounded-t-2xl sm:rounded-2xl border border-border w-full sm:max-w-md sm:mx-4 shadow-xl max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-lg font-bold text-text-main">💬 意見回饋</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-alt text-text-secondary transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={NAV_ICONS.close} className="text-sm" />
          </button>
        </div>

        {submitted ? (
          /* 送出成功 */
          <div className="px-5 pb-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-4xl">🙏</span>
            </div>
            <h3 className="text-base font-bold text-text-main mb-2">感謝你的回饋！</h3>
            <p className="text-sm text-text-secondary mb-5">
              我們會盡快處理，讓 Wildmap 變得更好 🌟
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2.5 bg-primary text-text-on-primary rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors cursor-pointer"
            >
              好的
            </button>
          </div>
        ) : (
          /* 表單 */
          <div className="px-5 pb-5">
            {/* 類型選擇 */}
            <div className="mb-4">
              <label className="text-sm font-medium text-text-main mb-2 block">回饋類型</label>
              <div className="grid grid-cols-3 gap-2">
                {FEEDBACK_TYPES.map(ft => (
                  <button
                    key={ft.value}
                    onClick={() => setType(ft.value)}
                    className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-center transition-all cursor-pointer ${
                      type === ft.value
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'border-border hover:border-primary/50 hover:bg-surface-alt'
                    }`}
                  >
                    <span className="text-2xl">{ft.icon}</span>
                    <span className={`text-xs font-medium ${
                      type === ft.value ? 'text-primary' : 'text-text-main'
                    }`}>
                      {ft.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 描述文字 */}
            <div className="mb-4">
              <label className="text-sm font-medium text-text-main mb-2 block">描述</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={
                  type === 'bug'
                    ? '請描述你遇到的問題，例如什麼操作會導致錯誤...'
                    : type === 'suggestion'
                    ? '告訴我們你的想法，如何讓平台更好...'
                    : '想說什麼都可以...'
                }
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 border border-border rounded-xl text-sm text-text-main bg-surface placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
              />
              <div className="flex justify-between mt-1.5">
                <span className={`text-xs ${
                  charCount < 10 ? 'text-text-secondary' : charCount > 450 ? 'text-error' : 'text-text-secondary'
                }`}>
                  {charCount < 10 ? `至少 ${10 - charCount} 字` : ''}
                </span>
                <span className={`text-xs ${charCount > 450 ? 'text-error' : 'text-text-secondary'}`}>
                  {charCount}/500
                </span>
              </div>
            </div>

            {/* 匿名提示 */}
            {!user && (
              <div className="mb-4 flex items-start gap-2 px-3 py-2.5 rounded-xl bg-surface-alt border border-border">
                <span className="text-sm mt-0.5">👤</span>
                <p className="text-xs text-text-secondary">
                  你目前未登入，回饋將以匿名方式送出。
                  <a href="/login" className="text-primary hover:underline ml-1">登入</a>
                  後可追蹤回饋進度和獲得成就。
                </p>
              </div>
            )}

            {/* 錯誤訊息 */}
            {error && (
              <div className="mb-4 px-3 py-2.5 rounded-xl bg-error/10 border border-error/20">
                <p className="text-xs text-error">{error}</p>
              </div>
            )}

            {/* 送出按鈕 */}
            <button
              onClick={handleSubmit}
              disabled={!isValid || submitting}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                isValid && !submitting
                  ? 'bg-primary text-text-on-primary hover:bg-primary-dark cursor-pointer active:scale-[0.98]'
                  : 'bg-surface-alt text-text-secondary cursor-not-allowed'
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={NAV_ICONS.spinner} className="animate-spin text-xs" />
                  送出中...
                </span>
              ) : (
                '送出回饋'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
