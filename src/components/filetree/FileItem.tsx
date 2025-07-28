'use client'

import React, { useState } from 'react'
import { Edit, Trash2, MoreVertical } from 'lucide-react'
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
        className={`file-item flex items-center gap-1.5 h-7 px-1 py-0.5 cursor-pointer transition-smooth relative rounded-sm ${
          isActive ? 'bg-active' : ''
        } ${isDragging ? 'opacity-50' : ''}`}
        style={{ paddingLeft }}
        onClick={handleClick}
        draggable={!isEditing}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <span className="text-xs">{getFileIcon(file.name, false)}</span>
          {isEditing ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              className="input flex-1 px-1 py-0 text-xs"
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
            <span className="text-xs text-foreground truncate flex-1">
              {file.name}
            </span>
          )}
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="p-0.5 hover:bg-border rounded transition-fast hover-lift"
          >
            <MoreVertical size={10} />
          </button>
        </div>

        {showMenu && (
          <div className="menu absolute right-2 top-6 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(true)
                setShowMenu(false)
              }}
              className="menu-item text-xs"
            >
              <Edit size={10} />
              Rename
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDelete()
              }}
              className="menu-item text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 size={10} />
              Delete
            </button>
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