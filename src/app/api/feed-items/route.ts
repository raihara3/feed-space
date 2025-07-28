import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get user's keywords for matching
  const { data: userKeywords } = await supabase
    .from('user_keywords')
    .select('keyword')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  // Get all feed items for user's feeds
  const { data: items, error } = await supabase
    .from('feed_items')
    .select(`
      *,
      feeds!inner(
        id,
        title,
        user_id
      )
    `)
    .eq('feeds.user_id', user.id)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Add matched keywords to each item
  const itemsWithKeywords = items?.map(item => {
    const matchedKeywords: string[] = []
    
    if (userKeywords) {
      const title = (item.title || '').toLowerCase()
      const description = (item.description || '').toLowerCase()
      
      userKeywords.forEach(keywordObj => {
        const keyword = keywordObj.keyword.toLowerCase()
        if (title.includes(keyword) || description.includes(keyword)) {
          matchedKeywords.push(keywordObj.keyword)
        }
      })
    }
    
    return {
      ...item,
      matched_keywords: matchedKeywords
    }
  }) || []

  return NextResponse.json({ items: itemsWithKeywords })
}