'use client'

import React from 'react'
import { X, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useEditorStore } from '@/store/editorStore'
import { getFileIcon } from '@/lib/fileUtils'

const TabBar = React.memo(function TabBar() {
  const { tabs, activeTabId, setActiveTab, closeTab } = useEditorStore()

  if (tabs.length === 0) {
    return (
      <div className="h-10 bg-card border-b border-border flex items-center justify-center">
        <span className="text-sm text-muted-foreground">No files open</span>
      </div>
    )
  }

  return (
    <div className="h-10 bg-card border-b border-border flex items-center">
      {/* Tab List */}
      <div className="flex-1 flex items-center overflow-x-auto scrollbar-hide">
        <div className="flex items-center min-w-max">
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              className={`group relative flex items-center gap-2 px-3 py-2 cursor-pointer transition-all duration-200 border-r border-border/50 min-w-0 max-w-48 ${
                activeTabId === tab.id 
                  ? 'bg-background text-foreground border-b-2 border-b-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
              onClick={() => setActiveTab(tab.id)}
              style={{ 
                animationDelay: `${index * 50}ms`,
                position: 'relative'
              }}
            >
              {/* Active indicator */}
              {activeTabId === tab.id && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
              
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm shrink-0">
                  {getFileIcon(tab.name, false)}
                </span>
                <span className="text-sm font-medium truncate">
                  {tab.name}
                </span>
                {tab.isDirty && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full shrink-0" title="Unsaved changes" />
                )}
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  closeTab(tab.id)
                }}
                className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hover:bg-destructive/10 hover:text-destructive"
                title="Close tab"
              >
                <X size={12} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Actions */}
      {tabs.length > 3 && (
        <div className="flex items-center px-2 border-l border-border">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            title="Show all tabs"
          >
            <MoreHorizontal size={14} />
          </Button>
        </div>
      )}

      {/* Tab Count Badge */}
      <div className="flex items-center px-3 border-l border-border">
        <Badge variant="secondary" className="h-5 text-xs">
          {tabs.length}
        </Badge>
      </div>
    </div>
  )
})

export default TabBar