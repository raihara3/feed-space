import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Parser from 'rss-parser'

const parser = new Parser()

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: feeds, error } = await supabase
    .from('feeds')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ feeds })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if profile exists, create if not
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!existingProfile) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.id,
          username: user.email?.split('@')[0] || 'user',
        },
      ])

    if (profileError) {
      return NextResponse.json({ error: `Profile creation failed: ${profileError.message}` }, { status: 500 })
    }
  }

  const { url } = await request.json()

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  try {
    // Parse the RSS feed to get metadata
    const feed = await parser.parseURL(url)
    
    // Insert the feed
    const { data, error } = await supabase
      .from('feeds')
      .insert([
        {
          user_id: user.id,
          url,
          title: feed.title || 'Untitled Feed',
          description: feed.description || null,
          last_fetched_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      if (error.message.includes('duplicate')) {
        return NextResponse.json({ error: 'Feed already exists' }, { status: 409 })
      }
      if (error.message.includes('Feed limit reached')) {
        return NextResponse.json({ error: 'Feed limit reached. Maximum 10 feeds per user.' }, { status: 400 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Immediately fetch and store feed items (limit to latest 50 items)
    const newItems = []
    // Sort by date and take only the latest 50 items
    const sortedItems = (feed.items || []).sort((a, b) => {
      const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0
      const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0
      return dateB - dateA // Descending order (newest first)
    }).slice(0, 50)
    
    for (const item of sortedItems) {
      const guid = item.guid || item.link
      
      newItems.push({
        feed_id: data.id,
        title: item.title || 'Untitled',
        link: item.link || '',
        description: item.contentSnippet || item.content || null,
        published_at: item.pubDate ? new Date(item.pubDate).toISOString() : null,
        guid,
      })
    }

    // Insert feed items with conflict handling using upsert
    let itemsInserted = 0
    if (newItems.length > 0) {
      try {
        const { data: insertedItems, error: itemsError } = await supabase
          .from('feed_items')
          .upsert(newItems, { 
            onConflict: 'feed_id,guid',
            ignoreDuplicates: true 
          })
          .select()
        
        if (itemsError) {
          console.error('Error upserting feed items:', itemsError)
          // Fallback to individual inserts
          for (const item of newItems) {
            const { error: itemError } = await supabase
              .from('feed_items')
              .insert([item])
            
            if (!itemError) {
              itemsInserted++
            } else if (!itemError.message.includes('duplicate key')) {
              console.error('Error inserting feed item:', itemError)
            }
          }
        } else {
          itemsInserted = insertedItems?.length || 0
        }
      } catch (error) {
        console.error('Upsert failed, falling back to individual inserts:', error)
        // Fallback to individual inserts
        for (const item of newItems) {
          const { error: itemError } = await supabase
            .from('feed_items')
            .insert([item])
          
          if (!itemError) {
            itemsInserted++
          } else if (!itemError.message.includes('duplicate key')) {
            console.error('Error inserting feed item:', itemError)
          }
        }
      }
    }

    // Ensure we have exactly 50 items or less (in case of duplicates)
    const { data: finalItems } = await supabase
      .from('feed_items')
      .select('id, created_at')
      .eq('feed_id', data.id)
      .order('created_at', { ascending: false })

    if (finalItems && finalItems.length > 50) {
      const itemsToDelete = finalItems.slice(50).map(item => item.id)
      
      const { error: deleteError } = await supabase
        .from('feed_items')
        .delete()
        .in('id', itemsToDelete)

      if (deleteError) {
        console.error(`Error cleaning up excess items:`, deleteError)
      } else {
        console.log(`Deleted ${itemsToDelete.length} excess items to maintain 50 item limit`)
      }
    }

    return NextResponse.json({ 
      feed: data,
      itemsAdded: itemsInserted,
      feedItemsCount: feed.items?.length || 0,
      finalItemCount: finalItems?.length || 0,
      debug: {
        feedTitle: feed.title,
        feedItemsLength: feed.items?.length,
        newItemsLength: newItems.length
      }
    })
  } catch (parseError) {
    return NextResponse.json({ error: 'Failed to parse RSS feed' }, { status: 400 })
  }
}