'use client'

import React, { useState, useCallback } from 'react'
import { Upload, FileText } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'

interface DragDropZoneProps {
  children: React.ReactNode
}

export default function DragDropZone({ children }: DragDropZoneProps) {
  const { uploadFile } = useEditorStore()
  const [isDragging, setIsDragging] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setDragCounter(prev => prev + 1)
    
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setDragCounter(prev => prev - 1)
    
    if (dragCounter === 1) {
      setIsDragging(false)
    }
  }, [dragCounter])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsDragging(false)
    setDragCounter(0)

    const files = Array.from(e.dataTransfer.files).filter(file => {
      // Only accept text files
      return file.type.startsWith('text/') || 
             file.name.match(/\.(js|ts|jsx|tsx|html|css|scss|json|md|py|java|go|rs|sql|xml|yaml|yml)$/i)
    })

    if (files.length === 0) {
      alert('Please drop only text files or code files')
      return
    }

    try {
      const uploadPromises = files.map(file => uploadFile(file))
      await Promise.all(uploadPromises)
    } catch (error) {
      console.error('Error uploading files:', error)
      alert('Error uploading files')
    }
  }, [uploadFile])

  return (
    <div
      className="relative w-full h-full"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
      
      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm flex items-center justify-center z-50 border-2 border-dashed border-blue-500">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl border border-blue-500/30">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <Upload size={32} className="text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Drop Files Here
                </h3>
                <p className="text-sm text-text-muted">
                  Release to upload your files to the project
                </p>
                <div className="flex items-center gap-2 mt-3 text-xs text-text-muted">
                  <FileText size={14} />
                  <span>Supports: JS, TS, HTML, CSS, JSON, MD, PY, and more</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}