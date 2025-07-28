'use client'

import React, { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useEditorStore } from '@/store/editorStore'
import LoadingSpinner, { LoadingDots } from '@/components/ui/LoadingSpinner'

const MonacoEditorComponent = dynamic(
  () => import('@monaco-editor/react'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-editor-bg">
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinner size="lg" />
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm text-text-secondary">Loading Monaco Editor</p>
            <LoadingDots className="text-text-muted" />
          </div>
        </div>
      </div>
    )
  }
)

const MonacoEditor = React.memo(function MonacoEditor() {
  const { 
    getActiveFile, 
    updateFileContent, 
    markTabDirty, 
    isDarkMode,
    activeTabId 
  } = useEditorStore()
  
  const activeFile = getActiveFile()
  const editorRef = useRef<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const lastSavedContent = useRef<string>('')

  const handleEditorDidMount = (editor: any, monaco: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    editorRef.current = editor

    // Configure Monaco themes
    monaco.editor.defineTheme('notion-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '9b9a97', fontStyle: 'italic' },
        { token: 'keyword', foreground: '0969da' },
        { token: 'string', foreground: '0a3069' },
        { token: 'number', foreground: 'cf222e' },
        { token: 'type', foreground: '8250df' },
        { token: 'function', foreground: '6f42c1' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#37352f',
        'editor.lineHighlightBackground': '#f7f6f3',
        'editor.selectionBackground': '#0969da40',
        'editorCursor.foreground': '#37352f',
        'editorLineNumber.foreground': '#9b9a97',
        'editorLineNumber.activeForeground': '#37352f',
        'editor.inactiveSelectionBackground': '#0969da20',
        'editorIndentGuide.background': '#e9e9e7',
        'editorIndentGuide.activeBackground': '#d0d7de',
        'editorWhitespace.foreground': '#e9e9e7',
      }
    })

    monaco.editor.defineTheme('notion-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6f6f6f', fontStyle: 'italic' },
        { token: 'keyword', foreground: '79c0ff' },
        { token: 'string', foreground: 'a5d6ff' },
        { token: 'number', foreground: 'ffa198' },
        { token: 'type', foreground: 'f2cc60' },
        { token: 'function', foreground: 'd2a8ff' },
      ],
      colors: {
        'editor.background': '#191919',
        'editor.foreground': '#e9e9e7',
        'editor.lineHighlightBackground': '#1e1e1e',
        'editor.selectionBackground': '#79c0ff40',
        'editorCursor.foreground': '#e9e9e7',
        'editorLineNumber.foreground': '#6f6f6f',
        'editorLineNumber.activeForeground': '#e9e9e7',
        'editor.inactiveSelectionBackground': '#79c0ff20',
        'editorIndentGuide.background': '#373737',
        'editorIndentGuide.activeBackground': '#6f6f6f',
        'editorWhitespace.foreground': '#373737',
      }
    })

    // Set initial theme
    monaco.editor.setTheme(isDarkMode ? 'notion-dark' : 'notion-light')

    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
      lineHeight: 1.5,
      letterSpacing: 0.5,
      padding: { top: 16, bottom: 16 },
      scrollBeyondLastLine: false,
      minimap: { 
        enabled: true,
        side: 'right',
        size: 'fit',
        showSlider: 'mouseover',
        renderCharacters: true,
        maxColumn: 120
      },
      renderWhitespace: 'selection',
      renderLineHighlight: 'line',
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      smoothScrolling: true,
      contextmenu: true,
      mouseWheelZoom: true,
      wordWrap: 'on',
      wrappingIndent: 'indent',
      tabSize: 2,
      insertSpaces: true,
      detectIndentation: true,
      trimAutoWhitespace: true,
      formatOnPaste: true,
      formatOnType: true,
      autoIndent: 'full',
      bracketPairColorization: { enabled: true },
      guides: { bracketPairs: true, indentation: true },
      find: {
        addExtraSpaceOnTop: false,
        autoFindInSelection: 'never',
        seedSearchStringFromSelection: 'always'
      },
      quickSuggestions: {
        other: true,
        comments: false,
        strings: false
      },
      parameterHints: {
        enabled: true,
        cycle: false
      },
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: 'on',
      acceptSuggestionOnCommitCharacter: true,
      snippetSuggestions: 'top',
      wordBasedSuggestions: 'matchingDocuments',
      semanticHighlighting: { enabled: true },
      occurrencesHighlight: 'singleFile',
      codeLens: true,
      folding: true,
      foldingStrategy: 'indentation',
      showFoldingControls: 'mouseover',
      unfoldOnClickAfterEndOfLine: false,
      renderLineHighlight: 'line',
      selectOnLineNumbers: true,
      lineNumbersMinChars: 3,
      glyphMargin: true,
      lineDecorationsWidth: 10,
      renderValidationDecorations: 'on'
    })

    // Add keyboard shortcuts
    editor.addAction({
      id: 'save-file',
      label: 'Save File',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: () => {
        if (activeFile) {
          const content = editor.getValue()
          updateFileContent(activeFile.id, content)
          lastSavedContent.current = content
          markTabDirty(activeFile.id, false)
        }
      }
    })

    // Advanced find and replace
    editor.addAction({
      id: 'advanced-find',
      label: 'Find and Replace',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF],
      run: () => {
        editor.getAction('actions.find').run()
      }
    })

    // Toggle minimap
    editor.addAction({
      id: 'toggle-minimap',
      label: 'Toggle Minimap',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyM],
      run: () => {
        const currentOptions = editor.getOptions()
        const minimapEnabled = currentOptions.get(monaco.editor.EditorOption.minimap).enabled
        editor.updateOptions({
          minimap: { enabled: !minimapEnabled }
        })
      }
    })

    // Go to line
    editor.addAction({
      id: 'go-to-line',
      label: 'Go to Line',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyG],
      run: () => {
        editor.getAction('editor.action.gotoLine').run()
      }
    })

    // Format document
    editor.addAction({
      id: 'format-document',
      label: 'Format Document',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF],
      run: () => {
        editor.getAction('editor.action.formatDocument').run()
      }
    })

    // Comment line
    editor.addAction({
      id: 'toggle-comment',
      label: 'Toggle Line Comment',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash],
      run: () => {
        editor.getAction('editor.action.commentLine').run()
      }
    })

    // Store initial content
    if (activeFile?.content) {
      lastSavedContent.current = activeFile.content
    }
  }

  const handleEditorChange = (value: string | undefined) => {
    if (!activeFile || value === undefined) return
    
    const isDirty = value !== lastSavedContent.current
    markTabDirty(activeFile.id, isDirty)
    
    // Auto-save after 2 seconds of no changes
    const timeoutId = setTimeout(() => {
      updateFileContent(activeFile.id, value)
      lastSavedContent.current = value
      markTabDirty(activeFile.id, false)
    }, 2000)

    return () => clearTimeout(timeoutId)
  }

  // Update theme when dark mode changes
  useEffect(() => {
    if (editorRef.current) {
      const monaco = (window as any).monaco // eslint-disable-line @typescript-eslint/no-explicit-any
      if (monaco) {
        monaco.editor.setTheme(isDarkMode ? 'notion-dark' : 'notion-light')
      }
    }
  }, [isDarkMode])

  // Update content when active file changes
  useEffect(() => {
    if (activeFile?.content !== undefined) {
      lastSavedContent.current = activeFile.content
    }
  }, [activeTabId, activeFile?.content])

  if (!activeFile) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-editor-bg text-text-muted">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <span className="text-2xl text-white">📝</span>
          </div>
          <h2 className="text-lg font-medium text-foreground mb-2">No file selected</h2>
          <p className="text-sm">Select a file from the sidebar to start editing</p>
          <p className="text-xs mt-2">
            Or press <kbd className="bg-border px-2 py-1 rounded text-xs">Cmd+N</kbd> to create a new file
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-editor-bg">
      <MonacoEditorComponent
        height="100%"
        language={activeFile.language || 'plaintext'}
        value={activeFile.content || ''}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          automaticLayout: true,
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 12,
            horizontalScrollbarSize: 12,
          },
        }}
      />
    </div>
  )
})

export default MonacoEditor