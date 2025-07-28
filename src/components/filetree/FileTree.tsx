'use client'

import React, { useState, useEffect } from 'react'
import { useEditorStore } from '@/store/editorStore'
import FileItem from './FileItem'
import FolderItem from './FolderItem'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const FileTree = React.memo(function FileTree() {
  const { getFilesByParent } = useEditorStore()
  const [isLoading, setIsLoading] = useState(false)
  const [rootFiles, setRootFiles] = useState(() => getFilesByParent())

  // Simulate loading state for large file operations
  useEffect(() => {
    const files = getFilesByParent()
    if (files.length > 20) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setRootFiles(files)
        setIsLoading(false)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setRootFiles(files)
    }
  }, [getFilesByParent])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="md" />
      </div>
    )
  }

  if (rootFiles.length === 0) {
    return (
      <div className="p-6 text-center text-text-muted text-sm">
        <p>No files yet</p>
        <p className="text-xs mt-1">Create your first file or folder</p>
      </div>
    )
  }

  return (
    <div className="py-2 px-1">
      {rootFiles.map((file) => {
        if (file.type === 'folder') {
          return (
            <FolderItem
              key={file.id}
              file={file}
              level={0}
            />
          )
        } else {
          return (
            <FileItem
              key={file.id}
              file={file}
              level={0}
            />
          )
        }
      })}
    </div>
  )
})

export default FileTree