'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import ItemList from './ItemList'

interface FeedReaderProps {
  username: string
}

export default function FeedReader({ username }: FeedReaderProps) {
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null)

  return (
    <div className="h-screen bg-gray-900 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex-shrink-0 hidden lg:block">
        <Sidebar 
          username={username} 
          selectedFeedId={selectedFeedId}
          onFeedSelect={setSelectedFeedId}
        />
      </div>
      
      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        {/* Mobile layout will be added later */}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 h-full overflow-hidden">
        <ItemList selectedFeedId={selectedFeedId} />
      </div>
    </div>
  )
}