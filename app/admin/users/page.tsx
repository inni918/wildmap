import { adminSupabase } from '@/lib/supabase/admin'

export default async function AdminUsers() {
  const { data: users } = await adminSupabase
    .from('users')
    .select('id, display_name, username, level, role, is_active, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">用戶管理</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['名稱', '帳號', '等級', '角色', '狀態', '加入時間'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-gray-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users?.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{u.display_name || '-'}</td>
                <td className="px-4 py-3 text-gray-500">{u.username || '-'}</td>
                <td className="px-4 py-3">Lv{u.level}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                  }`}>{u.role}</span>
                </td>
                <td className="px-4 py-3">{u.is_active ? '✅' : '🚫'}</td>
                <td className="px-4 py-3 text-gray-400">{new Date(u.created_at).toLocaleDateString('zh-TW')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
