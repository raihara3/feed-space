import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import FeedReader from '@/components/FeedReader'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  return (
    <div className="dashboard-layout">
      <FeedReader username={profile?.username || user.email?.split('@')[0] || 'User'} />
    </div>
  )
}