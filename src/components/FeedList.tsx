'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, RefreshCw } from 'lucide-react'

interface Feed {
  id: string
  title: string
  url: string
  description: string | null
  last_fetched_at: string | null
}

export default function FeedList() {
  const [feeds, setFeeds] = useState<Feed[]>([])
  const [isAddingFeed, setIsAddingFeed] = useState(false)
  const [newFeedUrl, setNewFeedUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchFeeds()
  }, [])

  const fetchFeeds = async () => {
    const response = await fetch('/api/feeds')
    const data = await response.json()
    if (data.feeds) {
      setFeeds(data.feeds)
    }
  }

  const handleAddFeed = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const response = await fetch('/api/feeds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: newFeedUrl }),
    })

    const data = await response.json()
    
    if (response.ok) {
      setFeeds([data.feed, ...feeds])
      setNewFeedUrl('')
      setIsAddingFeed(false)
      
      // Show debug info
      console.log('Feed addition response:', data)
      
      if (data.error) {
        alert(data.error)
      }
      
      // Refresh the page to show new items
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else {
      alert(data.error)
    }
    
    setLoading(false)
  }

  const handleDeleteFeed = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feed?')) return

    const response = await fetch(`/api/feeds/${id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      setFeeds(feeds.filter(feed => feed.id !== id))
    }
  }

  const handleRefreshFeeds = async () => {
    setRefreshing(true)
    
    const response = await fetch('/api/feeds/refresh', {
      method: 'POST',
    })

    if (response.ok) {
      window.location.reload()
    }
    
    setRefreshing(false)
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Your Feeds</h2>
        <div className="flex gap-2">
          <button
            onClick={handleRefreshFeeds}
            disabled={refreshing}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition disabled:opacity-50"
            title="Refresh all feeds"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsAddingFeed(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition"
            title="Add new feed"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isAddingFeed && (
        <form onSubmit={handleAddFeed} className="mb-4">
          <input
            type="url"
            value={newFeedUrl}
            onChange={(e) => setNewFeedUrl(e.target.value)}
            placeholder="Enter RSS feed URL..."
            required
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Feed'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingFeed(false)
                setNewFeedUrl('')
              }}
              className="px-3 py-1 text-gray-400 hover:text-white text-sm transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {feeds.length === 0 ? (
          <p className="text-gray-400 text-sm">No feeds added yet</p>
        ) : (
          feeds.map((feed) => (
            <div
              key={feed.id}
              className="flex items-center justify-between p-3 bg-gray-800 rounded hover:bg-gray-700 transition group"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white truncate">{feed.title}</h3>
                <p className="text-xs text-gray-400 truncate">{feed.url}</p>
              </div>
              <button
                onClick={() => handleDeleteFeed(feed.id)}
                className="p-1 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-gray-500 mt-4">
        {feeds.length}/10 feeds
      </p>
    </div>
  )
}