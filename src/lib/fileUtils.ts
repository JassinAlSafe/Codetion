export const isValidFileName = (name: string): boolean => {
  if (!name || name.trim().length === 0) return false
  
  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*\x00-\x1f]/
  if (invalidChars.test(name)) return false
  
  // Check for reserved names (Windows)
  const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9']
  if (reservedNames.includes(name.toUpperCase())) return false
  
  // Check for names ending with dots or spaces
  if (name.endsWith('.') || name.endsWith(' ')) return false
  
  return true
}

export const getFileIcon = (fileName: string, isFolder: boolean = false): string => {
  if (isFolder) return '📁'
  
  const ext = fileName.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'js':
    case 'jsx':
      return '🟨'
    case 'ts':
    case 'tsx':
      return '🔷'
    case 'html':
      return '🌐'
    case 'css':
    case 'scss':
    case 'sass':
      return '🎨'
    case 'json':
      return '📋'
    case 'md':
      return '📝'
    case 'py':
      return '🐍'
    case 'java':
      return '☕'
    case 'go':
      return '🐹'
    case 'rust':
    case 'rs':
      return '🦀'
    case 'sql':
      return '🗃️'
    case 'xml':
      return '📄'
    case 'yaml':
    case 'yml':
      return '⚙️'
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return '🖼️'
    case 'pdf':
      return '📕'
    case 'zip':
    case 'rar':
    case 'tar':
    case 'gz':
      return '📦'
    default:
      return '📄'
  }
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getRelativePath = (filePath: string, basePath: string = ''): string => {
  if (!basePath) return filePath
  return filePath.startsWith(basePath) ? filePath.slice(basePath.length) : filePath
}

export const downloadFile = (content: string, fileName: string, mimeType: string = 'text/plain'): void => {
  if (typeof window === 'undefined') return
  
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = (e) => reject(e)
    reader.readAsText(file)
  })
}

export const getShortcutText = (key: string, metaKey: boolean = false): string => {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const modifierKey = isMac ? '⌘' : 'Ctrl'
  
  return metaKey ? `${modifierKey}+${key}` : key
}