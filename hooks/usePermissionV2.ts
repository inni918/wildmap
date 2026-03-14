'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import {
  hasPermission as checkPerm,
  hasPermissions as checkPerms,
  getPermissionDescription,
  isBasePermission,
  PERMISSION_REQUIREMENTS,
} from '@/lib/permission-service'

export interface PermissionV2Result {
  allowed: boolean
  loading: boolean
  /** 權限描述（給 Toast 顯示用） */
  description: string
  /** 解鎖提示文字 */
  unlockHint: string
}

/**
 * 成就系統 v2 的權限 hook
 * 檢查使用者的 permissions_cache JSONB
 */
export function usePermissionV2(permission: string): PermissionV2Result {
  const { user, loading: authLoading } = useAuth()
  const [allowed, setAllowed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setAllowed(false)
      setLoading(false)
      return
    }

    // 基礎權限不需要查 DB
    if (isBasePermission(permission)) {
      setAllowed(true)
      setLoading(false)
      return
    }

    let cancelled = false
    checkPerm(user.id, permission).then(result => {
      if (!cancelled) {
        setAllowed(result)
        setLoading(false)
      }
    })

    return () => { cancelled = true }
  }, [user, authLoading, permission])

  const description = getPermissionDescription(permission)
  const req = PERMISSION_REQUIREMENTS[permission]

  let unlockHint = ''
  if (!allowed && req) {
    if (req.profileComplete) {
      unlockHint = '完成個人資料即可解鎖'
    } else if (req.achievements?.length) {
      unlockHint = req.description
    } else {
      unlockHint = '繼續探索以解鎖'
    }
  }

  return { allowed, loading, description, unlockHint }
}

/**
 * 批次權限 hook（一次查多個）
 */
export function usePermissionsV2(permissions: string[]): {
  results: Record<string, boolean>
  loading: boolean
} {
  const { user, loading: authLoading } = useAuth()
  const [results, setResults] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      const empty: Record<string, boolean> = {}
      permissions.forEach(p => { empty[p] = false })
      setResults(empty)
      setLoading(false)
      return
    }

    let cancelled = false
    checkPerms(user.id, permissions).then(result => {
      if (!cancelled) {
        // 補上基礎權限
        const final = { ...result }
        permissions.forEach(p => {
          if (isBasePermission(p)) final[p] = true
        })
        setResults(final)
        setLoading(false)
      }
    })

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, permissions.join(',')])

  return { results, loading }
}
