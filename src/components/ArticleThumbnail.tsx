'use client'

import { useState, useEffect, useMemo } from 'react'
import { Image as ImageIcon } from 'lucide-react'

interface ArticleThumbnailProps {
  description: string | null
  link: string
  title: string
}

export default function ArticleThumbnail({ description, link, title }: ArticleThumbnailProps) {
  const [ogpImageUrl, setOgpImageUrl] = useState<string | null>(null)
  const [ogpLoading, setOgpLoading] = useState(false)
  const [ogpError, setOgpError] = useState(false)

  // Extract RSS image using useMemo (synchronous, stable)
  const rssImageUrl = useMemo(() => {
    if (!description) return null
    
    const isValidImageUrl = (url: string): boolean => {
      if (!url) return false
      
      try {
        new URL(url.startsWith('//') ? `https:${url}` : url)
      } catch {
        return false
      }
      
      const imageExtensions = /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?|$)/i
      const isDataUrl = url.startsWith('data:image/')
      
      return imageExtensions.test(url) || isDataUrl
    }
    
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
  }, [description])

  // Only fetch OGP if no RSS image found
  useEffect(() => {
    if (rssImageUrl) return // Don't fetch OGP if we have RSS image
    
    let cancelled = false
    
    const fetchOgpImage = async () => {
      setOgpLoading(true)
      setOgpError(false)
      
      try {
        const response = await fetch(`/api/ogp-image?url=${encodeURIComponent(link)}`)
        const data = await response.json()
        
        if (cancelled) return
        
        if (data.imageUrl) {
          setOgpImageUrl(data.imageUrl)
        } else {
          setOgpError(true)
        }
      } catch (err) {
        if (cancelled) return
        console.log('Failed to fetch OGP image for:', link)
        setOgpError(true)
      } finally {
        if (!cancelled) {
          setOgpLoading(false)
        }
      }
    }

    fetchOgpImage()
    
    return () => {
      cancelled = true
    }
  }, [link, rssImageUrl])

  // Determine which image to show
  const finalImageUrl = useMemo(() => {
    return rssImageUrl || ogpImageUrl
  }, [rssImageUrl, ogpImageUrl])

  const isLoading = useMemo(() => {
    return !rssImageUrl && ogpLoading
  }, [rssImageUrl, ogpLoading])

  const hasError = useMemo(() => {
    return !rssImageUrl && ogpError
  }, [rssImageUrl, ogpError])

  const handleImageError = () => {
    if (rssImageUrl) {
      // If RSS image failed, try OGP
      setOgpError(true)
    } else {
      setOgpImageUrl(null)
    }
  }

  return (
    <div className="w-24 h-16 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
      {isLoading ? (
        <div className="w-full h-full bg-gray-700 animate-pulse"></div>
      ) : finalImageUrl && !hasError ? (
        <img
          src={finalImageUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={handleImageError}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-gray-500" />
        </div>
      )}
    </div>
  )
}