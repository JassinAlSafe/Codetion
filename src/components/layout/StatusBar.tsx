'use client'

import { useEditorStore } from '@/store/editorStore'

export default function StatusBar() {
  const { getActiveFile, tabs } = useEditorStore()
  const activeFile = getActiveFile()

  return (
    <footer className="h-6 bg-status-bg border-t border-border flex items-center justify-between px-4 text-xs text-text-secondary shrink-0">
      <div className="flex items-center gap-4">
        {activeFile && (
          <>
            <span>{activeFile.name}</span>
            {activeFile.language && (
              <span className="capitalize">{activeFile.language}</span>
            )}
            <span>
              {activeFile.content?.split('\n').length || 0} lines
            </span>
          </>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <span>{tabs.length} tab{tabs.length !== 1 ? 's' : ''} open</span>
        <span>UTF-8</span>
        <span>LF</span>
      </div>
    </footer>
  )
}