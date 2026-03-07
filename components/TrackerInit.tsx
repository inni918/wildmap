'use client'

import { useEffect } from 'react'
import { initTracker } from '@/lib/tracker'

/** 輕量元件：初始化行為追蹤（不渲染任何 DOM） */
export default function TrackerInit() {
  useEffect(() => {
    initTracker()
  }, [])
  return null
}
