import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-brand-green text-white px-6 py-3 flex items-center justify-between">
        <div className="font-bold">Wildmap 後台</div>
        <div className="flex gap-4 text-sm">
          <a href="/admin" className="hover:opacity-80">Dashboard</a>
          <a href="/admin/spots" className="hover:opacity-80">地標</a>
          <a href="/admin/users" className="hover:opacity-80">用戶</a>
          <a href="/admin/reports" className="hover:opacity-80">檢舉</a>
          <a href="/" className="hover:opacity-80">← 前台</a>
        </div>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  )
}
