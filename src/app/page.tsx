import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ItemList from '@/components/ItemList'

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
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex-shrink-0 hidden lg:block">
        <Sidebar username={profile?.username || user.email?.split('@')[0] || 'User'} />
      </div>
      
      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        {/* Mobile layout will be added later */}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ItemList />
      </div>
    </div>
  )
}