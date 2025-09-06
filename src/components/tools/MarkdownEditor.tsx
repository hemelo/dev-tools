import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Eye, Code, Download, Copy, Upload, Bold, Italic, Link, List, Quote, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const { toast } = useToast();

  const sampleMarkdown = `# Markdown Editor

This is a **live markdown editor** with real-time preview!

## Features

- ✨ **Real-time preview**
- 🎨 **Syntax highlighting**
- 📱 **Responsive design**
- 💾 **Export options**

### Code Examples

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
\`\`\`

### Lists

#### Unordered List
- Item 1
- Item 2
  - Nested item
  - Another nested item

#### Ordered List
1. First item
2. Second item
3. Third item

### Links and Images

[Visit GitHub](https://github.com)

![Alt text](https://via.placeholder.com/300x200?text=Sample+Image)

### Tables

| Feature | Status | Description |
|---------|--------|-------------|
| Preview | ✅ | Real-time rendering |
| Export | ✅ | PDF and HTML |
| Themes | ✅ | Light and dark |

### Blockquotes

> This is a blockquote. It can contain multiple lines and will be rendered with proper styling.

### Horizontal Rule

---

### Inline Code

Use \`console.log()\` to print to the console.

### Emphasis

*This text is italic*

**This text is bold**

***This text is both bold and italic***

### Task Lists

- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task

---

*Happy writing!* 🚀`;

  const insertMarkdown = (syntax: string, placeholder: string = "") => {
    const textarea = document.getElementById('markdown-input') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const textToInsert = syntax.replace('{text}', selectedText || placeholder);
    
    const newMarkdown = markdown.substring(0, start) + textToInsert + markdown.substring(end);
    setMarkdown(newMarkdown);
    
    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + syntax.indexOf('{text}'), start + syntax.indexOf('{text}') + (selectedText || placeholder).length);
    }, 0);
  };

  const renderMarkdown = (text: string) => {
    // Simple markdown renderer
    let html = text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      
      // Bold and italic
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-code-bg p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm">$1</code></pre>')
      
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-code-bg px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
      
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic text-gray-600 dark:text-gray-400">$1</blockquote>')
      
      // Horizontal rules
      .replace(/^---$/gim, '<hr class="my-6 border-gray-300 dark:border-gray-600" />')
      
      // Lists
      .replace(/^\- \[x\] (.*$)/gim, '<li class="flex items-center"><input type="checkbox" checked disabled class="mr-2" />$1</li>')
      .replace(/^\- \[ \] (.*$)/gim, '<li class="flex items-center"><input type="checkbox" disabled class="mr-2" />$1</li>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
      
      // Line breaks
      .replace(/\n/g, '<br />');

    // Wrap lists
    html = html.replace(/(<li.*<\/li>)/g, '<ul class="my-2 space-y-1">$1</ul>');
    
    return html;
  };

  const exportToHtml = () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Export</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; font-family: 'Monaco', 'Consolas', monospace; }
        pre { background: #f4f4f4; padding: 16px; border-radius: 8px; overflow-x: auto; }
        blockquote { border-left: 4px solid #ddd; padding-left: 16px; margin: 16px 0; color: #666; }
        table { border-collapse: collapse; width: 100%; margin: 16px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f4f4f4; }
    </style>
</head>
<body>
    ${renderMarkdown(markdown)}
</body>
</html>`;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markdown-export.html';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success!",
      description: "HTML file downloaded!",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    toast({
      title: "Copied!",
      description: "Markdown copied to clipboard!",
    });
  };

  const loadSample = () => {
    setMarkdown(sampleMarkdown);
  };

  const wordCount = useMemo(() => {
    const words = markdown.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
  }, [markdown]);

  const characterCount = markdown.length;
  const lineCount = markdown.split('\n').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Markdown Editor</h2>
        <p className="text-muted-foreground">
          Write and preview markdown with real-time rendering and export options
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-sm">Theme:</Label>
            <Select value={theme} onValueChange={(value: any) => setTheme(value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{wordCount} words</Badge>
          <Badge variant="secondary">{characterCount} chars</Badge>
          <Badge variant="secondary">{lineCount} lines</Badge>
        </div>
      </div>

      <Tabs defaultValue="editor" className="space-y-4">
        <TabsList>
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="split" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Split View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Markdown Editor
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => insertMarkdown('**{text}**', 'bold text')}>
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertMarkdown('*{text}*', 'italic text')}>
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertMarkdown('[{text}](url)', 'link text')}>
                    <Link className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertMarkdown('- {text}', 'list item')}>
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertMarkdown('> {text}', 'quote')}>
                    <Quote className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertMarkdown('## {text}', 'heading')}>
                    <Hash className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                id="markdown-input"
                placeholder="Start writing your markdown here..."
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="min-h-[500px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className={`min-h-[500px] p-4 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-white text-gray-900'
                }`}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="split" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Editor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Start writing your markdown here..."
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  className="min-h-[500px] font-mono text-sm"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className={`min-h-[500px] p-4 rounded-lg border overflow-y-auto ${
                    theme === 'dark' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-white text-gray-900'
                  }`}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button onClick={copyToClipboard} disabled={!markdown.trim()}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Markdown
          </Button>
          <Button onClick={exportToHtml} disabled={!markdown.trim()}>
            <Download className="h-4 w-4 mr-2" />
            Export HTML
          </Button>
        </div>
      </div>

      {/* Quick Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Examples</CardTitle>
          <CardDescription>Click on any example to load it</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Documentation</Label>
              <div className="space-y-1">
                {[
                  { 
                    name: "README Template", 
                    data: `# Project Name

A brief description of your project.

## Features

- ✨ **Real-time preview**
- 🎨 **Syntax highlighting**
- 📱 **Responsive design**
- 💾 **Export options**

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request` 
                  },
                  { 
                    name: "API Documentation", 
                    data: `# API Documentation

## Authentication

All API requests require authentication via API key.

\`\`\`http
GET /api/users
Authorization: Bearer YOUR_API_KEY
\`\`\`

## Endpoints

### Get Users

**GET** \`/api/users\`

Returns a list of all users.

**Response:**
\`\`\`json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
\`\`\`` 
                  }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setMarkdown(example.data)}
                    className="w-full justify-start text-xs"
                  >
                    {example.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Blog Posts</Label>
              <div className="space-y-1">
                {[
                  { 
                    name: "Tech Article", 
                    data: `# Getting Started with React

React is a powerful JavaScript library for building user interfaces.

## Why React?

- **Component-based architecture**
- **Virtual DOM for performance**
- **Rich ecosystem**
- **Strong community support**

## Your First Component

\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}
\`\`\`

> **Tip:** Start with simple components and gradually build complexity.

## Next Steps

1. Learn about **props** and **state**
2. Understand the **component lifecycle**
3. Explore **hooks** for functional components
4. Build your first **full application**` 
                  },
                  { 
                    name: "Tutorial", 
                    data: `# How to Build a Todo App

In this tutorial, we'll create a simple todo application using React.

## Prerequisites

- Basic knowledge of JavaScript
- Node.js installed
- A code editor

## Step 1: Setup

Create a new React project:

\`\`\`bash
npx create-react-app todo-app
cd todo-app
\`\`\`

## Step 2: Create Components

Create a \`TodoItem\` component:

\`\`\`jsx
const TodoItem = ({ todo, onToggle }) => (
  <div className={\`todo \${todo.completed ? 'completed' : ''}\`}>
    <input 
      type="checkbox" 
      checked={todo.completed}
      onChange={() => onToggle(todo.id)}
    />
    <span>{todo.text}</span>
  </div>
);
\`\`\`` 
                  }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setMarkdown(example.data)}
                    className="w-full justify-start text-xs"
                  >
                    {example.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Notes & Lists</Label>
              <div className="space-y-1">
                {[
                  { 
                    name: "Meeting Notes", 
                    data: `# Weekly Team Meeting

**Date:** December 25, 2023  
**Attendees:** Alice, Bob, Charlie

## Agenda

- [x] Review last week's progress
- [x] Discuss new features
- [ ] Plan next sprint
- [ ] Address blockers

## Action Items

1. **Alice** - Complete user authentication
2. **Bob** - Update API documentation  
3. **Charlie** - Fix mobile responsive issues

## Next Meeting

**When:** January 1, 2024  
**Focus:** Sprint planning and feature prioritization` 
                  },
                  { 
                    name: "Project Planning", 
                    data: `# Project Roadmap

## Q1 2024 Goals

### 🎯 High Priority
- [ ] User authentication system
- [ ] Dashboard redesign
- [ ] Mobile app development

### 📊 Medium Priority  
- [ ] Analytics integration
- [ ] Performance optimization
- [ ] API rate limiting

### 🔧 Low Priority
- [ ] Dark mode theme
- [ ] Advanced search
- [ ] Export functionality

## Timeline

| Feature | Start Date | End Date | Status |
|---------|------------|----------|--------|
| Auth System | Jan 1 | Jan 15 | 🟡 In Progress |
| Dashboard | Jan 16 | Jan 30 | ⚪ Planned |
| Mobile App | Feb 1 | Mar 15 | ⚪ Planned |` 
                  }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setMarkdown(example.data)}
                    className="w-full justify-start text-xs"
                  >
                    {example.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarkdownEditor;
