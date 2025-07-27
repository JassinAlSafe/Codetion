'use client'

import { useEditorStore } from '@/store/editorStore'
import FileItem from './FileItem'
import FolderItem from './FolderItem'

export default function FileTree() {
  const { getFilesByParent } = useEditorStore()
  const rootFiles = getFilesByParent()

  if (rootFiles.length === 0) {
    return (
      <div className="p-4 text-center text-text-muted text-sm">
        <p>No files yet</p>
        <p className="text-xs mt-1">Create your first file or folder</p>
      </div>
    )
  }

  return (
    <div className="py-2">
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
}