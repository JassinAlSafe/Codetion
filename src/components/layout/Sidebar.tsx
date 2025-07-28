'use client'

import { useState, useMemo } from 'react'
import { Plus, FileText, Folder, MoreVertical, Search, X } from 'lucide-react'
import { useEditorStore, FileItem } from '@/store/editorStore'
import FileTree from '@/components/filetree/FileTree'
import { getFileIcon } from '@/lib/fileUtils'

// Search Results Component
function SearchResults({ files, searchQuery }: { files: FileItem[], searchQuery: string }) {
  const { openTab } = useEditorStore()

  const highlightMatch = (text: string, query: string) => {
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  return (
    <div className="py-2">
      {files.length === 0 ? (
        <div className="px-4 py-8 text-center text-text-muted">
          <Search size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No files found</p>
          <p className="text-xs mt-1">Try a different search term</p>
        </div>
      ) : (
        files.map((file) => (
          <div
            key={file.id}
            onClick={() => file.type === 'file' && openTab(file.id)}
            className="file-item flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-hover transition-fast"
          >
            <span className="text-sm">{getFileIcon(file.name, file.type === 'folder')}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-foreground truncate">
                {highlightMatch(file.name, searchQuery)}
              </div>
              <div className="text-xs text-text-muted truncate">
                {file.type === 'file' ? 'File' : 'Folder'}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default function Sidebar() {
  const { isSidebarOpen, sidebarWidth, createFile, files } = useEditorStore()
  const [showNewFileModal, setShowNewFileModal] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [newFileType, setNewFileType] = useState<'file' | 'folder'>('file')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // Filtered files based on search query
  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return null
    
    const query = searchQuery.toLowerCase()
    return Object.values(files).filter(file => 
      file.name.toLowerCase().includes(query)
    )
  }, [files, searchQuery])

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
      className="bg-sidebar-bg border-r border-border flex flex-col shrink-0 overflow-hidden"
      style={{ width: Math.max(sidebarWidth, 280), minWidth: '280px' }}
      role="navigation"
      aria-label="File explorer"
    >
      {/* Sidebar Header */}
      <div className="h-8 flex items-center justify-between px-3 border-b border-border">
        <h2 className="font-medium text-xs text-foreground">Explorer</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowNewFileModal(true)}
            className="btn-ghost p-1 hover:bg-hover rounded-md transition-colors hover-lift touch-target"
            title="New File or Folder"
            aria-label="Create new file or folder"
          >
            <Plus size={12} />
          </button>
          <button
            className="btn-ghost p-1 hover:bg-hover rounded-md transition-colors hover-lift touch-target"
            title="More Actions"
            aria-label="More file actions"
          >
            <MoreVertical size={12} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-1.5 border-b border-border">
        <div className={`relative transition-smooth ${isSearchFocused ? 'hover-glow' : ''}`}>
          <Search size={10} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search files..."
            className="input w-full pl-6 pr-6 py-1 text-xs"
            aria-label="Search files"
            aria-describedby="search-help"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-0.5 hover:bg-hover rounded transition-fast"
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={10} />
            </button>
          )}
        </div>
        
        {searchQuery && filteredFiles && (
          <div id="search-help" className="mt-1 text-xs text-text-secondary" role="status" aria-live="polite">
            {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''} found
          </div>
        )}
      </div>

      {/* New File Modal */}
      {showNewFileModal && (
        <div className="p-3 border-b border-border bg-tab-bg menu">
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setNewFileType('file')}
              className={`btn btn-ghost flex items-center gap-1 px-2 py-1 rounded text-xs transition-fast ${
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
              className={`btn btn-ghost flex items-center gap-1 px-2 py-1 rounded text-xs transition-fast ${
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
            className="input w-full"
            autoFocus
          />
          <div className="flex gap-1 mt-2">
            <button
              onClick={handleCreateFile}
              className="btn btn-primary"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowNewFileModal(false)
                setNewFileName('')
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* File Tree or Search Results */}
      <div className="flex-1 overflow-auto">
        {searchQuery && filteredFiles ? (
          <SearchResults files={filteredFiles} searchQuery={searchQuery} />
        ) : (
          <FileTree />
        )}
      </div>
    </aside>
  )
}