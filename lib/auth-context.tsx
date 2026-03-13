'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react'
import { supabase, type UserProfile } from './supabase'
import type { User, Session } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  accessToken: string | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<{ error: string | null }>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  // TODO: 手機登入 - Phase 2 實作
  signInWithPhone: (phone: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  accessToken: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  signInWithPhone: async () => ({ error: null }),
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const loadingResolved = useRef(false)

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) setProfile(data as UserProfile)
  }, [])

  useEffect(() => {
    let cancelled = false

    const resolveLoading = () => {
      if (!loadingResolved.current && !cancelled) {
        loadingResolved.current = true
        setLoading(false)
      }
    }

    // 保底 timer，8秒後強制結束 loading（正常不應觸發）
    const safetyTimer = setTimeout(() => {
      if (!loadingResolved.current) {
        console.warn('[AuthProvider] safety timer triggered after 8s')
        resolveLoading()
      }
    }, 8000)

    // 單一入口：onAuthStateChange 在 mount 時會立刻觸發 INITIAL_SESSION
    // 不再呼叫 getUser()，避免 navigator.locks 競爭導致 auth lock timeout
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (cancelled) return
        setUser(session?.user ?? null)
        setSession(session)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        // INITIAL_SESSION 或任何 auth 事件都代表 loading 完成
        resolveLoading()
      }
    )

    return () => {
      cancelled = true
      clearTimeout(safetyTimer)
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const signInWithEmail = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      return { error: error.message }
    }
    return { error: null }
  }

  const signUpWithEmail = async (email: string, password: string, displayName: string): Promise<{ error: string | null }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    })
    if (error) {
      return { error: error.message }
    }

    // 註冊成功後，更新 users 表的 display_name 並記錄同意條款時間
    if (data.user) {
      await supabase
        .from('users')
        .update({ display_name: displayName, tos_accepted_at: new Date().toISOString() })
        .eq('id', data.user.id)
    }

    return { error: null }
  }

  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    })
    if (error) {
      return { error: error.message }
    }
    return { error: null }
  }

  // TODO: Phase 2 - 實作手機號碼登入（Supabase Phone Auth）
  const signInWithPhone = async (_phone: string): Promise<{ error: string | null }> => {
    // TODO: 使用 supabase.auth.signInWithOtp({ phone }) 實作
    return { error: '手機登入即將推出' }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      accessToken: session?.access_token ?? null,
      loading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      resetPassword,
      signInWithPhone,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
