'use client'

import React from 'react'
import { Moon, Sun, Menu, FileText, Monitor, RefreshCw, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useEditorStore } from '@/store/editorStore'
import FileOperations from '@/components/file/FileOperations'

const Header = React.memo(function Header() {
  const { 
    isDarkMode, 
    toggleDarkMode, 
    toggleSidebar, 
    isSidebarOpen, 
    togglePreview, 
    isPreviewOpen,
    toggleTerminal,
    isTerminalOpen,
    shouldShowPreview 
  } = useEditorStore()

  return (
    <header className="h-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border flex items-center px-6 shrink-0">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
          title={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          <Menu size={16} />
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
              <FileText size={16} className="text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="font-semibold text-foreground text-base leading-none hidden sm:block">CodeNotion</h1>
            <span className="text-xs text-muted-foreground hidden sm:block">Web Code Editor</span>
          </div>
          <h1 className="font-semibold text-foreground text-base sm:hidden">CN</h1>
        </div>
      </div>

      {/* File Operations */}
      <div className="flex-1 flex justify-center">
        <FileOperations />
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant={isPreviewOpen ? "default" : "ghost"}
          size="sm"
          onClick={togglePreview}
          className={`h-8 gap-2 ${isPreviewOpen ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}`}
          title={isPreviewOpen ? 'Hide live preview' : 'Show live preview'}
        >
          <Monitor size={14} />
          <span className="hidden md:inline">Preview</span>
        </Button>
        
        <Button
          variant={isTerminalOpen ? "default" : "ghost"}
          size="sm"
          onClick={toggleTerminal}
          className={`h-8 gap-2 ${isTerminalOpen ? 'bg-green-500 hover:bg-green-600 text-white' : ''}`}
          title={isTerminalOpen ? 'Hide terminal' : 'Show terminal'}
        >
          <Terminal size={14} />
          <span className="hidden md:inline">Terminal</span>
        </Button>
        
        <Separator orientation="vertical" className="h-6 mx-2" />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="h-8 w-8"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (confirm('Reset to demo files? This will clear your current files.')) {
              localStorage.removeItem('code-notion-editor')
              window.location.reload()
            }
          }}
          className="h-8 w-8"
          title="Reset to demo"
        >
          <RefreshCw size={16} />
        </Button>
      </div>
    </header>
  )
})

export default Header