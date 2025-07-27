import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  content?: string
  language?: string
  parentId?: string
  isOpen?: boolean
  children?: string[]
}

export interface Tab {
  id: string
  name: string
  isDirty: boolean
  filePath: string
}

export interface EditorStore {
  // File system
  files: Record<string, FileItem>
  rootFiles: string[]
  
  // Tabs
  tabs: Tab[]
  activeTabId: string | null
  
  // UI state
  isDarkMode: boolean
  sidebarWidth: number
  isSidebarOpen: boolean
  
  // File operations
  createFile: (name: string, parentId?: string, type?: 'file' | 'folder') => string
  deleteFile: (id: string) => void
  renameFile: (id: string, newName: string) => void
  updateFileContent: (id: string, content: string) => void
  toggleFolder: (id: string) => void
  
  // Tab operations
  openTab: (fileId: string) => void
  closeTab: (tabId: string) => void
  setActiveTab: (tabId: string) => void
  markTabDirty: (tabId: string, isDirty: boolean) => void
  
  // UI operations
  toggleDarkMode: () => void
  setSidebarWidth: (width: number) => void
  toggleSidebar: () => void
  
  // Utility
  getFileById: (id: string) => FileItem | undefined
  getFilesByParent: (parentId?: string) => FileItem[]
  getActiveFile: () => FileItem | undefined
}

const generateId = () => Math.random().toString(36).substr(2, 9)

