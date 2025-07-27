'use client'

import { useState } from 'react'
import { Plus, FileText, Folder, MoreVertical } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import FileTree from '@/components/filetree/FileTree'

export default function Sidebar() {
  const { isSidebarOpen, sidebarWidth, createFile } = useEditorStore()
  const [showNewFileModal, setShowNewFileModal] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [newFileType, setNewFileType] = useState<'file' | 'folder'>('file')

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      createFile(newFileName.trim(), undefined, newFileType)
      setNewFileName('')
      setShowNewFileModal(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateFile()
    } else if (e.key === 'Escape') {
      setShowNewFileModal(false)
      setNewFileName('')
    }
  }

  if (!isSidebarOpen) return null

  return (
    <aside 
      className="bg-sidebar-bg border-r border-border flex flex-col shrink-0"
      style={{ width: sidebarWidth }}
    >
      {/* Sidebar Header */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-border">
        <h2 className="font-medium text-sm text-foreground">Explorer</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowNewFileModal(true)}
            className="p-1.5 hover:bg-hover rounded-md transition-colors"
            title="New File or Folder"
          >
            <Plus size={14} />
          </button>
          <button
            className="p-1.5 hover:bg-hover rounded-md transition-colors"
            title="More Actions"
          >
            <MoreVertical size={14} />
          </button>
        </div>
      </div>

      {/* New File Modal */}
      {showNewFileModal && (
        <div className="p-3 border-b border-border bg-tab-bg">
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setNewFileType('file')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                newFileType === 'file' 
                  ? 'bg-active text-foreground' 
                  : 'text-text-secondary hover:bg-hover'
              }`}
            >
              <FileText size={12} />
              File
            </button>
            <button
              onClick={() => setNewFileType('folder')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                newFileType === 'folder' 
                  ? 'bg-active text-foreground' 
                  : 'text-text-secondary hover:bg-hover'
              }`}
            >
              <Folder size={12} />
              Folder
            </button>
          </div>
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`${newFileType === 'file' ? 'File' : 'Folder'} name`}
            className="w-full px-2 py-1 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex gap-1 mt-2">
            <button
              onClick={handleCreateFile}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowNewFileModal(false)
                setNewFileName('')
              }}
              className="px-2 py-1 text-xs bg-border text-foreground rounded hover:bg-active transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* File Tree */}
      <div className="flex-1 overflow-auto">
        <FileTree />
      </div>
    </aside>
  )
}