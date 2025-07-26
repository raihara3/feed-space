import * as cheerio from 'cheerio'

interface ImageExtractionResult {
  imageUrl: string | null
  source: 'rss' | 'ogp' | 'content'
}

export async function extractImageFromContent(
  description: string | null,
  link: string
): Promise<ImageExtractionResult> {
  // First try to extract from RSS description
  if (description) {
    const rssImage = extractImageFromDescription(description)
    if (rssImage) {
      return { imageUrl: rssImage, source: 'rss' }
    }
  }

  // Then try to fetch OGP image from the actual page
  try {
    const ogpImage = await fetchOGPImage(link)
    if (ogpImage) {
      return { imageUrl: ogpImage, source: 'ogp' }
    }
  } catch (error) {
    console.log('Failed to fetch OGP image:', error)
  }

  return { imageUrl: null, source: 'content' }
}

function extractImageFromDescription(description: string): string | null {
  if (!description) return null
  
  // Try to find img tags
  const imgMatch = description.match(/<img[^>]+src="([^"]+)"/i)
  if (imgMatch) {
    const src = imgMatch[1]
    if (isValidImageUrl(src)) return src
  }
  
  // Try to find image URLs in text
  const urlMatch = description.match(/(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|avif))/i)
  if (urlMatch) {
    return urlMatch[1]
  }
  
  return null
}

async function fetchOGPImage(url: string): Promise<string | null> {
  try {
    // Use a proxy or CORS-enabled endpoint in production
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader Bot)',
      },
      // Add timeout
      signal: AbortSignal.timeout(5000),
    })
    
    if (!response.ok) return null
    
    const html = await response.text()
    const $ = cheerio.load(html)
    
    // Try different OGP and meta tags
    const ogpImage = 
      $('meta[property="og:image"]').attr('content') ||
      $('meta[property="og:image:url"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[name="twitter:image:src"]').attr('content') ||
      $('meta[itemprop="image"]').attr('content')
    
    if (ogpImage && isValidImageUrl(ogpImage)) {
      // Convert relative URLs to absolute
      if (ogpImage.startsWith('/')) {
        const baseUrl = new URL(url)
        return `${baseUrl.protocol}//${baseUrl.host}${ogpImage}`
      }
      return ogpImage
    }
    
    // Fallback: try to find the first image in content
    const firstImg = $('img').first().attr('src')
    if (firstImg && isValidImageUrl(firstImg)) {
      if (firstImg.startsWith('/')) {
        const baseUrl = new URL(url)
        return `${baseUrl.protocol}//${baseUrl.host}${firstImg}`
      }
      return firstImg
    }
    
  } catch (error) {
    // Silently fail for CORS or network issues
    return null
  }
  
  return null
}

function isValidImageUrl(url: string): boolean {
  if (!url) return false
  
  // Check if it's a valid URL
  try {
    new URL(url.startsWith('//') ? `https:${url}` : url)
  } catch {
    return false
  }
  
  // Check for common image extensions or data URLs
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?|$)/i
  const isDataUrl = url.startsWith('data:image/')
  
  return imageExtensions.test(url) || isDataUrl
}