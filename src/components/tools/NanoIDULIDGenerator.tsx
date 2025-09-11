import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Hash, 
  Copy, 
  Check, 
  Download, 
  Upload, 
  RefreshCw, 
  Settings, 
  Zap, 
  Info, 
  AlertCircle, 
  CheckCircle, 
  RotateCcw, 
  Play, 
  Square, 
  Volume2, 
  VolumeX, 
  Trash2, 
  Edit, 
  Save, 
  Loader2, 
  Target, 
  Activity, 
  PieChart, 
  LineChart, 
  Scatter, 
  Bell, 
  Hash as HashIcon, 
  Percent, 
  Sigma, 
  Function, 
  Grid3X3, 
  List, 
  Table, 
  BookOpen, 
  Lightbulb, 
  ArrowRight, 
  ArrowDown, 
  ArrowUp, 
  ArrowLeft, 
  Palette, 
  Layers, 
  Database, 
  Network, 
  Shield, 
  Lock, 
  Key, 
  Star, 
  Heart, 
  Smile, 
  Frown, 
  Meh, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  MapPin, 
  Clock, 
  Calendar, 
  Mail, 
  Phone, 
  CreditCard, 
  DollarSign, 
  Percent as PercentIcon, 
  Plus, 
  Minus, 
  X, 
  Divide, 
  Equal, 
  LessThan, 
  GreaterThan, 
  QuestionMark, 
  AlertTriangle, 
  AtSign, 
  Hash as HashIcon2, 
  DollarSign as DollarIcon, 
  Percent as PercentIcon2, 
  Ampersand, 
  Asterisk, 
  Parentheses, 
  Brackets, 
  Braces, 
  Quotes, 
  Apostrophe, 
  Backslash, 
  ForwardSlash, 
  Pipe, 
  Tilde, 
  Backtick, 
  Underscore, 
  Period, 
  Comma, 
  Semicolon, 
  Colon, 
  Space,
  FileText,
  Code,
  Globe,
  Eye,
  BarChart3,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GeneratorConfig {
  type: "nanoid" | "ulid";
  size: number;
  alphabet: string;
  customAlphabet: string;
  useCustomAlphabet: boolean;
  batchSize: number;
  prefix: string;
  suffix: string;
  separator: string;
  timestamp: boolean;
  random: boolean;
}

interface GeneratedID {
  id: string;
  timestamp: number;
  type: "nanoid" | "ulid";
  length: number;
  entropy: number;
}

interface AnalysisResult {
  totalGenerated: number;
  uniqueCount: number;
  averageLength: number;
  minLength: number;
  maxLength: number;
  collisionRate: number;
  entropy: number;
  characterDistribution: { [key: string]: number };
}

