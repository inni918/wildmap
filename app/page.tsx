'use client'

import { AuthProvider } from '@/lib/auth-context'
import Map from '@/components/Map'

export default function Home() {
  return (
    <AuthProvider>
      <main className="w-full h-screen">
        <Map />
      </main>
    </AuthProvider>
  )
}
