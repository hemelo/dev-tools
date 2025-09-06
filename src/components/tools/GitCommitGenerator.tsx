import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitCommit, Copy, Shuffle, FileText, Code, Bug, Plus, Minus, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CommitConfig {
  type: string;
  scope?: string;
  description: string;
  body?: string;
  footer?: string;
  breakingChange: boolean;
  issueNumber?: string;
}

interface CommitType {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  emoji: string;
}

const GitCommitGenerator = () => {
  const [config, setConfig] = useState<CommitConfig>({
    type: 'feat',
    scope: '',
    description: '',
    body: '',
    footer: '',
    breakingChange: false,
    issueNumber: ''
  });

  const [generatedCommit, setGeneratedCommit] = useState('');
  const [commitHistory, setCommitHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const commitTypes: CommitType[] = [
    {
      value: 'feat',
      label: 'Feature',
      description: 'A new feature for the user',
      icon: <Plus className="h-4 w-4" />,
      emoji: '✨'
    },
    {
      value: 'fix',
      label: 'Bug Fix',
      description: 'A bug fix',
      icon: <Bug className="h-4 w-4" />,
      emoji: '🐛'
    },
    {
      value: 'docs',
      label: 'Documentation',
      description: 'Documentation only changes',
      icon: <FileText className="h-4 w-4" />,
      emoji: '📚'
    },
    {
      value: 'style',
      label: 'Style',
      description: 'Changes that do not affect the meaning of the code',
      icon: <Code className="h-4 w-4" />,
      emoji: '💄'
    },
    {
      value: 'refactor',
      label: 'Refactor',
      description: 'A code change that neither fixes a bug nor adds a feature',
      icon: <RotateCcw className="h-4 w-4" />,
      emoji: '♻️'
    },
    {
      value: 'perf',
      label: 'Performance',
      description: 'A code change that improves performance',
      icon: <Plus className="h-4 w-4" />,
      emoji: '⚡'
    },
    {
      value: 'test',
      label: 'Test',
      description: 'Adding missing tests or correcting existing tests',
      icon: <FileText className="h-4 w-4" />,
      emoji: '🧪'
    },
    {
      value: 'build',
      label: 'Build',
      description: 'Changes that affect the build system or external dependencies',
      icon: <Code className="h-4 w-4" />,
      emoji: '🔨'
    },
    {
      value: 'ci',
      label: 'CI',
      description: 'Changes to our CI configuration files and scripts',
      icon: <Code className="h-4 w-4" />,
      emoji: '👷'
    },
    {
      value: 'chore',
      label: 'Chore',
      description: 'Other changes that don\'t modify src or test files',
      icon: <Minus className="h-4 w-4" />,
      emoji: '🔧'
    },
    {
      value: 'revert',
      label: 'Revert',
      description: 'Reverts a previous commit',
      icon: <RotateCcw className="h-4 w-4" />,
      emoji: '⏪'
    }
  ];

  const sampleDescriptions = {
    feat: [
      'add user authentication system',
      'implement dark mode toggle',
      'create responsive navigation menu',
      'add real-time notifications',
      'implement file upload functionality'
    ],
    fix: [
      'resolve memory leak in data processing',
      'fix navigation menu overflow issue',
      'correct API endpoint validation',
      'resolve race condition in async operations',
      'fix responsive layout on mobile devices'
    ],
    docs: [
      'update API documentation',
      'add installation guide',
      'document new configuration options',
      'update README with examples',
      'add troubleshooting section'
    ],
    style: [
      'format code according to style guide',
      'update component styling',
      'improve code readability',
      'standardize naming conventions',
      'update color scheme'
    ],
    refactor: [
      'extract common utility functions',
      'simplify component structure',
      'optimize database queries',
      'restructure project architecture',
      'improve error handling'
    ],
    perf: [
      'optimize image loading performance',
      'reduce bundle size',
      'improve database query speed',
      'optimize rendering performance',
      'implement lazy loading'
    ],
    test: [
      'add unit tests for user service',
      'implement integration tests',
      'add test coverage for edge cases',
      'update existing test cases',
      'add end-to-end tests'
    ],
    build: [
      'update webpack configuration',
      'upgrade dependencies',
      'configure build optimization',
      'update Docker configuration',
      'setup automated deployment'
    ],
    ci: [
      'configure GitHub Actions workflow',
      'setup automated testing pipeline',
      'configure code quality checks',
      'setup deployment automation',
      'update CI/CD configuration'
    ],
    chore: [
      'update package dependencies',
      'clean up unused files',
      'update project configuration',
      'organize project structure',
      'update development tools'
    ],
    revert: [
      'revert previous feature implementation',
      'rollback breaking changes',
      'undo problematic commit',
      'restore previous version',
      'revert experimental changes'
    ]
  };

  const generateCommit = () => {
    if (!config.description.trim()) {
      toast({
        title: "Error",
        description: "Please enter a commit description",
        variant: "destructive",
      });
      return;
    }

    const selectedType = commitTypes.find(t => t.value === config.type);
    const emoji = selectedType?.emoji || '📝';
    
    let commitMessage = `${config.type}`;
    
    if (config.scope) {
      commitMessage += `(${config.scope})`;
    }
    
    if (config.breakingChange) {
      commitMessage += '!';
    }
    
    commitMessage += `: ${config.description}`;
    
    if (config.body) {
      commitMessage += `\n\n${config.body}`;
    }
    
    if (config.footer) {
      commitMessage += `\n\n${config.footer}`;
    }
    
    if (config.issueNumber) {
      commitMessage += `\n\nCloses #${config.issueNumber}`;
    }

    const commitWithEmoji = `${emoji} ${commitMessage}`;
    setGeneratedCommit(commitWithEmoji);
    setCommitHistory(prev => [commitWithEmoji, ...prev.slice(0, 9)]);
  };

  const generateRandomCommit = () => {
    const randomType = commitTypes[Math.floor(Math.random() * commitTypes.length)];
    const randomDescription = sampleDescriptions[randomType.value as keyof typeof sampleDescriptions][
      Math.floor(Math.random() * sampleDescriptions[randomType.value as keyof typeof sampleDescriptions].length)
    ];
    
    setConfig(prev => ({
      ...prev,
      type: randomType.value,
      description: randomDescription,
      scope: Math.random() > 0.7 ? ['auth', 'ui', 'api', 'db', 'config'][Math.floor(Math.random() * 5)] : '',
      breakingChange: Math.random() > 0.9,
      issueNumber: Math.random() > 0.8 ? Math.floor(Math.random() * 1000).toString() : ''
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Commit message copied to clipboard!",
    });
  };

  const clearHistory = () => {
    setCommitHistory([]);
  };

  const loadSampleCommit = (type: string) => {
    const sampleType = commitTypes.find(t => t.value === type);
    if (sampleType) {
      const sampleDescription = sampleDescriptions[type as keyof typeof sampleDescriptions][0];
      setConfig(prev => ({
        ...prev,
        type: type,
        description: sampleDescription,
        scope: type === 'feat' ? 'auth' : type === 'fix' ? 'ui' : '',
        body: type === 'feat' ? 'This commit adds a new authentication system with JWT tokens and user management.' : '',
        footer: type === 'feat' ? 'BREAKING CHANGE: Authentication API has been updated.' : ''
      }));
    }
  };

  const getCommitTypeInfo = (type: string) => {
    return commitTypes.find(t => t.value === type);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Git Commit Message Generator</h2>
        <p className="text-muted-foreground">
          Generate conventional commit messages following best practices
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCommit className="h-5 w-5" />
              Commit Configuration
            </CardTitle>
            <CardDescription>
              Configure your commit message details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="commit-type">Commit Type</Label>
              <Select 
                value={config.type} 
                onValueChange={(value) => setConfig(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {commitTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        {type.icon}
                        <span>{type.label}</span>
                        <span className="text-gray-500">({type.value})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getCommitTypeInfo(config.type) && (
                <p className="text-sm text-muted-foreground mt-1">
                  {getCommitTypeInfo(config.type)?.description}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="scope">Scope (Optional)</Label>
              <Input
                id="scope"
                placeholder="auth, ui, api, db, config"
                value={config.scope}
                onChange={(e) => setConfig(prev => ({ ...prev, scope: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                placeholder="brief description of the change"
                value={config.description}
                onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="body">Body (Optional)</Label>
              <Textarea
                id="body"
                placeholder="More detailed explanation of the change..."
                value={config.body}
                onChange={(e) => setConfig(prev => ({ ...prev, body: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="footer">Footer (Optional)</Label>
              <Textarea
                id="footer"
                placeholder="Additional notes, breaking changes, or issue references..."
                value={config.footer}
                onChange={(e) => setConfig(prev => ({ ...prev, footer: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="issue-number">Issue Number (Optional)</Label>
                <Input
                  id="issue-number"
                  placeholder="123"
                  value={config.issueNumber}
                  onChange={(e) => setConfig(prev => ({ ...prev, issueNumber: e.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="breaking-change"
                  checked={config.breakingChange}
                  onChange={(e) => setConfig(prev => ({ ...prev, breakingChange: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="breaking-change" className="text-sm">
                  Breaking Change
                </Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={generateCommit} className="flex-1">
                <GitCommit className="h-4 w-4 mr-2" />
                Generate Commit
              </Button>
              <Button variant="outline" onClick={generateRandomCommit}>
                <Shuffle className="h-4 w-4" />
              </Button>
            </div>

          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generated Commit Message
            </CardTitle>
            <CardDescription>
              Your conventional commit message
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedCommit ? (
              <>
                <div className="p-4 bg-code-bg rounded-lg">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {generatedCommit}
                  </pre>
                </div>
                
                <Button
                  onClick={() => copyToClipboard(generatedCommit)}
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Commit Message
                </Button>
              </>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <div className="text-center">
                  <GitCommit className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Generated commit message will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {commitHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Commits
              </span>
              <Button variant="outline" size="sm" onClick={clearHistory}>
                Clear History
              </Button>
            </CardTitle>
            <CardDescription>
              Your recent commit message history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {commitHistory.map((commit, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <Badge variant="secondary">#{index + 1}</Badge>
                  <pre className="flex-1 text-sm font-mono whitespace-pre-wrap">
                    {commit}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(commit)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Conventional Commits Guide</CardTitle>
          <CardDescription>
            Understanding the conventional commit format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Format</h4>
              <div className="p-3 bg-code-bg rounded-lg font-mono text-sm">
                &lt;type&gt;[optional scope]: &lt;description&gt;<br/>
                [optional body]<br/>
                [optional footer(s)]
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Examples</h4>
              <div className="space-y-2">
                <div className="p-3 bg-code-bg rounded-lg">
                  <code className="text-sm">feat(auth): add JWT token validation</code>
                </div>
                <div className="p-3 bg-code-bg rounded-lg">
                  <code className="text-sm">fix(ui): resolve navigation menu overflow</code>
                </div>
                <div className="p-3 bg-code-bg rounded-lg">
                  <code className="text-sm">docs: update API documentation</code>
                </div>
                <div className="p-3 bg-code-bg rounded-lg">
                  <code className="text-sm">feat!: redesign user authentication system</code>
                  <p className="text-xs text-muted-foreground mt-1">
                    The ! indicates a breaking change
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Benefits</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Automated changelog generation</li>
                <li>• Semantic versioning support</li>
                <li>• Better code review process</li>
                <li>• Clear communication of changes</li>
                <li>• Automated release management</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Examples</CardTitle>
          <CardDescription>Click on any example to load it</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Feature Commits</Label>
              <div className="space-y-1">
                {[
                  { 
                    name: "New Feature", 
                    type: 'feat',
                    description: 'add user authentication system',
                    scope: 'auth'
                  },
                  { 
                    name: "UI Enhancement", 
                    type: 'feat',
                    description: 'implement dark mode toggle',
                    scope: 'ui'
                  }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadSampleCommit(example.type)}
                    className="w-full justify-start text-xs"
                  >
                    {example.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Bug Fixes</Label>
              <div className="space-y-1">
                {[
                  { 
                    name: "UI Fix", 
                    type: 'fix',
                    description: 'resolve navigation menu overflow',
                    scope: 'ui'
                  },
                  { 
                    name: "API Fix", 
                    type: 'fix',
                    description: 'correct API endpoint validation',
                    scope: 'api'
                  }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadSampleCommit(example.type)}
                    className="w-full justify-start text-xs"
                  >
                    {example.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Documentation</Label>
              <div className="space-y-1">
                {[
                  { 
                    name: "API Docs", 
                    type: 'docs',
                    description: 'update API documentation',
                    scope: ''
                  },
                  { 
                    name: "Installation Guide", 
                    type: 'docs',
                    description: 'add installation guide',
                    scope: ''
                  }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadSampleCommit(example.type)}
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

export default GitCommitGenerator;
