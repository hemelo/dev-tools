import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Copy, Check, Download, RotateCcw, Plus, Minus, Eye, Code, Globe, 
  Upload, Settings, Zap, BookOpen, Palette, Ruler, Layers, Target, 
  AlertCircle, FileImage, Trash2, RefreshCw, Maximize, Minimize,
  Download as DownloadIcon, FolderOpen, ImageIcon, Send, Shield,
  Clock, Activity, Server, Key, Lock, Unlock, Play, Pause, Square,
  Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, BarChart3, TrendingUp,
  Hash, Shuffle, Calculator, History, Save, FileText, BarChart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RandomNumberConfig {
  type: 'integer' | 'float' | 'boolean' | 'uuid' | 'hex' | 'binary';
  min: number;
  max: number;
  precision: number;
  count: number;
  seed?: string;
  excludeDuplicates: boolean;
  sort: boolean;
  format: 'plain' | 'json' | 'csv' | 'array';
}

interface GeneratedNumber {
  id: string;
  value: string | number | boolean;
  timestamp: number;
  seed?: string;
}

interface Statistics {
  count: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  mode: number;
  standardDeviation: number;
  variance: number;
  range: number;
  sum: number;
}

const NUMBER_TYPES = [
  { 
    value: 'integer', 
    label: 'Integer', 
    description: 'Whole numbers within a range',
    icon: Hash
  },
  { 
    value: 'float', 
    label: 'Float', 
    description: 'Decimal numbers with precision control',
    icon: Calculator
  },
  { 
    value: 'boolean', 
    label: 'Boolean', 
    description: 'True or false values',
    icon: Square
  },
  { 
    value: 'uuid', 
    label: 'UUID', 
    description: 'Universally unique identifiers',
    icon: Key
  },
  { 
    value: 'hex', 
    label: 'Hexadecimal', 
    description: 'Hexadecimal color codes or values',
    icon: Palette
  },
  { 
    value: 'binary', 
    label: 'Binary', 
    description: 'Binary strings of specified length',
    icon: Code
  }
];

const FORMAT_OPTIONS = [
  { value: 'plain', label: 'Plain Text' },
  { value: 'json', label: 'JSON Array' },
  { value: 'csv', label: 'CSV' },
  { value: 'array', label: 'JavaScript Array' }
];

const PRESET_CONFIGS = [
  {
    name: 'Dice Roll',
    description: 'Simulate dice rolls (1-6)',
    config: {
      type: 'integer' as const,
      min: 1,
      max: 6,
      precision: 0,
      count: 1,
      excludeDuplicates: false,
      sort: false,
      format: 'plain' as const
    }
  },
  {
    name: 'Lottery Numbers',
    description: 'Generate lottery numbers (1-49)',
    config: {
      type: 'integer' as const,
      min: 1,
      max: 49,
      precision: 0,
      count: 6,
      excludeDuplicates: true,
      sort: true,
      format: 'array' as const
    }
  },
  {
    name: 'Password Salt',
    description: 'Generate random hex for password salting',
    config: {
      type: 'hex' as const,
      min: 16,
      max: 32,
      precision: 0,
      count: 1,
      excludeDuplicates: false,
      sort: false,
      format: 'plain' as const
    }
  },
  {
    name: 'API Keys',
    description: 'Generate UUIDs for API keys',
    config: {
      type: 'uuid' as const,
      min: 0,
      max: 0,
      precision: 0,
      count: 5,
      excludeDuplicates: true,
      sort: false,
      format: 'json' as const
    }
  },
  {
    name: 'Test Data',
    description: 'Generate random test data (0-100)',
    config: {
      type: 'float' as const,
      min: 0,
      max: 100,
      precision: 2,
      count: 10,
      excludeDuplicates: false,
      sort: false,
      format: 'csv' as const
    }
  },
  {
    name: 'Coin Flip',
    description: 'Simulate coin flips',
    config: {
      type: 'boolean' as const,
      min: 0,
      max: 1,
      precision: 0,
      count: 10,
      excludeDuplicates: false,
      sort: false,
      format: 'array' as const
    }
  }
];

