import { useEffect } from 'react'
import { useEditorStore } from '@/store/editorStore'

export function useKeyboardShortcuts() {
  const { 
    createFile, 
    toggleSidebar, 
    togglePreview, 
    toggleDarkMode,
    closeTab,
    activeTabId,
    tabs,
    setActiveTab
  } = useEditorStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const metaKey = isMac ? e.metaKey : e.ctrlKey

      // Prevent default for our shortcuts
      if (metaKey || e.key === 'F1') {
        switch (e.key.toLowerCase()) {
          case 'n':
            if (metaKey && !e.shiftKey) {
              e.preventDefault()
              createFile('Untitled.txt')
            }
            break
          case 'w':
            if (metaKey && activeTabId) {
              e.preventDefault()
              closeTab(activeTabId)
            }
            break
          case 'b':
            if (metaKey && e.shiftKey) {
              e.preventDefault()
              toggleSidebar()
            }
            break
          case 'p':
            if (metaKey && e.shiftKey) {
              e.preventDefault()
              togglePreview()
            }
            break
          case 'd':
            if (metaKey && e.shiftKey) {
              e.preventDefault()
              toggleDarkMode()
            }
            break
          case 'tab':
            if (e.ctrlKey && tabs.length > 1) {
              e.preventDefault()
              const currentIndex = tabs.findIndex(tab => tab.id === activeTabId)
              const nextIndex = e.shiftKey 
                ? (currentIndex - 1 + tabs.length) % tabs.length
                : (currentIndex + 1) % tabs.length
              setActiveTab(tabs[nextIndex].id)
            }
            break
        }
      }

      // Handle F-keys
      switch (e.key) {
        case 'F1':
          e.preventDefault()
          // Could open help/command palette
          console.log('Help shortcut triggered')
          break
        case 'F11':
          e.preventDefault()
          // Toggle fullscreen
          if (document.fullscreenElement) {
            document.exitFullscreen()
          } else {
            document.documentElement.requestFullscreen()
          }
          break
      }

      // Handle Escape key
      if (e.key === 'Escape') {
        // Close any open modals, menus, etc.
        // This could be expanded to close search, menus, etc.
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [
    createFile, 
    toggleSidebar, 
    togglePreview, 
    toggleDarkMode,
    closeTab,
    activeTabId,
    tabs,
    setActiveTab
  ])
}

// Hook for focus management
export function useFocusManagement() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Focus management with arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const focusableElements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as Element)

        if (currentIndex !== -1) {
          let nextIndex = currentIndex

          switch (e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
              nextIndex = (currentIndex + 1) % focusableElements.length
              break
            case 'ArrowUp':
            case 'ArrowLeft':
              nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length
              break
          }

          if (nextIndex !== currentIndex) {
            e.preventDefault()
            ;(focusableElements[nextIndex] as HTMLElement).focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
}