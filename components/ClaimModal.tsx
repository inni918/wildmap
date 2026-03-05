'use client'

import { type Spot } from '@/lib/supabase'

interface Props {
  spot: Spot
  onClose: () => void
  onSubmitted: () => void
}

/**
 * TODO: 實作商家認證申請 Modal
 * 這是一個佔位元件，避免建置錯誤。
 */
export default function ClaimModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-lg font-bold mb-2 text-text-main">商家認證</h2>
        <p className="text-sm text-text-secondary mb-4">
          此功能即將推出，敬請期待！
        </p>
        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
        >
          關閉
        </button>
      </div>
    </div>
  )
}
