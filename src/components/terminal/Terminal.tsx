'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Terminal as TerminalIcon, X, Minimize2, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

interface TerminalProps {
  isOpen: boolean
  onClose: () => void
}

export default function Terminal({ isOpen, onClose }: TerminalProps) {
  const [history, setHistory] = useState<Array<{type: 'input' | 'output' | 'error', content: string}>>([
    { type: 'output', content: '🚀 CodeNotion Terminal v1.0.0' },
    { type: 'output', content: 'Welcome to the integrated terminal! Ready for commands.' },
    { type: 'output', content: 'Type "help" to see available commands or "exit" to close.' },
  ])
  const [currentInput, setCurrentInput] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current && !isMinimized) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [history])

  const executeCommand = (command: string) => {
    const trimmedCommand = command.trim()
    
    // Add input to history
    setHistory(prev => [...prev, { type: 'input', content: `$ ${trimmedCommand}` }])

    if (!trimmedCommand) return

    const parts = trimmedCommand.split(' ')
    const cmd = parts[0].toLowerCase()
    const args = parts.slice(1)

    let output = ''
    let type: 'output' | 'error' = 'output'

    switch (cmd) {
      case 'help':
        output = `📋 Available Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  help     │ Show this help message
  clear    │ Clear the terminal history
  echo     │ Echo text back to output
  pwd      │ Print current working directory
  ls       │ List directory contents (simulated)
  node     │ Run Node.js interpreter (simulated)
  npm      │ Execute NPM commands (simulated)
  exit     │ Close the terminal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Tip: This is a simulated terminal for demonstration purposes.`
        break
      
      case 'clear':
        setHistory([])
        return
      
      case 'echo':
        output = args.join(' ')
        break
      
      case 'pwd':
        output = '/workspace/codenotion'
        break
      
      case 'ls':
        output = `📁 Directory Contents:
┌─────────────┬──────┬────────────────────────┐
│ Name        │ Type │ Description            │
├─────────────┼──────┼────────────────────────┤
│ index.html  │ file │ Main HTML document     │
│ style.css   │ file │ Stylesheet             │
│ script.js   │ file │ JavaScript source      │
│ Welcome.md  │ file │ Welcome documentation  │
│ package.json│ file │ NPM package manifest   │
│ README.md   │ file │ Project documentation  │
│ .gitignore  │ file │ Git ignore rules       │
│ node_modules│ dir  │ NPM dependencies       │
└─────────────┴──────┴────────────────────────┘`
        break
      
      case 'node':
        if (args.length === 0) {
          output = `Node.js v18.17.0
Welcome to Node.js REPL
> (simulated - this would start Node.js interactive mode)`
        } else {
          output = `Executing: node ${args.join(' ')}
(simulated - this would run your Node.js file)`
        }
        break
      
      case 'npm':
        if (args[0] === 'install' || args[0] === 'i') {
          output = `npm install ${args.slice(1).join(' ')}
(simulated - this would install packages)`
        } else if (args[0] === 'run') {
          output = `npm run ${args[1]}
(simulated - this would run the script)`
        } else {
          output = `npm ${args.join(' ')}
(simulated - this would execute npm command)`
        }
        break
      
      case 'exit':
        onClose()
        return
      
      default:
        output = `Command not found: ${cmd}
Type 'help' to see available commands.`
        type = 'error'
    }

    setHistory(prev => [...prev, { type, content: output }])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput)
      setCurrentInput('')
    }
  }

  if (!isOpen) return null

  return (
    <Card className={`fixed bottom-0 left-0 right-0 font-mono text-sm transition-all duration-300 ${
      isMinimized ? 'h-12' : 'h-80'
    } z-40 rounded-none border-t border-l-0 border-r-0 border-b-0 shadow-2xl`}>
      {/* Terminal Header */}
      <CardHeader className="flex flex-row items-center justify-between p-3 pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-primary/10 rounded-md">
              <TerminalIcon size={14} className="text-primary" />
            </div>
            <span className="font-semibold text-sm text-foreground">Terminal</span>
          </div>
          <Badge variant="secondary" className="h-5 text-xs px-2">
            {history.filter(h => h.type === 'input').length} commands
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-7 w-7"
            title={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
            title="Close terminal"
          >
            <X size={12} />
          </Button>
        </div>
      </CardHeader>

      {/* Terminal Content */}
      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-full">
          {/* Output Area */}
          <div 
            ref={outputRef}
            className="flex-1 p-4 overflow-y-auto bg-muted/30 min-h-0"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'hsl(var(--muted-foreground)) hsl(var(--muted))'
            }}
          >
            <div className="space-y-1">
              {history.map((entry, index) => (
                <div 
                  key={index} 
                  className={`whitespace-pre-wrap text-sm leading-relaxed ${
                    entry.type === 'input' 
                      ? 'text-primary font-medium' 
                      : entry.type === 'error' 
                      ? 'text-destructive' 
                      : 'text-foreground/80'
                  }`}
                >
                  {entry.content}
                </div>
              ))}
            </div>
          </div>

          <Separator />
          
          {/* Input Area */}
          <div className="flex items-center gap-2 p-3 bg-card">
            <Badge variant="outline" className="h-6 px-2 text-xs font-mono">
              $
            </Badge>
            <Input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 font-mono text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              placeholder="Type a command and press Enter..."
              autoComplete="off"
            />
          </div>
        </CardContent>
      )}
    </Card>
  )
}