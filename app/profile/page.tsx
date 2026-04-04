import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileView from '@/components/profile/ProfileView'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: achievements } = await supabase
    .from('user_achievements')
    .select('*, achievements(code, name, icon_name, category, tiers)')
    .eq('user_id', user.id)
    .order('unlocked_at', { ascending: false })

  const { data: stats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return <ProfileView user={user} profile={profile} achievements={achievements || []} stats={stats} />
}
