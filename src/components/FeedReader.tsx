'use client'

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import ItemList from './ItemList'

interface FeedReaderProps {
  username: string
}

export default function FeedReader({ username }: FeedReaderProps) {
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null)
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [refreshKey, setRefreshKey] = useState(0)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [readLaterRefresh, setReadLaterRefresh] = useState(0)

  // Load filter state from localStorage on component mount
  useEffect(() => {
    const savedFeedId = localStorage.getItem('selectedFeedId')
    const savedKeywords = localStorage.getItem('selectedKeywords')
    
    if (savedFeedId && savedFeedId !== 'null' && savedFeedId !== '') {
      setSelectedFeedId(savedFeedId)
    }
    
    if (savedKeywords) {
      try {
        const keywords = JSON.parse(savedKeywords)
        if (Array.isArray(keywords)) {
          setSelectedKeywords(keywords)
        }
      } catch (error) {
        console.error('Error parsing saved keywords:', error)
      }
    }
    
    setIsInitialized(true)
  }, [])

  // Save filter state to localStorage when it changes
  useEffect(() => {
    if (!isInitialized) return
    
    localStorage.setItem('selectedFeedId', selectedFeedId || '')
  }, [selectedFeedId, isInitialized])

  useEffect(() => {
    if (!isInitialized) return
    
    localStorage.setItem('selectedKeywords', JSON.stringify(selectedKeywords))
  }, [selectedKeywords, isInitialized])

  const handleFeedDeleted = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleKeywordUpdated = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleReadLaterUpdated = () => {
    setReadLaterRefresh(prev => prev + 1)
  }

  return (
    <div className="h-screen bg-gray-900 flex overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex-shrink-0 hidden lg:block">
        <Sidebar 
          username={username} 
          selectedFeedId={selectedFeedId}
          selectedKeywords={selectedKeywords}
          onFeedSelect={setSelectedFeedId}
          onKeywordSelect={setSelectedKeywords}
          onFeedDeleted={handleFeedDeleted}
          onKeywordUpdated={handleKeywordUpdated}
          onReadLaterUpdated={handleReadLaterUpdated}
          readLaterRefreshKey={readLaterRefresh}
        />
      </div>
      
      {/* Mobile Sidebar Overlay */}
      <div className={`lg:hidden fixed inset-0 z-50 flex transition-opacity duration-300 ${
        isMobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50" 
          onClick={() => setIsMobileSidebarOpen(false)}
        />
        
        {/* Sidebar */}
        <div className={`relative w-80 bg-gray-800 h-full overflow-hidden transform transition-transform duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <Sidebar 
            username={username} 
            selectedFeedId={selectedFeedId}
            selectedKeywords={selectedKeywords}
            onFeedSelect={(feedId) => {
              setSelectedFeedId(feedId)
              setIsMobileSidebarOpen(false)
            }}
            onKeywordSelect={(keywords) => {
              setSelectedKeywords(keywords)
              setIsMobileSidebarOpen(false)
            }}
            onFeedDeleted={() => {
              handleFeedDeleted()
              setIsMobileSidebarOpen(false)
            }}
            onKeywordUpdated={handleKeywordUpdated}
            onReadLaterUpdated={handleReadLaterUpdated}
            readLaterRefreshKey={readLaterRefresh}
            isMobile={true}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 h-full overflow-hidden">
        <ItemList 
          key={`${refreshKey}-${readLaterRefresh}`} 
          selectedFeedId={selectedFeedId} 
          selectedKeywords={selectedKeywords}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onReadLaterUpdated={handleReadLaterUpdated}
        />
      </div>
    </div>
  )
}