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
  
  // Live Preview state
  isPreviewOpen: boolean
  previewWidth: number
  
  // Terminal state
  isTerminalOpen: boolean
  
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
  
  // Preview operations
  togglePreview: () => void
  setPreviewWidth: (width: number) => void
  
  // Terminal operations
  toggleTerminal: () => void
  
  // Utility
  getFileById: (id: string) => FileItem | undefined
  getFilesByParent: (parentId?: string) => FileItem[]
  getActiveFile: () => FileItem | undefined
  getPreviewFiles: () => { html?: string; css?: string; js?: string }
  shouldShowPreview: () => boolean
}

const generateId = () => Math.random().toString(36).substr(2, 9)

const getLanguageFromFileName = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  switch (ext) {
    // JavaScript & TypeScript
    case 'js':
    case 'jsx':
    case 'mjs':
    case 'cjs':
      return 'javascript'
    case 'ts':
    case 'tsx':
    case 'mts':
    case 'cts':
      return 'typescript'
    
    // Web technologies
    case 'html':
    case 'htm':
      return 'html'
    case 'css':
      return 'css'
    case 'scss':
    case 'sass':
      return 'scss'
    case 'less':
      return 'less'
    case 'json':
    case 'jsonc':
      return 'json'
    case 'xml':
    case 'xhtml':
      return 'xml'
    case 'svg':
      return 'xml'
    
    // Programming languages
    case 'py':
    case 'pyw':
    case 'pyi':
      return 'python'
    case 'java':
      return 'java'
    case 'c':
      return 'c'
    case 'cpp':
    case 'cxx':
    case 'cc':
    case 'c++':
      return 'cpp'
    case 'cs':
      return 'csharp'
    case 'php':
      return 'php'
    case 'rb':
      return 'ruby'
    case 'go':
      return 'go'
    case 'rust':
    case 'rs':
      return 'rust'
    case 'swift':
      return 'swift'
    case 'kt':
    case 'kts':
      return 'kotlin'
    case 'scala':
      return 'scala'
    case 'r':
      return 'r'
    case 'dart':
      return 'dart'
    
    // Shell & Scripts
    case 'sh':
    case 'bash':
    case 'zsh':
    case 'fish':
      return 'shell'
    case 'ps1':
      return 'powershell'
    case 'bat':
    case 'cmd':
      return 'bat'
    
    // Data & Config
    case 'sql':
      return 'sql'
    case 'yaml':
    case 'yml':
      return 'yaml'
    case 'toml':
      return 'toml'
    case 'ini':
      return 'ini'
    case 'cfg':
    case 'conf':
      return 'ini'
    case 'env':
      return 'shell'
    
    // Documentation
    case 'md':
    case 'markdown':
      return 'markdown'
    case 'txt':
      return 'plaintext'
    case 'log':
      return 'plaintext'
    
    // Specialized
    case 'dockerfile':
      return 'dockerfile'
    case 'graphql':
    case 'gql':
      return 'graphql'
    case 'prisma':
      return 'prisma'
    case 'proto':
      return 'protobuf'
    
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

- 📁 File tree navigation with full CRUD operations
- 📝 Monaco Editor with syntax highlighting
- 🎨 Beautiful Notion-inspired design
- 🌙 Dark/Light mode toggle
- 💾 Local file persistence
- 📑 Tab system for multiple files
- 🖥️ **Live Preview** - CodePen-like experience for web development

## Live Preview

Create HTML, CSS, and JS files to see them rendered in real-time! Try creating:

- **index.html** - Your main HTML content
- **style.css** - CSS styling
- **script.js** - JavaScript functionality

The preview panel will automatically appear when you have web files, and updates live as you type!

## Getting Started

1. Create new files and folders using the sidebar
2. Click on files to open them in tabs
3. Use Cmd/Ctrl + N to create a new file
4. Toggle dark mode with the theme button
5. Create HTML/CSS/JS files to see the live preview in action

Happy coding! 🚀
`,
          language: 'markdown'
        },
        'demo-html': {
          id: 'demo-html',
          name: 'index.html',
          type: 'file',
          content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeNotion Demo</title>
</head>
<body>
    <div class="container">
        <header>
            <h1>Welcome to CodeNotion Live Preview!</h1>
            <p class="subtitle">A modern, Notion-inspired code editor</p>
        </header>
        
        <main>
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="icon">📝</div>
                    <h3>Monaco Editor</h3>
                    <p>Full VS Code editing experience with syntax highlighting and IntelliSense</p>
                </div>
                
                <div class="feature-card">
                    <div class="icon">🎨</div>
                    <h3>Beautiful Design</h3>
                    <p>Clean, Notion-inspired interface that gets out of your way</p>
                </div>
                
                <div class="feature-card">
                    <div class="icon">🖥️</div>
                    <h3>Live Preview</h3>
                    <p>See your changes instantly with our CodePen-like preview panel</p>
                </div>
            </div>
            
            <div class="demo-section">
                <button id="demo-btn" onclick="showAlert()">Click me!</button>
                <div id="output"></div>
            </div>
        </main>
    </div>
</body>
</html>`,
          language: 'html'
        },
        'demo-css': {
          id: 'demo-css',
          name: 'style.css',
          type: 'file',
          content: `/* CodeNotion Demo Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

header {
    text-align: center;
    margin-bottom: 3rem;
    color: white;
}

header h1 {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.feature-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.feature-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #333;
}

.feature-card p {
    color: #666;
}

.demo-section {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    text-align: center;
}

#demo-btn {
    background: #667eea;
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease;
}

#demo-btn:hover {
    background: #5a6fd8;
}

#output {
    margin-top: 1rem;
    font-weight: bold;
    color: #667eea;
}`,
          language: 'css'
        },
        'demo-js': {
          id: 'demo-js',
          name: 'script.js',
          type: 'file',
          content: `// CodeNotion Demo JavaScript
function showAlert() {
    const output = document.getElementById('output');
    const messages = [
        'Welcome to CodeNotion! 🎉',
        'Edit this code and see changes instantly! ⚡',
        'Try modifying the CSS for different styles! 🎨',
        'Create your own HTML structure! 🏗️',
        'JavaScript works perfectly too! 💻'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    output.textContent = randomMessage;
    
    // Add some animation
    output.style.opacity = '0';
    setTimeout(() => {
        output.style.opacity = '1';
        output.style.transition = 'opacity 0.3s ease';
    }, 100);
}

// Initialize with a welcome message
document.addEventListener('DOMContentLoaded', function() {
    const output = document.getElementById('output');
    output.textContent = 'Live preview is working! Try clicking the button above.';
    
    // Add some interactive effects
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            card.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.background = 'white';
        });
    });
});`,
          language: 'javascript'
        }
      },
      rootFiles: ['welcome', 'demo-html', 'demo-css', 'demo-js'],
      tabs: [
        {
          id: 'welcome',
          name: 'Welcome.md',
          isDirty: false,
          filePath: 'Welcome.md'
        },
        {
          id: 'demo-html',
          name: 'index.html',
          isDirty: false,
          filePath: 'index.html'
        }
      ],
      activeTabId: 'demo-html',
      isDarkMode: false,
      sidebarWidth: 280,
      isSidebarOpen: true,
      isPreviewOpen: true,
      previewWidth: 400,
      isTerminalOpen: false,

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

      // Preview operations
      togglePreview: () => {
        set((state) => ({ ...state, isPreviewOpen: !state.isPreviewOpen }))
      },

      setPreviewWidth: (width: number) => {
        set((state) => ({ ...state, previewWidth: width }))
      },
      
      // Terminal operations
      toggleTerminal: () => {
        set((state) => ({ ...state, isTerminalOpen: !state.isTerminalOpen }))
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
      },

      getPreviewFiles: () => {
        const { files } = get()
        const result: { html?: string; css?: string; js?: string } = {}
        
        Object.values(files).forEach(file => {
          if (file.type === 'file' && file.content !== undefined) {
            const fileName = file.name.toLowerCase()
            if (fileName === 'index.html' || fileName.endsWith('.html')) {
              result.html = file.content
            } else if (fileName === 'style.css' || fileName === 'styles.css' || fileName.endsWith('.css')) {
              result.css = file.content
            } else if (fileName === 'script.js' || fileName === 'main.js' || fileName.endsWith('.js')) {
              result.js = file.content
            }
          }
        })
        
        return result
      },

      shouldShowPreview: () => {
        const { files } = get()
        return Object.values(files).some(file => 
          file.type === 'file' && 
          (file.language === 'html' || file.language === 'css' || file.language === 'javascript')
        )
      },
      
      // File operations
      uploadFile: (file: File) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            const content = e.target?.result as string
            const id = generateId()
            const language = getLanguageFromFileName(file.name)
            
            const newFile: FileItem = {
              id,
              name: file.name,
              type: 'file',
              content,
              language
            }
            
            set((state) => ({
              ...state,
              files: { ...state.files, [id]: newFile },
              rootFiles: [...state.rootFiles, id]
            }))
            
            resolve(id)
          }
          reader.onerror = () => reject(new Error('Failed to read file'))
          reader.readAsText(file)
        })
      },
      
      downloadFile: (id: string) => {
        const { files } = get()
        const file = files[id]
        if (!file || file.type !== 'file') return
        
        const blob = new Blob([file.content || ''], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      },
      
      downloadProject: () => {
        const { files } = get()
        // We'll implement ZIP export later
        const projectFiles = Object.values(files).filter(f => f.type === 'file')
        
        if (projectFiles.length === 1) {
          const file = projectFiles[0]
          const blob = new Blob([file.content || ''], { type: 'text/plain' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = file.name
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        } else {
          // For now, download as JSON (we'll add ZIP later)
          const projectData = { files: projectFiles }
          const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'codenotion-project.json'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
      }
    }),
    {
      name: 'code-notion-editor',
      partialize: (state) => ({
        files: state.files,
        rootFiles: state.rootFiles,
        isDarkMode: state.isDarkMode,
        sidebarWidth: state.sidebarWidth,
        isSidebarOpen: state.isSidebarOpen,
        isPreviewOpen: state.isPreviewOpen,
        previewWidth: state.previewWidth
      })
    }
  )
)