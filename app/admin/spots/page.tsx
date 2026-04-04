import { adminSupabase } from '@/lib/supabase/admin'

export default async function AdminSpots() {
  const { data: spots } = await adminSupabase
    .from('spots')
    .select('id, name, city, status, gov_certified, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">地標管理</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['名稱', '縣市', '狀態', '合法', '建立時間'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-gray-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {spots?.map(spot => (
              <tr key={spot.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{spot.name}</td>
                <td className="px-4 py-3 text-gray-500">{spot.city || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    spot.status === 'active' || spot.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>{spot.status}</span>
                </td>
                <td className="px-4 py-3">{spot.gov_certified ? '🛡️' : '-'}</td>
                <td className="px-4 py-3 text-gray-400">{new Date(spot.created_at).toLocaleDateString('zh-TW')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
