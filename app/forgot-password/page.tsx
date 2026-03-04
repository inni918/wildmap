'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await resetPassword(email)
    if (result.error) {
      setError(result.error)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light/10 to-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 no-underline">
            <FontAwesomeIcon icon={NAV_ICONS.map} className="text-primary text-2xl" />
            <h1 className="text-3xl font-bold text-primary-dark">Wildmap</h1>
          </Link>
          <p className="text-text-secondary mt-2">重設密碼</p>
        </div>

        {/* Card */}
        <div className="bg-surface rounded-2xl shadow-lg border border-border p-6">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-light/20 flex items-center justify-center">
                <FontAwesomeIcon icon={NAV_ICONS.envelope} className="text-primary text-2xl" />
              </div>
              <h2 className="text-lg font-semibold text-text-main mb-2">重設密碼信已寄出</h2>
              <p className="text-sm text-text-secondary mb-6">
                請檢查 <span className="font-medium text-text-main">{email}</span> 的收件匣，點擊信中連結來重設密碼。
              </p>
              <Link
                href="/login"
                className="inline-block bg-primary hover:bg-primary-dark text-text-on-primary font-semibold px-6 py-2.5 rounded-[10px] transition-colors no-underline"
              >
                返回登入
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-text-secondary mb-6">
                輸入你的 Email，我們會寄一封重設密碼的信給你。
              </p>

              {error && (
                <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-[10px] text-error text-sm flex items-center gap-2">
                  <FontAwesomeIcon icon={NAV_ICONS.warning} className="text-xs flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-2.5 border border-border rounded-[10px] focus:ring-2 focus:ring-primary-light focus:border-primary outline-none text-sm transition-shadow bg-surface"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-dark text-text-on-primary font-semibold py-2.5 rounded-[10px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? '寄送中...' : '寄送重設密碼信'}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Back to login */}
        <div className="text-center mt-6">
          <Link href="/login" className="text-sm text-text-secondary hover:text-primary transition-colors inline-flex items-center gap-1">
            <FontAwesomeIcon icon={NAV_ICONS.back} className="text-xs" />
            返回登入
          </Link>
        </div>
      </div>
    </div>
  )
}
