import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: readLaterItems, error } = await supabase
      .from('read_later')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching read later items:', error)
      return NextResponse.json({ error: 'Failed to fetch read later items' }, { status: 500 })
    }

    return NextResponse.json({ readLaterItems: readLaterItems || [] })
  } catch (error) {
    console.error('Error in read-later GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { feedItemId } = await request.json()
    
    if (!feedItemId) {
      return NextResponse.json({ error: 'Feed item ID is required' }, { status: 400 })
    }

    // Check current count
    const { count } = await supabase
      .from('read_later')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (count && count >= 5) {
      return NextResponse.json({ 
        error: '5件以上は登録できません。情報が新しいうちに早めに読みましょう！' 
      }, { status: 400 })
    }

    // Get feed item details
    const { data: feedItem, error: fetchError } = await supabase
      .from('feed_items')
      .select(`
        id,
        title,
        link,
        description,
        published_at,
        feeds!inner (
          id,
          title
        )
      `)
      .eq('id', feedItemId)
      .single()

    if (fetchError || !feedItem) {
      return NextResponse.json({ error: 'Feed item not found' }, { status: 404 })
    }

    // Extract feed data (feeds might be an array or object)
    const feedsData = Array.isArray(feedItem.feeds) ? feedItem.feeds[0] : feedItem.feeds
    const feedData = feedsData as { id: string; title: string }

    // Check if already exists by link
    const { data: existing } = await supabase
      .from('read_later')
      .select('id')
      .eq('user_id', user.id)
      .eq('link', feedItem.link)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Already added to read later' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('read_later')
      .insert({
        user_id: user.id,
        feed_item_id: feedItemId,
        title: feedItem.title,
        link: feedItem.link,
        description: feedItem.description,
        published_at: feedItem.published_at,
        feed_title: feedData.title,
        feed_id: feedData.id
      })
      .select()

    if (error) {
      console.error('Error adding to read later:', error)
      return NextResponse.json({ error: 'Failed to add to read later' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error in read-later POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}