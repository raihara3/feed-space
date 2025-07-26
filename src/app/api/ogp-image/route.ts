import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter required' }, { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader Bot)',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch page' }, { status: 400 })
    }
    
    const html = await response.text()
    const $ = cheerio.load(html)
    
    // Try different OGP and meta tags
    const ogpImage = 
      $('meta[property="og:image"]').attr('content') ||
      $('meta[property="og:image:url"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[name="twitter:image:src"]').attr('content') ||
      $('meta[itemprop="image"]').attr('content')
    
    if (ogpImage) {
      // Convert relative URLs to absolute
      let imageUrl = ogpImage
      if (ogpImage.startsWith('/')) {
        const baseUrl = new URL(url)
        imageUrl = `${baseUrl.protocol}//${baseUrl.host}${ogpImage}`
      } else if (ogpImage.startsWith('//')) {
        imageUrl = `https:${ogpImage}`
      }
      
      return NextResponse.json({ imageUrl, source: 'ogp' })
    }
    
    // Fallback: try to find the first image in content
    const firstImg = $('img').first().attr('src')
    if (firstImg) {
      let imageUrl = firstImg
      if (firstImg.startsWith('/')) {
        const baseUrl = new URL(url)
        imageUrl = `${baseUrl.protocol}//${baseUrl.host}${firstImg}`
      } else if (firstImg.startsWith('//')) {
        imageUrl = `https:${firstImg}`
      }
      
      return NextResponse.json({ imageUrl, source: 'content' })
    }
    
    return NextResponse.json({ imageUrl: null, source: null })
    
  } catch (error) {
    console.error('Error fetching OGP image:', error)
    return NextResponse.json({ 
      error: 'Failed to extract image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}