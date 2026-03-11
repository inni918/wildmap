'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback, useRef } from 'react'
import FilterBottomSheet, { type FilterState } from '@/components/FilterBottomSheet'

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
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [appliedFilter, setAppliedFilter] = useState<FilterState>({
    featureKeys: [],
  })

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

  const handleFilterApply = useCallback((filter: FilterState) => {
    setAppliedFilter(filter)
  }, [])

  const activeFilterCount = appliedFilter.featureKeys.length

  return (
    <main className="w-full h-screen">
      <Map
        nameFilter={debouncedName}
        onNameFilterChange={handleNameChange}
        isFreeFilter={null}
        facilityKeys={appliedFilter.featureKeys}
        onFilterClick={() => setFilterSheetOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      {/* ── 篩選 Bottom Sheet ── */}
      <FilterBottomSheet
        open={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        filter={appliedFilter}
        onApply={handleFilterApply}
      />
    </main>
  )
}
