'use client'

import React, { useState } from 'react'
import { 
  Search, 
  Replace, 
  MapPin, 
  Maximize2, 
  Type, 
  Palette,
  Settings,
  Command,
  Code,
  Eye,
  Hash
} from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'

const EditorToolbar = React.memo(function EditorToolbar() {
  const { getActiveFile } = useEditorStore()
  const [showSettings, setShowSettings] = useState(false)
  const activeFile = getActiveFile()

  if (!activeFile) return null

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

  const toolbarActions = [
    {
      id: 'find',
      label: 'Find',
      icon: <Search size={14} />,
      shortcut: 'Cmd+F',
      action: () => triggerEditorAction('actions.find')
    },
    {
      id: 'replace',
      label: 'Find & Replace',
      icon: <Replace size={14} />,
      shortcut: 'Cmd+H',
      action: () => triggerEditorAction('editor.action.startFindReplaceAction')
    },
    {
      id: 'goto-line',
      label: 'Go to Line',
      icon: <Hash size={14} />,
      shortcut: 'Cmd+G',
      action: () => triggerEditorAction('editor.action.gotoLine')
    },
    {
      id: 'format',
      label: 'Format Document',
      icon: <Code size={14} />,
      shortcut: 'Cmd+Shift+F',
      action: () => triggerEditorAction('editor.action.formatDocument')
    },
    {
      id: 'command-palette',
      label: 'Command Palette',
      icon: <Command size={14} />,
      shortcut: 'Cmd+Shift+P',
      action: () => triggerEditorAction('editor.action.quickCommand')
    }
  ]

  return (
    <div className="h-8 bg-secondary/10 border-b border-border flex items-center justify-between px-2 overflow-hidden">
      {/* Left side - Editor actions */}
      <div className="flex items-center gap-0.5 flex-1 min-w-0">
        {toolbarActions.map((tool) => (
          <button
            key={tool.id}
            onClick={tool.action}
            className="
              flex items-center gap-1 px-1.5 py-1 rounded text-xs
              hover:bg-hover transition-colors text-text-secondary hover:text-foreground
              shrink-0
            "
            title={`${tool.label} (${tool.shortcut})`}
          >
            {tool.icon}
            <span className="hidden md:inline text-xs">{tool.label}</span>
          </button>
        ))}
      </div>

      {/* Right side - Editor options */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={() => triggerEditorAction('editor.action.toggleMinimap')}
          className="
            flex items-center gap-1 px-1.5 py-1 rounded text-xs
            hover:bg-hover transition-colors text-text-secondary hover:text-foreground
          "
          title="Toggle Minimap (Cmd+Shift+M)"
        >
          <MapPin size={12} />
          <span className="hidden lg:inline text-xs">Map</span>
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="
            flex items-center gap-1 px-1.5 py-1 rounded text-xs
            hover:bg-hover transition-colors text-text-secondary hover:text-foreground
          "
          title="Editor Settings"
        >
          <Settings size={12} />
        </button>

        {/* Language indicator */}
        <div className="
          flex items-center gap-1 px-1.5 py-1 rounded text-xs
          bg-blue-500/10 text-blue-600 border border-blue-500/20
        ">
          <Type size={10} />
          <span className="font-medium text-xs hidden sm:inline">
            {(activeFile.language || 'txt').slice(0, 3)}
          </span>
        </div>
      </div>

      {/* Settings dropdown */}
      {showSettings && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setShowSettings(false)}
          />
          <div className="
            absolute top-full right-3 mt-1 bg-background border border-border rounded-md shadow-lg py-2 z-20
            min-w-48
          ">
            <div className="px-3 py-1 text-xs font-medium text-foreground border-b border-border mb-2">
              Editor Settings
            </div>
            
            <button 
              onClick={() => {
                triggerEditorAction('editor.action.toggleWordWrap')
                setShowSettings(false)
              }}
              className="w-full px-3 py-1.5 text-left text-xs hover:bg-hover transition-colors flex items-center gap-2"
            >
              <Eye size={12} />
              Toggle Word Wrap
            </button>
            
            <button 
              onClick={() => {
                triggerEditorAction('editor.action.toggleRenderWhitespace')
                setShowSettings(false)
              }}
              className="w-full px-3 py-1.5 text-left text-xs hover:bg-hover transition-colors flex items-center gap-2"
            >
              <Palette size={12} />
              Toggle Whitespace
            </button>
            
            <button 
              onClick={() => {
                triggerEditorAction('editor.action.toggleMinimap')
                setShowSettings(false)
              }}
              className="w-full px-3 py-1.5 text-left text-xs hover:bg-hover transition-colors flex items-center gap-2"
            >
              <MapPin size={12} />
              Toggle Minimap
            </button>
            
            <button 
              onClick={() => {
                const monaco = (window as any).monaco // eslint-disable-line @typescript-eslint/no-explicit-any
                if (monaco && monaco.editor) {
                  const editors = monaco.editor.getEditors()
                  if (editors.length > 0) {
                    const editor = editors[0]
                    if (document.fullscreenElement) {
                      document.exitFullscreen()
                    } else {
                      editor.getDomNode()?.requestFullscreen()
                    }
                  }
                }
                setShowSettings(false)
              }}
              className="w-full px-3 py-1.5 text-left text-xs hover:bg-hover transition-colors flex items-center gap-2"
            >
              <Maximize2 size={12} />
              Toggle Fullscreen
            </button>
          </div>
        </>
      )}
    </div>
  )
})

export default EditorToolbar