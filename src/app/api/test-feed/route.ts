import { NextResponse } from 'next/server'
import Parser from 'rss-parser'

const parser = new Parser()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter required' }, { status: 400 })
  }

  try {
    const feed = await parser.parseURL(url)
    
    return NextResponse.json({
      success: true,
      feedTitle: feed.title,
      feedDescription: feed.description,
      itemsCount: feed.items?.length || 0,
      items: feed.items?.slice(0, 3).map(item => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        guid: item.guid
      })) || []
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 })
  }
}