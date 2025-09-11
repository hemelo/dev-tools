import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Check, AlertCircle, CheckCircle, ArrowRightLeft, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const YamlJsonConverter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [conversionType, setConversionType] = useState<"yaml-to-json" | "json-to-yaml">("yaml-to-json");
  const [indentation, setIndentation] = useState(2);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Simple YAML to JSON converter (basic implementation)
  const yamlToJson = (yamlText: string): any => {
    const lines = yamlText.split('\n');
    const result: any = {};
    const stack: any[] = [result];
    const indentStack: number[] = [0];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }

      const indent = line.length - line.trimStart().length;
      
      // Adjust stack based on indentation
      while (indentStack.length > 1 && indent <= indentStack[indentStack.length - 1]) {
        stack.pop();
        indentStack.pop();
      }

      if (trimmedLine.includes(':')) {
        const [key, ...valueParts] = trimmedLine.split(':');
        const value = valueParts.join(':').trim();
        
        if (value === '' || value === '|' || value === '>') {
          // Object or multiline string
          const newObj: any = {};
          stack[stack.length - 1][key.trim()] = newObj;
          stack.push(newObj);
          indentStack.push(indent);
        } else if (value.startsWith('[') && value.endsWith(']')) {
          // Array
          try {
            const arrayValue = JSON.parse(value);
            stack[stack.length - 1][key.trim()] = arrayValue;
          } catch {
            stack[stack.length - 1][key.trim()] = value;
          }
        } else if (value === 'true' || value === 'false') {
          stack[stack.length - 1][key.trim()] = value === 'true';
        } else if (!isNaN(Number(value))) {
          stack[stack.length - 1][key.trim()] = Number(value);
        } else {
          stack[stack.length - 1][key.trim()] = value.replace(/^["']|["']$/g, '');
        }
      } else if (trimmedLine.startsWith('- ')) {
        // Array item
        const value = trimmedLine.substring(2).trim();
        const currentObj = stack[stack.length - 1];
        
        if (!Array.isArray(currentObj)) {
          // Convert object to array
          const newArray = Object.values(currentObj);
          Object.keys(currentObj).forEach(key => delete currentObj[key]);
          newArray.push(value);
          Object.assign(currentObj, newArray);
        } else {
          currentObj.push(value);
        }
      }
    }

    return result;
  };

  // Simple JSON to YAML converter (basic implementation)
  const jsonToYaml = (jsonData: any, indent: number = 0): string => {
    const spaces = ' '.repeat(indent);
    
    if (jsonData === null || jsonData === undefined) {
      return 'null';
    }
    
    if (typeof jsonData === 'string') {
      return `"${jsonData}"`;
    }
    
    if (typeof jsonData === 'number' || typeof jsonData === 'boolean') {
      return String(jsonData);
    }
    
    if (Array.isArray(jsonData)) {
      if (jsonData.length === 0) {
        return '[]';
      }
      
      return jsonData.map(item => {
        const yamlItem = jsonToYaml(item, indent + 2);
        return `${spaces}- ${yamlItem.startsWith(' ') ? yamlItem.substring(2) : yamlItem}`;
      }).join('\n');
    }
    
    if (typeof jsonData === 'object') {
      const entries = Object.entries(jsonData);
      if (entries.length === 0) {
        return '{}';
      }
      
      return entries.map(([key, value]) => {
        const yamlValue = jsonToYaml(value, indent + 2);
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          return `${spaces}${key}:\n${yamlValue}`;
        } else {
          return `${spaces}${key}: ${yamlValue}`;
        }
      }).join('\n');
    }
    
    return String(jsonData);
  };

  const convertYamlToJson = () => {
    try {
      if (!input.trim()) {
        setError("Please enter YAML data");
        setIsValid(false);
        return;
      }

      const jsonData = yamlToJson(input);
      const formatted = JSON.stringify(jsonData, null, indentation);
      setOutput(formatted);
      setIsValid(true);
      setError("");
    } catch (err) {
      setError((err as Error).message);
      setIsValid(false);
      setOutput("");
    }
  };

  const convertJsonToYaml = () => {
    try {
      if (!input.trim()) {
        setError("Please enter JSON data");
        setIsValid(false);
        return;
      }

      const jsonData = JSON.parse(input);
      const yamlText = jsonToYaml(jsonData);
      setOutput(yamlText);
      setIsValid(true);
      setError("");
    } catch (err) {
      setError((err as Error).message);
      setIsValid(false);
      setOutput("");
    }
  };

  const convert = () => {
    if (conversionType === "yaml-to-json") {
      convertYamlToJson();
    } else {
      convertJsonToYaml();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast({
        title: "Copied!",
        description: `${conversionType === "yaml-to-json" ? "JSON" : "YAML"} copied to clipboard`,
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

  const clearAll = () => {
    setInput("");
    setOutput("");
    setIsValid(null);
    setError("");
  };

  const getInputPlaceholder = () => {
    if (conversionType === "yaml-to-json") {
      return `name: John Doe
age: 30
city: New York
hobbies:
  - reading
  - coding
  - hiking
address:
  street: 123 Main St
  zip: 10001`;
    } else {
      return `{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "hobbies": ["reading", "coding", "hiking"],
  "address": {
    "street": "123 Main St",
    "zip": 10001
  }
}`;
    }
  };

  const getOutputDescription = () => {
    return conversionType === "yaml-to-json" ? "JSON output" : "YAML output";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">YAML ↔ JSON Converter</h2>
        <p className="text-muted-foreground">
          Convert between YAML and JSON formats with customizable indentation
        </p>
      </div>

      {/* Conversion Options */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Options</CardTitle>
          <CardDescription>Configure how the conversion should be performed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Conversion Type</label>
              <Select value={conversionType} onValueChange={(value: "yaml-to-json" | "json-to-yaml") => setConversionType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yaml-to-json">YAML to JSON</SelectItem>
                  <SelectItem value="json-to-yaml">JSON to YAML</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {conversionType === "yaml-to-json" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">JSON Indentation</label>
                <Select value={indentation.toString()} onValueChange={(value) => setIndentation(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 spaces</SelectItem>
                    <SelectItem value="4">4 spaces</SelectItem>
                    <SelectItem value="0">Minified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Input {conversionType === "yaml-to-json" ? "YAML" : "JSON"}</CardTitle>
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
              Paste your {conversionType === "yaml-to-json" ? "YAML" : "JSON"} data here
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={getInputPlaceholder()}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="font-mono min-h-[300px] resize-none bg-code-bg"
            />
            <div className="flex gap-2 flex-wrap">
              <Button onClick={convert} disabled={!input.trim()}>
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Convert
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
              <CardTitle>Output {conversionType === "json-to-yaml" ? "YAML" : "JSON"}</CardTitle>
              {output && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="gap-2"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              )}
            </div>
            <CardDescription>
              {getOutputDescription()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
                <div className="flex items-center gap-2 text-destructive mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Conversion Error</span>
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
                Converted {conversionType === "yaml-to-json" ? "JSON" : "YAML"} will appear here
              </div>
            )}
          </CardContent>
        </Card>
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
              <Label className="text-sm font-medium">Configuration</Label>
              <div className="space-y-1">
                {[
                  { yaml: "app:\n  name: MyApp\n  version: 1.0.0\n  debug: true", desc: "App Config" },
                  { yaml: "database:\n  host: localhost\n  port: 5432\n  name: mydb", desc: "Database Config" },
                  { yaml: "server:\n  port: 3000\n  cors: true\n  ssl: false", desc: "Server Config" }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setConversionType("yaml-to-json");
                      setInput(example.yaml);
                    }}
                    className="w-full justify-start text-xs"
                  >
                    {example.desc}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Data Structures</Label>
              <div className="space-y-1">
                {[
                  { json: '{"users": [{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]}', desc: "User Array" },
                  { json: '{"settings": {"theme": "dark", "language": "en", "notifications": true}}', desc: "Settings Object" },
                  { json: '{"products": [{"id": 1, "name": "Laptop", "price": 999.99}]}', desc: "Product List" }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setConversionType("json-to-yaml");
                      setInput(example.json);
                    }}
                    className="w-full justify-start text-xs"
                  >
                    {example.desc}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Complex Examples</Label>
              <div className="space-y-1">
                {[
                  { yaml: "api:\n  endpoints:\n    - name: users\n      method: GET\n      path: /api/users", desc: "API Definition" },
                  { json: '{"docker": {"services": {"web": {"image": "nginx", "ports": ["80:80"]}}}}', desc: "Docker Compose" },
                  { yaml: "deployment:\n  replicas: 3\n  strategy:\n    type: RollingUpdate", desc: "K8s Deployment" }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (example.yaml) {
                        setConversionType("yaml-to-json");
                        setInput(example.yaml);
                      } else {
                        setConversionType("json-to-yaml");
                        setInput(example.json);
                      }
                    }}
                    className="w-full justify-start text-xs"
                  >
                    {example.desc}
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

export default YamlJsonConverter;
