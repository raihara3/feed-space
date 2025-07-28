import { NextRequest, NextResponse } from 'next/server'

// Cache OGP images in memory for 1 hour
const ogpCache = new Map<string, { image: string | null; timestamp: number }>()
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url')
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Check cache
    const cached = ogpCache.get(url)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json({ image: cached.image })
    }

    // Fetch the page
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; FeedSpace/1.0; +https://github.com/raihara3/feed-space)'
        }
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        ogpCache.set(url, { image: null, timestamp: Date.now() })
        return NextResponse.json({ image: null })
      }

      // Read only first 50KB to avoid loading entire page
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let html = ''
      let bytesRead = 0
      const maxBytes = 50 * 1024 // 50KB

      if (reader) {
        while (bytesRead < maxBytes) {
          const { done, value } = await reader.read()
          if (done) break
          
          html += decoder.decode(value, { stream: true })
          bytesRead += value.length
          
          // Check if we have found OGP image
          if (html.includes('</head>') || html.includes('og:image')) {
            break
          }
        }
        reader.cancel()
      }

      // Extract OGP image with various patterns
      const patterns = [
        /<meta\s+property="og:image"\s+content="([^"]+)"/i,
        /<meta\s+name="og:image"\s+content="([^"]+)"/i,
        /<meta\s+content="([^"]+)"\s+property="og:image"/i,
        /<meta\s+content="([^"]+)"\s+name="og:image"/i,
        /<meta\s+property='og:image'\s+content='([^']+)'/i,
        /<meta\s+name='og:image'\s+content='([^']+)'/i,
        /<meta\s+name="twitter:image"\s+content="([^"]+)"/i,
        /<meta\s+content="([^"]+)"\s+name="twitter:image"/i,
        /<meta\s+property="twitter:image"\s+content="([^"]+)"/i,
      ]

      let imageUrl = null
      for (const pattern of patterns) {
        const match = html.match(pattern)
        if (match && match[1]) {
          imageUrl = match[1]
          break
        }
      }

      // Make relative URLs absolute
      if (imageUrl && !imageUrl.startsWith('http')) {
        const baseUrl = new URL(url)
        imageUrl = new URL(imageUrl, baseUrl).toString()
      }

      // Cache the result
      ogpCache.set(url, { image: imageUrl, timestamp: Date.now() })
      
      return NextResponse.json({ image: imageUrl })
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        ogpCache.set(url, { image: null, timestamp: Date.now() })
        return NextResponse.json({ image: null })
      }
      throw error
    }
  } catch (error) {
    console.error('Error fetching OGP image:', error)
    return NextResponse.json({ image: null })
  }
}