'use client'

import dynamic from 'next/dynamic'

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
          <span className="text-2xl">🗺️</span>
        </div>
        <p className="text-text-secondary text-sm">載入地圖中...</p>
      </div>
    </div>
  ),
})

export default function MapPage() {
  return (
    <main className="w-full h-screen">
      <Map />
    </main>
  )
}
