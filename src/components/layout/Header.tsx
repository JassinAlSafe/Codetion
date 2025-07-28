'use client'

import React from 'react'
import { Moon, Sun, Menu, FileText, Monitor } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'

const Header = React.memo(function Header() {
  const { 
    isDarkMode, 
    toggleDarkMode, 
    toggleSidebar, 
    isSidebarOpen, 
    togglePreview, 
    isPreviewOpen,
    shouldShowPreview 
  } = useEditorStore()

  return (
    <header className="h-8 bg-header-bg border-b border-border flex items-center justify-between px-3 shrink-0">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="btn-ghost p-1.5 hover:bg-hover rounded transition-smooth"
          title={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          aria-label={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          <Menu size={14} />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center shrink-0">
            <FileText size={12} className="text-white" />
          </div>
          <h1 className="font-semibold text-foreground text-sm hidden sm:block">CodeNotion</h1>
          <h1 className="font-semibold text-foreground text-sm sm:hidden">CN</h1>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {shouldShowPreview() && (
          <button
            onClick={togglePreview}
            className={`btn-ghost p-1.5 hover:bg-hover rounded transition-smooth ${
              isPreviewOpen ? 'bg-blue-500/10 text-blue-600' : ''
            }`}
            title={isPreviewOpen ? 'Hide live preview' : 'Show live preview'}
            aria-label={isPreviewOpen ? 'Hide live preview' : 'Show live preview'}
          >
            <Monitor size={14} />
          </button>
        )}
        
        <button
          onClick={toggleDarkMode}
          className="btn-ghost p-1.5 hover:bg-hover rounded transition-smooth"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </header>
  )
})

export default Header