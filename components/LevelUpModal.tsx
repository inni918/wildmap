'use client'

import { useEffect, useState, useCallback } from 'react'
import { type LevelDefinition } from '@/lib/levels'
import { getNewPermissionDescriptions } from '@/lib/permissions'

interface Props {
  newLevel: LevelDefinition
  onClose: () => void
}

export default function LevelUpModal({ newLevel, onClose }: Props) {
  const [phase, setPhase] = useState<'enter' | 'show' | 'exit'>('enter')
  const [showFeatures, setShowFeatures] = useState(false)

  const newFeatures = getNewPermissionDescriptions(newLevel.level)

  useEffect(() => {
    // 進場動畫
    const enterTimer = setTimeout(() => setPhase('show'), 50)
    // 顯示新功能
    const featureTimer = setTimeout(() => setShowFeatures(true), 800)

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(featureTimer)
    }
  }, [])

  const handleClose = useCallback(() => {
    setPhase('exit')
    setTimeout(onClose, 300)
  }, [onClose])

  // 點擊背景關閉
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose()
  }, [handleClose])

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-300 ${
        phase === 'enter' ? 'opacity-0' : phase === 'exit' ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleBackdropClick}
    >
      {/* 背景遮罩 + 粒子效果 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* 發光粒子背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float-particle"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: newLevel.color,
              opacity: Math.random() * 0.5 + 0.2,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* 主卡片 */}
      <div
        className={`relative w-[90%] max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${
          phase === 'show' ? 'scale-100 translate-y-0' : 'scale-75 translate-y-8'
        }`}
        style={{
          background: `linear-gradient(135deg, ${newLevel.color}15, ${newLevel.color}30)`,
          border: `2px solid ${newLevel.color}50`,
        }}
      >
        {/* 頂部光暈 */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-3xl"
          style={{ backgroundColor: `${newLevel.color}40` }}
        />

        <div className="relative p-8 text-center">
          {/* LEVEL UP 文字 */}
          <div className="mb-2">
            <span
              className="text-xs font-bold tracking-[0.3em] uppercase"
              style={{ color: newLevel.color }}
            >
              LEVEL UP!
            </span>
          </div>

          {/* 等級圖示 */}
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full text-4xl mb-4 animate-bounce-gentle"
            style={{
              background: `linear-gradient(135deg, ${newLevel.color}20, ${newLevel.color}40)`,
              boxShadow: `0 0 30px ${newLevel.color}30`,
            }}
          >
            {newLevel.icon}
          </div>

          {/* 等級名稱 */}
          <h2 className="text-2xl font-bold text-text-main mb-1">
            Lv.{newLevel.level} {newLevel.name}
          </h2>

          <p className="text-sm text-text-secondary mb-6">
            恭喜你升級了！繼續探索更多精彩內容 🎉
          </p>

          {/* 新解鎖功能 */}
          {newFeatures.length > 0 && (
            <div
              className={`bg-surface/80 backdrop-blur-sm rounded-2xl p-4 mb-6 text-left transition-all duration-500 ${
                showFeatures ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <h3 className="text-xs font-bold text-text-secondary mb-3 flex items-center gap-1.5">
                <span>🔓</span>
                新解鎖功能
              </h3>
              <ul className="space-y-2">
                {newFeatures.map((feat, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-sm text-text-main"
                    style={{
                      animationDelay: `${idx * 100 + 800}ms`,
                    }}
                  >
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]"
                      style={{ backgroundColor: newLevel.color }}
                    >
                      ✓
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 關閉按鈕 */}
          <button
            onClick={handleClose}
            className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 active:scale-95 cursor-pointer"
            style={{ backgroundColor: newLevel.color }}
          >
            太棒了！繼續探索
          </button>
        </div>
      </div>

      {/* Animations via global style tag */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-30px) scale(1.5); opacity: 0.6; }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-particle { animation: float-particle 3s ease-in-out infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
      `}} />
    </div>
  )
}
