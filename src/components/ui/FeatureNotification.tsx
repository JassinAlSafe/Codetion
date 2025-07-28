'use client'

import React, { useState, useEffect } from 'react'
import { X, Sparkles, Keyboard, Search, MapPin, Command } from 'lucide-react'

const FeatureNotification = React.memo(function FeatureNotification() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if user has already seen this notification
    const hasSeenNotification = localStorage.getItem('feature-notification-seen')
    if (!hasSeenNotification) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000) // Show after 2 seconds
      
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('feature-notification-seen', 'true')
  }

  if (isDismissed || !isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-xs">
      <div className="
        bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg p-3
      ">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-yellow-300" />
            <h3 className="font-semibold text-sm">New Editor Features!</h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="text-xs text-white/90 space-y-1 mb-3">
          <div className="flex items-center gap-2">
            <MapPin size={12} />
            <span>Minimap enabled (Cmd+Shift+M)</span>
          </div>
          <div className="flex items-center gap-2">
            <Search size={12} />
            <span>Enhanced Find & Replace (Cmd+F)</span>
          </div>
          <div className="flex items-center gap-2">
            <Keyboard size={12} />
            <span>Breadcrumbs navigation</span>
          </div>
          <div className="flex items-center gap-2">
            <Command size={12} />
            <span>Editor toolbar with shortcuts</span>
          </div>
        </div>
        
        <button
          onClick={handleDismiss}
          className="
            w-full py-2 px-3 bg-white/20 hover:bg-white/30 rounded text-xs font-medium
            transition-colors backdrop-blur-sm
          "
        >
          Got it!
        </button>
      </div>
    </div>
  )
})

export default FeatureNotification