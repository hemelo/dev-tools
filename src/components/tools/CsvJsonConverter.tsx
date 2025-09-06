import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Check, AlertCircle, CheckCircle, ArrowRightLeft, FileText, Table } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const CsvJsonConverter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [conversionType, setConversionType] = useState<"csv-to-json" | "json-to-csv">("csv-to-json");
  const [delimiter, setDelimiter] = useState(",");
  const [hasHeader, setHasHeader] = useState(true);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const parseCSV = (csvText: string, delimiter: string, hasHeader: boolean) => {
    const lines = csvText.trim().split('\n');
    if (lines.length === 0) return [];

    const headers = hasHeader ? lines[0].split(delimiter).map(h => h.trim().replace(/^"|"$/g, '')) : [];
    const dataLines = hasHeader ? lines.slice(1) : lines;

    return dataLines.map(line => {
      const values = line.split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''));
      
      if (hasHeader) {
        const obj: Record<string, string> = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        return obj;
      } else {
        return values;
      }
    });
  };

  const convertCSVToJSON = () => {
    try {
      if (!input.trim()) {
        setError("Please enter CSV data");
        setIsValid(false);
        return;
      }

      const jsonData = parseCSV(input, delimiter, hasHeader);
      const formatted = JSON.stringify(jsonData, null, 2);
      setOutput(formatted);
      setIsValid(true);
      setError("");
    } catch (err) {
      setError((err as Error).message);
      setIsValid(false);
      setOutput("");
    }
  };

  const convertJSONToCSV = () => {
    try {
      if (!input.trim()) {
        setError("Please enter JSON data");
        setIsValid(false);
        return;
      }

      const jsonData = JSON.parse(input);
      if (!Array.isArray(jsonData)) {
        throw new Error("JSON must be an array of objects");
      }

      if (jsonData.length === 0) {
        setOutput("");
        setIsValid(true);
        setError("");
        return;
      }

      const headers = Object.keys(jsonData[0]);
      const csvLines = [];

      // Add header row
      csvLines.push(headers.map(h => `"${h}"`).join(delimiter));

      // Add data rows
      jsonData.forEach(row => {
        const values = headers.map(header => {
          const value = row[header];
          return `"${value !== null && value !== undefined ? String(value) : ''}"`;
        });
        csvLines.push(values.join(delimiter));
      });

      setOutput(csvLines.join('\n'));
      setIsValid(true);
      setError("");
    } catch (err) {
      setError((err as Error).message);
      setIsValid(false);
      setOutput("");
    }
  };

  const convert = () => {
    if (conversionType === "csv-to-json") {
      convertCSVToJSON();
    } else {
      convertJSONToCSV();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast({
        title: "Copied!",
        description: `${conversionType === "csv-to-json" ? "JSON" : "CSV"} copied to clipboard`,
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

  const loadExample = (example: string) => {
    setInput(example);
    setOutput("");
    setIsValid(null);
    setError("");
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setIsValid(null);
    setError("");
  };

  const getInputPlaceholder = () => {
    if (conversionType === "csv-to-json") {
      return `name,age,city
"John Doe",30,"New York"
"Jane Smith",25,"Los Angeles"`;
    } else {
      return `[
  {"name": "John Doe", "age": 30, "city": "New York"},
  {"name": "Jane Smith", "age": 25, "city": "Los Angeles"}
]`;
    }
  };

  const getOutputDescription = () => {
    return conversionType === "csv-to-json" ? "JSON output" : "CSV output";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">CSV ↔ JSON Converter</h2>
        <p className="text-muted-foreground">
          Convert between CSV and JSON formats with customizable options
        </p>
      </div>

      {/* Conversion Options */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Options</CardTitle>
          <CardDescription>Configure how the conversion should be performed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Conversion Type</label>
              <Select value={conversionType} onValueChange={(value: "csv-to-json" | "json-to-csv") => setConversionType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv-to-json">CSV to JSON</SelectItem>
                  <SelectItem value="json-to-csv">JSON to CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {conversionType === "csv-to-json" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Delimiter</label>
                <Select value={delimiter} onValueChange={setDelimiter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=",">Comma (,)</SelectItem>
                    <SelectItem value=";">Semicolon (;)</SelectItem>
                    <SelectItem value="\t">Tab</SelectItem>
                    <SelectItem value="|">Pipe (|)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {conversionType === "csv-to-json" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">First Row</label>
                <Select value={hasHeader ? "header" : "data"} onValueChange={(value) => setHasHeader(value === "header")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="header">Contains Headers</SelectItem>
                    <SelectItem value="data">Contains Data</SelectItem>
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
              <CardTitle>Input {conversionType === "csv-to-json" ? "CSV" : "JSON"}</CardTitle>
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
              Paste your {conversionType === "csv-to-json" ? "CSV" : "JSON"} data here
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
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Output {conversionType === "json-to-csv" ? "CSV" : "JSON"}</CardTitle>
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
                Converted {conversionType === "csv-to-json" ? "JSON" : "CSV"} will appear here
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Table className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium">CSV Examples</h4>
              </div>
              <div className="space-y-2">
                {[
                  { 
                    csv: 'name,age,city\n"John Doe",30,"New York"\n"Jane Smith",25,"Los Angeles"\n"Bob Johnson",35,"Chicago"', 
                    desc: "Basic CSV with Headers" 
                  },
                  { 
                    csv: 'product;price;category\n"Laptop";999.99;"Electronics"\n"Book";19.99;"Education"\n"Coffee";4.99;"Food"', 
                    desc: "Semicolon Delimited" 
                  },
                  { 
                    csv: 'id\tname\temail\n1\tAlice\talice@example.com\n2\tBob\tbob@example.com', 
                    desc: "Tab Delimited" 
                  },
                  { 
                    csv: 'name|department|salary\n"John Smith"|"Engineering"|75000\n"Sarah Davis"|"Marketing"|65000', 
                    desc: "Pipe Delimited" 
                  }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      loadExample(example.csv);
                      setConversionType("csv-to-json");
                    }}
                    className="w-full justify-start text-xs font-mono"
                  >
                    {example.desc}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                <h4 className="font-medium">JSON Examples</h4>
              </div>
              <div className="space-y-2">
                {[
                  { 
                    json: '[{"name": "John Doe", "age": 30, "city": "New York"}, {"name": "Jane Smith", "age": 25, "city": "Los Angeles"}]', 
                    desc: "Simple Object Array" 
                  },
                  { 
                    json: '[{"product": "Laptop", "price": 999.99, "inStock": true}, {"product": "Mouse", "price": 29.99, "inStock": false}]', 
                    desc: "Mixed Data Types" 
                  },
                  { 
                    json: '[{"id": 1, "user": {"name": "Alice", "email": "alice@example.com"}}, {"id": 2, "user": {"name": "Bob", "email": "bob@example.com"}}]', 
                    desc: "Nested Objects" 
                  },
                  { 
                    json: '[{"date": "2024-01-15", "sales": 1500, "region": "North"}, {"date": "2024-01-16", "sales": 2300, "region": "South"}]', 
                    desc: "Date and Numbers" 
                  }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      loadExample(example.json);
                      setConversionType("json-to-csv");
                    }}
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

      {/* CSV/JSON Tips */}
      <Card>
        <CardHeader>
          <CardTitle>CSV/JSON Conversion Tips</CardTitle>
          <CardDescription>Best practices for data conversion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">CSV Formatting</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use consistent delimiters throughout the file</li>
                <li>• Quote fields containing special characters or spaces</li>
                <li>• Include headers in the first row for better JSON structure</li>
                <li>• Handle empty fields appropriately</li>
                <li>• Use proper encoding (UTF-8) for international characters</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">JSON Structure</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use arrays of objects for tabular data</li>
                <li>• Ensure consistent property names across objects</li>
                <li>• Use appropriate data types (strings, numbers, booleans)</li>
                <li>• Handle null values explicitly</li>
                <li>• Consider nested structures for complex data</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Conversion Notes</p>
                <p className="text-blue-700 dark:text-blue-300">
                  When converting CSV to JSON, the first row is treated as headers by default. 
                  For JSON to CSV conversion, ensure your JSON is an array of objects with consistent properties.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
