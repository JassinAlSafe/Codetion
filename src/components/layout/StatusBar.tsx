'use client'

import { useEditorStore } from '@/store/editorStore'

export default function StatusBar() {
  const { getActiveFile, tabs } = useEditorStore()
  const activeFile = getActiveFile()

  return (
    <footer className="h-6 bg-status-bg border-t border-border flex items-center justify-between px-3 text-xs text-text-secondary shrink-0 overflow-hidden">
      <div className="flex items-center gap-3 min-w-0">
        {activeFile && (
          <>
            <span className="truncate">{activeFile.name}</span>
            {activeFile.language && (
              <span className="capitalize shrink-0">{activeFile.language}</span>
            )}
            <span className="shrink-0">
              {activeFile.content?.split('\n').length || 0} lines
            </span>
          </>
        )}
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        <span>{tabs.length} tab{tabs.length !== 1 ? 's' : ''}</span>
        <span>UTF-8</span>
        <span>LF</span>
      </div>
    </footer>
  )
}