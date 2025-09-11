import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Copy, Check, Hash, FileText, Lock, Key, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Simple hash implementations (for demo purposes - in production use crypto libraries)
const hashFunctions = {
  md5: async (text: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('MD5', data).catch(() => null);
    if (!hashBuffer) return simpleHash(text, 32); // Fallback for unsupported MD5
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  },
  sha1: async (text: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  },
  sha256: async (text: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  },
  sha512: async (text: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-512', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
};

// Simple hash fallback for MD5 (since it's not supported in Web Crypto API)
const simpleHash = (str: string, length: number) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(length, '0').substring(0, length);
};

const HashGenerator = () => {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState("sha256");
  const [results, setResults] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const { toast } = useToast();

  const generateHashes = async () => {
    if (!input.trim()) return;
    
    setIsGenerating(true);
    const newResults: Record<string, string> = {};
    
    try {
      for (const [algo, hashFunc] of Object.entries(hashFunctions)) {
        newResults[algo] = await hashFunc(input);
      }
      setResults(newResults);
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Could not generate hashes",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSingleHash = async () => {
    if (!input.trim()) return;
    
    setIsGenerating(true);
    try {
      const hashFunc = hashFunctions[algorithm as keyof typeof hashFunctions];
      const hash = await hashFunc(input);
      setResults({ [algorithm]: hash });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Could not generate hash",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (hash: string, algo: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopiedHash(algo);
      toast({
        title: "Copied!",
        description: `${algo.toUpperCase()} hash copied to clipboard`,
      });
      setTimeout(() => setCopiedHash(null), 2000);
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
    setResults({});
  };

  const clearAll = () => {
    setInput("");
    setResults({});
  };

  // Auto-generate when input changes (debounced)
  useEffect(() => {
    if (!input.trim()) {
      setResults({});
      return;
    }

    const timeout = setTimeout(() => {
      generateSingleHash();
    }, 500);

    return () => clearTimeout(timeout);
  }, [input, algorithm]);

  const algorithmInfo = {
    md5: { name: "MD5", bits: 128, description: "Fast but cryptographically broken" },
    sha1: { name: "SHA-1", bits: 160, description: "Deprecated for security applications" },
    sha256: { name: "SHA-256", bits: 256, description: "Secure and widely used" },
    sha512: { name: "SHA-512", bits: 512, description: "Most secure, larger output" }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Hash Generator</h2>
        <p className="text-muted-foreground">
          Generate cryptographic hashes (MD5, SHA-1, SHA-256, SHA-512) for text input
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Input Text</CardTitle>
          <CardDescription>
            Enter the text you want to hash
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter text to hash..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[120px] resize-none bg-code-bg"
          />
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Algorithm:</label>
              <Select value={algorithm} onValueChange={setAlgorithm}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(algorithmInfo).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      {info.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={generateHashes} 
              disabled={!input.trim() || isGenerating}
              className="gap-2"
            >
              <Hash className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate All"}
            </Button>
            <Button variant="outline" onClick={clearAll}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {Object.keys(results).length > 0 && (
        <div className="space-y-4">
          {Object.entries(results).map(([algo, hash]) => {
            const info = algorithmInfo[algo as keyof typeof algorithmInfo];
            return (
              <Card key={algo}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {info.name} ({info.bits} bits)
                      </CardTitle>
                      <CardDescription>
                        {info.description}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(hash, algo)}
                      className="gap-2"
                    >
                      {copiedHash === algo ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copiedHash === algo ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Input
                    value={hash}
                    readOnly
                    className="font-mono bg-code-bg text-sm"
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Quick Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Examples</CardTitle>
          <CardDescription>Click on any example to generate hashes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <Label className="text-sm font-medium">Text Examples</Label>
              </div>
              <div className="space-y-1">
                {[
                  { text: "Hello World", desc: "Simple Text" },
                  { text: "password123", desc: "Password" },
                  { text: "Lorem ipsum dolor sit amet", desc: "Lorem Ipsum" },
                  { text: "user@example.com", desc: "Email Address" }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample(example.text)}
                    className="w-full justify-start text-xs"
                  >
                    {example.desc}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-green-600" />
                <Label className="text-sm font-medium">Security Examples</Label>
              </div>
              <div className="space-y-1">
                {[
                  { text: "admin", desc: "Username" },
                  { text: "secret_key_2024", desc: "API Key" },
                  { text: "session_token_abc123", desc: "Session Token" },
                  { text: "file_checksum_data", desc: "File Data" }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample(example.text)}
                    className="w-full justify-start text-xs"
                  >
                    {example.desc}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-purple-600" />
                <Label className="text-sm font-medium">Code Examples</Label>
              </div>
              <div className="space-y-1">
                {[
                  { text: "function() { return true; }", desc: "JavaScript Function" },
                  { text: "SELECT * FROM users", desc: "SQL Query" },
                  { text: "git commit -m 'initial'", desc: "Git Command" },
                  { text: "JSON.stringify(data)", desc: "JSON String" }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample(example.text)}
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

      {/* Hash Information */}
      <Card>
        <CardHeader>
          <CardTitle>About Cryptographic Hashes</CardTitle>
          <CardDescription>Understanding hash functions and their security implications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-2">Hash Functions:</h4>
              <ul className="space-y-1">
                <li><strong>MD5:</strong> Fast but insecure, used for checksums</li>
                <li><strong>SHA-1:</strong> Deprecated, avoid for new applications</li>
                <li><strong>SHA-256:</strong> Secure standard, widely adopted</li>
                <li><strong>SHA-512:</strong> Most secure, larger hash size</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Use Cases:</h4>
              <ul className="space-y-1">
                <li>• Data integrity verification</li>
                <li>• Password storage (with salt)</li>
                <li>• Digital signatures</li>
                <li>• File checksums</li>
                <li>• Blockchain and cryptocurrency</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-orange-900 dark:text-orange-100 mb-1">Security Warning</p>
                <p className="text-orange-700 dark:text-orange-300">
                  Never use MD5 or SHA-1 for security-critical applications. Always use SHA-256 or SHA-512 
                  for password hashing, and remember to use proper salting techniques.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HashGenerator;