'use client'

import { useState, useEffect, useRef } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { ExternalLink, Clock, Image as ImageIcon, Menu, Bookmark } from 'lucide-react'
import ArticleThumbnail from './ArticleThumbnail'

interface FeedItem {
  id: string
  title: string
  link: string
  description: string | null
  published_at: string | null
  created_at: string
  is_read: boolean
  read_at: string | null
  matched_keywords: string[]
  feeds: {
    id: string
    title: string
  }
}

interface ItemListProps {
  selectedFeedId: string | null
  selectedKeywords: string[]
  onOpenMobileSidebar?: () => void
  onReadLaterUpdated?: () => void
}

export default function ItemList({ selectedFeedId, selectedKeywords, onOpenMobileSidebar, onReadLaterUpdated }: ItemListProps) {
  const [allItems, setAllItems] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [readLaterItems, setReadLaterItems] = useState<string[]>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchItems()
    fetchReadLaterItems()
  }, [])

  // Reset scroll position when selectedFeedId changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0
    }
  }, [selectedFeedId])

  const fetchItems = async () => {
    setLoading(true)
    
    // Check and refresh feeds if needed, then get items
    await fetch('/api/feeds/check-and-refresh', { method: 'POST' })
    
    const response = await fetch('/api/feed-items')
    const data = await response.json()
    
    if (data.items) {
      setAllItems(data.items)
    }
    setLoading(false)
  }


  const fetchReadLaterItems = async () => {
    try {
      const response = await fetch('/api/read-later')
      const data = await response.json()
      if (data.readLaterItems) {
        setReadLaterItems(data.readLaterItems.map((item: any) => item.feed_item_id).filter(Boolean))
      }
    } catch (error) {
      console.error('Error fetching read later items:', error)
    }
  }

  const addToReadLater = async (itemId: string) => {
    try {
      const response = await fetch('/api/read-later', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedItemId: itemId })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setReadLaterItems(prev => [...prev, itemId])
        if (onReadLaterUpdated) onReadLaterUpdated()
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error('Error adding to read later:', error)
      alert('あとで読むに追加できませんでした')
    }
  }

  const markAsRead = async (itemId: string) => {
    try {
      await fetch('/api/read-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, isRead: true })
      })
      
      // Update local state to reflect read status immediately
      setAllItems(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, is_read: true, read_at: new Date().toISOString() }
          : item
      ))
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  // Filter items based on selected feed and keyword
  const filteredItems = allItems.filter(item => {
    // Filter by feed if selected
    if (selectedFeedId && item.feeds.id !== selectedFeedId) {
      return false
    }
    
    // Filter by keywords if selected (OR condition)
    if (selectedKeywords.length > 0 && !item.matched_keywords.some(keyword => selectedKeywords.includes(keyword))) {
      return false
    }
    
    return true
  })

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '不明'
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ja })
    } catch {
      return '不明'
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
      <div className="p-6 border-b border-gray-700 lg:bg-transparent lg:backdrop-blur-none bg-gray-900/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 text-gray-400 md:hover:text-white md:hover:bg-gray-700 rounded-md transition"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">
              {selectedFeed && selectedKeywords.length > 0 
                ? `${selectedFeed.title} フィルタリング中`
                : selectedFeed 
                ? selectedFeed.title 
                : selectedKeywords.length > 0
                ? 'フィルタリング中'
                : '最新記事'}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {filteredItems.length}件の記事
              {selectedFeed && selectedKeywords.length > 0 
                ? ` - ${selectedFeed.title}の#${selectedKeywords.join(', #')}を含む記事`
                : selectedFeed 
                ? ` - ${selectedFeed.title}`
                : selectedKeywords.length > 0
                ? ` - #${selectedKeywords.join(', #')}を含む記事`
                : ''}
            </p>
          </div>
        </div>
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
                {selectedFeed ? 'このフィードに記事がありません' : 'まだ記事がありません'}
              </p>
              <p className="text-gray-500 text-sm">
                {selectedFeed ? 'このフィードには最近の記事がない可能性があります。' : 'フィードを追加して始めましょう！'}
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {filteredItems.map((item) => {
              const cleanDescription = item.description ? stripHtml(item.description) : null
              const isRead = item.is_read
              
              return (
                <article
                  key={item.id}
                  className="p-6 md:hover:bg-gray-800 transition-colors group cursor-pointer"
                  onClick={() => {
                    markAsRead(item.id)
                    window.open(item.link, '_blank')
                  }}
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <ArticleThumbnail url={item.link} title={item.title} />
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`mb-2 transition-colors ${
                        isRead 
                          ? 'text-[#b0b0b0] font-normal' 
                          : 'text-white font-semibold md:group-hover:text-purple-400'
                      }`}>
                        {item.title}
                      </h3>
                      
                      {cleanDescription && (
                        <p className={`text-sm line-clamp-2 mb-3 ${
                          isRead ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {cleanDescription}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 text-xs flex-wrap">
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full">
                          {item.feeds.title}
                        </span>
                        {item.matched_keywords && item.matched_keywords.map((keyword, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 rounded-full text-black text-xs font-medium"
                            style={{ backgroundColor: '#f66f3b' }}
                          >
                            #{keyword}
                          </span>
                        ))}
                        <span className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-3 h-3" />
                          {formatDate(item.published_at)}
                        </span>
                        {!readLaterItems.includes(item.id) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              addToReadLater(item.id)
                            }}
                            className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-400 underline transition"
                          >
                            <Bookmark className="w-3 h-3" />
                            あとで読む
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Action */}
                    <div className="flex-shrink-0 hidden md:block">
                      <div className="p-2 text-gray-400 md:group-hover:text-white transition-colors">
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