'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import ItemList from './ItemList'

interface FeedReaderProps {
  username: string
}

export default function FeedReader({ username }: FeedReaderProps) {
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null)
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const handleFeedDeleted = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleKeywordUpdated = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="h-screen bg-gray-900 flex overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex-shrink-0 hidden lg:block">
        <Sidebar 
          username={username} 
          selectedFeedId={selectedFeedId}
          selectedKeyword={selectedKeyword}
          onFeedSelect={setSelectedFeedId}
          onKeywordSelect={setSelectedKeyword}
          onFeedDeleted={handleFeedDeleted}
          onKeywordUpdated={handleKeywordUpdated}
        />
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50" 
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative w-80 bg-gray-800 h-full overflow-hidden">
            <Sidebar 
              username={username} 
              selectedFeedId={selectedFeedId}
              selectedKeyword={selectedKeyword}
              onFeedSelect={(feedId) => {
                setSelectedFeedId(feedId)
                setIsMobileSidebarOpen(false)
              }}
              onKeywordSelect={(keyword) => {
                setSelectedKeyword(keyword)
                setIsMobileSidebarOpen(false)
              }}
              onFeedDeleted={() => {
                handleFeedDeleted()
                setIsMobileSidebarOpen(false)
              }}
              onKeywordUpdated={handleKeywordUpdated}
              isMobile={true}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 h-full overflow-hidden">
        <ItemList 
          key={refreshKey} 
          selectedFeedId={selectedFeedId} 
          selectedKeyword={selectedKeyword}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />
      </div>
    </div>
  )
}