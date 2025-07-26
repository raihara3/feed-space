'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, RefreshCw, LogOut, Rss } from 'lucide-react'

interface Feed {
  id: string
  title: string
  url: string
  description: string | null
  last_fetched_at: string | null
}

interface SidebarProps {
  username: string
}

export default function Sidebar({ username }: SidebarProps) {
  const [feeds, setFeeds] = useState<Feed[]>([])
  const [isAddingFeed, setIsAddingFeed] = useState(false)
  const [newFeedUrl, setNewFeedUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  const fetchFeeds = useCallback(async () => {
    try {
      const response = await fetch('/api/feeds')
      const data = await response.json()
      if (data.feeds) {
        setFeeds(data.feeds)
      }
    } catch (error) {
      console.error('Error fetching feeds:', error)
    }
  }, [])

  useEffect(() => {
    fetchFeeds()
  }, [fetchFeeds])

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
      
      console.log('Feed addition response:', data)
      
      if (data.error) {
        alert(data.error)
      }
      
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

    try {
      const response = await fetch(`/api/feeds/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setFeeds(prevFeeds => prevFeeds.filter(feed => feed.id !== id))
      } else {
        const errorData = await response.json()
        alert(`Failed to delete feed: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting feed:', error)
      alert('Failed to delete feed. Please try again.')
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

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.refresh()
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Rss className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">FEED SPACE</h1>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-gray-300 text-sm">{username}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Feed Section */}
      <div className="p-4 border-b border-gray-700">
        {!isAddingFeed ? (
          <button
            onClick={() => setIsAddingFeed(true)}
            className="w-full flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
          >
            <Plus className="w-4 h-4" />
            Add New Feed
          </button>
        ) : (
          <form onSubmit={handleAddFeed} className="space-y-3">
            <input
              type="url"
              value={newFeedUrl}
              onChange={(e) => setNewFeedUrl(e.target.value)}
              placeholder="Enter RSS feed URL..."
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingFeed(false)
                  setNewFeedUrl('')
                }}
                className="px-3 py-2 text-gray-400 hover:text-white text-sm transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Refresh Button */}
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={handleRefreshFeeds}
          disabled={refreshing}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh All Feeds'}
        </button>
      </div>

      {/* Feeds List */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Your Feeds ({feeds.length}/10)
        </h3>
        
        {feeds.length === 0 ? (
          <p className="text-gray-500 text-sm">No feeds added yet</p>
        ) : (
          <div className="space-y-2">
            {feeds.map((feed) => (
              <div
                key={feed.id}
                className="group flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">{feed.title}</h4>
                  <p className="text-xs text-gray-400 truncate">
                    {(() => {
                      try {
                        return new URL(feed.url).hostname
                      } catch {
                        return feed.url
                      }
                    })()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteFeed(feed.id)}
                  className="p-1 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}