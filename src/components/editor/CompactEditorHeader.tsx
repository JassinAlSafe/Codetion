'use client'

import React, { useState } from 'react'
import { 
  ChevronRight, 
  Home, 
  Folder, 
  FileText,
  Search, 
  Replace, 
  Hash, 
  Code,
  Command,
  MapPin,
  Settings,
  Type,
  MoreHorizontal
} from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'

const CompactEditorHeader = React.memo(function CompactEditorHeader() {
  const { getActiveFile, files, openTab } = useEditorStore()
  const [showActions, setShowActions] = useState(false)
  const activeFile = getActiveFile()

  const triggerEditorAction = (action: string) => {
    const monaco = (window as any).monaco // eslint-disable-line @typescript-eslint/no-explicit-any
    if (monaco && monaco.editor) {
      const editors = monaco.editor.getEditors()
      if (editors.length > 0) {
        const activeEditor = editors[0]
        activeEditor.getAction(action)?.run()
      }
    }
  }

  // Build breadcrumb path
  const buildPath = (file: any): any[] => {
    if (!file) return []
    const path = [file]
    let current = file
    
    while (current.parentId) {
      const parent = files[current.parentId]
      if (parent) {
        path.unshift(parent)
        current = parent
      } else {
        break
      }
    }
    
    return path
  }

  const breadcrumbPath = activeFile ? buildPath(activeFile) : []

  const quickActions = [
    { icon: <Search size={12} />, action: () => triggerEditorAction('actions.find'), label: 'Find' },
    { icon: <Replace size={12} />, action: () => triggerEditorAction('editor.action.startFindReplaceAction'), label: 'Replace' },
    { icon: <Hash size={12} />, action: () => triggerEditorAction('editor.action.gotoLine'), label: 'Go to Line' },
    { icon: <Code size={12} />, action: () => triggerEditorAction('editor.action.formatDocument'), label: 'Format' },
  ]

  return (
    <div className="h-5 bg-secondary/10 border-b border-border flex items-center justify-between px-2 text-xs overflow-hidden">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-1 min-w-0 flex-1">
        {!activeFile ? (
          <div className="flex items-center gap-1 text-text-muted">
            <Home size={10} />
            <span>No file selected</span>
          </div>
        ) : (
          <div className="flex items-center gap-0.5 min-w-0">
            <Home size={10} className="text-text-muted shrink-0" />
            
            {breadcrumbPath.map((item, index) => (
              <React.Fragment key={item.id}>
                <ChevronRight size={8} className="text-text-muted shrink-0" />
                <button
                  onClick={() => {
                    if (item.type === 'file') {
                      openTab(item.id)
                    }
                  }}
                  className={`
                    flex items-center gap-0.5 px-1 py-0.5 rounded transition-colors min-w-0
                    ${item.type === 'file' ? 'hover:bg-hover cursor-pointer' : 'cursor-default'}
                    ${index === breadcrumbPath.length - 1 ? 'text-foreground font-medium' : 'text-text-secondary hover:text-foreground'}
                  `}
                  disabled={item.type === 'folder'}
                  title={item.name}
                >
                  <span className="shrink-0">
                    {item.type === 'folder' ? <Folder size={8} /> : <FileText size={8} />}
                  </span>
                  <span className="truncate max-w-20 text-xs">
                    {item.name}
                  </span>
                </button>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Center: Quick Actions */}
      <div className="flex items-center gap-1 mx-2">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="p-1 hover:bg-hover rounded transition-colors text-text-secondary hover:text-foreground"
            title={action.label}
          >
            {action.icon}
          </button>
        ))}
      </div>

      {/* Right: Language & Settings */}
      <div className="flex items-center gap-1 shrink-0">
        {activeFile && (
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-blue-500/10 text-blue-600 border border-blue-500/20">
            <Type size={8} />
            <span className="text-xs font-medium">
              {(activeFile.language || 'txt').slice(0, 3)}
            </span>
          </div>
        )}
        
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-1 hover:bg-hover rounded transition-colors text-text-secondary hover:text-foreground"
          title="More actions"
        >
          <MoreHorizontal size={12} />
        </button>

        {/* Actions dropdown */}
        {showActions && (
          <>
            <div 
              className="fixed inset-0 z-10"
              onClick={() => setShowActions(false)}
            />
            <div className="absolute top-full right-0 mt-1 bg-background border border-border rounded shadow-lg py-1 z-20 min-w-32">
              <button 
                onClick={() => {
                  triggerEditorAction('editor.action.toggleMinimap')
                  setShowActions(false)
                }}
                className="w-full px-2 py-1 text-left text-xs hover:bg-hover transition-colors flex items-center gap-2"
              >
                <MapPin size={10} />
                Toggle Minimap
              </button>
              <button 
                onClick={() => {
                  triggerEditorAction('editor.action.toggleWordWrap')
                  setShowActions(false)
                }}
                className="w-full px-2 py-1 text-left text-xs hover:bg-hover transition-colors flex items-center gap-2"
              >
                <Settings size={10} />
                Word Wrap
              </button>
              <button 
                onClick={() => {
                  triggerEditorAction('editor.action.quickCommand')
                  setShowActions(false)
                }}
                className="w-full px-2 py-1 text-left text-xs hover:bg-hover transition-colors flex items-center gap-2"
              >
                <Command size={10} />
                Command Palette
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
})

export default CompactEditorHeader