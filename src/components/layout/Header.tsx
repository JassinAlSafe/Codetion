'use client'

import { Moon, Sun, Menu, FileText } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'

export default function Header() {
  const { isDarkMode, toggleDarkMode, toggleSidebar, isSidebarOpen } = useEditorStore()

  return (
    <header className="h-12 bg-header-bg border-b border-border flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-hover rounded-md transition-colors"
          title={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          <Menu size={16} />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
            <FileText size={14} className="text-white" />
          </div>
          <h1 className="font-semibold text-foreground">CodeNotion</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="p-2 hover:bg-hover rounded-md transition-colors"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  )
}