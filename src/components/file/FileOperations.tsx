'use client'

import React, { useRef, useState } from 'react'
import { Upload, Download, FolderOpen, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEditorStore } from '@/store/editorStore'

export default function FileOperations() {
  const { uploadFile, downloadProject, getActiveFile, downloadFile } = useEditorStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const activeFile = getActiveFile()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setUploadStatus('uploading')
    setStatusMessage(`Uploading ${files.length} file(s)...`)

    try {
      const uploadPromises = Array.from(files).map(file => uploadFile(file))
      await Promise.all(uploadPromises)
      
      setUploadStatus('success')
      setStatusMessage(`Successfully uploaded ${files.length} file(s)`)
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setUploadStatus('idle')
        setStatusMessage('')
      }, 3000)
    } catch (error) {
      setUploadStatus('error')
      setStatusMessage('Failed to upload files')
      
      setTimeout(() => {
        setUploadStatus('idle')
        setStatusMessage('')
      }, 3000)
    }

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleDownloadFile = () => {
    if (activeFile) {
      downloadFile(activeFile.id)
    }
  }

  const handleDownloadProject = () => {
    downloadProject()
  }

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Upload size={14} className="animate-pulse text-blue-500" />
      case 'success':
        return <CheckCircle size={14} className="text-green-500" />
      case 'error':
        return <AlertCircle size={14} className="text-red-500" />
      default:
        return <Upload size={14} />
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".txt,.js,.ts,.jsx,.tsx,.html,.css,.scss,.json,.md,.py,.java,.go,.rs,.sql,.xml,.yaml,.yml"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Upload button */}
      <Button
        onClick={handleUploadClick}
        disabled={uploadStatus === 'uploading'}
        size="sm"
        className="h-8 gap-2 bg-blue-500 hover:bg-blue-600"
        title="Upload files"
      >
        {getStatusIcon()}
        <span className="hidden sm:inline">
          {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload'}
        </span>
      </Button>

      {/* Download current file */}
      {activeFile && (
        <Button
          onClick={handleDownloadFile}
          variant="secondary"
          size="sm"
          className="h-8 gap-2"
          title={`Download ${activeFile.name}`}
        >
          <Download size={14} />
          <span className="hidden sm:inline">File</span>
        </Button>
      )}

      {/* Download project */}
      <Button
        onClick={handleDownloadProject}
        size="sm"
        className="h-8 gap-2 bg-green-500 hover:bg-green-600"
        title="Download entire project"
      >
        <FolderOpen size={14} />
        <span className="hidden sm:inline">Project</span>
      </Button>

      {/* Status message */}
      {statusMessage && (
        <div className={`text-xs px-3 py-1 rounded-md border ${
          uploadStatus === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
          uploadStatus === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
          'bg-blue-50 text-blue-700 border-blue-200'
        }`}>
          {statusMessage}
        </div>
      )}
    </div>
  )
}