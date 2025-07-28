'use client'

import { useState, useMemo } from 'react'
import { Plus, FileText, Folder, MoreVertical, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-900 px-1 rounded text-yellow-900 dark:text-yellow-100">
          {part}
        </mark>
      ) : part
    )
  }

  return (
    <div className="py-1">
      {files.length === 0 ? (
        <div className="px-4 py-8 text-center text-muted-foreground">
          <Search size={32} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium">No files found</p>
          <p className="text-xs mt-1">Try a different search term</p>
        </div>
      ) : (
        <div className="space-y-1 px-2">
          {files.map((file) => (
            <Button
              key={file.id}
              variant="ghost"
              onClick={() => file.type === 'file' && openTab(file.id)}
              className="w-full justify-start h-auto py-2 px-3 hover:bg-accent"
            >
              <span className="text-base mr-3">{getFileIcon(file.name, file.type === 'folder')}</span>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm font-medium truncate">
                  {highlightMatch(file.name, searchQuery)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {file.type === 'file' ? 'File' : 'Folder'}
                </div>
              </div>
            </Button>
          ))}
        </div>
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
      className="bg-card border-r border-border flex flex-col shrink-0 overflow-hidden"
      style={{ width: Math.max(sidebarWidth, 280), minWidth: '280px' }}
      role="navigation"
      aria-label="File explorer"
    >
      {/* Sidebar Header */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-sm text-foreground">Explorer</h2>
          <Badge variant="secondary" className="h-5 text-xs">
            {Object.keys(files).length}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNewFileModal(true)}
            className="h-7 w-7"
            title="New File or Folder"
          >
            <Plus size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            title="More Actions"
          >
            <MoreVertical size={14} />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search files..."
            className="pl-9 pr-8 h-8 text-sm"
            aria-label="Search files"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery('')}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
              title="Clear search"
            >
              <X size={12} />
            </Button>
          )}
        </div>
        
        {searchQuery && filteredFiles && (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {filteredFiles.length} result{filteredFiles.length !== 1 ? 's' : ''}
            </span>
            <Badge variant="outline" className="h-5 text-xs">
              {filteredFiles.length}
            </Badge>
          </div>
        )}
      </div>

      {/* New File Modal */}
      {showNewFileModal && (
        <div className="p-4 border-b border-border bg-muted/50">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                variant={newFileType === 'file' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewFileType('file')}
                className="flex items-center gap-2 h-8"
              >
                <FileText size={14} />
                File
              </Button>
              <Button
                variant={newFileType === 'folder' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewFileType('folder')}
                className="flex items-center gap-2 h-8"
              >
                <Folder size={14} />
                Folder
              </Button>
            </div>
            
            <Input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`${newFileType === 'file' ? 'File' : 'Folder'} name`}
              className="h-8"
              autoFocus
            />
            
            <div className="flex gap-2">
              <Button
                onClick={handleCreateFile}
                size="sm"
                className="flex-1 h-8"
              >
                Create
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewFileModal(false)
                  setNewFileName('')
                }}
                size="sm"
                className="flex-1 h-8"
              >
                Cancel
              </Button>
            </div>
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