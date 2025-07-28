'use client'

import React, { useMemo } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { FixedSizeList as List } from 'react-window'
import FileItem from '@/components/filetree/FileItem'
import FolderItem from '@/components/filetree/FolderItem'

interface VirtualizedFileTreeProps {
  height: number
}

interface FlattenedFile {
  id: string
  type: 'file' | 'folder'
  level: number
  file: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

const VirtualizedFileTree = React.memo(function VirtualizedFileTree({ 
  height 
}: VirtualizedFileTreeProps) {
  const { getFilesByParent } = useEditorStore()

  // Flatten the file tree for virtualization
  const flattenedFiles = useMemo(() => {
    const result: FlattenedFile[] = []
    
    const addFiles = (parentId?: string, level = 0) => {
      const children = getFilesByParent(parentId)
      
      for (const file of children) {
        result.push({
          id: file.id,
          type: file.type,
          level,
          file
        })
        
        // Add children if folder is open
        if (file.type === 'folder' && file.isOpen) {
          addFiles(file.id, level + 1)
        }
      }
    }
    
    addFiles()
    return result
  }, [getFilesByParent])

  const Row = React.memo(({ index, style }: { index: number; style: any }) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const item = flattenedFiles[index]
    
    return (
      <div style={style}>
        {item.type === 'folder' ? (
          <FolderItem
            file={item.file}
            level={item.level}
          />
        ) : (
          <FileItem
            file={item.file}
            level={item.level}
          />
        )}
      </div>
    )
  })

  Row.displayName = 'VirtualizedFileTreeRow'

  // Only use virtualization if we have many files
  if (flattenedFiles.length < 50) {
    return (
      <div className="py-2">
        {flattenedFiles.map((item) => (
          item.type === 'folder' ? (
            <FolderItem
              key={item.id}
              file={item.file}
              level={item.level}
            />
          ) : (
            <FileItem
              key={item.id}
              file={item.file}
              level={item.level}
            />
          )
        ))}
      </div>
    )
  }

  return (
    <List
      height={height}
      width="100%"
      itemCount={flattenedFiles.length}
      itemSize={28} // Height of each file item
      overscanCount={5}
    >
      {Row}
    </List>
  )
})

export default VirtualizedFileTree