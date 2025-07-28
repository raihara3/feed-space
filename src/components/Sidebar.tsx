'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, RefreshCw, LogOut, Rss, UserX, Tag, X, Bookmark } from 'lucide-react'
import KeywordsModal from './KeywordsModal'

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
  selectedKeywords: string[]
  onFeedSelect: (feedId: string | null) => void
  onKeywordSelect: (keywords: string[]) => void
  onFeedDeleted?: () => void
  onKeywordUpdated?: () => void
  onReadLaterUpdated?: () => void
  readLaterRefreshKey?: number
  isMobile?: boolean
  onCloseMobile?: () => void
}

export default function Sidebar({ username, selectedFeedId, selectedKeywords, onFeedSelect, onKeywordSelect, onFeedDeleted, onKeywordUpdated, onReadLaterUpdated, readLaterRefreshKey = 0, isMobile, onCloseMobile }: SidebarProps) {
  const [feeds, setFeeds] = useState<Feed[]>([])
  const [isAddingFeed, setIsAddingFeed] = useState(false)
  const [newFeedUrl, setNewFeedUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteStep, setDeleteStep] = useState(1) // 1: warning, 2: password, 3: final confirmation
  const [deleting, setDeleting] = useState(false)
  const [showKeywordsModal, setShowKeywordsModal] = useState(false)
  const [keywords, setKeywords] = useState<{id: string, keyword: string}[]>([])
  const [readLaterItems, setReadLaterItems] = useState<any[]>([])
  const [maxFeeds, setMaxFeeds] = useState(5)
  const router = useRouter()
  const supabase = createClient()

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
    fetchKeywords()
    fetchMaxFeeds()
    fetchReadLaterItems()
  }, [fetchFeeds])

  useEffect(() => {
    fetchReadLaterItems()
  }, [readLaterRefreshKey])

  const fetchMaxFeeds = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('max_feeds')
          .eq('id', user.id)
          .single()
        
        if (profile) {
          setMaxFeeds(profile.max_feeds)
        }
      }
    } catch (error) {
      console.error('Error fetching max feeds:', error)
    }
  }

  const fetchKeywords = async () => {
    try {
      const response = await fetch('/api/keywords')
      const data = await response.json()
      if (data.keywords) {
        setKeywords(data.keywords)
      }
    } catch (error) {
      console.error('Error fetching keywords:', error)
    }
  }

  const fetchReadLaterItems = async () => {
    try {
      const response = await fetch('/api/read-later')
      const data = await response.json()
      if (data.readLaterItems) {
        setReadLaterItems(data.readLaterItems)
      }
    } catch (error) {
      console.error('Error fetching read later items:', error)
    }
  }

  const removeFromReadLater = async (readLaterId: string) => {
    if (!confirm('あとで読むから削除しますか？')) return
    
    try {
      const response = await fetch(`/api/read-later/${readLaterId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setReadLaterItems(prev => prev.filter(item => item.id !== readLaterId))
        if (onReadLaterUpdated) onReadLaterUpdated()
      } else {
        alert('削除に失敗しました')
      }
    } catch (error) {
      console.error('Error removing from read later:', error)
      alert('削除に失敗しました')
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
      
      console.log('Feed addition response:', data)
      
      if (data.error) {
        alert(data.error)
      }
      
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else {
      alert(data.error || 'フィードの追加に失敗しました')
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
    try {
      // Sign out from Supabase client-side
      const { error: clientError } = await supabase.auth.signOut()
      if (clientError) {
        console.error('Client signout error:', clientError)
      }

      // Also call server-side signout
      const response = await fetch('/api/auth/signout', { method: 'POST' })
      const data = await response.json()
      
      if (response.ok || clientError === null) {
        // Redirect to home page after successful signout
        window.location.href = '/'
      } else {
        console.error('Server signout error:', data.error)
        alert('Failed to sign out. Please try again.')
      }
    } catch (error) {
      console.error('Signout error:', error)
      // Still try to redirect even if there's an error
      window.location.href = '/'
    }
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
          <img
            src="/logo.png"
            alt="Feed Space Logo"
            width="40"
            height="40"
            className="w-10 h-10 rounded-lg"
          />
          <h1 className="text-xl font-bold text-white flex-1">Feed Space</h1>
          {isMobile && (
            <button
              onClick={onCloseMobile}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
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
            className="w-full flex items-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium"
          >
            <Plus className="w-4 h-4" />
フィードを追加
          </button>
        ) : (
          <form onSubmit={handleAddFeed} className="space-y-3">
            <input
              type="url"
              value={newFeedUrl}
              onChange={(e) => setNewFeedUrl(e.target.value)}
              placeholder="RSSフィードのURLを入力..."
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-md transition disabled:opacity-50"
              >
                {loading ? '追加中...' : '追加'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingFeed(false)
                  setNewFeedUrl('')
                }}
                className="px-3 py-2 text-gray-400 hover:text-white text-sm transition"
              >
                キャンセル
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Keywords Section */}
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={() => setShowKeywordsModal(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition mb-3"
        >
          <Tag className="w-4 h-4" />
キーワード管理
        </button>
        
        {keywords.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                キーワード
              </h4>
              {selectedKeywords.length > 0 ? (
                <button
                  onClick={() => onKeywordSelect([])}
                  className="text-xs text-purple-400 hover:text-purple-300 transition"
                >
                  フィルタリングを外す
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (keywords.length > 0) {
                      onKeywordSelect(keywords.map(k => k.keyword))
                    }
                  }}
                  className="text-xs text-purple-400 hover:text-purple-300 transition"
                >
                  全て選択
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <button
                  key={keyword.id}
                  onClick={() => {
                    const isSelected = selectedKeywords.includes(keyword.keyword)
                    if (isSelected) {
                      onKeywordSelect(selectedKeywords.filter(k => k !== keyword.keyword))
                    } else {
                      onKeywordSelect([...selectedKeywords, keyword.keyword])
                    }
                  }}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition ${
                    selectedKeywords.includes(keyword.keyword)
                      ? 'text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  style={{
                    backgroundColor: selectedKeywords.includes(keyword.keyword) ? '#f66f3b' : undefined
                  }}
                >
                  #{keyword.keyword}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Feeds List */}
      <div className="overflow-hidden p-3" style={{ minHeight: '80px' }}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
登録フィード ({feeds.length}/{maxFeeds})
          </h3>
          {selectedFeedId && (
            <button
              onClick={() => onFeedSelect(null)}
              className="text-[10px] text-purple-400 hover:text-purple-300 transition"
            >
              フィルタリングを外す
            </button>
          )}
        </div>
        
        {feeds.length === 0 ? (
          <p className="text-gray-500 text-[10px]">まだフィードが追加されていません</p>
        ) : (
          <div className="overflow-y-auto space-y-0.5" style={{ minHeight: '3rem', maxHeight: '8rem' }}>
            {feeds.map((feed) => (
              <div
                key={feed.id}
                className={`group flex items-center justify-between p-1.5 rounded-md transition cursor-pointer ${
                  selectedFeedId === feed.id 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => onFeedSelect(feed.id)}
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-medium text-white truncate leading-tight">{feed.title}</h4>
                  <p className="text-[9px] text-gray-400 truncate leading-tight">
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
                  className="p-0.5 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Read Later Section */}
      <div className="p-3 flex flex-col" style={{ minHeight: '80px' }}>
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1">
            <Bookmark className="w-3 h-3" />
            あとで読む ({readLaterItems.length}/5)
          </h4>
        </div>
        
        {readLaterItems.length === 0 ? (
          <p className="text-gray-500 text-[10px]">あとで読む記事はありません</p>
        ) : (
          <div className="overflow-y-auto flex-1 space-y-0.5" style={{ minHeight: '3rem' }}>
            {readLaterItems.map((item) => (
              <div
                key={item.id}
                className="group flex items-start gap-1 p-1 bg-gray-700 hover:bg-gray-600 rounded transition"
              >
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => {
                      window.open(item.link, '_blank')
                      if (onCloseMobile) onCloseMobile()
                    }}
                    className="text-left w-full"
                  >
                    <h5 className="text-[10px] font-medium text-white line-clamp-1 hover:text-purple-400 transition leading-tight">
                      {item.title}
                    </h5>
                    <p className="text-[9px] text-gray-400 leading-tight">
                      {item.feed_title}
                    </p>
                  </button>
                </div>
                <button
                  onClick={() => removeFromReadLater(item.id)}
                  className="p-0.5 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-3 h-3" />
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
アカウント削除
        </button>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            {deleteStep === 1 && (
              <>
                <h3 className="text-lg font-bold text-white mb-4">アカウント削除</h3>
                <div className="text-sm text-gray-300 mb-6 space-y-2">
                  <p>⚠️ <strong>警告: この操作は元に戻せません。</strong></p>
                  <p>アカウントを削除すると、以下のデータが永久に失われます:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-gray-400">
                    <li>すべてのRSSフィード</li>
                    <li>保存されたすべての記事</li>
                    <li>アカウント情報</li>
                  </ul>
                  <p>本当に続行しますか？</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={resetDeleteModal}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                  >
続行
                  </button>
                </div>
              </>
            )}

            {deleteStep === 2 && (
              <>
                <h3 className="text-lg font-bold text-white mb-4">パスワードの確認</h3>
                <p className="text-sm text-gray-300 mb-4">
                  アカウント削除を確定するため、パスワードを入力してください:
                </p>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="パスワードを入力"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-6"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteStep(1)}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
                  >
                    戻る
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                  >
パスワードを確認
                  </button>
                </div>
              </>
            )}

            {deleteStep === 3 && (
              <>
                <h3 className="text-lg font-bold text-red-400 mb-4">最終確認</h3>
                <div className="text-sm text-gray-300 mb-6">
                  <p className="font-semibold text-red-400 mb-2">これが最後のチャンスです！</p>
                  <p>
                    アカウントと関連するすべてのデータが永久に削除されます。
                    この操作は元に戻せません。
                  </p>
                  <p className="mt-2 font-semibold">
                    本当にアカウントを削除しますか？
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteStep(2)}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition disabled:opacity-50"
                  >
                    戻る
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition disabled:opacity-50"
                  >
                    {deleting ? '削除中...' : 'アカウントを削除'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Keywords Modal */}
      <KeywordsModal 
        isOpen={showKeywordsModal}
        onClose={() => setShowKeywordsModal(false)}
        onKeywordUpdated={() => {
          fetchKeywords()
          if (onKeywordUpdated) {
            onKeywordUpdated()
          }
        }}
      />
    </div>
  )
}