'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { Monitor, RefreshCw, X } from 'lucide-react'

export default function LivePreview() {
  const { 
    getPreviewFiles, 
    togglePreview,
    isPreviewOpen 
  } = useEditorStore()
  
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const createPreviewDocument = (html?: string, css?: string, js?: string) => {
    const defaultHtml = html || `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Live Preview</title>
      </head>
      <body>
        <div style="padding: 20px; font-family: Inter, system-ui, sans-serif; color: #374151;">
          <h1 style="color: #1f2937; margin-bottom: 16px;">Welcome to Live Preview</h1>
          <p style="margin-bottom: 12px;">Create an <strong>index.html</strong> file to see your content here.</p>
          <p style="margin-bottom: 12px;">You can also add:</p>
          <ul style="margin-left: 20px;">
            <li><strong>style.css</strong> for styling</li>
            <li><strong>script.js</strong> for JavaScript</li>
          </ul>
          <p style="margin-top: 16px; font-size: 14px; color: #6b7280;">Changes will update in real-time as you type!</p>
        </div>
      </body>
      </html>
    `

    // If we have HTML content, inject CSS and JS into it
    if (html) {
      let document = html
      
      // Inject CSS
      if (css) {
        const styleTag = `<style>\n${css}\n</style>`
        if (document.includes('</head>')) {
          document = document.replace('</head>', `${styleTag}\n</head>`)
        } else {
          document = `<head>${styleTag}</head>\n${document}`
        }
      }
      
      // Inject JS
      if (js) {
        const scriptTag = `<script>\n${js}\n</script>`
        if (document.includes('</body>')) {
          document = document.replace('</body>', `${scriptTag}\n</body>`)
        } else {
          document = `${document}\n${scriptTag}`
        }
      }
      
      return document
    }

    return defaultHtml
  }

  const updatePreview = useCallback(() => {
    if (!iframeRef.current) return

    setIsLoading(true)
    setError(null)

    try {
      const { html, css, js } = getPreviewFiles()
      const document = createPreviewDocument(html, css, js)
      
      // Create a blob URL for the HTML document
      const blob = new Blob([document], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      
      // Update iframe src
      iframeRef.current.src = url
      
      // Clean up previous blob URL after iframe loads
      const handleLoad = () => {
        setIsLoading(false)
        if (iframeRef.current?.src.startsWith('blob:')) {
          // Keep current URL, clean up after next update
        }
      }
      
      const handleError = () => {
        setIsLoading(false)
        setError('Failed to load preview')
      }
      
      iframeRef.current.onload = handleLoad
      iframeRef.current.onerror = handleError
      
    } catch (err) {
      setIsLoading(false)
      setError('Error creating preview')
      console.error('Preview error:', err)
    }
  }, [getPreviewFiles])

  const debouncedUpdate = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      updatePreview()
    }, 300) as NodeJS.Timeout
  }, [updatePreview])

  // Update preview when files change
  useEffect(() => {
    if (isPreviewOpen) {
      debouncedUpdate()
    }
    
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [getPreviewFiles, isPreviewOpen, debouncedUpdate])

  // Initial load
  useEffect(() => {
    if (isPreviewOpen) {
      updatePreview()
    }
  }, [isPreviewOpen, updatePreview])

  if (!isPreviewOpen) {
    return null
  }

  return (
    <div className="flex flex-col h-full bg-background border-l border-border">
      {/* Preview Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-2">
          <Monitor size={16} className="text-foreground" />
          <span className="text-sm font-medium text-foreground">Live Preview</span>
          {isLoading && (
            <RefreshCw size={14} className="text-blue-500 animate-spin" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={updatePreview}
            className="p-1 rounded hover:bg-secondary transition-colors"
            title="Refresh preview"
          >
            <RefreshCw size={14} className="text-text-muted" />
          </button>
          <button
            onClick={togglePreview}
            className="p-1 rounded hover:bg-secondary transition-colors"
            title="Close preview"
          >
            <X size={14} className="text-text-muted" />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 relative">
        {error ? (
          <div className="flex items-center justify-center h-full bg-destructive/10">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-3">
                <X size={20} className="text-destructive" />
              </div>
              <p className="text-sm font-medium text-destructive mb-1">Preview Error</p>
              <p className="text-xs text-text-muted">{error}</p>
              <button
                onClick={updatePreview}
                className="mt-3 px-3 py-1 text-xs bg-destructive text-white rounded hover:bg-destructive/90 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
            title="Live Preview"
          />
        )}
        
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <RefreshCw size={20} className="text-blue-500 animate-spin" />
              <span className="text-sm text-text-secondary">Updating preview...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}