const RandomNumberGenerator = () => {
  const [config, setConfig] = useState<RandomNumberConfig>({
    type: 'integer',
    min: 1,
    max: 100,
    precision: 0,
    count: 1,
    excludeDuplicates: false,
    sort: false,
    format: 'plain'
  });

  const [generatedNumbers, setGeneratedNumbers] = useState<GeneratedNumber[]>([]);
  const [history, setHistory] = useState<GeneratedNumber[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [activeTab, setActiveTab] = useState("generator");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const historyRef = useRef<GeneratedNumber[]>([]);

  // Generate unique ID
  const generateId = useCallback(() => {
    return Math.random().toString(36).substr(2, 9);
  }, []);

  // Generate UUID v4
  const generateUUID = useCallback(() => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }, []);

  // Generate hex string
  const generateHex = useCallback((length: number) => {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }, []);

  // Generate binary string
  const generateBinary = useCallback((length: number) => {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 2).toString();
    }
    return result;
  }, []);

  // Seeded random number generator (Linear Congruential Generator)
  const seededRandom = useCallback((seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return () => {
      hash = (hash * 1664525 + 1013904223) % 2147483647;
      return hash / 2147483647;
    };
  }, []);

  // Calculate statistics
  const calculateStatistics = useCallback((numbers: (string | number | boolean)[]) => {
    const numericValues = numbers
      .filter(n => typeof n === 'number')
      .map(n => n as number);

    if (numericValues.length === 0) return null;

    const sorted = [...numericValues].sort((a, b) => a - b);
    const count = numericValues.length;
    const sum = numericValues.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;
    const median = count % 2 === 0 
      ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
      : sorted[Math.floor(count / 2)];
    
    // Calculate mode
    const frequency: Record<number, number> = {};
    numericValues.forEach(val => {
      frequency[val] = (frequency[val] || 0) + 1;
    });
    const mode = Object.keys(frequency).reduce((a, b) => 
      frequency[parseFloat(a)] > frequency[parseFloat(b)] ? a : b
    );

    const variance = numericValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const standardDeviation = Math.sqrt(variance);
    const range = Math.max(...numericValues) - Math.min(...numericValues);

    return {
      count,
      min: Math.min(...numericValues),
      max: Math.max(...numericValues),
      mean,
      median,
      mode: parseFloat(mode),
      standardDeviation,
      variance,
      range,
      sum
    };
  }, []);

  // Generate random numbers
  const generateNumbers = useCallback(() => {
    setIsGenerating(true);
    
    try {
      const numbers: GeneratedNumber[] = [];
      const randomFunc = config.seed ? seededRandom(config.seed) : Math.random;
      const values: (string | number | boolean)[] = [];

      for (let i = 0; i < config.count; i++) {
        let value: string | number | boolean;

        switch (config.type) {
          case 'integer':
            value = Math.floor(randomFunc() * (config.max - config.min + 1)) + config.min;
            break;
          case 'float':
            value = parseFloat((randomFunc() * (config.max - config.min) + config.min).toFixed(config.precision));
            break;
          case 'boolean':
            value = randomFunc() > 0.5;
            break;
          case 'uuid':
            value = generateUUID();
            break;
          case 'hex':
            const hexLength = Math.floor(randomFunc() * (config.max - config.min + 1)) + config.min;
            value = generateHex(hexLength);
            break;
          case 'binary':
            const binaryLength = Math.floor(randomFunc() * (config.max - config.min + 1)) + config.min;
            value = generateBinary(binaryLength);
            break;
          default:
            value = 0;
        }

        // Check for duplicates if required
        if (config.excludeDuplicates && values.includes(value)) {
          i--; // Retry this iteration
          continue;
        }

        values.push(value);

        numbers.push({
          id: generateId(),
          value,
          timestamp: Date.now(),
          seed: config.seed
        });
      }

      // Sort if required
      if (config.sort && config.type !== 'boolean' && config.type !== 'uuid') {
        numbers.sort((a, b) => {
          if (typeof a.value === 'number' && typeof b.value === 'number') {
            return a.value - b.value;
          }
          return String(a.value).localeCompare(String(b.value));
        });
      }

      setGeneratedNumbers(numbers);
      setHistory(prev => [...numbers, ...prev]);
      historyRef.current = [...numbers, ...historyRef.current];

      // Calculate statistics for numeric values
      const stats = calculateStatistics(values);
      setStatistics(stats);

      toast({
        title: "Numbers Generated",
        description: `Generated ${numbers.length} random ${config.type}${numbers.length > 1 ? 's' : ''}`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [config, generateId, generateUUID, generateHex, generateBinary, seededRandom, calculateStatistics, toast]);

  // Apply preset
  const applyPreset = useCallback((preset: typeof PRESET_CONFIGS[0]) => {
    setConfig(preset.config);
    toast({
      title: "Preset Applied",
      description: `${preset.name} preset has been applied`,
    });
  }, [toast]);

  // Format output
  const formatOutput = useCallback((numbers: GeneratedNumber[]) => {
    const values = numbers.map(n => n.value);
    
    switch (config.format) {
      case 'json':
        return JSON.stringify(values, null, 2);
      case 'csv':
        return values.join(',\n');
      case 'array':
        return `[${values.map(v => typeof v === 'string' ? `"${v}"` : v).join(', ')}]`;
      default:
        return values.join('\n');
    }
  }, [config.format]);

  // Copy to clipboard
  const copyToClipboard = useCallback(() => {
    const output = formatOutput(generatedNumbers);
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied to Clipboard",
      description: "Generated numbers copied to clipboard",
    });
  }, [generatedNumbers, formatOutput, toast]);

  // Download as file
  const downloadAsFile = useCallback(() => {
    const output = formatOutput(generatedNumbers);
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `random-numbers-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File Downloaded",
      description: "Random numbers saved to file",
    });
  }, [generatedNumbers, formatOutput, toast]);

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
    historyRef.current = [];
    toast({
      title: "History Cleared",
      description: "All generation history has been cleared",
    });
  }, [toast]);

  // Update config
  const updateConfig = useCallback((updates: Partial<RandomNumberConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold">Random Number Generator</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Dice1 className="h-3 w-3" />
              Professional
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">
          Professional random number generation with statistical analysis, seed support, and multiple output formats
        </p>
      </div>

      {/* Professional Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Quick Presets
          </CardTitle>
          <CardDescription>Pre-configured settings for common use cases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRESET_CONFIGS.map((preset) => {
              const IconComponent = NUMBER_TYPES.find(t => t.value === preset.config.type)?.icon || Hash;
              return (
                <Card key={preset.name} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4" onClick={() => applyPreset(preset)}>
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent className="h-4 w-4" />
                      <h4 className="font-medium">{preset.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{preset.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generator" className="gap-2">
                <Dice1 className="h-4 w-4" />
                Generator
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
              <TabsTrigger value="stats" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Statistics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generator" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Number Generator</CardTitle>
                  <CardDescription>Configure and generate random numbers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Number Type</Label>
                    <Select value={config.type} onValueChange={(value: any) => updateConfig({ type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {NUMBER_TYPES.map((type) => {
                          const IconComponent = type.icon;
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4" />
                                <div>
                                  <div className="font-medium">{type.label}</div>
                                  <div className="text-xs text-muted-foreground">{type.description}</div>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {config.type === 'integer' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="min">Minimum</Label>
                        <Input
                          id="min"
                          type="number"
                          value={config.min}
                          onChange={(e) => updateConfig({ min: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="max">Maximum</Label>
                        <Input
                          id="max"
                          type="number"
                          value={config.max}
                          onChange={(e) => updateConfig({ max: parseInt(e.target.value) || 100 })}
                        />
                      </div>
                    </div>
                  )}

                  {config.type === 'float' && (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="min-float">Minimum</Label>
                        <Input
                          id="min-float"
                          type="number"
                          step="any"
                          value={config.min}
                          onChange={(e) => updateConfig({ min: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="max-float">Maximum</Label>
                        <Input
                          id="max-float"
                          type="number"
                          step="any"
                          value={config.max}
                          onChange={(e) => updateConfig({ max: parseFloat(e.target.value) || 100 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="precision">Precision</Label>
                        <Input
                          id="precision"
                          type="number"
                          min="0"
                          max="10"
                          value={config.precision}
                          onChange={(e) => updateConfig({ precision: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                  )}

                  {(config.type === 'hex' || config.type === 'binary') && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="min-length">Min Length</Label>
                        <Input
                          id="min-length"
                          type="number"
                          min="1"
                          value={config.min}
                          onChange={(e) => updateConfig({ min: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="max-length">Max Length</Label>
                        <Input
                          id="max-length"
                          type="number"
                          min="1"
                          value={config.max}
                          onChange={(e) => updateConfig({ max: parseInt(e.target.value) || 10 })}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="count">Count</Label>
                    <Input
                      id="count"
                      type="number"
                      min="1"
                      max="10000"
                      value={config.count}
                      onChange={(e) => updateConfig({ count: parseInt(e.target.value) || 1 })}
                    />
                  </div>

                  {showAdvanced && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="seed">Seed (Optional)</Label>
                        <Input
                          id="seed"
                          value={config.seed || ''}
                          onChange={(e) => updateConfig({ seed: e.target.value || undefined })}
                          placeholder="Enter seed for reproducible results"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Output Format</Label>
                        <Select value={config.format} onValueChange={(value: any) => updateConfig({ format: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FORMAT_OPTIONS.map((format) => (
                              <SelectItem key={format.value} value={format.value}>
                                {format.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="exclude-duplicates"
                            checked={config.excludeDuplicates}
                            onCheckedChange={(checked) => updateConfig({ excludeDuplicates: checked })}
                          />
                          <Label htmlFor="exclude-duplicates">Exclude Duplicates</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="sort"
                            checked={config.sort}
                            onCheckedChange={(checked) => updateConfig({ sort: checked })}
                          />
                          <Label htmlFor="sort">Sort Results</Label>
                        </div>
                      </div>
                    </>
                  )}

                  <Button
                    onClick={generateNumbers}
                    disabled={isGenerating}
                    className="w-full gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Shuffle className="h-4 w-4" />
                        Generate Numbers
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Generation History</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        onClick={clearHistory}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Clear
                      </Button>
                    </div>
                  </div>
                  <CardDescription>View all previously generated numbers</CardDescription>
                </CardHeader>
                <CardContent>
                  {history.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No generation history</p>
                      <p className="text-sm">Generate numbers to see them here</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {history.map((item) => (
                        <div key={item.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {new Date(item.timestamp).toLocaleTimeString()}
                              </Badge>
                              {item.seed && (
                                <Badge variant="secondary" className="text-xs">
                                  Seed: {item.seed.substring(0, 8)}...
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="font-mono text-sm">
                            {typeof item.value === 'boolean' ? (
                              <span className={item.value ? 'text-green-600' : 'text-red-600'}>
                                {item.value.toString()}
                              </span>
                            ) : (
                              item.value
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Statistical Analysis</CardTitle>
                  <CardDescription>Analyze the distribution of generated numbers</CardDescription>
                </CardHeader>
                <CardContent>
                  {!statistics ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No statistics available</p>
                      <p className="text-sm">Generate numeric values to see statistics</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Count</Label>
                          <div className="text-2xl font-bold">{statistics.count}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Sum</Label>
                          <div className="text-2xl font-bold">{statistics.sum.toFixed(2)}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Minimum</Label>
                          <div className="text-lg font-semibold">{statistics.min}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Maximum</Label>
                          <div className="text-lg font-semibold">{statistics.max}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Mean</Label>
                          <div className="text-lg font-semibold">{statistics.mean.toFixed(2)}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Median</Label>
                          <div className="text-lg font-semibold">{statistics.median.toFixed(2)}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Mode</Label>
                          <div className="text-lg font-semibold">{statistics.mode}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Range</Label>
                          <div className="text-lg font-semibold">{statistics.range.toFixed(2)}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Standard Deviation</Label>
                          <div className="text-lg font-semibold">{statistics.standardDeviation.toFixed(2)}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Variance</Label>
                          <div className="text-lg font-semibold">{statistics.variance.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Generated Numbers</CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    Copy
                  </Button>
                  <Button
                    onClick={downloadAsFile}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
              <CardDescription>Your generated random numbers</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedNumbers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Dice1 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No numbers generated yet</p>
                  <p className="text-sm">Configure settings and click "Generate Numbers"</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline">
                      {generatedNumbers.length} {config.type}{generatedNumbers.length > 1 ? 's' : ''}
                    </Badge>
                    {config.seed && (
                      <Badge variant="secondary">
                        Seed: {config.seed.substring(0, 8)}...
                      </Badge>
                    )}
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm font-mono whitespace-pre-wrap break-words">
                      {formatOutput(generatedNumbers)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  onClick={() => updateConfig({ count: 1 })}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Dice1 className="h-4 w-4" />
                  Single Number
                </Button>
                <Button
                  onClick={() => updateConfig({ count: 10 })}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Dice2 className="h-4 w-4" />
                  10 Numbers
                </Button>
                <Button
                  onClick={() => updateConfig({ count: 100 })}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Dice3 className="h-4 w-4" />
                  100 Numbers
                </Button>
                <Button
                  onClick={() => updateConfig({ type: 'uuid', count: 1 })}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Key className="h-4 w-4" />
                  Generate UUID
                </Button>
                <Button
                  onClick={() => updateConfig({ type: 'hex', min: 32, max: 32, count: 1 })}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Palette className="h-4 w-4" />
                  Generate Hex
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Professional Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Tips</CardTitle>
          <CardDescription>Best practices for random number generation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Random Number Generation</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Seeds:</strong> Use seeds for reproducible results in testing</li>
                <li>• <strong>Cryptographic Security:</strong> Use crypto.getRandomValues() for security</li>
                <li>• <strong>Distribution:</strong> Consider the distribution of your random numbers</li>
                <li>• <strong>Range Validation:</strong> Always validate min/max ranges</li>
                <li>• <strong>Performance:</strong> Large batches may impact performance</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Use Cases</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Testing:</strong> Generate test data for applications</li>
                <li>• <strong>Simulation:</strong> Monte Carlo simulations and modeling</li>
                <li>• <strong>Gaming:</strong> Dice rolls, card shuffling, loot drops</li>
                <li>• <strong>Security:</strong> Generate tokens, salts, and keys</li>
                <li>• <strong>Sampling:</strong> Random sampling for data analysis</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RandomNumberGenerator;
