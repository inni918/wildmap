'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signInWithEmail } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/admin'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signInWithEmail(email, password)
    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    // 登入成功，跳轉
    router.push(redirect)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg border border-[var(--color-border)] p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">🏕️</div>
            <h1 className="text-xl font-bold text-[var(--color-primary)]">
              Wildmap 後台
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              管理員登入
            </p>
          </div>

          {/* 表單 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@wildmap.tw"
                required
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">密碼</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
            </div>

            {error && (
              <div className="text-sm text-[var(--color-error)] bg-red-50 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[var(--color-primary)] text-white rounded-lg font-medium text-sm hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? '登入中...' : '登入'}
            </button>
          </form>

          <div className="text-center mt-6">
            <a
              href="/"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
            >
              ← 回到前台
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
