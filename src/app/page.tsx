import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import FeedList from '@/components/FeedList'
import ItemList from '@/components/ItemList'
import Header from '@/components/Header'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <FeedList />
          </div>
          <div className="lg:col-span-3">
            <ItemList />
          </div>
        </div>
      </div>
    </div>
  )
}