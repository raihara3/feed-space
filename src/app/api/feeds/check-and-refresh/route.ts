import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Parser from 'rss-parser'

const parser = new Parser()

export async function POST() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get all user's feeds
    const { data: feeds, error: feedsError } = await supabase
      .from('feeds')
      .select('*')
      .eq('user_id', user.id)

    if (feedsError) {
      return NextResponse.json({ error: feedsError.message }, { status: 500 })
    }

    if (!feeds || feeds.length === 0) {
      return NextResponse.json({ 
        needsRefresh: false, 
        message: 'No feeds to check' 
      })
    }

    // Check if any feed needs refresh (2 hours = 7200000ms)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    const needsRefresh = feeds.some(feed => 
      !feed.last_fetched_at || new Date(feed.last_fetched_at) < twoHoursAgo
    )

    if (!needsRefresh) {
      return NextResponse.json({ 
        needsRefresh: false,
        message: 'All feeds are up to date' 
      })
    }


    // Refresh feeds that need updating
    const results = []
    let totalNewItems = 0

    for (const feed of feeds) {
      const lastFetched = feed.last_fetched_at ? new Date(feed.last_fetched_at) : null
      const shouldRefresh = !lastFetched || lastFetched < twoHoursAgo

      if (!shouldRefresh) {
        continue
      }

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

        // Get current item count before inserting new items
        const { count: currentCount } = await supabase
          .from('feed_items')
          .select('*', { count: 'exact', head: true })
          .eq('feed_id', feed.id)

        // Insert new items with conflict handling
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
              const itemsAdded = insertedItems?.length || 0
              results.push({ feed: feed.title, newItems: itemsAdded })
              totalNewItems += itemsAdded
            }
          } catch (error) {
            results.push({ feed: feed.title, error: 'Failed to insert items' })
          }
        } else {
          results.push({ feed: feed.title, newItems: 0 })
        }

        // Clean up old items - keep only the latest 50 items per feed
        const { data: allFeedItems } = await supabase
          .from('feed_items')
          .select('id, created_at')
          .eq('feed_id', feed.id)
          .order('created_at', { ascending: false })

        if (allFeedItems && allFeedItems.length > 50) {
          // Keep exactly 50 items
          const itemsToDelete = allFeedItems.slice(50).map(item => item.id)
          
          const { error: deleteError } = await supabase
            .from('feed_items')
            .delete()
            .in('id', itemsToDelete)

          if (deleteError) {
            console.error(`Error cleaning up old items for feed ${feed.title}:`, deleteError)
          } else {
            console.log(`Deleted ${itemsToDelete.length} old items from feed ${feed.title} (keeping exactly 50)`)
          }
        }

      } catch (error) {
        results.push({ feed: feed.title, error: 'Failed to parse feed' })
      }
    }

    return NextResponse.json({ 
      needsRefresh: true,
      refreshed: true,
      totalNewItems,
      results 
    })

  } catch (error) {
    console.error('Error in check-and-refresh:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}