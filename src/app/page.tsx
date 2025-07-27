'use client'

import { useEffect } from 'react'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import StatusBar from '@/components/layout/StatusBar'
import TabBar from '@/components/editor/TabBar'
import MonacoEditor from '@/components/editor/MonacoEditor'
import { useEditorStore } from '@/store/editorStore'

export default function Home() {
  const { isDarkMode } = useEditorStore()

  // Initialize dark mode on mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tab Bar */}
          <TabBar />
          
          {/* Monaco Editor */}
          <div className="flex-1">
            <MonacoEditor />
          </div>
        </div>
      </div>
      
      {/* Status Bar */}
      <StatusBar />
    </div>
  )
}
