'use client'

import { type ReactNode, useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { checkPermission, type Permission } from '@/lib/permissions'
import {
  hasPermission as hasPermV2,
  getPermissionDescription,
  isBasePermission,
  PERMISSION_REQUIREMENTS,
} from '@/lib/permission-service'
import { LEVELS } from '@/lib/levels'

interface Props {
  /** 需要的權限 */
  permission: Permission
  /** 有權限時顯示的內容 */
  children: ReactNode
  /** 無權限時的替代內容（可選，預設顯示鎖定提示） */
  fallback?: ReactNode
  /** 隱藏模式：無權限時完全不顯示（不顯示提示） */
  hide?: boolean
  /** 使用 v2 成就系統權限檢查 */
  v2?: boolean
}

/**
 * 權限閘門組件
 * 包裝在需要權限檢查的 UI 元素外層
 *
 * 用法：
 * <PermissionGate permission="add_spot">
 *   <AddSpotButton />
 * </PermissionGate>
 */
export default function PermissionGate({ permission, children, fallback, hide, v2 }: Props) {
  const { profile, user } = useAuth()
  const userLevel = profile?.level || 1

  // V2 模式：使用成就系統權限
  if (v2) {
    return (
      <PermissionGateV2
        permission={permission}
        fallback={fallback}
        hide={hide}
      >
        {children}
      </PermissionGateV2>
    )
  }

  // V1 fallback：等級權限
  const result = checkPermission(permission, userLevel)

  if (result.allowed) {
    return <>{children}</>
  }

  if (hide) return null

  if (fallback) return <>{fallback}</>

  // 預設鎖定提示
  const requiredLevelInfo = LEVELS.find(l => l.level === result.requiredLevel)

  return (
    <div className="relative group">
      {/* 半透明遮罩 */}
      <div className="opacity-40 pointer-events-none select-none">
        {children}
      </div>
      {/* 鎖定提示 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-surface/95 backdrop-blur-sm border border-border rounded-xl px-3 py-2 shadow-lg text-center max-w-[200px]">
          <div className="text-sm mb-0.5">🔒</div>
          <p className="text-xs font-medium text-text-main">
            需要 Lv.{result.requiredLevel} {requiredLevelInfo?.name || ''}
          </p>
          <p className="text-[10px] text-text-secondary mt-0.5">
            {result.description}
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * V2 權限閘門（成就系統 v2）
 */
function PermissionGateV2({
  permission,
  children,
  fallback,
  hide,
}: {
  permission: string
  children: ReactNode
  fallback?: ReactNode
  hide?: boolean
}) {
  const { user } = useAuth()
  const router = useRouter()
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (!user) {
      setAllowed(false)
      return
    }
    if (isBasePermission(permission)) {
      setAllowed(true)
      return
    }
    hasPermV2(user.id, permission).then(setAllowed)
  }, [user, permission])

  if (allowed === null) return <>{children}</> // loading, optimistic
  if (allowed) return <>{children}</>
  if (hide) return null
  if (fallback) return <>{fallback}</>

  const req = PERMISSION_REQUIREMENTS[permission]
  const hint = req?.profileComplete
    ? '完成個人資料即可使用'
    : req?.description || '需要解鎖相關技能'

  const handleClick = () => {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
    // 如果是 profile 相關的，跳轉 profile
    if (req?.profileComplete) {
      setTimeout(() => router.push('/profile'), 800)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="w-full opacity-50 cursor-pointer"
      >
        <div className="pointer-events-none">
          {children}
        </div>
      </button>

      {/* Toast 提示 */}
      {showToast && (
        <div className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none animate-slide-down">
          <div className="bg-[#2D6A4F]/95 text-white rounded-xl px-4 py-3 shadow-lg max-w-sm w-full">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔒</span>
              <div>
                <p className="text-xs font-bold">功能未解鎖</p>
                <p className="text-[10px] text-white/70">{hint}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

/**
 * Hook 版本：用於程式邏輯中的權限檢查
 */
export function usePermission(permission: Permission) {
  const { profile, loading } = useAuth()
  const userLevel = profile?.level ?? 1
  const result = checkPermission(permission, userLevel)
  if (loading && !profile) {
    return { ...result, allowed: false, isLoading: true }
  }
  return { ...result, isLoading: false }
}

/**
 * V2 Hook：成就系統權限檢查
 */
export function usePermissionV2(permission: string) {
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
    if (isBasePermission(permission)) {
      setAllowed(true)
      setLoading(false)
      return
    }

    hasPermV2(user.id, permission).then(result => {
      setAllowed(result)
      setLoading(false)
    })
  }, [user, authLoading, permission])

  const description = getPermissionDescription(permission)
  const req = PERMISSION_REQUIREMENTS[permission]
  const unlockHint = !allowed && req
    ? req.profileComplete
      ? '完成個人資料即可解鎖'
      : req.description
    : ''

  return { allowed, isLoading: loading, description, unlockHint }
}
