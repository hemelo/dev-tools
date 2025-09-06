import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Check, AlertCircle, CheckCircle, RotateCcw, FileText, Download, Upload, Info, Zap, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SqlStats {
  size: number;
  lines: number;
  keywords: number;
  tables: number;
  columns: number;
  functions: number;
  complexity: string;
}

export const SqlFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);
  const [uppercaseKeywords, setUppercaseKeywords] = useState(true);
  const [stats, setStats] = useState<SqlStats | null>(null);
  const { toast } = useToast();

  // SQL Keywords for formatting
  const sqlKeywords = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'ON',
    'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC', 'LIMIT', 'OFFSET',
    'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE',
    'ALTER', 'DROP', 'INDEX', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES',
    'UNIQUE', 'NOT', 'NULL', 'DEFAULT', 'AUTO_INCREMENT', 'IDENTITY',
    'AND', 'OR', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS', 'AS', 'CASE',
    'WHEN', 'THEN', 'ELSE', 'END', 'UNION', 'ALL', 'DISTINCT', 'COUNT',
    'SUM', 'AVG', 'MIN', 'MAX', 'CAST', 'CONVERT', 'SUBSTRING', 'LENGTH',
    'UPPER', 'LOWER', 'TRIM', 'REPLACE', 'CONCAT', 'COALESCE', 'NULLIF',
    'IF', 'IFNULL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'BEGIN',
    'COMMIT', 'ROLLBACK', 'TRANSACTION', 'GRANT', 'REVOKE', 'EXECUTE',
    'PROCEDURE', 'FUNCTION', 'TRIGGER', 'VIEW', 'SCHEMA', 'DATABASE'
  ];

  const calculateStats = (sql: string): SqlStats => {
    const upperSql = sql.toUpperCase();
    const lines = sql.split('\n').length;
    const size = sql.length;
    
    // Count keywords
    const keywordCount = sqlKeywords.reduce((count, keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = sql.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);

    // Extract table names (simplified)
    const tableMatches = sql.match(/\bFROM\s+(\w+)/gi) || [];
    const joinMatches = sql.match(/\bJOIN\s+(\w+)/gi) || [];
    const insertMatches = sql.match(/\bINTO\s+(\w+)/gi) || [];
    const updateMatches = sql.match(/\bUPDATE\s+(\w+)/gi) || [];
    const tables = new Set([
      ...tableMatches.map(m => m.split(/\s+/)[1]),
      ...joinMatches.map(m => m.split(/\s+/)[1]),
      ...insertMatches.map(m => m.split(/\s+/)[1]),
      ...updateMatches.map(m => m.split(/\s+/)[1])
    ]).size;

    // Extract column names (simplified)
    const columnMatches = sql.match(/\bSELECT\s+([^FROM]+)/gi) || [];
    const columns = columnMatches.reduce((count, match) => {
      const cols = match.replace(/SELECT\s+/i, '').split(',').length;
      return count + cols;
    }, 0);

    // Count functions
    const functionMatches = sql.match(/\b(COUNT|SUM|AVG|MIN|MAX|UPPER|LOWER|TRIM|REPLACE|CONCAT|COALESCE|NULLIF|IF|IFNULL|CAST|CONVERT|SUBSTRING|LENGTH)\s*\(/gi) || [];
    const functions = functionMatches.length;

    // Determine complexity
    let complexity = "Simple";
    if (keywordCount > 20 || tables > 3 || functions > 5) {
      complexity = "Complex";
    } else if (keywordCount > 10 || tables > 2 || functions > 2) {
      complexity = "Medium";
    }

    return {
      size,
      lines,
      keywords: keywordCount,
      tables,
      columns,
      functions,
      complexity
    };
  };

  const formatSql = () => {
    try {
      if (!input.trim()) {
        setError("Please enter SQL query");
        setIsValid(false);
        return;
      }

      const formatted = formatSqlQuery(input, indentSize, uppercaseKeywords);
      setOutput(formatted);
      setIsValid(true);
      setError("");
      setStats(calculateStats(formatted));
    } catch (err) {
      setError((err as Error).message);
      setIsValid(false);
      setOutput("");
      setStats(null);
    }
  };

  const formatSqlQuery = (sql: string, indent: number, uppercase: boolean): string => {
    let formatted = sql.trim();
    
    // Basic SQL formatting
    const indentStr = ' '.repeat(indent);
    
    // Convert keywords to uppercase if requested
    if (uppercase) {
      sqlKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, keyword.toUpperCase());
      });
    }

    // Add line breaks after major keywords
    formatted = formatted
      .replace(/\bSELECT\b/gi, '\nSELECT')
      .replace(/\bFROM\b/gi, '\nFROM')
      .replace(/\bWHERE\b/gi, '\nWHERE')
      .replace(/\bJOIN\b/gi, '\nJOIN')
      .replace(/\bINNER\s+JOIN\b/gi, '\nINNER JOIN')
      .replace(/\bLEFT\s+JOIN\b/gi, '\nLEFT JOIN')
      .replace(/\bRIGHT\s+JOIN\b/gi, '\nRIGHT JOIN')
      .replace(/\bOUTER\s+JOIN\b/gi, '\nOUTER JOIN')
      .replace(/\bGROUP\s+BY\b/gi, '\nGROUP BY')
      .replace(/\bORDER\s+BY\b/gi, '\nORDER BY')
      .replace(/\bHAVING\b/gi, '\nHAVING')
      .replace(/\bUNION\b/gi, '\nUNION')
      .replace(/\bINSERT\s+INTO\b/gi, '\nINSERT INTO')
      .replace(/\bUPDATE\b/gi, '\nUPDATE')
      .replace(/\bDELETE\s+FROM\b/gi, '\nDELETE FROM')
      .replace(/\bCREATE\s+TABLE\b/gi, '\nCREATE TABLE')
      .replace(/\bALTER\s+TABLE\b/gi, '\nALTER TABLE')
      .replace(/\bDROP\s+TABLE\b/gi, '\nDROP TABLE');

    // Add indentation
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const indentedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      // Decrease indent for certain keywords
      if (/\b(WHERE|HAVING|ORDER\s+BY|GROUP\s+BY|UNION)\b/i.test(trimmed)) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const indented = indentStr.repeat(indentLevel) + trimmed;
      
      // Increase indent for certain keywords
      if (/\b(SELECT|FROM|JOIN|INNER\s+JOIN|LEFT\s+JOIN|RIGHT\s+JOIN|OUTER\s+JOIN|INSERT\s+INTO|UPDATE|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE)\b/i.test(trimmed)) {
        indentLevel++;
      }
      
      return indented;
    });

    return indentedLines.join('\n').trim();
  };

  const minifySql = () => {
    try {
      if (!input.trim()) {
        setError("Please enter SQL query");
        setIsValid(false);
        return;
      }

      const minified = input
        .replace(/\s+/g, ' ')
        .replace(/\s*,\s*/g, ',')
        .replace(/\s*\(\s*/g, '(')
        .replace(/\s*\)\s*/g, ')')
        .trim();
      
      setOutput(minified);
      setIsValid(true);
      setError("");
      setStats(calculateStats(minified));
    } catch (err) {
      setError((err as Error).message);
      setIsValid(false);
      setOutput("");
      setStats(null);
    }
  };

  const validateSql = () => {
    try {
      if (!input.trim()) {
        setError("Please enter SQL query");
        setIsValid(false);
        setStats(null);
        return;
      }

      // Basic SQL validation (simplified)
      const sql = input.trim().toUpperCase();
      const hasSelect = sql.includes('SELECT');
      const hasFrom = sql.includes('FROM');
      const hasInsert = sql.includes('INSERT');
      const hasUpdate = sql.includes('UPDATE');
      const hasDelete = sql.includes('DELETE');
      const hasCreate = sql.includes('CREATE');
      
      const isValidQuery = hasSelect || hasInsert || hasUpdate || hasDelete || hasCreate;
      
      if (!isValidQuery) {
        throw new Error("Invalid SQL query structure");
      }

      // Check for basic syntax issues
      const openParens = (input.match(/\(/g) || []).length;
      const closeParens = (input.match(/\)/g) || []).length;
      
      if (openParens !== closeParens) {
        throw new Error("Mismatched parentheses");
      }

      setIsValid(true);
      setError("");
      setStats(calculateStats(input));
      toast({
        title: "Valid SQL",
        description: "SQL query appears to be properly formatted",
      });
    } catch (err) {
      setError((err as Error).message);
      setIsValid(false);
      setStats(null);
      toast({
        title: "Invalid SQL",
        description: "Please check your SQL syntax",
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
        description: "SQL query copied to clipboard",
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

  const downloadSql = () => {
    if (!output) return;
    
    const blob = new Blob([output], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted-sql-${Date.now()}.sql`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "SQL file downloaded successfully",
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
        <h2 className="text-3xl font-bold mb-2">SQL Formatter & Validator</h2>
        <p className="text-muted-foreground">
          Format, validate, and minify SQL queries with advanced features and statistics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Input SQL</CardTitle>
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
              Paste your SQL query here
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
                  id="uppercase-keywords"
                  checked={uppercaseKeywords}
                  onChange={(e) => setUppercaseKeywords(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="uppercase-keywords" className="text-sm">Uppercase Keywords</Label>
              </div>
            </div>
            
            <Textarea
              placeholder="SELECT u.name, u.email FROM users u JOIN orders o ON u.id = o.user_id WHERE u.active = 1 ORDER BY u.name;"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="font-mono min-h-[300px] resize-none bg-code-bg"
            />
            <div className="flex gap-2 flex-wrap">
              <Button onClick={formatSql} disabled={!input.trim()}>
                <FileText className="h-4 w-4 mr-2" />
                Format
              </Button>
              <Button variant="outline" onClick={minifySql} disabled={!input.trim()}>
                Minify
              </Button>
              <Button variant="outline" onClick={validateSql} disabled={!input.trim()}>
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
                    onClick={downloadSql}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              )}
            </div>
            <CardDescription>
              Formatted SQL output
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
                <div className="flex items-center gap-2 text-destructive mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">SQL Validation Error</span>
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
                Formatted SQL will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              SQL Statistics
            </CardTitle>
            <CardDescription>
              Analysis of your SQL query structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.size}</div>
                <div className="text-sm text-muted-foreground">Characters</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.lines}</div>
                <div className="text-sm text-muted-foreground">Lines</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.keywords}</div>
                <div className="text-sm text-muted-foreground">Keywords</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.tables}</div>
                <div className="text-sm text-muted-foreground">Tables</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.columns}</div>
                <div className="text-sm text-muted-foreground">Columns</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.functions}</div>
                <div className="text-sm text-muted-foreground">Functions</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.complexity}</div>
                <div className="text-sm text-muted-foreground">Complexity</div>
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
              <Label className="text-sm font-medium">Basic Queries</Label>
              <div className="space-y-1">
                {[
                  { sql: 'SELECT * FROM users WHERE active = 1;', desc: "Simple Select" },
                  { sql: 'SELECT name, email FROM users ORDER BY name ASC;', desc: "Select with Order" },
                  { sql: 'SELECT COUNT(*) as total FROM users WHERE created_at > "2024-01-01";', desc: "Count Query" }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample(example.sql)}
                    className="w-full justify-start text-xs font-mono"
                  >
                    {example.desc}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Complex Queries</Label>
              <div className="space-y-1">
                {[
                  { sql: 'SELECT u.name, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id GROUP BY u.id, u.name HAVING COUNT(o.id) > 5 ORDER BY order_count DESC;', desc: "Join with Group By" },
                  { sql: 'SELECT p.name, p.price, c.name as category FROM products p JOIN categories c ON p.category_id = c.id WHERE p.price BETWEEN 10 AND 100 AND c.active = 1;', desc: "Multi-table Join" },
                  { sql: 'SELECT u.name, SUM(o.total) as total_spent FROM users u JOIN orders o ON u.id = o.user_id WHERE o.status = "completed" GROUP BY u.id HAVING SUM(o.total) > 1000 ORDER BY total_spent DESC LIMIT 10;', desc: "Complex Aggregation" }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample(example.sql)}
                    className="w-full justify-start text-xs font-mono"
                  >
                    {example.desc}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Data Modification</Label>
              <div className="space-y-1">
                {[
                  { sql: 'INSERT INTO users (name, email, created_at) VALUES ("John Doe", "john@example.com", NOW());', desc: "Insert Statement" },
                  { sql: 'UPDATE users SET last_login = NOW() WHERE id = 123;', desc: "Update Statement" },
                  { sql: 'DELETE FROM users WHERE last_login < DATE_SUB(NOW(), INTERVAL 1 YEAR);', desc: "Delete Statement" }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample(example.sql)}
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

      {/* SQL Tips */}
      <Card>
        <CardHeader>
          <CardTitle>SQL Tips & Best Practices</CardTitle>
          <CardDescription>Guidelines for writing clean and efficient SQL queries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Formatting Rules</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use consistent indentation (2 or 4 spaces)</li>
                <li>• Put keywords on new lines</li>
                <li>• Align JOIN conditions properly</li>
                <li>• Use meaningful table and column aliases</li>
                <li>• End statements with semicolons</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Performance Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use specific column names instead of SELECT *</li>
                <li>• Add appropriate indexes for WHERE clauses</li>
                <li>• Use LIMIT for large result sets</li>
                <li>• Avoid functions in WHERE clauses</li>
                <li>• Use EXISTS instead of IN for subqueries</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Pro Tip</p>
                <p className="text-blue-700 dark:text-blue-300">
                  Use the statistics panel to understand your query complexity. 
                  High keyword counts or many tables might indicate queries that could be optimized.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SqlFormatter;
