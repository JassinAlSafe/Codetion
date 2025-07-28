'use client'

import React, { useState } from 'react'
import { Edit, Trash2, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEditorStore, FileItem as FileItemType } from '@/store/editorStore'
import { getFileIcon } from '@/lib/fileUtils'

interface FileItemProps {
  file: FileItemType
  level: number
}

const FileItem = React.memo(function FileItem({ file, level }: FileItemProps) {
  const { openTab, deleteFile, renameFile, activeTabId } = useEditorStore()
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState(file.name)
  const [showMenu, setShowMenu] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  // const [isDragOver, setIsDragOver] = useState(false) // TODO: Implement drag over functionality

  const isActive = activeTabId === file.id
  const paddingLeft = level * 12 + 8

  const handleClick = () => {
    if (file.type === 'file') {
      openTab(file.id)
    }
  }

  const handleRename = () => {
    if (newName.trim() && newName !== file.name) {
      renameFile(file.id, newName.trim())
    }
    setIsEditing(false)
    setShowMenu(false)
  }

  const handleDelete = () => {
    deleteFile(file.id)
    setShowMenu(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename()
    } else if (e.key === 'Escape') {
      setNewName(file.name)
      setIsEditing(false)
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    e.dataTransfer.setData('text/plain', JSON.stringify({
      id: file.id,
      name: file.name,
      type: file.type
    }))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <div className="relative group">
      <div
        className={`flex items-center gap-2 h-8 px-2 py-1 cursor-pointer transition-colors relative rounded-md mx-2 ${
          isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
        } ${isDragging ? 'opacity-50' : ''}`}
        style={{ paddingLeft: Math.max(paddingLeft - 8, 8) }}
        onClick={handleClick}
        draggable={!isEditing}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm">{getFileIcon(file.name, false)}</span>
          {isEditing ? (
            <Input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              className="h-6 px-1 py-0 text-sm border-0 bg-background"
              autoFocus
              onFocus={(e) => {
                const lastDot = e.target.value.lastIndexOf('.')
                if (lastDot > 0) {
                  e.target.setSelectionRange(0, lastDot)
                } else {
                  e.target.select()
                }
              }}
            />
          ) : (
            <span className="text-sm font-medium truncate flex-1">
              {file.name}
            </span>
          )}
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="h-6 w-6"
            title="More actions"
          >
            <MoreVertical size={12} />
          </Button>
        </div>

        {showMenu && (
          <div className="absolute right-2 top-8 z-10 bg-popover border border-border rounded-md shadow-md py-1 min-w-[120px]">
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(true)
                setShowMenu(false)
              }}
              className="w-full justify-start h-8 px-3 text-sm"
            >
              <Edit size={14} className="mr-2" />
              Rename
            </Button>
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                handleDelete()
              }}
              className="w-full justify-start h-8 px-3 text-sm text-destructive hover:text-destructive"
            >
              <Trash2 size={14} className="mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  )
})

export default FileItem