'use client'

import { useState, useEffect, useCallback } from 'react'
import { Image as ImageIcon } from 'lucide-react'

interface ArticleThumbnailProps {
  description: string | null
  link: string
  title: string
}

export default function ArticleThumbnail({ description, link, title }: ArticleThumbnailProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const isValidImageUrl = useCallback((url: string): boolean => {
    if (!url) return false
    
    try {
      new URL(url.startsWith('//') ? `https:${url}` : url)
    } catch {
      return false
    }
    
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?|$)/i
    const isDataUrl = url.startsWith('data:image/')
    
    return imageExtensions.test(url) || isDataUrl
  }, [])

  const extractImageFromDescription = useCallback((description: string | null): string | null => {
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
  }, [isValidImageUrl])

  const extractImage = useCallback(async () => {
    setLoading(true)
    setError(false)

    // First try to extract from RSS description
    const rssImage = extractImageFromDescription(description)
    if (rssImage) {
      setImageUrl(rssImage)
      setLoading(false)
      return
    }

    // Then try to fetch OGP image
    try {
      const response = await fetch(`/api/ogp-image?url=${encodeURIComponent(link)}`)
      const data = await response.json()
      
      if (data.imageUrl) {
        setImageUrl(data.imageUrl)
      } else {
        setError(true)
      }
    } catch (err) {
      console.log('Failed to fetch OGP image for:', link)
      setError(true)
    }
    
    setLoading(false)
  }, [description, link, extractImageFromDescription])

  useEffect(() => {
    extractImage()
  }, [extractImage])

  const handleImageError = () => {
    setError(true)
    setImageUrl(null)
  }

  return (
    <div className="w-24 h-16 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
      {loading ? (
        <div className="w-full h-full bg-gray-700 animate-pulse"></div>
      ) : imageUrl && !error ? (
        <img
          src={imageUrl}
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