'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, RefreshCw, LogOut, Rss, UserX } from 'lucide-react'

interface Feed {
  id: string
  title: string
  url: string
  description: string | null
  last_fetched_at: string | null
}

interface SidebarProps {
  username: string
  selectedFeedId: string | null
  onFeedSelect: (feedId: string | null) => void
  onFeedDeleted?: () => void
}

export default function Sidebar({ username, selectedFeedId, onFeedSelect, onFeedDeleted }: SidebarProps) {
  const [feeds, setFeeds] = useState<Feed[]>([])
  const [isAddingFeed, setIsAddingFeed] = useState(false)
  const [newFeedUrl, setNewFeedUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteStep, setDeleteStep] = useState(1) // 1: warning, 2: password, 3: final confirmation
  const [deleting, setDeleting] = useState(false)
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
        // If the deleted feed was selected, clear the selection
        if (selectedFeedId === id) {
          onFeedSelect(null)
        }
        // Notify parent component to refresh the item list
        if (onFeedDeleted) {
          onFeedDeleted()
        }
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
    
    const response = await fetch('/api/feeds/check-and-refresh', {
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

  const handleDeleteAccount = async () => {
    if (deleteStep === 1) {
      setDeleteStep(2)
      return
    }
    
    if (deleteStep === 2) {
      if (!deletePassword.trim()) {
        alert('Please enter your password')
        return
      }
      setDeleteStep(3)
      return
    }
    
    if (deleteStep === 3) {
      setDeleting(true)
      
      try {
        // First delete profile data via API
        const response = await fetch('/api/auth/delete-account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: deletePassword })
        })
        
        const data = await response.json()
        
        if (response.ok) {
          // Redirect to top page after successful deletion
          window.location.href = '/'
        } else {
          alert(data.error || 'Failed to delete account')
          setDeleting(false)
        }
      } catch (error) {
        console.error('Error deleting account:', error)
        alert('An error occurred while deleting your account')
        setDeleting(false)
      }
    }
  }

  const resetDeleteModal = () => {
    setShowDeleteModal(false)
    setDeletePassword('')
    setDeleteStep(1)
    setDeleting(false)
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
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
            Your Feeds ({feeds.length}/10)
          </h3>
          {selectedFeedId && (
            <button
              onClick={() => onFeedSelect(null)}
              className="text-xs text-blue-400 hover:text-blue-300 transition"
            >
              Show All
            </button>
          )}
        </div>
        
        {feeds.length === 0 ? (
          <p className="text-gray-500 text-sm">No feeds added yet</p>
        ) : (
          <div className="space-y-2">
            {feeds.map((feed) => (
              <div
                key={feed.id}
                className={`group flex items-center justify-between p-3 rounded-lg transition cursor-pointer ${
                  selectedFeedId === feed.id 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => onFeedSelect(feed.id)}
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
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteFeed(feed.id)
                  }}
                  className="p-1 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Account Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded-md transition"
        >
          <UserX className="w-3 h-3" />
          Delete Account
        </button>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            {deleteStep === 1 && (
              <>
                <h3 className="text-lg font-bold text-white mb-4">Delete Account</h3>
                <div className="text-sm text-gray-300 mb-6 space-y-2">
                  <p>⚠️ <strong>Warning: This action cannot be undone.</strong></p>
                  <p>By deleting your account, you will permanently lose:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-gray-400">
                    <li>All your RSS feeds</li>
                    <li>All saved articles</li>
                    <li>Your account data</li>
                  </ul>
                  <p>Are you sure you want to proceed?</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={resetDeleteModal}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {deleteStep === 2 && (
              <>
                <h3 className="text-lg font-bold text-white mb-4">Confirm Password</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Please enter your password to confirm account deletion:
                </p>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-6"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteStep(1)}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                  >
                    Verify Password
                  </button>
                </div>
              </>
            )}

            {deleteStep === 3 && (
              <>
                <h3 className="text-lg font-bold text-red-400 mb-4">Final Confirmation</h3>
                <div className="text-sm text-gray-300 mb-6">
                  <p className="font-semibold text-red-400 mb-2">This is your last chance!</p>
                  <p>
                    Your account and all associated data will be permanently deleted.
                    This action cannot be undone.
                  </p>
                  <p className="mt-2 font-semibold">
                    Are you absolutely sure you want to delete your account?
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteStep(2)}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition disabled:opacity-50"
                  >
                    {deleting ? 'Deleting...' : 'Delete Account'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}