import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Copy, Check, FileText, RotateCcw, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DiffResult {
  added: number;
  removed: number;
  unchanged: number;
  changes: Array<{
    type: 'added' | 'removed' | 'unchanged';
    content: string;
    lineNumber?: number;
  }>;
}

const TextDiffTool = () => {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffResult, setDiffResult] = useState<DiffResult>({
    added: 0,
    removed: 0,
    unchanged: 0,
    changes: []
  });
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  // Simple diff algorithm implementation
  const computeDiff = (text1: string, text2: string): DiffResult => {
    if (!text1 && !text2) {
      return { added: 0, removed: 0, unchanged: 0, changes: [] };
    }

    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    
    const changes: Array<{
      type: 'added' | 'removed' | 'unchanged';
      content: string;
      lineNumber?: number;
    }> = [];

    let i = 0, j = 0;
    let added = 0, removed = 0, unchanged = 0;

    while (i < lines1.length || j < lines2.length) {
      if (i >= lines1.length) {
        // Only text2 has content
        changes.push({
          type: 'added',
          content: lines2[j],
          lineNumber: j + 1
        });
        added++;
        j++;
      } else if (j >= lines2.length) {
        // Only text1 has content
        changes.push({
          type: 'removed',
          content: lines1[i],
          lineNumber: i + 1
        });
        removed++;
        i++;
      } else if (lines1[i] === lines2[j]) {
        // Lines are identical
        changes.push({
          type: 'unchanged',
          content: lines1[i],
          lineNumber: i + 1
        });
        unchanged++;
        i++;
        j++;
      } else {
        // Lines are different - need to find the best match
        let found = false;
        
        // Look ahead in text2 for a match
        for (let k = j + 1; k < Math.min(j + 10, lines2.length); k++) {
          if (lines1[i] === lines2[k]) {
            // Add lines from text2 as additions
            for (let l = j; l < k; l++) {
              changes.push({
                type: 'added',
                content: lines2[l],
                lineNumber: l + 1
              });
              added++;
            }
            j = k;
            found = true;
            break;
          }
        }
        
        if (!found) {
          // Look ahead in text1 for a match
          for (let k = i + 1; k < Math.min(i + 10, lines1.length); k++) {
            if (lines1[k] === lines2[j]) {
              // Add lines from text1 as removals
              for (let l = i; l < k; l++) {
                changes.push({
                  type: 'removed',
                  content: lines1[l],
                  lineNumber: l + 1
                });
                removed++;
              }
              i = k;
              found = true;
              break;
            }
          }
        }
        
        if (!found) {
          // No match found, treat as replacement
          changes.push({
            type: 'removed',
            content: lines1[i],
            lineNumber: i + 1
          });
          changes.push({
            type: 'added',
            content: lines2[j],
            lineNumber: j + 1
          });
          removed++;
          added++;
          i++;
          j++;
        }
      }
    }

    return { added, removed, unchanged, changes };
  };

  const performDiff = () => {
    const result = computeDiff(text1, text2);
    setDiffResult(result);
  };

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
    setText1("");
    setText2("");
    setDiffResult({
      added: 0,
      removed: 0,
      unchanged: 0,
      changes: []
    });
  };

  const swapTexts = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
  };

  const getDiffStats = () => {
    const total = diffResult.added + diffResult.removed + diffResult.unchanged;
    if (total === 0) return "No changes";
    
    const changes = diffResult.added + diffResult.removed;
    const unchanged = diffResult.unchanged;
    
    return `${changes} changed, ${unchanged} unchanged`;
  };

  const getDiffSummary = () => {
    if (diffResult.added === 0 && diffResult.removed === 0) {
      return "Files are identical";
    }
    
    const summary = [];
    if (diffResult.added > 0) summary.push(`+${diffResult.added} added`);
    if (diffResult.removed > 0) summary.push(`-${diffResult.removed} removed`);
    
    return summary.join(", ");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Text Diff Tool</h2>
        <p className="text-muted-foreground">
          Compare two text documents and see the differences with highlighting
        </p>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Original Text</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(text1, "Original Text")}
                className="gap-2"
              >
                {copied === "Original Text" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <CardDescription>First version of the text</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Enter the original text here..."
              className="font-mono min-h-[300px] resize-none"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Modified Text</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(text2, "Modified Text")}
                className="gap-2"
              >
                {copied === "Modified Text" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <CardDescription>Second version of the text</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Enter the modified text here..."
              className="font-mono min-h-[300px] resize-none"
            />
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Diff Controls</CardTitle>
          <CardDescription>Compare the texts and configure the display</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap items-center">
            <Button onClick={performDiff} disabled={!text1.trim() && !text2.trim()}>
              <FileText className="h-4 w-4 mr-2" />
              Compare Texts
            </Button>
            <Button variant="outline" onClick={swapTexts} disabled={!text1.trim() || !text2.trim()}>
              Swap Texts
            </Button>
            <Button variant="outline" onClick={clearAll}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLineNumbers(!showLineNumbers)}
                className="gap-2"
              >
                {showLineNumbers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showLineNumbers ? "Hide" : "Show"} Line Numbers
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diff Results */}
      {diffResult.changes.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Diff Results</CardTitle>
              <div className="flex gap-2">
                <Badge variant="destructive">-{diffResult.removed} removed</Badge>
                <Badge variant="default">+{diffResult.added} added</Badge>
                <Badge variant="secondary">{diffResult.unchanged} unchanged</Badge>
              </div>
            </div>
            <CardDescription>{getDiffSummary()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-code-bg rounded-md border overflow-auto max-h-[500px]">
              <div className="p-4 space-y-1">
                {diffResult.changes.map((change, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2 p-1 rounded text-sm font-mono ${
                      change.type === 'added'
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                        : change.type === 'removed'
                        ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                        : 'text-foreground'
                    }`}
                  >
                    {showLineNumbers && change.lineNumber && (
                      <span className="text-muted-foreground text-xs w-8 flex-shrink-0">
                        {change.lineNumber}
                      </span>
                    )}
                    <span className="w-4 flex-shrink-0 text-center">
                      {change.type === 'added' && '+'}
                      {change.type === 'removed' && '-'}
                      {change.type === 'unchanged' && ' '}
                    </span>
                    <span className="flex-1 whitespace-pre-wrap">
                      {change.content}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
              <span>{getDiffStats()}</span>
              <div className="flex gap-4">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-red-100 dark:bg-red-900/20 rounded"></span>
                  Removed
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-green-100 dark:bg-green-900/20 rounded"></span>
                  Added
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-transparent border rounded"></span>
                  Unchanged
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Examples</CardTitle>
          <CardDescription>Click on any example to load sample texts for comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Code Changes</Label>
              <div className="space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setText1("function hello() {\n  console.log('Hello');\n}");
                    setText2("function hello(name) {\n  console.log(`Hello ${name}`);\n}");
                  }}
                  className="w-full justify-start text-xs"
                >
                  Function Parameter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setText1("const x = 5;\nconst y = 10;\nconst sum = x + y;");
                    setText2("const x = 5;\nconst y = 10;\nconst z = 15;\nconst sum = x + y + z;");
                  }}
                  className="w-full justify-start text-xs"
                >
                  Variable Addition
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Text Changes</Label>
              <div className="space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setText1("The quick brown fox jumps over the lazy dog.");
                    setText2("The quick brown fox jumps over the lazy cat.");
                  }}
                  className="w-full justify-start text-xs"
                >
                  Word Replacement
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setText1("Line 1\nLine 2\nLine 3");
                    setText2("Line 1\nNew Line\nLine 2\nLine 3");
                  }}
                  className="w-full justify-start text-xs"
                >
                  Line Insertion
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Configuration</Label>
              <div className="space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setText1("debug: true\nport: 3000\nhost: localhost");
                    setText2("debug: false\nport: 8080\nhost: localhost\nssl: true");
                  }}
                  className="w-full justify-start text-xs"
                >
                  Config Changes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setText1("Same content");
                    setText2("Same content");
                  }}
                  className="w-full justify-start text-xs"
                >
                  Identical Files
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TextDiffTool;
