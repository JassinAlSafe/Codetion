'use client'

import React from 'react'
import { X } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { getFileIcon } from '@/lib/fileUtils'

const TabBar = React.memo(function TabBar() {
  const { tabs, activeTabId, setActiveTab, closeTab } = useEditorStore()

  if (tabs.length === 0) {
    return null
  }

  return (
    <div className="h-7 bg-tab-bg border-b border-border flex items-center overflow-x-auto scrollbar-hide">
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          className={`tab
            flex items-center gap-1.5 px-2 h-full border-r border-border cursor-pointer
            transition-smooth group relative min-w-0 max-w-36 shrink-0
            ${activeTabId === tab.id 
              ? 'bg-tab-active text-foreground active' 
              : 'bg-tab-bg text-text-secondary hover:bg-hover'
            }
          `}
          onClick={() => setActiveTab(tab.id)}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <span className="text-xs shrink-0">
              {getFileIcon(tab.name, false)}
            </span>
            <span className="text-xs truncate">
              {tab.name}
              {tab.isDirty && <span className="text-orange-500 ml-0.5">●</span>}
            </span>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              closeTab(tab.id)
            }}
            className="btn-ghost p-0.5 rounded opacity-0 group-hover:opacity-100 transition-fast shrink-0"
            title="Close tab"
          >
            <X size={10} />
          </button>
        </div>
      ))}
    </div>
  )
})

export default TabBar