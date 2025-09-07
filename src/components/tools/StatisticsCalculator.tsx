import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Plus,
  X,
  Download,
  Upload,
  Copy,
  Check,
  RefreshCw,
  FileText,
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
  Hash,
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
  Settings,
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
  Plus as PlusIcon,
  Minus as MinusIcon,
  X as XIcon,
  Divide,
  Equal,
  LessThan,
  GreaterThan,
  QuestionMark,
  AlertTriangle,
  AtSign,
  Hash as HashIcon,
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
  Space
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DescriptiveStats {
  count: number;
  mean: number;
  median: number;
  mode: number | null;
  range: number;
  variance: number;
  standardDeviation: number;
  skewness: number;
  kurtosis: number;
  min: number;
  max: number;
  sum: number;
  q1: number;
  q3: number;
  iqr: number;
}

interface DistributionParams {
  normal: { mean: number; stdDev: number };
  uniform: { min: number; max: number };
  exponential: { rate: number };
  poisson: { lambda: number };
  binomial: { n: number; p: number };
  geometric: { p: number };
  hypergeometric: { N: number; K: number; n: number };
}

interface SampleData {
  values: number[];
  name: string;
  color: string;
}

export const StatisticsCalculator = () => {
  const [inputData, setInputData] = useState("");
  const [sampleSize, setSampleSize] = useState(1000);
  const [selectedDistribution, setSelectedDistribution] = useState<keyof DistributionParams>("normal");
  const [distributionParams, setDistributionParams] = useState<DistributionParams>({
    normal: { mean: 0, stdDev: 1 },
    uniform: { min: 0, max: 1 },
    exponential: { rate: 1 },
    poisson: { lambda: 5 },
    binomial: { n: 10, p: 0.5 },
    geometric: { p: 0.5 },
    hypergeometric: { N: 100, K: 20, n: 10 }
  });
  const [samples, setSamples] = useState<SampleData[]>([]);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHistogram, setShowHistogram] = useState(true);
  const [binCount, setBinCount] = useState(20);
  const { toast } = useToast();

  // Parse input data
  const parsedData = useMemo(() => {
    if (!inputData.trim()) return [];
    
    try {
      const values = inputData
        .split(/[,\s\n]+/)
        .map(v => v.trim())
        .filter(v => v !== "")
        .map(v => parseFloat(v))
        .filter(v => !isNaN(v));
      
      return values;
    } catch (error) {
      return [];
    }
  }, [inputData]);

  // Calculate descriptive statistics
  const descriptiveStats = useMemo((): DescriptiveStats | null => {
    if (parsedData.length === 0) return null;

    const sorted = [...parsedData].sort((a, b) => a - b);
    const n = parsedData.length;
    const sum = parsedData.reduce((acc, val) => acc + val, 0);
    const mean = sum / n;
    
    // Variance and standard deviation
    const variance = parsedData.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
    const standardDeviation = Math.sqrt(variance);
    
    // Median
    const median = n % 2 === 0 
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 
      : sorted[Math.floor(n / 2)];
    
    // Mode
    const frequency: { [key: number]: number } = {};
    parsedData.forEach(val => {
      frequency[val] = (frequency[val] || 0) + 1;
    });
    const maxFreq = Math.max(...Object.values(frequency));
    const mode = Object.keys(frequency).find(key => frequency[parseFloat(key)] === maxFreq);
    
    // Quartiles
    const q1Index = Math.floor(n * 0.25);
    const q3Index = Math.floor(n * 0.75);
    const q1 = sorted[q1Index];
    const q3 = sorted[q3Index];
    const iqr = q3 - q1;
    
    // Skewness
    const skewness = parsedData.reduce((acc, val) => acc + Math.pow((val - mean) / standardDeviation, 3), 0) / n;
    
    // Kurtosis
    const kurtosis = parsedData.reduce((acc, val) => acc + Math.pow((val - mean) / standardDeviation, 4), 0) / n - 3;
    
    return {
      count: n,
      mean,
      median,
      mode: mode ? parseFloat(mode) : null,
      range: sorted[n - 1] - sorted[0],
      variance,
      standardDeviation,
      skewness,
      kurtosis,
      min: sorted[0],
      max: sorted[n - 1],
      sum,
      q1,
      q3,
      iqr
    };
  }, [parsedData]);

  // Generate random samples from distributions
  const generateSample = (distribution: keyof DistributionParams, params: any, size: number): number[] => {
    const samples: number[] = [];
    
    for (let i = 0; i < size; i++) {
      let value: number;
      
      switch (distribution) {
        case "normal":
          // Box-Muller transform for normal distribution
          const u1 = Math.random();
          const u2 = Math.random();
          const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
          value = params.mean + params.stdDev * z0;
          break;
          
        case "uniform":
          value = params.min + Math.random() * (params.max - params.min);
          break;
          
        case "exponential":
          value = -Math.log(1 - Math.random()) / params.rate;
          break;
          
        case "poisson":
          // Approximate Poisson with normal for large lambda
          if (params.lambda > 30) {
            const normalSample = generateSample("normal", { mean: params.lambda, stdDev: Math.sqrt(params.lambda) }, 1)[0];
            value = Math.max(0, Math.round(normalSample));
          } else {
            // Exact Poisson generation
            let k = 0;
            let p = Math.exp(-params.lambda);
            let s = p;
            const u = Math.random();
            
            while (u > s) {
              k++;
              p *= params.lambda / k;
              s += p;
            }
            value = k;
          }
          break;
          
        case "binomial":
          let successes = 0;
          for (let j = 0; j < params.n; j++) {
            if (Math.random() < params.p) {
              successes++;
            }
          }
          value = successes;
          break;
          
        case "geometric":
          value = Math.ceil(Math.log(1 - Math.random()) / Math.log(1 - params.p));
          break;
          
        case "hypergeometric":
          // Simplified hypergeometric (approximation)
          const p = params.K / params.N;
          let hypergeometricSuccesses = 0;
          for (let j = 0; j < params.n; j++) {
            if (Math.random() < p) {
              hypergeometricSuccesses++;
            }
          }
          value = hypergeometricSuccesses;
          break;
          
        default:
          value = Math.random();
      }
      
      samples.push(value);
    }
    
    return samples;
  };

  const addSample = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const newSample = generateSample(selectedDistribution, distributionParams[selectedDistribution], sampleSize);
      const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#84cc16", "#f97316"];
      const color = colors[samples.length % colors.length];
      
      setSamples(prev => [...prev, {
        values: newSample,
        name: `${selectedDistribution} (${samples.length + 1})`,
        color
      }]);
      
      setIsGenerating(false);
      toast({
        title: "Sample generated",
        description: `${sampleSize} values generated from ${selectedDistribution} distribution`,
      });
    }, 500);
  };

  const removeSample = (index: number) => {
    setSamples(prev => prev.filter((_, i) => i !== index));
  };

  const clearSamples = () => {
    setSamples([]);
    toast({
      title: "Samples cleared",
      description: "All generated samples have been removed",
    });
  };

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

  const exportData = () => {
    const data = {
      inputData: parsedData,
      descriptiveStats,
      samples: samples.map(sample => ({
        name: sample.name,
        values: sample.values,
        stats: calculateSampleStats(sample.values)
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'statistics-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exported!",
      description: "Statistics data has been exported",
    });
  };

  const calculateSampleStats = (values: number[]): DescriptiveStats | null => {
    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const n = values.length;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / n;
    
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
    const standardDeviation = Math.sqrt(variance);
    
    const median = n % 2 === 0 
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 
      : sorted[Math.floor(n / 2)];
    
    const frequency: { [key: number]: number } = {};
    values.forEach(val => {
      frequency[val] = (frequency[val] || 0) + 1;
    });
    const maxFreq = Math.max(...Object.values(frequency));
    const mode = Object.keys(frequency).find(key => frequency[parseFloat(key)] === maxFreq);
    
    const q1Index = Math.floor(n * 0.25);
    const q3Index = Math.floor(n * 0.75);
    const q1 = sorted[q1Index];
    const q3 = sorted[q3Index];
    const iqr = q3 - q1;
    
    const skewness = values.reduce((acc, val) => acc + Math.pow((val - mean) / standardDeviation, 3), 0) / n;
    const kurtosis = values.reduce((acc, val) => acc + Math.pow((val - mean) / standardDeviation, 4), 0) / n - 3;
    
    return {
      count: n,
      mean,
      median,
      mode: mode ? parseFloat(mode) : null,
      range: sorted[n - 1] - sorted[0],
      variance,
      standardDeviation,
      skewness,
      kurtosis,
      min: sorted[0],
      max: sorted[n - 1],
      sum,
      q1,
      q3,
      iqr
    };
  };

  const loadExampleData = () => {
    const exampleData = [
      85, 90, 78, 92, 88, 76, 95, 89, 84, 91,
      87, 93, 79, 86, 94, 82, 88, 90, 85, 92,
      89, 87, 91, 83, 88, 90, 86, 93, 84, 89
    ].join(", ");
    
    setInputData(exampleData);
    toast({
      title: "Example loaded",
      description: "Sample dataset has been loaded",
    });
  };

  const resetData = () => {
    setInputData("");
    setSamples([]);
    setDistributionParams({
      normal: { mean: 0, stdDev: 1 },
      uniform: { min: 0, max: 1 },
      exponential: { rate: 1 },
      poisson: { lambda: 5 },
      binomial: { n: 10, p: 0.5 },
      geometric: { p: 0.5 },
      hypergeometric: { N: 100, K: 20, n: 10 }
    });
    toast({
      title: "Data reset",
      description: "All data has been cleared",
    });
  };

  const updateDistributionParam = (distribution: keyof DistributionParams, param: string, value: number) => {
    setDistributionParams(prev => ({
      ...prev,
      [distribution]: {
        ...prev[distribution],
        [param]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Statistics Calculator</h2>
        <p className="text-muted-foreground">
          Calculate descriptive statistics, generate probability distributions, and analyze data with comprehensive statistical tools
        </p>
      </div>

      <Tabs defaultValue="descriptive" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="descriptive">Descriptive Statistics</TabsTrigger>
          <TabsTrigger value="distributions">Probability Distributions</TabsTrigger>
          <TabsTrigger value="samples">Generated Samples</TabsTrigger>
        </TabsList>

        {/* Descriptive Statistics */}
        <TabsContent value="descriptive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Input Data</CardTitle>
              <CardDescription>Enter your data values separated by commas, spaces, or new lines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="data-input">Data Values</Label>
                <Textarea
                  id="data-input"
                  placeholder="Enter numbers separated by commas, spaces, or new lines..."
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  rows={6}
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={loadExampleData} className="gap-2">
                  <FileText className="h-4 w-4" />
                  Load Example
                </Button>
                <Button variant="outline" onClick={resetData} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
                {parsedData.length > 0 && (
                  <Button variant="outline" onClick={() => copyToClipboard(parsedData.join(", "), "Data")} className="gap-2">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    Copy Data
                  </Button>
                )}
              </div>
              
              {parsedData.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {parsedData.length} values
                  </Badge>
                  <Badge variant="outline">
                    Range: {Math.min(...parsedData).toFixed(2)} - {Math.max(...parsedData).toFixed(2)}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {descriptiveStats && (
            <Card>
              <CardHeader>
                <CardTitle>Descriptive Statistics</CardTitle>
                <CardDescription>Statistical measures for your data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Count</Label>
                    <p className="text-2xl font-bold">{descriptiveStats.count}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Mean</Label>
                    <p className="text-2xl font-bold">{descriptiveStats.mean.toFixed(4)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Median</Label>
                    <p className="text-2xl font-bold">{descriptiveStats.median.toFixed(4)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Mode</Label>
                    <p className="text-2xl font-bold">{descriptiveStats.mode?.toFixed(4) || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Standard Deviation</Label>
                    <p className="text-2xl font-bold">{descriptiveStats.standardDeviation.toFixed(4)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Variance</Label>
                    <p className="text-2xl font-bold">{descriptiveStats.variance.toFixed(4)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Range</Label>
                    <p className="text-2xl font-bold">{descriptiveStats.range.toFixed(4)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">IQR</Label>
                    <p className="text-2xl font-bold">{descriptiveStats.iqr.toFixed(4)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Min</Label>
                    <p className="text-2xl font-bold">{descriptiveStats.min.toFixed(4)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Max</Label>
                    <p className="text-2xl font-bold">{descriptiveStats.max.toFixed(4)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Q1</Label>
                    <p className="text-2xl font-bold">{descriptiveStats.q1.toFixed(4)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Q3</Label>
                    <p className="text-2xl font-bold">{descriptiveStats.q3.toFixed(4)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Skewness</Label>
                    <p className="text-2xl font-bold">{descriptiveStats.skewness.toFixed(4)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Kurtosis</Label>
                    <p className="text-2xl font-bold">{descriptiveStats.kurtosis.toFixed(4)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Sum</Label>
                    <p className="text-2xl font-bold">{descriptiveStats.sum.toFixed(4)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Probability Distributions */}
        <TabsContent value="distributions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribution Parameters</CardTitle>
              <CardDescription>Configure parameters for probability distributions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Distribution Type</Label>
                  <Select value={selectedDistribution} onValueChange={(value: keyof DistributionParams) => setSelectedDistribution(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal Distribution</SelectItem>
                      <SelectItem value="uniform">Uniform Distribution</SelectItem>
                      <SelectItem value="exponential">Exponential Distribution</SelectItem>
                      <SelectItem value="poisson">Poisson Distribution</SelectItem>
                      <SelectItem value="binomial">Binomial Distribution</SelectItem>
                      <SelectItem value="geometric">Geometric Distribution</SelectItem>
                      <SelectItem value="hypergeometric">Hypergeometric Distribution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sample Size</Label>
                  <Input
                    type="number"
                    value={sampleSize}
                    onChange={(e) => setSampleSize(parseInt(e.target.value) || 1000)}
                    min="1"
                    max="10000"
                  />
                </div>
              </div>

              {/* Distribution-specific parameters */}
              {selectedDistribution === "normal" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Mean (μ)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={distributionParams.normal.mean}
                      onChange={(e) => updateDistributionParam("normal", "mean", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Standard Deviation (σ)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={distributionParams.normal.stdDev}
                      onChange={(e) => updateDistributionParam("normal", "stdDev", parseFloat(e.target.value) || 1)}
                    />
                  </div>
                </div>
              )}

              {selectedDistribution === "uniform" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Minimum</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={distributionParams.uniform.min}
                      onChange={(e) => updateDistributionParam("uniform", "min", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={distributionParams.uniform.max}
                      onChange={(e) => updateDistributionParam("uniform", "max", parseFloat(e.target.value) || 1)}
                    />
                  </div>
                </div>
              )}

              {selectedDistribution === "exponential" && (
                <div className="space-y-2">
                  <Label>Rate (λ)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={distributionParams.exponential.rate}
                    onChange={(e) => updateDistributionParam("exponential", "rate", parseFloat(e.target.value) || 1)}
                  />
                </div>
              )}

              {selectedDistribution === "poisson" && (
                <div className="space-y-2">
                  <Label>Lambda (λ)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={distributionParams.poisson.lambda}
                    onChange={(e) => updateDistributionParam("poisson", "lambda", parseFloat(e.target.value) || 5)}
                  />
                </div>
              )}

              {selectedDistribution === "binomial" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Number of Trials (n)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={distributionParams.binomial.n}
                      onChange={(e) => updateDistributionParam("binomial", "n", parseInt(e.target.value) || 10)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Probability of Success (p)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={distributionParams.binomial.p}
                      onChange={(e) => updateDistributionParam("binomial", "p", parseFloat(e.target.value) || 0.5)}
                    />
                  </div>
                </div>
              )}

              {selectedDistribution === "geometric" && (
                <div className="space-y-2">
                  <Label>Probability of Success (p)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="1"
                    value={distributionParams.geometric.p}
                    onChange={(e) => updateDistributionParam("geometric", "p", parseFloat(e.target.value) || 0.5)}
                  />
                </div>
              )}

              {selectedDistribution === "hypergeometric" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Population Size (N)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={distributionParams.hypergeometric.N}
                      onChange={(e) => updateDistributionParam("hypergeometric", "N", parseInt(e.target.value) || 100)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Successes in Population (K)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={distributionParams.hypergeometric.K}
                      onChange={(e) => updateDistributionParam("hypergeometric", "K", parseInt(e.target.value) || 20)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sample Size (n)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={distributionParams.hypergeometric.n}
                      onChange={(e) => updateDistributionParam("hypergeometric", "n", parseInt(e.target.value) || 10)}
                    />
                  </div>
                </div>
              )}

              <Button onClick={addSample} disabled={isGenerating} className="gap-2">
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Generate Sample
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generated Samples */}
        <TabsContent value="samples" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generated Samples</CardTitle>
                  <CardDescription>Statistical analysis of generated samples</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={clearSamples} className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Clear All
                  </Button>
                  <Button variant="outline" onClick={exportData} className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {samples.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No samples generated yet. Go to the "Probability Distributions" tab to generate samples.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {samples.map((sample, index) => {
                    const stats = calculateSampleStats(sample.values);
                    return (
                      <Card key={index} className="border-l-4" style={{ borderLeftColor: sample.color }}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: sample.color }}
                              />
                              <CardTitle className="text-lg">{sample.name}</CardTitle>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeSample(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {stats && (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                              <div className="space-y-1">
                                <Label className="text-sm font-medium text-muted-foreground">Count</Label>
                                <p className="text-lg font-semibold">{stats.count}</p>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-sm font-medium text-muted-foreground">Mean</Label>
                                <p className="text-lg font-semibold">{stats.mean.toFixed(4)}</p>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-sm font-medium text-muted-foreground">Std Dev</Label>
                                <p className="text-lg font-semibold">{stats.standardDeviation.toFixed(4)}</p>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-sm font-medium text-muted-foreground">Min</Label>
                                <p className="text-lg font-semibold">{stats.min.toFixed(4)}</p>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-sm font-medium text-muted-foreground">Max</Label>
                                <p className="text-lg font-semibold">{stats.max.toFixed(4)}</p>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-sm font-medium text-muted-foreground">Range</Label>
                                <p className="text-lg font-semibold">{stats.range.toFixed(4)}</p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Statistics Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Statistics Reference</CardTitle>
          <CardDescription>Understanding statistical measures and probability distributions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Descriptive Statistics</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Mean:</strong> Average value of the data</li>
                <li>• <strong>Median:</strong> Middle value when data is sorted</li>
                <li>• <strong>Mode:</strong> Most frequently occurring value</li>
                <li>• <strong>Standard Deviation:</strong> Measure of data spread</li>
                <li>• <strong>Variance:</strong> Average squared deviation from mean</li>
                <li>• <strong>Skewness:</strong> Measure of asymmetry</li>
                <li>• <strong>Kurtosis:</strong> Measure of tail heaviness</li>
                <li>• <strong>IQR:</strong> Interquartile range (Q3 - Q1)</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Probability Distributions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Normal:</strong> Bell-shaped, symmetric distribution</li>
                <li>• <strong>Uniform:</strong> Equal probability across range</li>
                <li>• <strong>Exponential:</strong> Time between events</li>
                <li>• <strong>Poisson:</strong> Number of events in interval</li>
                <li>• <strong>Binomial:</strong> Number of successes in trials</li>
                <li>• <strong>Geometric:</strong> Number of trials until success</li>
                <li>• <strong>Hypergeometric:</strong> Sampling without replacement</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Pro Tip</p>
                <p className="text-blue-700 dark:text-blue-300">
                  Use this tool for data analysis, statistical modeling, and understanding probability distributions. 
                  Generate samples from different distributions to see how they behave, and compare their statistical 
                  properties. Export your data for further analysis in other tools.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
