import { adminSupabase } from '@/lib/supabase/admin'

export default async function AdminReports() {
  const { data: reports } = await adminSupabase
    .from('reports')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">檢舉管理</h1>
      {!reports?.length ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-400">目前沒有待處理的檢舉 ✅</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['類型', '原因', '狀態', '時間'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-gray-600 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{r.target_type}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{r.reason}</td>
                  <td className="px-4 py-3">
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{new Date(r.created_at).toLocaleDateString('zh-TW')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
