import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCode, Copy, Download, Upload, AlertCircle, CheckCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SchemaOptions {
  version: 'draft-07' | 'draft-06' | 'draft-04';
  title: string;
  description: string;
  includeExamples: boolean;
  strictMode: boolean;
  requiredFields: boolean;
}

const JsonSchemaGenerator = () => {
  const [inputJson, setInputJson] = useState("");
  const [generatedSchema, setGeneratedSchema] = useState("");
  const [error, setError] = useState("");
  const [options, setOptions] = useState<SchemaOptions>({
    version: 'draft-07',
    title: 'Generated Schema',
    description: 'Auto-generated JSON Schema',
    includeExamples: true,
    strictMode: false,
    requiredFields: true
  });
  const { toast } = useToast();


  const inferType = (value: any): string => {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    if (typeof value === 'string') {
      // Check for common string patterns
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) return 'string (ISO date)';
      if (/^https?:\/\//.test(value)) return 'string (URL)';
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'string (email)';
      if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value)) return 'string (UUID)';
      return 'string';
    }
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'integer' : 'number';
    }
    if (typeof value === 'boolean') return 'boolean';
    return typeof value;
  };

  const generateSchemaFromValue = (value: any, path: string = '', depth: number = 0): any => {
    // Prevent infinite recursion by limiting depth
    if (depth > 10) {
      return { type: 'object', description: 'Max depth reached' };
    }
    
    const type = inferType(value);
    
    if (type === 'null') {
      return { type: 'null' };
    }
    
    if (type === 'array') {
      if (value.length === 0) {
        return {
          type: 'array',
          items: {}
        };
      }
      
      // Analyze array items
      const itemTypes = value.map((item, index) => inferType(item));
      const uniqueTypes = [...new Set(itemTypes)];
      
      if (uniqueTypes.length === 1) {
        // All items have the same type
        return {
          type: 'array',
          items: generateSchemaFromValue(value[0], `${path}[0]`, depth + 1),
          minItems: options.strictMode ? value.length : undefined,
          maxItems: options.strictMode ? value.length : undefined
        };
      } else {
        // Mixed types - use oneOf
        return {
          type: 'array',
          items: {
            oneOf: uniqueTypes.map(type => {
              const sampleItem = value.find(item => inferType(item) === type);
              return generateSchemaFromValue(sampleItem, `${path}[*]`, depth + 1);
            })
          }
        };
      }
    }
    
    if (type === 'object') {
      const properties: any = {};
      const required: string[] = [];
      
      for (const [key, val] of Object.entries(value)) {
        properties[key] = generateSchemaFromValue(val, `${path}.${key}`, depth + 1);
        
        if (options.requiredFields && val !== null && val !== undefined) {
          required.push(key);
        }
      }
      
      const schema: any = {
        type: 'object',
        properties
      };
      
      if (required.length > 0) {
        schema.required = required;
      }
      
      if (options.strictMode) {
        schema.additionalProperties = false;
      }
      
      return schema;
    }
    
    // Primitive types
    const schema: any = { type: type.split(' ')[0] };
    
    if (type === 'string') {
      if (options.includeExamples) {
        schema.examples = [value];
      }
      
      // Add format if detected
      if (type.includes('email')) schema.format = 'email';
      if (type.includes('URL')) schema.format = 'uri';
      if (type.includes('ISO date')) schema.format = 'date-time';
      if (type.includes('UUID')) schema.format = 'uuid';
    }
    
    if (type === 'integer' || type === 'number') {
      if (options.includeExamples) {
        schema.examples = [value];
      }
    }
    
    if (type === 'boolean') {
      if (options.includeExamples) {
        schema.examples = [value];
      }
    }
    
    return schema;
  };

  const generateSchema = () => {
    setError("");
    setGeneratedSchema("");
    
    try {
      const parsedData = JSON.parse(inputJson);
      const schema = generateSchemaFromValue(parsedData);
      
      const fullSchema = {
        $schema: `http://json-schema.org/${options.version}/schema#`,
        title: options.title,
        description: options.description,
        ...schema
      };
      
      setGeneratedSchema(JSON.stringify(fullSchema, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse JSON");
    }
  };


  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Schema copied to clipboard!",
    });
  };

  const downloadSchema = () => {
    const blob = new Blob([generatedSchema], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schema.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success!",
      description: "Schema downloaded!",
    });
  };

  const validateJson = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  };

  const isValidJson = useMemo(() => {
    return inputJson.trim() === '' || validateJson(inputJson);
  }, [inputJson]);

  const schemaStats = useMemo(() => {
    if (!generatedSchema) return null;
    
    try {
      const schema = JSON.parse(generatedSchema);
      const countProperties = (obj: any): number => {
        if (obj.type === 'object' && obj.properties) {
          return Object.keys(obj.properties).length;
        }
        return 0;
      };
      
      const countRequired = (obj: any): number => {
        return obj.required ? obj.required.length : 0;
      };
      
      return {
        properties: countProperties(schema),
        required: countRequired(schema),
        version: schema.$schema?.split('/').pop() || 'unknown'
      };
    } catch {
      return null;
    }
  }, [generatedSchema]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">JSON Schema Generator</h2>
        <p className="text-muted-foreground">
          Automatically generate JSON Schema from your JSON data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Input JSON
            </CardTitle>
            <CardDescription>
              Paste your JSON data to generate a schema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="json-input">JSON Data</Label>
              <Textarea
                id="json-input"
                placeholder="Paste your JSON data here..."
                value={inputJson}
                onChange={(e) => setInputJson(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
              {!isValidJson && inputJson.trim() && (
                <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Invalid JSON format</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schema-title">Schema Title</Label>
                <Input
                  id="schema-title"
                  value={options.title}
                  onChange={(e) => setOptions(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="schema-version">Schema Version</Label>
                <Select 
                  value={options.version} 
                  onValueChange={(value: any) => setOptions(prev => ({ ...prev, version: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft-07">Draft 07</SelectItem>
                    <SelectItem value="draft-06">Draft 06</SelectItem>
                    <SelectItem value="draft-04">Draft 04</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="schema-description">Description</Label>
              <Input
                id="schema-description"
                value={options.description}
                onChange={(e) => setOptions(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options.includeExamples}
                    onChange={(e) => setOptions(prev => ({ ...prev, includeExamples: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Include examples</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options.strictMode}
                    onChange={(e) => setOptions(prev => ({ ...prev, strictMode: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Strict mode (no additional properties)</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options.requiredFields}
                    onChange={(e) => setOptions(prev => ({ ...prev, requiredFields: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Mark non-null fields as required</span>
                </label>
              </div>
            </div>

            <Button
              onClick={generateSchema}
              disabled={!inputJson.trim() || !isValidJson}
              className="w-full"
            >
              <FileCode className="h-4 w-4 mr-2" />
              Generate Schema
            </Button>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              Generated Schema
            </CardTitle>
            <CardDescription>
              {schemaStats && (
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">{schemaStats.properties} properties</Badge>
                  <Badge variant="secondary">{schemaStats.required} required</Badge>
                  <Badge variant="secondary">{schemaStats.version}</Badge>
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedSchema ? (
              <>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedSchema)}>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadSchema}>
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
                
                <div className="p-4 bg-code-bg rounded-lg max-h-96 overflow-y-auto">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {generatedSchema}
                  </pre>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <FileCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Generated schema will appear here</p>
                </div>
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
              <Label className="text-sm font-medium">User Data</Label>
              <div className="space-y-1">
                {[
                  { 
                    name: "Simple User", 
                    data: `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "isActive": true
}` 
                  },
                  { 
                    name: "User with Address", 
                    data: `{
  "id": 2,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  }
}` 
                  }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputJson(example.data)}
                    className="w-full justify-start text-xs"
                  >
                    {example.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">API Response</Label>
              <div className="space-y-1">
                {[
                  { 
                    name: "Product List", 
                    data: `{
  "products": [
    {
      "id": 1,
      "name": "Laptop",
      "price": 999.99,
      "inStock": true,
      "tags": ["electronics", "computers"]
    },
    {
      "id": 2,
      "name": "Mouse",
      "price": 29.99,
      "inStock": false,
      "tags": ["electronics", "accessories"]
    }
  ],
  "total": 2
}` 
                  },
                  { 
                    name: "Error Response", 
                    data: `{
  "error": {
    "code": 404,
    "message": "Resource not found",
    "details": {
      "resource": "user",
      "id": 123
    }
  },
  "timestamp": "2023-12-25T10:30:00Z"
}` 
                  }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputJson(example.data)}
                    className="w-full justify-start text-xs"
                  >
                    {example.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Complex Data</Label>
              <div className="space-y-1">
                {[
                  { 
                    name: "Nested Objects", 
                    data: `{
  "company": {
    "name": "Tech Corp",
    "employees": [
      {
        "id": 1,
        "name": "Alice",
        "department": "Engineering",
        "skills": ["JavaScript", "React", "Node.js"]
      }
    ],
    "location": {
      "address": "123 Tech St",
      "coordinates": {
        "lat": 40.7128,
        "lng": -74.0060
      }
    }
  }
}` 
                  },
                  { 
                    name: "Mixed Types", 
                    data: `{
  "data": [
    "string value",
    42,
    true,
    null,
    {
      "nested": "object"
    },
    [1, 2, 3]
  ]
}` 
                  }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputJson(example.data)}
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            About JSON Schema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">What is JSON Schema?</h4>
              <p className="text-sm text-muted-foreground">
                JSON Schema is a vocabulary that allows you to annotate and validate JSON documents. 
                It provides a contract for what JSON data is required for a given application and how to interact with it.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Common Use Cases</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>API Documentation:</strong> Define the structure of request/response data</li>
                <li>• <strong>Data Validation:</strong> Ensure incoming data matches expected format</li>
                <li>• <strong>Code Generation:</strong> Generate classes, interfaces, or types from schemas</li>
                <li>• <strong>Testing:</strong> Create mock data that conforms to your schema</li>
                <li>• <strong>Form Generation:</strong> Build dynamic forms based on schema structure</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Schema Versions</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <strong>Draft 07</strong>
                  <p className="text-muted-foreground mt-1">Most widely supported version</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <strong>Draft 06</strong>
                  <p className="text-muted-foreground mt-1">Good compatibility</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <strong>Draft 04</strong>
                  <p className="text-muted-foreground mt-1">Legacy support</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JsonSchemaGenerator;
