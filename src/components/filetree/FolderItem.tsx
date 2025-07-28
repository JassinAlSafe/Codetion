'use client'

import React, { useState } from 'react'
import { ChevronRight, ChevronDown, Edit, Trash2, MoreVertical, Plus } from 'lucide-react'
import { useEditorStore, FileItem as FileItemType } from '@/store/editorStore'
import { getFileIcon } from '@/lib/fileUtils'

interface FolderItemProps {
  file: FileItemType
  level: number
}

const FolderItem = React.memo(function FolderItem({ file, level }: FolderItemProps) {
  const { toggleFolder, deleteFile, renameFile, createFile, getFilesByParent } = useEditorStore()
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState(file.name)
  const [showMenu, setShowMenu] = useState(false)
  const [showNewFileModal, setShowNewFileModal] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [newFileType, setNewFileType] = useState<'file' | 'folder'>('file')

  const paddingLeft = level * 12 + 8
  const children = getFilesByParent(file.id)

  const handleToggle = () => {
    toggleFolder(file.id)
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

  const handleCreateChild = () => {
    if (newFileName.trim()) {
      createFile(newFileName.trim(), file.id, newFileType)
      setNewFileName('')
      setShowNewFileModal(false)
      if (!file.isOpen) {
        toggleFolder(file.id)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isEditing) {
        handleRename()
      } else {
        handleCreateChild()
      }
    } else if (e.key === 'Escape') {
      if (isEditing) {
        setNewName(file.name)
        setIsEditing(false)
      } else {
        setShowNewFileModal(false)
        setNewFileName('')
      }
    }
  }

  return (
    <div className="relative">
      <div className="group">
        <div
          className="flex items-center gap-1 h-7 px-1 py-0.5 cursor-pointer hover:bg-hover transition-colors rounded-sm"
          style={{ paddingLeft }}
          onClick={handleToggle}
        >
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <div className="w-4 h-4 flex items-center justify-center">
              {file.isOpen ? (
                <ChevronDown size={12} className="text-text-secondary" />
              ) : (
                <ChevronRight size={12} className="text-text-secondary" />
              )}
            </div>
            <span className="text-sm">{getFileIcon(file.name, true)}</span>
            {isEditing ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={handleKeyDown}
                className="flex-1 px-1 py-0 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
                onFocus={(e) => e.target.select()}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="text-sm text-foreground truncate flex-1">
                {file.name}
              </span>
            )}
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowNewFileModal(true)
              }}
              className="p-1 hover:bg-border rounded transition-colors"
              title="New File or Folder"
            >
              <Plus size={12} />
            </button>
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

      {/* New File Modal */}
      {showNewFileModal && (
        <div className="mt-1 p-2 border border-border rounded bg-tab-bg" style={{ marginLeft: paddingLeft + 16 }}>
          <div className="flex gap-1 mb-2">
            <button
              onClick={() => setNewFileType('file')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                newFileType === 'file' 
                  ? 'bg-active text-foreground' 
                  : 'text-text-secondary hover:bg-hover'
              }`}
            >
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
              Folder
            </button>
          </div>
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`${newFileType === 'file' ? 'File' : 'Folder'} name`}
            className="w-full px-2 py-1 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex gap-1 mt-2">
            <button
              onClick={handleCreateChild}
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

      {/* Render children */}
      {file.isOpen && children.length > 0 && (
        <div>
          {children.map((child) => {
            if (child.type === 'folder') {
              return (
                <FolderItem
                  key={child.id}
                  file={child}
                  level={level + 1}
                />
              )
            } else {
              // eslint-disable-next-line @typescript-eslint/no-require-imports
              const FileItemComponent = require('./FileItem').default as typeof import('./FileItem').default
              return (
                <FileItemComponent
                  key={child.id}
                  file={child}
                  level={level + 1}
                />
              )
            }
          })}
        </div>
      )}
    </div>
  )
})

export default FolderItem