import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { itemId, isRead } = await request.json()

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }

    const updateData: any = { is_read: isRead }
    
    if (isRead) {
      updateData.read_at = new Date().toISOString()
    } else {
      updateData.read_at = null
    }

    // Update the feed_items record
    const { error } = await supabase
      .from('feed_items')
      .update(updateData)
      .eq('id', itemId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating read status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}