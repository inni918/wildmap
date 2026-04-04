import { adminSupabase } from '@/lib/supabase/admin'

export default async function AdminDashboard() {
  const [
    { count: spotsCount },
    { count: usersCount },
    { count: commentsCount },
    { count: reportsCount }
  ] = await Promise.all([
    adminSupabase.from('spots').select('*', { count: 'exact', head: true }),
    adminSupabase.from('users').select('*', { count: 'exact', head: true }),
    adminSupabase.from('comments').select('*', { count: 'exact', head: true }),
    adminSupabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ])

  const stats = [
    { label: '露營地', value: spotsCount || 0, emoji: '🏕️' },
    { label: '用戶', value: usersCount || 0, emoji: '👤' },
    { label: '留言', value: commentsCount || 0, emoji: '💬' },
    { label: '待處理檢舉', value: reportsCount || 0, emoji: '🚨' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm">
            <div className="text-3xl mb-2">{s.emoji}</div>
            <div className="text-2xl font-bold text-gray-900">{s.value.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
