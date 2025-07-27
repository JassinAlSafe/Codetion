'use client'

import { X } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { getFileIcon } from '@/lib/fileUtils'

export default function TabBar() {
  const { tabs, activeTabId, setActiveTab, closeTab } = useEditorStore()

  if (tabs.length === 0) {
    return null
  }

  return (
    <div className="h-10 bg-tab-bg border-b border-border flex items-center overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`
            flex items-center gap-2 px-3 h-full border-r border-border cursor-pointer
            transition-colors group relative min-w-0 max-w-48
            ${activeTabId === tab.id 
              ? 'bg-tab-active text-foreground' 
              : 'bg-tab-bg text-text-secondary hover:bg-hover'
            }
          `}
          onClick={() => setActiveTab(tab.id)}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xs shrink-0">
              {getFileIcon(tab.name, false)}
            </span>
            <span className="text-sm truncate">
              {tab.name}
              {tab.isDirty && <span className="text-orange-500 ml-1">●</span>}
            </span>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              closeTab(tab.id)
            }}
            className="p-1 hover:bg-border rounded opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            title="Close tab"
          >
            <X size={12} />
          </button>

          {/* Active tab indicator */}
          {activeTabId === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </div>
      ))}
    </div>
  )
}