'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ExternalLink, Clock } from 'lucide-react'

interface FeedItem {
  id: string
  title: string
  link: string
  description: string | null
  published_at: string | null
  created_at: string
  feeds: {
    id: string
    title: string
  }
}

export default function ItemList() {
  const [items, setItems] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
    
    // Refresh items every 30 minutes
    const interval = setInterval(fetchItems, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    const response = await fetch('/api/feed-items')
    const data = await response.json()
    
    if (data.items) {
      setItems(data.items)
    }
    setLoading(false)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown'
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return 'Unknown'
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-800 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Latest Articles</h2>
      
      {items.length === 0 ? (
        <p className="text-gray-400">No articles yet. Add some feeds to get started!</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium mb-1 line-clamp-2">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="truncate">{item.feeds.title}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(item.published_at)}
                    </span>
                  </div>
                </div>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition flex-shrink-0"
                  title="Open article"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}