const getLanguageFromFileName = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'js':
    case 'jsx':
      return 'javascript'
    case 'ts':
    case 'tsx':
      return 'typescript'
    case 'html':
      return 'html'
    case 'css':
      return 'css'
    case 'scss':
    case 'sass':
      return 'scss'
    case 'json':
      return 'json'
    case 'md':
      return 'markdown'
    case 'py':
      return 'python'
    case 'java':
      return 'java'
    case 'go':
      return 'go'
    case 'rust':
    case 'rs':
      return 'rust'
    case 'sql':
      return 'sql'
    case 'xml':
      return 'xml'
    case 'yaml':
    case 'yml':
      return 'yaml'
    default:
      return 'plaintext'
  }
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      // Initial state
      files: {
        'welcome': {
          id: 'welcome',
          name: 'Welcome.md',
          type: 'file',
          content: `# Welcome to CodeNotion

This is a modern, Notion-inspired code editor built with Next.js, TypeScript, and Monaco Editor.

## Features

- 📁 File tree navigation
- 📝 Monaco Editor with syntax highlighting
- 🎨 Beautiful Notion-inspired design
- 🌙 Dark/Light mode toggle
- 💾 Local file persistence
- 📑 Tab system for multiple files

## Getting Started

1. Create new files and folders using the sidebar
2. Click on files to open them in tabs
3. Use Cmd/Ctrl + N to create a new file
4. Toggle dark mode with the theme button

Happy coding! 🚀
`,
          language: 'markdown'
        }
      },
      rootFiles: ['welcome'],
      tabs: [{
        id: 'welcome',
        name: 'Welcome.md',
        isDirty: false,
        filePath: 'Welcome.md'
      }],
      activeTabId: 'welcome',
      isDarkMode: false,
      sidebarWidth: 280,
      isSidebarOpen: true,

      // File operations
      createFile: (name: string, parentId?: string, type: 'file' | 'folder' = 'file') => {
        const id = generateId()
        const language = type === 'file' ? getLanguageFromFileName(name) : undefined
        
        const newFile: FileItem = {
          id,
          name,
          type,
          content: type === 'file' ? '' : undefined,
          language,
          parentId,
          isOpen: type === 'folder' ? false : undefined,
          children: type === 'folder' ? [] : undefined
        }

        set((state) => {
          const newFiles = { ...state.files, [id]: newFile }
          
          if (parentId) {
            const parent = newFiles[parentId]
            if (parent && parent.children) {
              parent.children.push(id)
            }
          } else {
            return {
              ...state,
              files: newFiles,
              rootFiles: [...state.rootFiles, id]
            }
          }
          
          return { ...state, files: newFiles }
        })

        return id
      },

      deleteFile: (id: string) => {
        set((state) => {
          const file = state.files[id]
          if (!file) return state

          const newFiles = { ...state.files }
          const newTabs = state.tabs.filter(tab => tab.id !== id)
          const newActiveTabId = state.activeTabId === id ? 
            (newTabs[0]?.id || null) : state.activeTabId

          // Remove from parent's children or root files
          if (file.parentId) {
            const parent = newFiles[file.parentId]
            if (parent && parent.children) {
              parent.children = parent.children.filter(childId => childId !== id)
            }
          } else {
            const newRootFiles = state.rootFiles.filter(rootId => rootId !== id)
            delete newFiles[id]
            return {
              ...state,
              files: newFiles,
              rootFiles: newRootFiles,
              tabs: newTabs,
              activeTabId: newActiveTabId
            }
          }

          delete newFiles[id]
          return {
            ...state,
            files: newFiles,
            tabs: newTabs,
            activeTabId: newActiveTabId
          }
        })
      },

      renameFile: (id: string, newName: string) => {
        set((state) => {
          const file = state.files[id]
          if (!file) return state

          const newLanguage = file.type === 'file' ? getLanguageFromFileName(newName) : file.language
          
          return {
            ...state,
            files: {
              ...state.files,
              [id]: { ...file, name: newName, language: newLanguage }
            },
            tabs: state.tabs.map(tab => 
              tab.id === id ? { ...tab, name: newName } : tab
            )
          }
        })
      },

      updateFileContent: (id: string, content: string) => {
        set((state) => {
          const file = state.files[id]
          if (!file || file.type !== 'file') return state

          return {
            ...state,
            files: {
              ...state.files,
              [id]: { ...file, content }
            }
          }
        })
      },

      toggleFolder: (id: string) => {
        set((state) => {
          const file = state.files[id]
          if (!file || file.type !== 'folder') return state

          return {
            ...state,
            files: {
              ...state.files,
              [id]: { ...file, isOpen: !file.isOpen }
            }
          }
        })
      },

      // Tab operations
      openTab: (fileId: string) => {
        set((state) => {
          const file = state.files[fileId]
          if (!file || file.type !== 'file') return state

          const existingTab = state.tabs.find(tab => tab.id === fileId)
          if (existingTab) {
            return { ...state, activeTabId: fileId }
          }

          const newTab: Tab = {
            id: fileId,
            name: file.name,
            isDirty: false,
            filePath: file.name
          }

          return {
            ...state,
            tabs: [...state.tabs, newTab],
            activeTabId: fileId
          }
        })
      },

      closeTab: (tabId: string) => {
        set((state) => {
          const newTabs = state.tabs.filter(tab => tab.id !== tabId)
          const newActiveTabId = state.activeTabId === tabId ? 
            (newTabs[0]?.id || null) : state.activeTabId

          return {
            ...state,
            tabs: newTabs,
            activeTabId: newActiveTabId
          }
        })
      },

      setActiveTab: (tabId: string) => {
        set((state) => ({ ...state, activeTabId: tabId }))
      },

      markTabDirty: (tabId: string, isDirty: boolean) => {
        set((state) => ({
          ...state,
          tabs: state.tabs.map(tab => 
            tab.id === tabId ? { ...tab, isDirty } : tab
          )
        }))
      },

      // UI operations
      toggleDarkMode: () => {
        set((state) => {
          const newIsDarkMode = !state.isDarkMode
          if (typeof document !== 'undefined') {
            if (newIsDarkMode) {
              document.documentElement.classList.add('dark')
            } else {
              document.documentElement.classList.remove('dark')
            }
          }
          return { ...state, isDarkMode: newIsDarkMode }
        })
      },

      setSidebarWidth: (width: number) => {
        set((state) => ({ ...state, sidebarWidth: width }))
      },

      toggleSidebar: () => {
        set((state) => ({ ...state, isSidebarOpen: !state.isSidebarOpen }))
      },

      // Utility functions
      getFileById: (id: string) => {
        return get().files[id]
      },

      getFilesByParent: (parentId?: string) => {
        const { files, rootFiles } = get()
        if (!parentId) {
          return rootFiles.map(id => files[id]).filter(Boolean)
        }
        
        const parent = files[parentId]
        if (!parent || !parent.children) return []
        
        return parent.children.map(id => files[id]).filter(Boolean)
      },

      getActiveFile: () => {
        const { files, activeTabId } = get()
        return activeTabId ? files[activeTabId] : undefined
      }
    }),
    {
      name: 'code-notion-editor',
      partialize: (state) => ({
        files: state.files,
        rootFiles: state.rootFiles,
        isDarkMode: state.isDarkMode,
        sidebarWidth: state.sidebarWidth,
        isSidebarOpen: state.isSidebarOpen
      })
    }
  )
)