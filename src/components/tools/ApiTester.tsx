import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Clock, CheckCircle, XCircle, Copy, Download, Globe, Shield, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers: Record<string, string>;
  body: string;
  timeout: number;
}

interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  time: number;
  size: number;
}

const ApiTester = () => {
  const [requestConfig, setRequestConfig] = useState<RequestConfig>({
    method: 'GET',
    url: '',
    headers: {
      'Content-Type': 'application/json'
    },
    body: '',
    timeout: 30000
  });

  const [response, setResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newHeaderKey, setNewHeaderKey] = useState('');
  const [newHeaderValue, setNewHeaderValue] = useState('');
  const { toast } = useToast();

  const sampleRequests = {
    jsonplaceholder: {
      method: 'GET' as const,
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      headers: { 'Content-Type': 'application/json' },
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
      url: 'https://api.github.com/users/octocat',
      headers: { 'Accept': 'application/vnd.github.v3+json' },
      body: ''
    }
  };

  const addHeader = () => {
    if (!newHeaderKey.trim() || !newHeaderValue.trim()) return;
    
    setRequestConfig(prev => ({
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
    setRequestConfig(prev => {
      const newHeaders = { ...prev.headers };
      delete newHeaders[key];
      return { ...prev, headers: newHeaders };
    });
  };

  const loadSample = (sample: keyof typeof sampleRequests) => {
    const sampleData = sampleRequests[sample];
    setRequestConfig(prev => ({
      ...prev,
      method: sampleData.method,
      url: sampleData.url,
      headers: sampleData.headers,
      body: sampleData.body
    }));
  };

  const sendRequest = async () => {
    if (!requestConfig.url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    setResponse(null);

    const startTime = Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), requestConfig.timeout);

      const requestOptions: RequestInit = {
        method: requestConfig.method,
        headers: requestConfig.headers,
        signal: controller.signal
      };

      if (['POST', 'PUT', 'PATCH'].includes(requestConfig.method) && requestConfig.body) {
        requestOptions.body = requestConfig.body;
      }

      const fetchResponse = await fetch(requestConfig.url, requestOptions);
      clearTimeout(timeoutId);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Get response headers
      const responseHeaders: Record<string, string> = {};
      fetchResponse.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // Get response data
      let responseData;
      const contentType = fetchResponse.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        responseData = await fetchResponse.json();
      } else if (contentType?.includes('text/')) {
        responseData = await fetchResponse.text();
      } else {
        responseData = await fetchResponse.blob();
      }

      // Calculate response size
      const responseSize = new Blob([JSON.stringify(responseData)]).size;

      setResponse({
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        headers: responseHeaders,
        data: responseData,
        time: responseTime,
        size: responseSize
      });

    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Request timeout');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = () => {
    if (!response) return;
    navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
    toast({
      title: "Copied!",
      description: "Response copied to clipboard!",
    });
  };

  const downloadResponse = () => {
    if (!response) return;
    
    const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-response-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success!",
      description: "Response downloaded!",
    });
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600 dark:text-green-400';
    if (status >= 300 && status < 400) return 'text-blue-600 dark:text-blue-400';
    if (status >= 400 && status < 500) return 'text-yellow-600 dark:text-yellow-400';
    if (status >= 500) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">API Tester</h2>
        <p className="text-muted-foreground">
          Test REST APIs with custom requests and detailed response analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Request Configuration
            </CardTitle>
            <CardDescription>
              Configure your API request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Select 
                value={requestConfig.method} 
                onValueChange={(value: any) => setRequestConfig(prev => ({ ...prev, method: value }))}
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
                </SelectContent>
              </Select>
              
              <Input
                placeholder="https://api.example.com/endpoint"
                value={requestConfig.url}
                onChange={(e) => setRequestConfig(prev => ({ ...prev, url: e.target.value }))}
                className="flex-1"
              />
            </div>

            <div className="flex gap-2">
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

            <div>
              <Label>Headers</Label>
              <div className="space-y-2 mt-2">
                {Object.entries(requestConfig.headers).map(([key, value]) => (
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
            </div>

            {['POST', 'PUT', 'PATCH'].includes(requestConfig.method) && (
              <div>
                <Label htmlFor="request-body">Request Body</Label>
                <Textarea
                  id="request-body"
                  placeholder="Enter request body (JSON, XML, etc.)"
                  value={requestConfig.body}
                  onChange={(e) => setRequestConfig(prev => ({ ...prev, body: e.target.value }))}
                  className="min-h-[150px] font-mono text-sm"
                />
              </div>
            )}

            <div>
              <Label>Timeout (ms)</Label>
              <Input
                type="number"
                value={requestConfig.timeout}
                onChange={(e) => setRequestConfig(prev => ({ ...prev, timeout: parseInt(e.target.value) || 30000 }))}
                className="w-32"
              />
            </div>

            <Button
              onClick={sendRequest}
              disabled={loading || !requestConfig.url.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {response && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Response
              </CardTitle>
              <CardDescription>
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(response.status)}>
                    {response.status} {response.statusText}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {response.time}ms
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatBytes(response.size)}
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="body" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="body">Body</TabsTrigger>
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                </TabsList>
                
                <TabsContent value="body" className="space-y-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyResponse}>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadResponse}>
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-code-bg rounded-lg max-h-96 overflow-y-auto">
                    <pre className="text-sm font-mono whitespace-pre-wrap">
                      {typeof response.data === 'object' 
                        ? JSON.stringify(response.data, null, 2)
                        : response.data
                      }
                    </pre>
                  </div>
                </TabsContent>
                
                <TabsContent value="headers" className="space-y-4">
                  <div className="space-y-2">
                    {Object.entries(response.headers).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <span className="font-mono text-sm font-medium w-32">{key}:</span>
                        <span className="font-mono text-sm flex-1">{value}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
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
              <p>• Never test with production APIs that contain sensitive data</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <p>• Be cautious with CORS policies - some APIs may not allow browser requests</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <p>• Use HTTPS URLs for secure communication</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <p>• Consider rate limiting when testing APIs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiTester;
