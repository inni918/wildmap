import type { Metadata } from 'next'
import { AuthProvider } from '@/lib/auth-context'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export const metadata: Metadata = {
  title: 'Wildmap 後台管理',
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className="font-sans antialiased bg-[var(--color-surface-alt)] text-[var(--color-text)]">
        <AuthProvider>
          <div className="flex min-h-screen">
            <AdminSidebar />
            <div className="flex-1 ml-60 flex flex-col min-h-screen">
              <AdminHeader />
              <main className="flex-1 p-6">{children}</main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
