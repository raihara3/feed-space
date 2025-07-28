'use client'

import { useState, useEffect } from 'react'
import { Image as ImageIcon } from 'lucide-react'

interface ArticleThumbnailProps {
  url: string
  title: string
}

export default function ArticleThumbnail({ url, title }: ArticleThumbnailProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchOgpImage = async () => {
      try {
        const response = await fetch(`/api/ogp-image?url=${encodeURIComponent(url)}`)
        const data = await response.json()
        
        if (data.image) {
          setImageUrl(data.image)
        }
      } catch (err) {
        console.error('Failed to fetch OGP image:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOgpImage()
  }, [url])

  const handleImageError = () => {
    setError(true)
    setImageUrl(null)
  }

  return (
    <div className="w-24 h-16 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
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