'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import ItemList from './ItemList'

interface FeedReaderProps {
  username: string
}

export default function FeedReader({ username }: FeedReaderProps) {
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleFeedDeleted = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleKeywordUpdated = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="h-screen bg-gray-900 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex-shrink-0 hidden lg:block">
        <Sidebar 
          username={username} 
          selectedFeedId={selectedFeedId}
          onFeedSelect={setSelectedFeedId}
          onFeedDeleted={handleFeedDeleted}
          onKeywordUpdated={handleKeywordUpdated}
        />
      </div>
      
      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        {/* Mobile layout will be added later */}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 h-full overflow-hidden">
        <ItemList key={refreshKey} selectedFeedId={selectedFeedId} />
      </div>
    </div>
  )
}