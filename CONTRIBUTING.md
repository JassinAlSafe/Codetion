# Contributing to CodeNotion 🤝

Thank you for your interest in contributing to CodeNotion! We welcome contributions from developers of all skill levels. This document provides guidelines and information to help you contribute effectively.

## 🌟 Ways to Contribute

### 🐛 **Bug Reports**
- Check existing issues before creating a new one
- Use the bug report template
- Provide clear reproduction steps
- Include browser/OS information
- Add screenshots or screen recordings if helpful

### 💡 **Feature Requests**
- Check if the feature has already been requested
- Use the feature request template
- Explain the use case and expected behavior
- Consider the impact on existing functionality

### 🔧 **Code Contributions**
- Fix bugs or implement new features
- Improve documentation
- Add tests
- Optimize performance
- Enhance accessibility

### 📚 **Documentation**
- Fix typos or unclear explanations
- Add examples or tutorials
- Improve API documentation
- Translate documentation

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **npm**, **yarn**, or **pnpm**
- **Git**
- A GitHub account

### Development Setup

1. **Fork the repository** on GitHub

2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/code-notion.git
   cd code-notion
   ```

3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-owner/code-notion.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser** to [http://localhost:3000](http://localhost:3000)

## 🛠️ Development Workflow

### Branch Naming Convention

Use descriptive branch names with prefixes:

- `feature/add-vim-mode` - New features
- `fix/monaco-theme-bug` - Bug fixes
- `docs/update-readme` - Documentation updates
- `refactor/file-tree-component` - Code refactoring
- `test/add-editor-tests` - Adding tests

### Making Changes

1. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes**:
   ```bash
   npm run lint          # Check code style
   npm run type-check    # TypeScript validation
   npm run build         # Ensure it builds
   ```

4. **Commit your changes** with a clear message:
   ```bash
   git commit -m "feat: add dark mode toggle to header"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat: add new feature`
- `fix: resolve bug in component`
- `docs: update documentation`
- `style: format code (no functional changes)`
- `refactor: restructure code without changing functionality`
- `test: add or modify tests`
- `chore: update dependencies or build process`

## 📋 Code Standards

### TypeScript Guidelines

- **Use TypeScript** for all new code
- **Define interfaces** for complex objects
- **Use strict typing** - avoid `any` when possible
- **Export types** that might be useful elsewhere

```typescript
// Good
interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
}

// Avoid
const file: any = { /* ... */ }
```

### React Best Practices

- **Use functional components** with hooks
- **Keep components focused** - single responsibility
- **Use descriptive prop names**
- **Handle loading and error states**
- **Optimize re-renders** with useMemo/useCallback when needed

```typescript
// Good
interface EditorProps {
  file: FileItem
  onChange: (content: string) => void
  isLoading?: boolean
}

export default function Editor({ file, onChange, isLoading }: EditorProps) {
  // Component implementation
}
```

### Styling Guidelines

- **Use Tailwind CSS** classes
- **Follow the design system** defined in globals.css
- **Use semantic class names** for custom components
- **Ensure responsive design**
- **Test in both light and dark modes**

```typescript
// Good
<div className="bg-sidebar-bg border-r border-border">
  
// Avoid inline styles when Tailwind classes exist
<div style={{ backgroundColor: '#f7f6f3' }}>
```

### File Organization

- **Group related files** in appropriate directories
- **Use descriptive file names**
- **Export components** from index files when appropriate
- **Keep files focused** - prefer multiple small files

```
components/
├── editor/
│   ├── MonacoEditor.tsx
│   ├── TabBar.tsx
│   └── index.ts          # Re-export components
└── layout/
    ├── Header.tsx
    ├── Sidebar.tsx
    └── StatusBar.tsx
```

## 🧪 Testing

### Running Tests

```bash
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Writing Tests

- **Test user interactions** and component behavior
- **Mock external dependencies** (APIs, Monaco Editor)
- **Test edge cases** and error conditions
- **Keep tests focused** and readable

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import FileItem from './FileItem'

test('should open file when clicked', () => {
  const mockOpenFile = jest.fn()
  const file = { id: '1', name: 'test.js', type: 'file' }
  
  render(<FileItem file={file} onOpen={mockOpenFile} />)
  
  fireEvent.click(screen.getByText('test.js'))
  expect(mockOpenFile).toHaveBeenCalledWith('1')
})
```

## 🎨 Design Guidelines

### UI/UX Principles

- **Follow Notion's design language** - clean, minimal, focused
- **Maintain consistency** with existing components
- **Ensure accessibility** - proper ARIA labels, keyboard navigation
- **Optimize for both desktop and mobile**
- **Consider dark mode** from the start

### Adding New Features

1. **Discuss the feature** in an issue before implementing
2. **Consider the user experience** - how does it fit in the workflow?
3. **Design for extensibility** - will this feature need more options later?
4. **Test thoroughly** - different screen sizes, themes, use cases

## 🚨 Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Tests pass and coverage is maintained
- [ ] Documentation is updated if needed
- [ ] The feature/fix works in both light and dark modes
- [ ] No console errors or warnings
- [ ] Responsive design is maintained

### Pull Request Template

When creating a PR, include:

1. **Clear title** describing the change
2. **Description** of what was changed and why
3. **Testing instructions** for reviewers
4. **Screenshots** for UI changes
5. **Breaking changes** if any

### Review Process

1. **Automated checks** must pass (lint, type-check, build)
2. **Code review** by maintainers
3. **Testing** of the changes
4. **Documentation review** if applicable
5. **Merge** after approval

## 🐛 Reporting Issues

### Bug Reports

Use the bug report template and include:

- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Environment details** (OS, browser, Node version)
- **Screenshots or recordings** if applicable

### Feature Requests

Use the feature request template and include:

- **Clear description** of the proposed feature
- **Use case** - why is this needed?
- **Proposed solution** if you have ideas
- **Alternatives considered**

## 📞 Getting Help

- **GitHub Discussions** - Ask questions or start conversations
- **Issues** - Report bugs or request features
- **Discord** - Join our community (link in README)
- **Email** - Reach out to maintainers for sensitive issues

## 🏆 Recognition

Contributors will be recognized in:

- **README contributors section**
- **Release notes** for significant contributions
- **Special badges** for consistent contributors
- **Contributor of the month** highlighting

## 📄 License

By contributing to CodeNotion, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Thank you for helping make CodeNotion better! 🎉