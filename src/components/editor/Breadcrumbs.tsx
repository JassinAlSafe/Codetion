'use client'

import React from 'react'
import { ChevronRight, Home, Folder, FileText } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'

const Breadcrumbs = React.memo(function Breadcrumbs() {
  const { getActiveFile, files, openTab } = useEditorStore()
  const activeFile = getActiveFile()

  if (!activeFile) {
    return (
      <div className="h-7 flex items-center px-3 bg-secondary/20 border-b border-border text-xs text-text-muted">
        <Home size={10} />
        <span className="ml-1.5 text-xs">No file selected</span>
      </div>
    )
  }

  // Build breadcrumb path
  const buildPath = (file: any): any[] => {
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

  const breadcrumbPath = buildPath(activeFile)

  return (
    <div className="h-7 flex items-center px-3 bg-secondary/20 border-b border-border text-xs overflow-hidden">
      <div className="flex items-center gap-1 min-w-0 flex-nowrap">
        <Home size={12} className="text-text-muted shrink-0" />
        
        {breadcrumbPath.map((item, index) => (
          <React.Fragment key={item.id}>
            <ChevronRight size={10} className="text-text-muted shrink-0 mx-0.5" />
            <button
              onClick={() => {
                if (item.type === 'file') {
                  openTab(item.id)
                }
              }}
              className={`
                flex items-center gap-0.5 px-1 py-0.5 rounded transition-colors min-w-0 text-xs
                ${item.type === 'file' 
                  ? 'hover:bg-hover cursor-pointer' 
                  : 'cursor-default'
                }
                ${index === breadcrumbPath.length - 1 
                  ? 'text-foreground font-medium' 
                  : 'text-text-secondary hover:text-foreground'
                }
              `}
              disabled={item.type === 'folder'}
              title={item.name}
            >
              <span className="shrink-0">
                {item.type === 'folder' ? (
                  <Folder size={10} />
                ) : (
                  <FileText size={10} />
                )}
              </span>
              <span className="truncate max-w-24">
                {item.name}
              </span>
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
})

export default Breadcrumbs