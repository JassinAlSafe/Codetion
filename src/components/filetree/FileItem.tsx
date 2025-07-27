'use client'

import { useState } from 'react'
import { File, Edit, Trash2, MoreVertical } from 'lucide-react'
import { useEditorStore, FileItem as FileItemType } from '@/store/editorStore'
import { getFileIcon } from '@/lib/fileUtils'

interface FileItemProps {
  file: FileItemType
  level: number
}

export default function FileItem({ file, level }: FileItemProps) {
  const { openTab, deleteFile, renameFile, activeTabId } = useEditorStore()
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState(file.name)
  const [showMenu, setShowMenu] = useState(false)

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

  return (
    <div className="relative group">
      <div
        className={`flex items-center gap-2 h-7 cursor-pointer hover:bg-hover transition-colors relative ${
          isActive ? 'bg-active' : ''
        }`}
        style={{ paddingLeft }}
        onClick={handleClick}
      >
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <span className="text-sm">{getFileIcon(file.name, false)}</span>
          {isEditing ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              className="flex-1 px-1 py-0 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            <span className="text-sm text-foreground truncate flex-1">
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
            className="p-1 hover:bg-border rounded transition-colors"
          >
            <MoreVertical size={12} />
          </button>
        </div>

        {showMenu && (
          <div className="absolute right-2 top-7 bg-background border border-border rounded-md shadow-lg py-1 z-10 min-w-[120px]">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(true)
                setShowMenu(false)
              }}
              className="w-full px-3 py-1 text-left text-sm hover:bg-hover transition-colors flex items-center gap-2"
            >
              <Edit size={12} />
              Rename
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDelete()
              }}
              className="w-full px-3 py-1 text-left text-sm hover:bg-hover transition-colors flex items-center gap-2 text-red-600"
            >
              <Trash2 size={12} />
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
}