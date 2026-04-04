'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/')
        router.refresh()
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage('請檢查信箱確認帳號！')
      }
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : '發生錯誤')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` }
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🏕️</div>
        <h1 className="text-xl font-bold text-gray-900">Wildmap</h1>
        <p className="text-sm text-gray-500 mt-1">台灣最完整的露營地圖</p>
      </div>

      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        <button onClick={() => setMode('login')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'login' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
          登入
        </button>
        <button onClick={() => setMode('signup')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'signup' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
          註冊
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="電子信箱" required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-green" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder="密碼" required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-green" />
        {message && <p className="text-sm text-center text-red-500">{message}</p>}
        <button type="submit" disabled={loading}
          className="w-full py-3 bg-brand-green text-white rounded-xl text-sm font-medium hover:bg-brand-green-dark transition-colors disabled:opacity-50">
          {loading ? '處理中...' : mode === 'login' ? '登入' : '註冊'}
        </button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
        <div className="relative text-center text-xs text-gray-400 bg-white px-2 mx-auto w-fit">或</div>
      </div>

      <button onClick={handleGoogle}
        className="w-full py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
        <span>🌐</span> Google 登入
      </button>
    </div>
  )
}
