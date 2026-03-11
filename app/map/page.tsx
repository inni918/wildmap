'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback, useRef } from 'react'
import type { FreeFilter } from '@/components/FilterChips'

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
  const [nameFilter, setNameFilter] = useState('')
  const [freeFilter, setFreeFilter] = useState<FreeFilter>('all')
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])

  // isFreeFilter：null=全部, true=免費, false=付費
  const isFreeFilter: boolean | null =
    freeFilter === 'free' ? true : freeFilter === 'paid' ? false : null

  // Debounced name filter（避免每次按鍵都 refetch）
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [debouncedName, setDebouncedName] = useState('')

  const handleNameChange = useCallback((value: string) => {
    setNameFilter(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedName(value)
    }, 300)
  }, [])

  const handleFreeFilterChange = useCallback((v: FreeFilter) => {
    setFreeFilter(v)
  }, [])

  const handleFacilitiesChange = useCallback((keys: string[]) => {
    setSelectedFacilities(keys)
  }, [])

  return (
    <main className="w-full h-screen">
      <Map
        nameFilter={debouncedName}
        onNameFilterChange={handleNameChange}
        isFreeFilter={isFreeFilter}
        onFreeFilterChange={handleFreeFilterChange}
        facilityKeys={selectedFacilities}
        onFacilitiesChange={handleFacilitiesChange}
      />
    </main>
  )
}
