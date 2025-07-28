# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CodeNotion is a Notion-inspired code editor built with Next.js 15, React 19, TypeScript, and Monaco Editor. It features a file tree navigation system, tabbed editor interface, persistent local storage using Zustand, and a live preview panel for web development (HTML/CSS/JS) similar to CodePen or JSFiddle.

## Development Commands

- `npm run dev --turbopack` - Start development server with Turbo (default dev command)
- `npm run build` - Build the application for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## Architecture Overview

### State Management
- **Zustand Store**: Global state managed in `src/store/editorStore.ts`
  - File system state (files, folders, hierarchy)
  - Tab management (open tabs, active tab, dirty state)
  - UI state (dark mode, sidebar width, sidebar visibility)
  - Persistence using Zustand middleware to localStorage

### Key Components
- **MonacoEditor** (`src/components/editor/MonacoEditor.tsx`): Core editor with custom Notion-themed light/dark modes, auto-save functionality, and keyboard shortcuts
- **LivePreview** (`src/components/editor/LivePreview.tsx`): Real-time HTML/CSS/JS preview in sandboxed iframe with 300ms debounced updates
- **FileTree** (`src/components/filetree/`): Hierarchical file browser with create/delete/rename operations
- **TabBar** (`src/components/editor/TabBar.tsx`): Tab management for multiple open files
- **Layout Components** (`src/components/layout/`): Header, Sidebar, StatusBar for overall UI structure

### File System Architecture
Files are stored as a flat object with hierarchical relationships:
- Each file/folder has a unique ID, name, type, and optional parentId
- Root files tracked in `rootFiles` array
- Folders have `children` array containing child IDs
- Files have `content` and `language` properties for editor integration

### Monaco Editor Integration
- Dynamic import with SSR disabled for client-side only rendering
- Custom themes (`notion-light`, `notion-dark`) with Notion-inspired colors
- Auto-save with 2-second debounce
- Keyboard shortcuts (Cmd/Ctrl+S for manual save)
- Language detection based on file extensions

### Live Preview System
- Detects HTML/CSS/JS files automatically (index.html, style.css, script.js)
- Creates blob URLs for secure iframe rendering
- 3-column layout: Sidebar → Editor → Preview (400px width)
- Toggle visibility based on presence of web development files
- Real-time updates with debounced rendering (300ms)

### Styling
- Tailwind CSS with custom design system
- CSS custom properties for theming
- Dark/light mode support with class-based switching

## Key Dependencies
- `@monaco-editor/react`: Code editor component
- `zustand`: State management with persistence
- `lucide-react`: Icon library
- `next`: React framework with App Router
- `tailwindcss`: Utility-first CSS framework

## File Organization
- `/src/app/` - Next.js App Router pages and API routes
- `/src/components/` - Reusable React components organized by feature
- `/src/store/` - Zustand state management
- `/src/lib/` - Utility functions and helpers

## Technology Insights

### Tailwind CSS v4 Insights
- Introduces a new zero-runtime approach
- Provides first-class support for CSS variables
- Enables more dynamic and flexible styling
- Improves performance by eliminating runtime CSS generation
- Supports more advanced configuration and customization options