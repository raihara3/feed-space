import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Parser from 'rss-parser'
import { formatDistanceToNow } from 'date-fns'

const parser = new Parser()

export async function POST() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get all user's feeds
  const { data: feeds, error: feedsError } = await supabase
    .from('feeds')
    .select('*')
    .eq('user_id', user.id)

  if (feedsError) {
    return NextResponse.json({ error: feedsError.message }, { status: 500 })
  }

  const results = []

  for (const feed of feeds) {
    try {
      // Parse the RSS feed
      const parsedFeed = await parser.parseURL(feed.url)
      
      // Update feed's last_fetched_at
      await supabase
        .from('feeds')
        .update({ last_fetched_at: new Date().toISOString() })
        .eq('id', feed.id)

      // Get existing items for this feed to check for duplicates
      const { data: existingItems } = await supabase
        .from('feed_items')
        .select('guid')
        .eq('feed_id', feed.id)

      const existingGuids = new Set(existingItems?.map(item => item.guid) || [])

      // Process new items
      const newItems = []
      for (const item of parsedFeed.items || []) {
        const guid = item.guid || item.link
        
        if (!existingGuids.has(guid)) {
          newItems.push({
            feed_id: feed.id,
            title: item.title || 'Untitled',
            link: item.link || '',
            description: item.contentSnippet || item.content || null,
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : null,
            guid,
          })
        }
      }

      // Insert new items with duplicate handling
      if (newItems.length > 0) {
        try {
          const { data: insertedItems, error: insertError } = await supabase
            .from('feed_items')
            .upsert(newItems, { 
              onConflict: 'feed_id,guid',
              ignoreDuplicates: true 
            })
            .select()

          if (insertError) {
            results.push({ feed: feed.title, error: insertError.message })
          } else {
            results.push({ feed: feed.title, newItems: insertedItems?.length || 0 })
          }
        } catch (error) {
          // Fallback to individual inserts
          let itemsInserted = 0
          for (const item of newItems) {
            const { error: itemError } = await supabase
              .from('feed_items')
              .insert([item])
            
            if (!itemError) {
              itemsInserted++
            }
          }
          results.push({ feed: feed.title, newItems: itemsInserted })
        }
      } else {
        results.push({ feed: feed.title, newItems: 0 })
      }

    } catch (error) {
      results.push({ feed: feed.title, error: 'Failed to parse feed' })
    }
  }

  // Clean up old items (older than 24 hours)
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  await supabase
    .from('feed_items')
    .delete()
    .lt('created_at', twentyFourHoursAgo)

  return NextResponse.json({ results })
}