const NanoIDULIDGenerator = () => {
  const [config, setConfig] = useState<GeneratorConfig>({
    type: "nanoid",
    size: 21,
    alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    customAlphabet: "",
    useCustomAlphabet: false,
    batchSize: 10,
    prefix: "",
    suffix: "",
    separator: "",
    timestamp: false,
    random: true
  });

  const [generatedIDs, setGeneratedIDs] = useState<GeneratedID[]>([]);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { toast } = useToast();

  // Predefined alphabets
  const predefinedAlphabets = {
    "url-safe": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
    "numeric": "0123456789",
    "hex": "0123456789abcdef",
    "hex-upper": "0123456789ABCDEF",
    "alpha": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    "alpha-upper": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "alpha-lower": "abcdefghijklmnopqrstuvwxyz",
    "alphanumeric": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    "base64": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    "base32": "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
    "custom": ""
  };

  // ULID generation function
  const generateULID = (): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Convert timestamp to base32
    let timeStr = "";
    let time = timestamp;
    const base32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
    
    for (let i = 0; i < 10; i++) {
      timeStr = base32[time % 32] + timeStr;
      time = Math.floor(time / 32);
    }
    
    // Generate random part
    let randomStr = "";
    for (let i = 0; i < 16; i++) {
      randomStr += base32[Math.floor(Math.random() * 32)];
    }
    
    return timeStr + randomStr;
  };

  // NanoID generation function
  const generateNanoID = (size: number, alphabet: string): string => {
    let id = "";
    for (let i = 0; i < size; i++) {
      id += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return id;
  };

  // Generate single ID
  const generateSingleID = (): GeneratedID => {
    const timestamp = Date.now();
    let id: string;
    let length: number;
    let entropy: number;

    if (config.type === "ulid") {
      id = generateULID();
      length = 26; // ULID is always 26 characters
      entropy = Math.log2(32) * 16; // 16 random characters in base32
    } else {
      const alphabet = config.useCustomAlphabet ? config.customAlphabet : config.alphabet;
      id = generateNanoID(config.size, alphabet);
      length = id.length;
      entropy = Math.log2(alphabet.length) * config.size;
    }

    // Add prefix and suffix
    if (config.prefix) {
      id = config.prefix + (config.separator || "") + id;
    }
    if (config.suffix) {
      id = id + (config.separator || "") + config.suffix;
    }

    return {
      id,
      timestamp,
      type: config.type,
      length: id.length,
      entropy
    };
  };

  // Generate batch of IDs
  const generateBatch = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const newIDs: GeneratedID[] = [];
      for (let i = 0; i < config.batchSize; i++) {
        newIDs.push(generateSingleID());
      }
      
      setGeneratedIDs(prev => [...prev, ...newIDs]);
      setIsGenerating(false);
      
      toast({
        title: "IDs generated",
        description: `${config.batchSize} ${config.type.toUpperCase()} IDs generated`,
      });
    }, 100);
  };

  // Generate single ID
  const generateOne = () => {
    const newID = generateSingleID();
    setGeneratedIDs(prev => [newID, ...prev]);
    
    toast({
      title: "ID generated",
      description: `New ${config.type.toUpperCase()} ID generated`,
    });
  };

  // Clear all generated IDs
  const clearAll = () => {
    setGeneratedIDs([]);
    toast({
      title: "Cleared",
      description: "All generated IDs have been removed",
    });
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
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

  // Export generated IDs
  const exportIDs = () => {
    const data = {
      config,
      generatedIDs,
      analysis: analysisResult
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nanoid-ulid-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exported!",
      description: "Generated IDs have been exported",
    });
  };

  // Analyze generated IDs
  const analysisResult = useMemo((): AnalysisResult | null => {
    if (generatedIDs.length === 0) return null;

    const uniqueIDs = new Set(generatedIDs.map(id => id.id));
    const lengths = generatedIDs.map(id => id.length);
    const entropies = generatedIDs.map(id => id.entropy);
    
    // Character distribution
    const charDist: { [key: string]: number } = {};
    generatedIDs.forEach(id => {
      for (const char of id.id) {
        charDist[char] = (charDist[char] || 0) + 1;
      }
    });

    return {
      totalGenerated: generatedIDs.length,
      uniqueCount: uniqueIDs.size,
      averageLength: lengths.reduce((a, b) => a + b, 0) / lengths.length,
      minLength: Math.min(...lengths),
      maxLength: Math.max(...lengths),
      collisionRate: (generatedIDs.length - uniqueIDs.size) / generatedIDs.length,
      entropy: entropies.reduce((a, b) => a + b, 0) / entropies.length,
      characterDistribution: charDist
    };
  }, [generatedIDs]);

  // Update config
  const updateConfig = (field: keyof GeneratorConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Load example configuration
  const loadExample = () => {
    setConfig({
      type: "nanoid",
      size: 12,
      alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
      customAlphabet: "",
      useCustomAlphabet: false,
      batchSize: 5,
      prefix: "user_",
      suffix: "",
      separator: "",
      timestamp: false,
      random: true
    });
    
    toast({
      title: "Example loaded",
      description: "Sample configuration has been loaded",
    });
  };

  // Reset configuration
  const resetConfig = () => {
    setConfig({
      type: "nanoid",
      size: 21,
      alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
      customAlphabet: "",
      useCustomAlphabet: false,
      batchSize: 10,
      prefix: "",
      suffix: "",
      separator: "",
      timestamp: false,
      random: true
    });
    
    toast({
      title: "Configuration reset",
      description: "All settings have been reset to defaults",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">NanoID / ULID Generator</h2>
        <p className="text-muted-foreground">
          Generate unique identifiers using NanoID and ULID algorithms with comprehensive customization options
        </p>
      </div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="generated">Generated IDs</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        {/* Generator Configuration */}
        <TabsContent value="generator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Configure ID generation parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ID Type</Label>
                  <Select value={config.type} onValueChange={(value: "nanoid" | "ulid") => updateConfig("type", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nanoid">NanoID</SelectItem>
                      <SelectItem value="ulid">ULID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Batch Size</Label>
                  <Input
                    type="number"
                    min="1"
                    max="1000"
                    value={config.batchSize}
                    onChange={(e) => updateConfig("batchSize", parseInt(e.target.value) || 10)}
                  />
                </div>
              </div>

              {config.type === "nanoid" && (
                <>
                  <div className="space-y-2">
                    <Label>Size (Length)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={config.size}
                      onChange={(e) => updateConfig("size", parseInt(e.target.value) || 21)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Alphabet</Label>
                    <Select 
                      value={config.useCustomAlphabet ? "custom" : Object.keys(predefinedAlphabets).find(key => predefinedAlphabets[key as keyof typeof predefinedAlphabets] === config.alphabet) || "url-safe"}
                      onValueChange={(value) => {
                        if (value === "custom") {
                          updateConfig("useCustomAlphabet", true);
                        } else {
                          updateConfig("useCustomAlphabet", false);
                          updateConfig("alphabet", predefinedAlphabets[value as keyof typeof predefinedAlphabets]);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(predefinedAlphabets).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {key.charAt(0).toUpperCase() + key.slice(1).replace("-", " ")} {value && `(${value.length} chars)`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {config.useCustomAlphabet && (
                    <div className="space-y-2">
                      <Label>Custom Alphabet</Label>
                      <Input
                        placeholder="Enter custom alphabet characters..."
                        value={config.customAlphabet}
                        onChange={(e) => updateConfig("customAlphabet", e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        {config.customAlphabet.length} characters
                      </p>
                    </div>
                  )}
                </>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Prefix</Label>
                  <Input
                    placeholder="user_"
                    value={config.prefix}
                    onChange={(e) => updateConfig("prefix", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Separator</Label>
                  <Input
                    placeholder="_"
                    value={config.separator}
                    onChange={(e) => updateConfig("separator", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Suffix</Label>
                  <Input
                    placeholder="_v1"
                    value={config.suffix}
                    onChange={(e) => updateConfig("suffix", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={generateOne} className="gap-2">
                  <Hash className="h-4 w-4" />
                  Generate One
                </Button>
                <Button onClick={generateBatch} disabled={isGenerating} className="gap-2">
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  Generate Batch
                </Button>
                <Button variant="outline" onClick={loadExample} className="gap-2">
                  <FileText className="h-4 w-4" />
                  Load Example
                </Button>
                <Button variant="outline" onClick={resetConfig} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generated IDs */}
        <TabsContent value="generated" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generated IDs</CardTitle>
                  <CardDescription>
                    {generatedIDs.length} IDs generated
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={clearAll} className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Clear All
                  </Button>
                  <Button variant="outline" onClick={exportIDs} className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {generatedIDs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Hash className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No IDs generated yet. Use the Generator tab to create some IDs.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {generatedIDs.map((id, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={id.type === "nanoid" ? "default" : "secondary"}>
                          {id.type.toUpperCase()}
                        </Badge>
                        <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                          {id.id}
                        </code>
                        <span className="text-sm text-muted-foreground">
                          {id.length} chars
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {id.entropy.toFixed(1)} bits
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(id.id, "ID")}
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis */}
        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analysis</CardTitle>
              <CardDescription>Statistical analysis of generated IDs</CardDescription>
            </CardHeader>
            <CardContent>
              {!analysisResult ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Generate some IDs to see analysis results.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-muted-foreground">Total Generated</Label>
                      <p className="text-2xl font-bold">{analysisResult.totalGenerated}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-muted-foreground">Unique Count</Label>
                      <p className="text-2xl font-bold">{analysisResult.uniqueCount}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-muted-foreground">Collision Rate</Label>
                      <p className="text-2xl font-bold">{(analysisResult.collisionRate * 100).toFixed(2)}%</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-muted-foreground">Average Entropy</Label>
                      <p className="text-2xl font-bold">{analysisResult.entropy.toFixed(1)} bits</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-muted-foreground">Average Length</Label>
                      <p className="text-lg font-semibold">{analysisResult.averageLength.toFixed(1)}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-muted-foreground">Min Length</Label>
                      <p className="text-lg font-semibold">{analysisResult.minLength}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-muted-foreground">Max Length</Label>
                      <p className="text-lg font-semibold">{analysisResult.maxLength}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-muted-foreground">Character Distribution</Label>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                      {Object.entries(analysisResult.characterDistribution)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 32)
                        .map(([char, count]) => (
                          <div key={char} className="text-center p-2 border rounded">
                            <div className="font-mono text-sm">{char}</div>
                            <div className="text-xs text-muted-foreground">{count}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* NanoID/ULID Reference */}
      <Card>
        <CardHeader>
          <CardTitle>NanoID / ULID Reference</CardTitle>
          <CardDescription>Understanding unique identifier generation and best practices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">NanoID</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Size:</strong> Configurable length (default 21 characters)</li>
                <li>• <strong>Alphabet:</strong> URL-safe characters by default</li>
                <li>• <strong>Entropy:</strong> ~5.95 bits per character</li>
                <li>• <strong>Collision:</strong> 1 in 1 billion at 21 chars</li>
                <li>• <strong>Performance:</strong> Fast generation and small size</li>
                <li>• <strong>Use Cases:</strong> Database IDs, API keys, session tokens</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">ULID</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Size:</strong> Fixed 26 characters</li>
                <li>• <strong>Format:</strong> Timestamp (10) + Random (16)</li>
                <li>• <strong>Sortable:</strong> Lexicographically sortable</li>
                <li>• <strong>Timestamp:</strong> 48-bit timestamp (milliseconds)</li>
                <li>• <strong>Random:</strong> 80-bit random component</li>
                <li>• <strong>Use Cases:</strong> Database primary keys, distributed systems</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Pro Tip</p>
                <p className="text-blue-700 dark:text-blue-300">
                  Use NanoID for general-purpose unique identifiers with custom alphabets and lengths. 
                  Use ULID when you need lexicographically sortable IDs with embedded timestamps. 
                  Both are cryptographically secure and suitable for production use.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NanoIDULIDGenerator;