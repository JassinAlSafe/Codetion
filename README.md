# CodeNotion 📝

> A beautiful, Notion-inspired code editor built with Next.js, TypeScript, and Monaco Editor

[![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-4.7.0-blue?style=flat-square)](https://microsoft.github.io/monaco-editor/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

![CodeNotion Screenshot](docs/screenshot.png)

## ✨ Features

### 🎨 **Beautiful Design**
- **Notion-inspired UI** with clean, minimal aesthetics
- **Dark/Light mode** with smooth transitions
- **Custom Monaco themes** that match the overall design
- **Inter font** for crisp, readable typography
- **Responsive layout** that works on all screen sizes

### 📁 **File Management**
- **Virtual file system** with full CRUD operations
- **Hierarchical folder structure** with expand/collapse
- **File type detection** with appropriate syntax highlighting
- **Context menus** for quick file operations
- **Persistent storage** using localStorage

### 💻 **Code Editing**
- **Monaco Editor** with full VS Code features
- **Syntax highlighting** for 20+ languages
- **Auto-save** with dirty state indicators
- **Keyboard shortcuts** (Cmd/Ctrl+S to save)
- **Tab system** for multiple open files
- **IntelliSense** and error detection

### 🚀 **Modern Architecture**
- **Next.js 15** with App Router
- **React 19** with modern hooks
- **TypeScript** throughout the entire codebase
- **Zustand** for lightweight state management
- **Tailwind CSS v4** with custom design system

## 🎯 Roadmap

### 🤖 **AI Integration** (Coming Soon)
- GPT/Claude-powered code assistance
- AI chat sidebar for code explanations
- Automatic code generation and refactoring
- Smart code suggestions

### 🌐 **Collaboration** (Planned)
- Real-time collaborative editing
- GitHub integration for file imports/exports
- Project sharing and permissions
- Multi-user authentication

### ☁️ **Cloud Features** (Future)
- Cloud storage for projects
- Cross-device synchronization
- Version control integration
- Deployment integration

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.17 or later
- **npm** or **yarn** or **pnpm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/code-notion.git
   cd code-notion
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the app in action!

## 📖 Usage

### Creating Files and Folders

1. **Click the "+" button** in the sidebar to create new files or folders
2. **Right-click** on any file or folder for context menu options
3. **Double-click** to rename files and folders
4. **Click** on files to open them in the editor

### Editor Features

- **Auto-save**: Changes are automatically saved after 2 seconds of inactivity
- **Manual save**: Use `Cmd+S` (Mac) or `Ctrl+S` (Windows/Linux)
- **Tab management**: Open multiple files and switch between them
- **Theme toggle**: Click the moon/sun icon in the header

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + S` | Save current file |
| `Cmd/Ctrl + N` | Create new file |
| `Cmd/Ctrl + W` | Close current tab |
| `Cmd/Ctrl + T` | Toggle theme |

## 🛠️ Development

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main editor page
│   └── api/               # API routes
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── editor/           # Editor-related components
│   └── filetree/         # File tree components
├── store/                # Zustand state management
├── lib/                  # Utility functions
└── styles/               # Global styles
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Tech Stack Deep Dive

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library with latest features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** - VS Code's editor
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

## 🤝 Contributing

We love contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- How to submit bug reports and feature requests
- Development setup and guidelines
- Code style and conventions
- Pull request process

### Quick Contribution Steps

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 🐛 Issues and Feedback

Found a bug or have a feature request? We'd love to hear from you!

- **Bug Reports**: [Create an issue](https://github.com/yourusername/code-notion/issues/new?template=bug_report.md)
- **Feature Requests**: [Request a feature](https://github.com/yourusername/code-notion/issues/new?template=feature_request.md)
- **Questions**: [Start a discussion](https://github.com/yourusername/code-notion/discussions)

## 🚀 Deployment

### Deploy on Vercel

The easiest way to deploy CodeNotion is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/code-notion)

### Deploy on Netlify

You can also deploy on [Netlify](https://netlify.com):

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/code-notion)

### Self-Hosting

For self-hosting instructions, see our [Deployment Guide](docs/deployment.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[VS Code](https://code.visualstudio.com/)** - Inspiration for editor features
- **[Notion](https://notion.so/)** - Design inspiration and UX patterns
- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** - Powerful code editor
- **[Vercel](https://vercel.com/)** - Hosting and deployment platform

## 💝 Support

If you find CodeNotion helpful, please consider:

- ⭐ **Starring** the repository
- 🐛 **Reporting** bugs and issues
- 💡 **Suggesting** new features
- 🤝 **Contributing** to the codebase
- 📢 **Sharing** with others

---

<div align="center">

**Built with ❤️ by the CodeNotion Team**

[Website](https://code-notion.dev) • [Documentation](https://docs.code-notion.dev) • [Community](https://github.com/yourusername/code-notion/discussions)

</div>
