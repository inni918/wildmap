'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function ConditionalFooter() {
  const pathname = usePathname()

  // 地圖頁面已有底部免責 bar，不重複顯示 Footer
  if (pathname === '/map' || pathname?.startsWith('/map/')) {
    return null
  }

  return <Footer />
}
