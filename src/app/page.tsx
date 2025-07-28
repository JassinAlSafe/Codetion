'use client'

import { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import StatusBar from '@/components/layout/StatusBar'
import TabBar from '@/components/editor/TabBar'
import MonacoEditor from '@/components/editor/MonacoEditor'
import CompactEditorHeader from '@/components/editor/CompactEditorHeader'
import LazyPreview from '@/components/editor/LazyPreview'
import FeatureNotification from '@/components/ui/FeatureNotification'
import { useEditorStore } from '@/store/editorStore'
import { useKeyboardShortcuts, useFocusManagement } from '@/lib/useKeyboardShortcuts'

export default function Home() {
  const { isDarkMode, isPreviewOpen, isSidebarOpen, toggleSidebar } = useEditorStore()
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Initialize keyboard shortcuts and focus management
  useKeyboardShortcuts()
  useFocusManagement()

  // Initialize component after hydration
  useEffect(() => {
    setMounted(true)
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initialize dark mode on mount
  useEffect(() => {
    if (mounted) {
      if (isDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [isDarkMode, mounted])

  // Handle mobile sidebar overlay click
  const handleOverlayClick = () => {
    if (isMobile && isSidebarOpen) {
      toggleSidebar()
    }
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="h-screen flex flex-col bg-background text-foreground">
        <div className="h-8 bg-header-bg border-b border-border flex items-center justify-center">
          <LoadingSpinner size="sm" />
        </div>
        <div className="flex flex-1">
          <div className="w-280 border-r border-border flex items-center justify-center">
            <LoadingSpinner size="sm" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <LoadingSpinner size="lg" />
              <p className="text-sm text-text-secondary">Loading CodeNotion...</p>
            </div>
          </div>
        </div>
        <div className="h-6 bg-secondary border-t border-border" />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground relative">
      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="sidebar-overlay show"
          onClick={handleOverlayClick}
        />
      )}
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden gap-0">
        {/* Sidebar - Responsive */}
        <div className={`
          ${isMobile 
            ? `sidebar-mobile ${isSidebarOpen ? 'open' : ''}` 
            : ''
          }
        `}>
          <Sidebar />
        </div>
        
        {/* Editor Area */}
        <div className="flex-1 flex min-w-0 gap-1">
          {/* Editor Section */}
          <div className="flex-1 flex flex-col min-w-96">
            {/* Tab Bar - Mobile responsive */}
            <div className={`${isMobile ? 'tab-bar-mobile' : ''}`}>
              <TabBar />
            </div>
            
            {/* Compact Editor Header */}
            <CompactEditorHeader />
            
            {/* Monaco Editor */}
            <div className="flex-1">
              <MonacoEditor />
            </div>
          </div>

          {/* Live Preview Panel - Responsive */}
          {isPreviewOpen && (
            <div className={`
              flex-shrink-0 border-l border-border
              ${isMobile 
                ? 'hidden' // Hide on mobile, could add a toggle button instead
                : 'w-80 md:w-80 lg:w-96 xl:w-[400px] min-w-80'
              }
            `}>
              <LazyPreview />
            </div>
          )}
        </div>
      </div>
      
      {/* Status Bar - Hide on mobile for more space */}
      {!isMobile && <StatusBar />}
      
      {/* Feature Notification */}
      <FeatureNotification />
    </div>
  )
}
