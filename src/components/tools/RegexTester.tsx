import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Check, AlertCircle, CheckCircle, Search, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
}

interface RegexResult {
  isValid: boolean;
  error?: string;
  matches: RegexMatch[];
  globalMatches: string[];
  replaced: string;
}

export const RegexTester = () => {
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [flags, setFlags] = useState({
    global: false,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false
  });
  const [replaceString, setReplaceString] = useState("");
  const [result, setResult] = useState<RegexResult>({
    isValid: true,
    matches: [],
    globalMatches: [],
    replaced: ""
  });
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const testRegex = () => {
    if (!pattern.trim()) {
      setResult({
        isValid: true,
        matches: [],
        globalMatches: [],
        replaced: testString
      });
      return;
    }

    try {
      const flagString = Object.entries(flags)
        .filter(([_, enabled]) => enabled)
        .map(([flag, _]) => {
          switch (flag) {
            case 'global': return 'g';
            case 'ignoreCase': return 'i';
            case 'multiline': return 'm';
            case 'dotAll': return 's';
            case 'unicode': return 'u';
            case 'sticky': return 'y';
            default: return '';
          }
        })
        .join('');

      const regex = new RegExp(pattern, flagString);
      const matches: RegexMatch[] = [];
      const globalMatches: string[] = [];
      let replaced = testString;

      // Test for matches
      let match;
      const regexCopy = new RegExp(pattern, flagString + 'g');
      
      while ((match = regexCopy.exec(testString)) !== null) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1)
        });
        globalMatches.push(match[0]);
        
        // Prevent infinite loop
        if (match.index === regexCopy.lastIndex) {
          regexCopy.lastIndex++;
        }
      }

      // Test replacement
      if (replaceString !== undefined) {
        replaced = testString.replace(regex, replaceString);
      }

      setResult({
        isValid: true,
        matches,
        globalMatches,
        replaced
      });
    } catch (err) {
      setResult({
        isValid: false,
        error: (err as Error).message,
        matches: [],
        globalMatches: [],
        replaced: testString
      });
    }
  };

  useEffect(() => {
    testRegex();
  }, [pattern, testString, flags, replaceString]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const clearAll = () => {
    setPattern("");
    setTestString("");
    setReplaceString("");
    setResult({
      isValid: true,
      matches: [],
      globalMatches: [],
      replaced: ""
    });
  };

  const getFlagString = () => {
    return Object.entries(flags)
      .filter(([_, enabled]) => enabled)
      .map(([flag, _]) => {
        switch (flag) {
          case 'global': return 'g';
          case 'ignoreCase': return 'i';
          case 'multiline': return 'm';
          case 'dotAll': return 's';
          case 'unicode': return 'u';
          case 'sticky': return 'y';
          default: return '';
        }
      })
      .join('');
  };

  const highlightMatches = (text: string, matches: RegexMatch[]) => {
    if (matches.length === 0) return text;
    
    let result = text;
    let offset = 0;
    
    matches.forEach((match) => {
      const start = match.index + offset;
      const end = start + match.match.length;
      const highlighted = `<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">${match.match}</mark>`;
      result = result.slice(0, start) + highlighted + result.slice(end);
      offset += highlighted.length - match.match.length;
    });
    
    return result;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Regex Tester</h2>
        <p className="text-muted-foreground">
          Test regular expressions with live preview and match highlighting
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Regex Pattern */}
          <Card>
            <CardHeader>
              <CardTitle>Regular Expression</CardTitle>
              <CardDescription>Enter your regex pattern</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pattern">Pattern</Label>
                <div className="flex gap-2">
                  <Input
                    id="pattern"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="Enter regex pattern (e.g., \d+, [a-z]+, ^start)"
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(pattern, "Pattern")}
                    className="gap-2"
                  >
                    {copied === "Pattern" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Flags */}
              <div className="space-y-2">
                <Label>Flags</Label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(flags).map(([flag, enabled]) => (
                    <div key={flag} className="flex items-center space-x-2">
                      <Checkbox
                        id={flag}
                        checked={enabled}
                        onCheckedChange={(checked) => 
                          setFlags(prev => ({ ...prev, [flag]: checked as boolean }))
                        }
                      />
                      <Label htmlFor={flag} className="text-sm">
                        {flag === 'global' && 'Global (g)'}
                        {flag === 'ignoreCase' && 'Ignore Case (i)'}
                        {flag === 'multiline' && 'Multiline (m)'}
                        {flag === 'dotAll' && 'Dot All (s)'}
                        {flag === 'unicode' && 'Unicode (u)'}
                        {flag === 'sticky' && 'Sticky (y)'}
                      </Label>
                    </div>
                  ))}
                </div>
                {getFlagString() && (
                  <div className="text-sm text-muted-foreground">
                    Active flags: <code className="bg-muted px-1 rounded">{getFlagString()}</code>
                  </div>
                )}
              </div>

              {!result.isValid && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Invalid Regex</span>
                  </div>
                  <p className="text-sm text-destructive/80 mt-1">{result.error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test String */}
          <Card>
            <CardHeader>
              <CardTitle>Test String</CardTitle>
              <CardDescription>Enter text to test against the regex</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="Enter text to test (e.g., 'Hello 123 World', 'user@example.com')"
                className="font-mono min-h-[120px] resize-none"
              />
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" onClick={clearAll} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Replace String */}
          <Card>
            <CardHeader>
              <CardTitle>Replace String</CardTitle>
              <CardDescription>Optional replacement string for testing</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                value={replaceString}
                onChange={(e) => setReplaceString(e.target.value)}
                placeholder="Enter replacement string (e.g., 'X', '$1', 'replaced')"
                className="font-mono"
              />
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Match Results */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Match Results</CardTitle>
                {result.isValid && (
                  <Badge variant={result.matches.length > 0 ? "default" : "secondary"}>
                    {result.matches.length} match{result.matches.length !== 1 ? 'es' : ''}
                  </Badge>
                )}
              </div>
              <CardDescription>Found matches and their details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.isValid ? (
                result.matches.length > 0 ? (
                  <div className="space-y-3">
                    {result.matches.map((match, index) => (
                      <div key={index} className="bg-muted rounded-md p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Match {index + 1}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(match.match, `Match ${index + 1}`)}
                            className="gap-2"
                          >
                            {copied === `Match ${index + 1}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="font-medium">Text:</span> 
                            <code className="bg-background px-1 rounded ml-1">{match.match}</code>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Index:</span> 
                            <code className="bg-background px-1 rounded ml-1">{match.index}</code>
                          </div>
                          {match.groups.length > 0 && (
                            <div className="text-sm">
                              <span className="font-medium">Groups:</span>
                              <div className="ml-2 mt-1 space-y-1">
                                {match.groups.map((group, groupIndex) => (
                                  <div key={groupIndex} className="text-xs">
                                    <code className="bg-background px-1 rounded">${groupIndex + 1}: {group}</code>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No matches found</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Invalid regex pattern</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Highlighted Text */}
          {result.isValid && result.matches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Highlighted Text</CardTitle>
                <CardDescription>Test string with matches highlighted</CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="bg-code-bg rounded-md p-3 min-h-[100px] font-mono text-sm"
                  dangerouslySetInnerHTML={{ 
                    __html: highlightMatches(testString, result.matches) 
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* Replacement Result */}
          {result.isValid && replaceString !== "" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Replacement Result</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(result.replaced, "Replaced")}
                    className="gap-2"
                  >
                    {copied === "Replaced" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied === "Replaced" ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <CardDescription>Result after applying replacement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-code-bg rounded-md p-3 min-h-[100px] font-mono text-sm">
                  {result.replaced}
                </div>
              </CardContent>
            </Card>
          )}
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
              <Label className="text-sm font-medium">Common Patterns</Label>
              <div className="space-y-1">
                {[
                  { pattern: "\\d+", test: "123 abc 456", desc: "Numbers" },
                  { pattern: "[a-zA-Z]+", test: "Hello123World", desc: "Letters" },
                  { pattern: "\\b\\w+@\\w+\\.\\w+\\b", test: "Contact: user@example.com", desc: "Email" }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPattern(example.pattern);
                      setTestString(example.test);
                    }}
                    className="w-full justify-start text-xs"
                  >
                    {example.desc}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Validation</Label>
              <div className="space-y-1">
                {[
                  { pattern: "^\\d{4}-\\d{2}-\\d{2}$", test: "2023-12-25", desc: "Date (YYYY-MM-DD)" },
                  { pattern: "^\\+?[1-9]\\d{1,14}$", test: "+1234567890", desc: "Phone Number" },
                  { pattern: "^[A-Z]{2}\\d{2}[A-Z0-9]{4}\\d{7}$", test: "GB82WEST12345698765432", desc: "IBAN" }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPattern(example.pattern);
                      setTestString(example.test);
                    }}
                    className="w-full justify-start text-xs"
                  >
                    {example.desc}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Extraction</Label>
              <div className="space-y-1">
                {[
                  { pattern: "(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})", test: "IP: 192.168.1.1", desc: "IP Address" },
                  { pattern: "#([a-fA-F0-9]{6})", test: "Color: #FF5733", desc: "Hex Color" },
                  { pattern: "\\$\\{([^}]+)\\}", test: "Hello ${name}!", desc: "Template Variables" }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPattern(example.pattern);
                      setTestString(example.test);
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
