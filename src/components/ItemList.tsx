'use client'

import { useState, useEffect, useRef } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ExternalLink, Clock, Image as ImageIcon } from 'lucide-react'

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

interface ItemListProps {
  selectedFeedId: string | null
}

export default function ItemList({ selectedFeedId }: ItemListProps) {
  const [allItems, setAllItems] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchItems()
    
    // Refresh items every 2 hours
    const interval = setInterval(fetchItems, 2 * 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Reset scroll position when selectedFeedId changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0
    }
  }, [selectedFeedId])

  const fetchItems = async () => {
    setLoading(true)
    const response = await fetch('/api/feed-items')
    const data = await response.json()
    
    if (data.items) {
      setAllItems(data.items)
    }
    setLoading(false)
  }

  // Filter items based on selected feed
  const filteredItems = selectedFeedId 
    ? allItems.filter(item => item.feeds.id === selectedFeedId)
    : allItems

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown'
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return 'Unknown'
    }
  }


  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').trim()
  }

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
        </div>
        <div className="flex-1 p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 p-4 bg-gray-800 rounded-lg animate-pulse">
                <div className="w-24 h-16 bg-gray-700 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Get the selected feed name for the header
  const selectedFeed = selectedFeedId 
    ? allItems.find(item => item.feeds.id === selectedFeedId)?.feeds
    : null

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-white">
          {selectedFeed ? selectedFeed.title : 'Latest Articles'}
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          {filteredItems.length} articles {selectedFeed ? `from ${selectedFeed.title}` : 'available'}
        </p>
      </div>
      
      {/* Articles List */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-400 text-lg mb-2">
                {selectedFeed ? 'No articles from this feed' : 'No articles yet'}
              </p>
              <p className="text-gray-500 text-sm">
                {selectedFeed ? 'This feed might not have recent articles.' : 'Add some feeds to get started!'}
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {filteredItems.map((item) => {
              const cleanDescription = item.description ? stripHtml(item.description) : null
              
              return (
                <article
                  key={item.id}
                  className="p-6 hover:bg-gray-800 transition-colors group cursor-pointer"
                  onClick={() => window.open(item.link, '_blank')}
                >
                  <div className="flex gap-4">
                    {/* Thumbnail Placeholder */}
                    <div className="w-24 h-16 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-500" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                      
                      {cleanDescription && (
                        <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                          {cleanDescription}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs">
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full">
                          {item.feeds.title}
                        </span>
                        <span className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-3 h-3" />
                          {formatDate(item.published_at)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action */}
                    <div className="flex-shrink-0">
                      <div className="p-2 text-gray-400 group-hover:text-white transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}