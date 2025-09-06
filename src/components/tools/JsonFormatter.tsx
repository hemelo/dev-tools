import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Check, AlertCircle, CheckCircle, RotateCcw, FileText, Download, Upload, Info, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JsonStats {
  size: number;
  lines: number;
  keys: number;
  depth: number;
  types: Record<string, number>;
}

export const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [stats, setStats] = useState<JsonStats | null>(null);
  const { toast } = useToast();

  const calculateStats = (obj: any, depth = 0): JsonStats => {
    const types: Record<string, number> = {};
    let keys = 0;
    let maxDepth = depth;

    const analyze = (value: any, currentDepth: number) => {
      const type = Array.isArray(value) ? 'array' : typeof value;
      types[type] = (types[type] || 0) + 1;
      
      if (type === 'object' && value !== null) {
        keys += Object.keys(value).length;
        maxDepth = Math.max(maxDepth, currentDepth + 1);
        Object.values(value).forEach(v => analyze(v, currentDepth + 1));
      } else if (type === 'array') {
        keys += value.length;
        maxDepth = Math.max(maxDepth, currentDepth + 1);
        value.forEach((v: any) => analyze(v, currentDepth + 1));
      }
    };

    analyze(obj, depth);

    return {
      size: JSON.stringify(obj).length,
      lines: JSON.stringify(obj, null, indentSize).split('\n').length,
      keys,
      depth: maxDepth,
      types
    };
  };

  const formatJson = () => {
    try {
      if (!input.trim()) {
        setError("Please enter JSON data");
        setIsValid(false);
        return;
      }

      const parsed = JSON.parse(input);
      const replacer = sortKeys ? Object.keys(parsed).sort() : undefined;
      const formatted = JSON.stringify(parsed, replacer, indentSize);
      setOutput(formatted);
      setIsValid(true);
      setError("");
      setStats(calculateStats(parsed));
    } catch (err) {
      setError((err as Error).message);
      setIsValid(false);
      setOutput("");
      setStats(null);
    }
  };

  const minifyJson = () => {
    try {
      if (!input.trim()) {
        setError("Please enter JSON data");
        setIsValid(false);
        return;
      }

      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setIsValid(true);
      setError("");
      setStats(calculateStats(parsed));
    } catch (err) {
      setError((err as Error).message);
      setIsValid(false);
      setOutput("");
      setStats(null);
    }
  };

  const validateJson = () => {
    try {
      if (!input.trim()) {
        setError("Please enter JSON data");
        setIsValid(false);
        setStats(null);
        return;
      }

      const parsed = JSON.parse(input);
      setIsValid(true);
      setError("");
      setStats(calculateStats(parsed));
      toast({
        title: "Valid JSON",
        description: "JSON is properly formatted and valid",
      });
    } catch (err) {
      setError((err as Error).message);
      setIsValid(false);
      setStats(null);
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON syntax",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "JSON copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadJson = () => {
    if (!output) return;
    
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted-json-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "JSON file downloaded successfully",
    });
  };

  const loadExample = (example: string) => {
    setInput(example);
    setOutput("");
    setIsValid(null);
    setError("");
    setStats(null);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setIsValid(null);
    setError("");
    setStats(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">JSON Formatter & Validator</h2>
        <p className="text-muted-foreground">
          Format, validate, and minify JSON data with advanced features and statistics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Input JSON</CardTitle>
              {isValid !== null && (
                <div className="flex items-center gap-2">
                  {isValid ? (
                    <Badge variant="default" className="bg-success text-success-foreground">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Valid
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Invalid
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <CardDescription>
              Paste your JSON data here
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="indent-size">Indent Size</Label>
                <Select value={indentSize.toString()} onValueChange={(value) => setIndentSize(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 spaces</SelectItem>
                    <SelectItem value="4">4 spaces</SelectItem>
                    <SelectItem value="8">8 spaces</SelectItem>
                    <SelectItem value="1">1 space</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="sort-keys"
                  checked={sortKeys}
                  onChange={(e) => setSortKeys(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="sort-keys" className="text-sm">Sort Keys</Label>
              </div>
            </div>
            
            <Textarea
              placeholder='{"name": "example", "value": 123, "nested": {"array": [1, 2, 3]}}'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="font-mono min-h-[300px] resize-none bg-code-bg"
            />
            <div className="flex gap-2 flex-wrap">
              <Button onClick={formatJson} disabled={!input.trim()}>
                <FileText className="h-4 w-4 mr-2" />
                Format
              </Button>
              <Button variant="outline" onClick={minifyJson} disabled={!input.trim()}>
                Minify
              </Button>
              <Button variant="outline" onClick={validateJson} disabled={!input.trim()}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Validate
              </Button>
              <Button variant="outline" onClick={clearAll}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Output</CardTitle>
              {output && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="gap-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadJson}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              )}
            </div>
            <CardDescription>
              Formatted JSON output
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
                <div className="flex items-center gap-2 text-destructive mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">JSON Parse Error</span>
                </div>
                <p className="text-sm text-destructive/80 font-mono">{error}</p>
              </div>
            ) : output ? (
              <Textarea
                value={output}
                readOnly
                className="font-mono min-h-[300px] resize-none bg-code-bg"
              />
            ) : (
              <div className="min-h-[300px] bg-code-bg rounded-md border flex items-center justify-center text-muted-foreground">
                Formatted JSON will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              JSON Statistics
            </CardTitle>
            <CardDescription>
              Analysis of your JSON data structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.size}</div>
                <div className="text-sm text-muted-foreground">Bytes</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.lines}</div>
                <div className="text-sm text-muted-foreground">Lines</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.keys}</div>
                <div className="text-sm text-muted-foreground">Keys/Items</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.depth}</div>
                <div className="text-sm text-muted-foreground">Max Depth</div>
              </div>
            </div>
            
            <div className="mt-4">
              <Label className="text-sm font-medium">Data Types</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(stats.types).map(([type, count]) => (
                  <Badge key={type} variant="outline">
                    {type}: {count}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Examples</CardTitle>
          <CardDescription>Click on any example to load it</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Basic JSON</Label>
              <div className="space-y-1">
                {[
                  { json: '{"name": "John Doe", "age": 30, "city": "New York"}', desc: "Simple Object" },
                  { json: '[1, 2, 3, 4, 5]', desc: "Number Array" },
                  { json: '{"users": [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]}', desc: "Nested Array" }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample(example.json)}
                    className="w-full justify-start text-xs font-mono"
                  >
                    {example.desc}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Complex JSON</Label>
              <div className="space-y-1">
                {[
                  { json: '{"config": {"database": {"host": "localhost", "port": 5432}, "api": {"version": "v1", "endpoints": ["users", "posts"]}}, "features": {"auth": true, "logging": false}}', desc: "Config Object" },
                  { json: '{"products": [{"id": 1, "name": "Laptop", "price": 999.99, "specs": {"cpu": "Intel i7", "ram": "16GB"}}, {"id": 2, "name": "Mouse", "price": 29.99}]}', desc: "Product Catalog" },
                  { json: '{"error": null, "data": {"user": {"id": 123, "profile": {"avatar": "https://example.com/avatar.jpg", "preferences": {"theme": "dark", "notifications": true}}}}', desc: "API Response" }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample(example.json)}
                    className="w-full justify-start text-xs font-mono"
                  >
                    {example.desc}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Invalid JSON</Label>
              <div className="space-y-1">
                {[
                  { json: '{"name": "John", "age": 30,}', desc: "Trailing Comma" },
                  { json: '{"name": "John", age: 30}', desc: "Unquoted Key" },
                  { json: '{"name": "John", "age": 30', desc: "Missing Brace" }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample(example.json)}
                    className="w-full justify-start text-xs font-mono"
                  >
                    {example.desc}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* JSON Tips */}
      <Card>
        <CardHeader>
          <CardTitle>JSON Tips & Best Practices</CardTitle>
          <CardDescription>Guidelines for working with JSON data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Formatting Rules</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use double quotes for strings and keys</li>
                <li>• No trailing commas allowed</li>
                <li>• Use consistent indentation (2 or 4 spaces)</li>
                <li>• Sort keys alphabetically for consistency</li>
                <li>• Use meaningful key names</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Common Issues</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Trailing commas in objects/arrays</li>
                <li>• Unquoted property names</li>
                <li>• Single quotes instead of double quotes</li>
                <li>• Missing closing brackets/braces</li>
                <li>• Invalid escape sequences</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Pro Tip</p>
                <p className="text-blue-700 dark:text-blue-300">
                  Use the statistics panel to understand your JSON structure better. 
                  Large depth values might indicate overly nested data that could be simplified.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};