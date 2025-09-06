import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Terminal, 
  Copy, 
  Download, 
  Send, 
  Globe, 
  Shield, 
  Key, 
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CurlConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  url: string;
  headers: Record<string, string>;
  body: string;
  auth: {
    type: 'none' | 'basic' | 'bearer' | 'apikey';
    username: string;
    password: string;
    token: string;
    apiKey: string;
    apiKeyHeader: string;
  };
  options: {
    followRedirects: boolean;
    includeHeaders: boolean;
    silent: boolean;
    verbose: boolean;
    insecure: boolean;
    timeout: number;
  };
}

const CurlGenerator = () => {
  const [config, setConfig] = useState<CurlConfig>({
    method: 'GET',
    url: '',
    headers: {
      'Content-Type': 'application/json'
    },
    body: '',
    auth: {
      type: 'none',
      username: '',
      password: '',
      token: '',
      apiKey: '',
      apiKeyHeader: 'X-API-Key'
    },
    options: {
      followRedirects: true,
      includeHeaders: true,
      silent: false,
      verbose: false,
      insecure: false,
      timeout: 30
    }
  });

  const [newHeaderKey, setNewHeaderKey] = useState('');
  const [newHeaderValue, setNewHeaderValue] = useState('');
  const [generatedCommand, setGeneratedCommand] = useState('');
  const { toast } = useToast();

  const sampleRequests = {
    jsonplaceholder: {
      method: 'GET' as const,
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      headers: { 'Accept': 'application/json' },
      body: ''
    },
    postExample: {
      method: 'POST' as const,
      url: 'https://jsonplaceholder.typicode.com/posts',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'foo',
        body: 'bar',
        userId: 1
      }, null, 2)
    },
    github: {
      method: 'GET' as const,
      url: 'https://api.github.com/user',
      headers: { 
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': 'Bearer YOUR_TOKEN'
      },
      body: ''
    }
  };

  const addHeader = () => {
    if (!newHeaderKey.trim() || !newHeaderValue.trim()) return;
    
    setConfig(prev => ({
      ...prev,
      headers: {
        ...prev.headers,
        [newHeaderKey]: newHeaderValue
      }
    }));
    
    setNewHeaderKey('');
    setNewHeaderValue('');
  };

  const removeHeader = (key: string) => {
    setConfig(prev => {
      const newHeaders = { ...prev.headers };
      delete newHeaders[key];
      return { ...prev, headers: newHeaders };
    });
  };

  const loadSample = (sample: keyof typeof sampleRequests) => {
    const sampleData = sampleRequests[sample];
    setConfig(prev => ({
      ...prev,
      method: sampleData.method,
      url: sampleData.url,
      headers: sampleData.headers,
      body: sampleData.body
    }));
  };

  const generateCurlCommand = () => {
    if (!config.url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      });
      return;
    }

    let command = 'curl';

    // Add options
    if (config.options.followRedirects) {
      command += ' -L';
    }
    if (config.options.includeHeaders) {
      command += ' -i';
    }
    if (config.options.silent) {
      command += ' -s';
    }
    if (config.options.verbose) {
      command += ' -v';
    }
    if (config.options.insecure) {
      command += ' -k';
    }
    if (config.options.timeout > 0) {
      command += ` --max-time ${config.options.timeout}`;
    }

    // Add method
    if (config.method !== 'GET') {
      command += ` -X ${config.method}`;
    }

    // Add authentication
    if (config.auth.type === 'basic' && config.auth.username && config.auth.password) {
      command += ` -u "${config.auth.username}:${config.auth.password}"`;
    } else if (config.auth.type === 'bearer' && config.auth.token) {
      command += ` -H "Authorization: Bearer ${config.auth.token}"`;
    } else if (config.auth.type === 'apikey' && config.auth.apiKey) {
      command += ` -H "${config.auth.apiKeyHeader}: ${config.auth.apiKey}"`;
    }

    // Add headers
    Object.entries(config.headers).forEach(([key, value]) => {
      command += ` -H "${key}: ${value}"`;
    });

    // Add body for POST, PUT, PATCH
    if (['POST', 'PUT', 'PATCH'].includes(config.method) && config.body) {
      command += ` -d '${config.body}'`;
    }

    // Add URL
    command += ` "${config.url}"`;

    setGeneratedCommand(command);
  };

  const copyCommand = () => {
    navigator.clipboard.writeText(generatedCommand);
    toast({
      title: "Copied!",
      description: "cURL command copied to clipboard!",
    });
  };

  const downloadCommand = () => {
    const blob = new Blob([generatedCommand], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `curl-command-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success!",
      description: "cURL command downloaded!",
    });
  };

  const testCommand = async () => {
    if (!config.url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL to test",
        variant: "destructive",
      });
      return;
    }

    try {
      const requestOptions: RequestInit = {
        method: config.method,
        headers: config.headers
      };

      if (['POST', 'PUT', 'PATCH'].includes(config.method) && config.body) {
        requestOptions.body = config.body;
      }

      const response = await fetch(config.url, requestOptions);
      const data = await response.text();
      
      toast({
        title: "Success!",
        description: `Request completed with status ${response.status}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to test the request",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">cURL Command Generator</h2>
        <p className="text-muted-foreground">
          Generate cURL commands for API testing and debugging with authentication and custom options
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Request Configuration
            </CardTitle>
            <CardDescription>
              Configure your HTTP request parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Select 
                value={config.method} 
                onValueChange={(value: any) => setConfig(prev => ({ ...prev, method: value }))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="HEAD">HEAD</SelectItem>
                  <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                placeholder="https://api.example.com/endpoint"
                value={config.url}
                onChange={(e) => setConfig(prev => ({ ...prev, url: e.target.value }))}
                className="flex-1"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadSample('jsonplaceholder')}
              >
                JSONPlaceholder
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadSample('postExample')}
              >
                POST Example
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadSample('github')}
              >
                GitHub API
              </Button>
            </div>

            <Tabs defaultValue="headers" className="space-y-4">
              <TabsList>
                <TabsTrigger value="headers">Headers</TabsTrigger>
                <TabsTrigger value="auth">Authentication</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
              </TabsList>
              
              <TabsContent value="headers" className="space-y-4">
                <div className="space-y-2">
                  {Object.entries(config.headers).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Input
                        value={key}
                        readOnly
                        className="flex-1 font-mono text-sm"
                      />
                      <Input
                        value={value}
                        readOnly
                        className="flex-1 font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeHeader(key)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Header name"
                      value={newHeaderKey}
                      onChange={(e) => setNewHeaderKey(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Header value"
                      value={newHeaderValue}
                      onChange={(e) => setNewHeaderValue(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addHeader}
                      disabled={!newHeaderKey.trim() || !newHeaderValue.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="auth" className="space-y-4">
                <div>
                  <Label>Authentication Type</Label>
                  <Select 
                    value={config.auth.type} 
                    onValueChange={(value: any) => setConfig(prev => ({ 
                      ...prev, 
                      auth: { ...prev.auth, type: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="basic">Basic Auth</SelectItem>
                      <SelectItem value="bearer">Bearer Token</SelectItem>
                      <SelectItem value="apikey">API Key</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.auth.type === 'basic' && (
                  <div className="space-y-2">
                    <Input
                      placeholder="Username"
                      value={config.auth.username}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        auth: { ...prev.auth, username: e.target.value }
                      }))}
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={config.auth.password}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        auth: { ...prev.auth, password: e.target.value }
                      }))}
                    />
                  </div>
                )}

                {config.auth.type === 'bearer' && (
                  <Input
                    placeholder="Bearer token"
                    value={config.auth.token}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      auth: { ...prev.auth, token: e.target.value }
                    }))}
                  />
                )}

                {config.auth.type === 'apikey' && (
                  <div className="space-y-2">
                    <Input
                      placeholder="API Key"
                      value={config.auth.apiKey}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        auth: { ...prev.auth, apiKey: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="Header name (e.g., X-API-Key)"
                      value={config.auth.apiKeyHeader}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        auth: { ...prev.auth, apiKeyHeader: e.target.value }
                      }))}
                    />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="options" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Follow Redirects</Label>
                    <Switch
                      checked={config.options.followRedirects}
                      onCheckedChange={(checked) => setConfig(prev => ({ 
                        ...prev, 
                        options: { ...prev.options, followRedirects: checked }
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Include Headers in Output</Label>
                    <Switch
                      checked={config.options.includeHeaders}
                      onCheckedChange={(checked) => setConfig(prev => ({ 
                        ...prev, 
                        options: { ...prev.options, includeHeaders: checked }
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Silent Mode</Label>
                    <Switch
                      checked={config.options.silent}
                      onCheckedChange={(checked) => setConfig(prev => ({ 
                        ...prev, 
                        options: { ...prev.options, silent: checked }
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Verbose Mode</Label>
                    <Switch
                      checked={config.options.verbose}
                      onCheckedChange={(checked) => setConfig(prev => ({ 
                        ...prev, 
                        options: { ...prev.options, verbose: checked }
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Allow Insecure SSL</Label>
                    <Switch
                      checked={config.options.insecure}
                      onCheckedChange={(checked) => setConfig(prev => ({ 
                        ...prev, 
                        options: { ...prev.options, insecure: checked }
                      }))}
                    />
                  </div>
                  
                  <div>
                    <Label>Timeout (seconds)</Label>
                    <Input
                      type="number"
                      value={config.options.timeout}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        options: { ...prev.options, timeout: parseInt(e.target.value) || 30 }
                      }))}
                      className="w-32"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {['POST', 'PUT', 'PATCH'].includes(config.method) && (
              <div>
                <Label htmlFor="request-body">Request Body</Label>
                <Textarea
                  id="request-body"
                  placeholder="Enter request body (JSON, XML, etc.)"
                  value={config.body}
                  onChange={(e) => setConfig(prev => ({ ...prev, body: e.target.value }))}
                  className="min-h-[100px] font-mono text-sm"
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={generateCurlCommand}
                disabled={!config.url.trim()}
                className="flex-1"
              >
                <Terminal className="h-4 w-4 mr-2" />
                Generate cURL
              </Button>
              <Button
                variant="outline"
                onClick={testCommand}
                disabled={!config.url.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                Test
              </Button>
            </div>
          </CardContent>
        </Card>

        {generatedCommand && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generated cURL Command
              </CardTitle>
              <CardDescription>
                Copy and use this command in your terminal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyCommand}>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadCommand}>
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
              
              <div className="p-4 bg-code-bg rounded-lg max-h-96 overflow-y-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap break-all">
                  {generatedCommand}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <p>• Never share cURL commands containing sensitive credentials</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <p>• Use environment variables for API keys and tokens in production</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p>• Always use HTTPS URLs for secure communication</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p>• Test commands in a safe environment before using in production</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurlGenerator;
