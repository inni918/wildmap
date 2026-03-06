'use client'

import { type ReactNode } from 'react'
import { useAuth } from '@/lib/auth-context'
import { checkPermission, type Permission } from '@/lib/permissions'
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
export default function PermissionGate({ permission, children, fallback, hide }: Props) {
  const { profile } = useAuth()
  const userLevel = profile?.level || 1

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
 * Hook 版本：用於程式邏輯中的權限檢查
 */
export function usePermission(permission: Permission) {
  const { profile } = useAuth()
  const userLevel = profile?.level || 1
  return checkPermission(permission, userLevel)
}
