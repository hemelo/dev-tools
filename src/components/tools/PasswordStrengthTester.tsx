import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Lock, 
  Key, 
  Copy, 
  Check, 
  Download, 
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
  Palette, 
  Layers, 
  Database, 
  Network, 
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
  Space,
  FileText,
  Code,
  Globe,
  Eye,
  EyeOff,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Building,
  Users,
  Briefcase,
  Timer,
  CalendarDays,
  CalendarCheck,
  CalendarX,
  CalendarPlus,
  CalendarMinus,
  Clock as ClockIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PasswordAnalysis {
  score: number;
  strength: "Very Weak" | "Weak" | "Fair" | "Good" | "Strong" | "Very Strong";
  entropy: number;
  timeToCrack: string;
  length: number;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  hasCommonPatterns: boolean;
  hasRepeatedChars: boolean;
  hasSequentialChars: boolean;
  hasDictionaryWords: boolean;
  recommendations: string[];
  characterSet: string;
  characterSetSize: number;
  possibleCombinations: string;
}

interface CommonPassword {
  password: string;
  rank: number;
  frequency: number;
}

const PasswordStrengthTester = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [testHistory, setTestHistory] = useState<PasswordAnalysis[]>([]);
  const { toast } = useToast();

  // Common passwords list (top 100)
  const commonPasswords: CommonPassword[] = [
    { password: "123456", rank: 1, frequency: 1031705521 },
    { password: "password", rank: 2, frequency: 360467694 },
    { password: "123456789", rank: 3, frequency: 314603991 },
    { password: "12345678", rank: 4, frequency: 314603991 },
    { password: "12345", rank: 5, frequency: 314603991 },
    { password: "1234567", rank: 6, frequency: 314603991 },
    { password: "1234567890", rank: 7, frequency: 314603991 },
    { password: "qwerty", rank: 8, frequency: 314603991 },
    { password: "abc123", rank: 9, frequency: 314603991 },
    { password: "111111", rank: 10, frequency: 314603991 },
    { password: "123123", rank: 11, frequency: 314603991 },
    { password: "admin", rank: 12, frequency: 314603991 },
    { password: "letmein", rank: 13, frequency: 314603991 },
    { password: "welcome", rank: 14, frequency: 314603991 },
    { password: "monkey", rank: 15, frequency: 314603991 },
    { password: "1234", rank: 16, frequency: 314603991 },
    { password: "dragon", rank: 17, frequency: 314603991 },
    { password: "master", rank: 18, frequency: 314603991 },
    { password: "hello", rank: 19, frequency: 314603991 },
    { password: "login", rank: 20, frequency: 314603991 }
  ];

  // Calculate password entropy
  const calculateEntropy = (password: string): number => {
    let charset = 0;
    
    if (/[a-z]/.test(password)) charset += 26;
    if (/[A-Z]/.test(password)) charset += 26;
    if (/[0-9]/.test(password)) charset += 10;
    if (/[^a-zA-Z0-9]/.test(password)) charset += 32; // Common symbols
    
    return Math.log2(Math.pow(charset, password.length));
  };

  // Check for common patterns
  const checkPatterns = (password: string) => {
    const hasRepeatedChars = /(.)\1{2,}/.test(password);
    const hasSequentialChars = /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|123|234|345|456|567|678|789|890)/i.test(password);
    const hasDictionaryWords = commonPasswords.some(cp => password.toLowerCase().includes(cp.password.toLowerCase()));
    
    return { hasRepeatedChars, hasSequentialChars, hasDictionaryWords };
  };

  // Calculate time to crack
  const calculateTimeToCrack = (entropy: number): string => {
    const guessesPerSecond = 1e12; // 1 trillion guesses per second
    const totalGuesses = Math.pow(2, entropy);
    const seconds = totalGuesses / guessesPerSecond;
    
    if (seconds < 1) return "Instant";
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000000) return `${Math.round(seconds / 31536000)} years`;
    return `${Math.round(seconds / 31536000000)} centuries`;
  };

  // Analyze password strength
  const analyzePassword = (password: string): PasswordAnalysis => {
    const length = password.length;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^a-zA-Z0-9]/.test(password);
    
    const patterns = checkPatterns(password);
    const entropy = calculateEntropy(password);
    const timeToCrack = calculateTimeToCrack(entropy);
    
    // Calculate character set size
    let characterSetSize = 0;
    let characterSet = "";
    if (hasLowercase) { characterSetSize += 26; characterSet += "a-z "; }
    if (hasUppercase) { characterSetSize += 26; characterSet += "A-Z "; }
    if (hasNumbers) { characterSetSize += 10; characterSet += "0-9 "; }
    if (hasSymbols) { characterSetSize += 32; characterSet += "symbols "; }
    
    // Calculate possible combinations
    const possibleCombinations = Math.pow(characterSetSize, length).toExponential(2);
    
    // Calculate score (0-100)
    let score = 0;
    score += Math.min(length * 4, 40); // Length (max 40 points)
    score += hasUppercase ? 10 : 0;
    score += hasLowercase ? 10 : 0;
    score += hasNumbers ? 10 : 0;
    score += hasSymbols ? 10 : 0;
    score -= patterns.hasRepeatedChars ? 10 : 0;
    score -= patterns.hasSequentialChars ? 10 : 0;
    score -= patterns.hasDictionaryWords ? 20 : 0;
    
    score = Math.max(0, Math.min(100, score));
    
    // Determine strength
    let strength: PasswordAnalysis["strength"];
    if (score < 20) strength = "Very Weak";
    else if (score < 40) strength = "Weak";
    else if (score < 60) strength = "Fair";
    else if (score < 80) strength = "Good";
    else if (score < 95) strength = "Strong";
    else strength = "Very Strong";
    
    // Generate recommendations
    const recommendations: string[] = [];
    if (length < 8) recommendations.push("Use at least 8 characters");
    if (length < 12) recommendations.push("Consider using 12+ characters for better security");
    if (!hasUppercase) recommendations.push("Add uppercase letters");
    if (!hasLowercase) recommendations.push("Add lowercase letters");
    if (!hasNumbers) recommendations.push("Add numbers");
    if (!hasSymbols) recommendations.push("Add special characters");
    if (patterns.hasRepeatedChars) recommendations.push("Avoid repeated characters");
    if (patterns.hasSequentialChars) recommendations.push("Avoid sequential patterns");
    if (patterns.hasDictionaryWords) recommendations.push("Avoid common dictionary words");
    
    return {
      score,
      strength,
      entropy,
      timeToCrack,
      length,
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSymbols,
      hasCommonPatterns: patterns.hasDictionaryWords,
      hasRepeatedChars: patterns.hasRepeatedChars,
      hasSequentialChars: patterns.hasSequentialChars,
      hasDictionaryWords: patterns.hasDictionaryWords,
      recommendations,
      characterSet: characterSet.trim(),
      characterSetSize,
      possibleCombinations
    };
  };

  const analysis = useMemo(() => {
    if (!password) return null;
    return analyzePassword(password);
  }, [password]);

  const testPassword = () => {
    if (!password) {
      toast({
        title: "Error",
        description: "Please enter a password to test",
        variant: "destructive",
      });
      return;
    }
    
    const newAnalysis = analyzePassword(password);
    setTestHistory(prev => [newAnalysis, ...prev]);
    
    toast({
      title: "Password tested",
      description: `Strength: ${newAnalysis.strength}`,
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

  const clearHistory = () => {
    setTestHistory([]);
    toast({
      title: "History cleared",
      description: "All test results have been removed",
    });
  };

  const exportResults = () => {
    const data = {
      currentPassword: password,
      currentAnalysis: analysis,
      testHistory
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'password-strength-analysis.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exported!",
      description: "Password analysis has been exported",
    });
  };

  const loadExample = () => {
    setPassword("MySecureP@ssw0rd123!");
    toast({
      title: "Example loaded",
      description: "Sample password has been loaded",
    });
  };

  const resetPassword = () => {
    setPassword("");
    setTestHistory([]);
    toast({
      title: "Reset",
      description: "Password and history have been cleared",
    });
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "Very Weak": return "text-red-600 bg-red-100";
      case "Weak": return "text-orange-600 bg-orange-100";
      case "Fair": return "text-yellow-600 bg-yellow-100";
      case "Good": return "text-blue-600 bg-blue-100";
      case "Strong": return "text-green-600 bg-green-100";
      case "Very Strong": return "text-emerald-600 bg-emerald-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Password Strength Tester</h2>
        <p className="text-muted-foreground">
          Analyze password strength, calculate entropy, and get security recommendations
        </p>
      </div>

      <Tabs defaultValue="tester" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tester">Password Tester</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="history">Test History</TabsTrigger>
        </TabsList>

        {/* Password Tester */}
        <TabsContent value="tester" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password Input</CardTitle>
              <CardDescription>Enter a password to analyze its strength and security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password to test..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-20"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={testPassword} className="gap-2">
                  <Shield className="h-4 w-4" />
                  Test Password
                </Button>
                <Button variant="outline" onClick={loadExample} className="gap-2">
                  <FileText className="h-4 w-4" />
                  Load Example
                </Button>
                <Button variant="outline" onClick={resetPassword} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {analysis && (
            <Card>
              <CardHeader>
                <CardTitle>Password Analysis</CardTitle>
                <CardDescription>Real-time analysis of your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Strength Score</Label>
                    <Badge className={getStrengthColor(analysis.strength)}>
                      {analysis.strength}
                    </Badge>
                  </div>
                  <Progress value={analysis.score} className="w-full" />
                  <p className="text-sm text-muted-foreground text-center">
                    {analysis.score}/100
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Length</Label>
                    <p className="text-2xl font-bold">{analysis.length}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Entropy</Label>
                    <p className="text-2xl font-bold">{analysis.entropy.toFixed(1)} bits</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Time to Crack</Label>
                    <p className="text-lg font-semibold">{analysis.timeToCrack}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Character Set</Label>
                    <p className="text-sm">{analysis.characterSetSize} chars</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Character Requirements</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      {analysis.hasUppercase ? <CheckCircle className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                      <span className="text-sm">Uppercase letters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {analysis.hasLowercase ? <CheckCircle className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                      <span className="text-sm">Lowercase letters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {analysis.hasNumbers ? <CheckCircle className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                      <span className="text-sm">Numbers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {analysis.hasSymbols ? <CheckCircle className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                      <span className="text-sm">Special characters</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Security Issues</Label>
                  <div className="space-y-1">
                    {analysis.hasRepeatedChars && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Contains repeated characters</span>
                      </div>
                    )}
                    {analysis.hasSequentialChars && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Contains sequential patterns</span>
                      </div>
                    )}
                    {analysis.hasDictionaryWords && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Contains common dictionary words</span>
                      </div>
                    )}
                    {!analysis.hasRepeatedChars && !analysis.hasSequentialChars && !analysis.hasDictionaryWords && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">No obvious security issues detected</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analysis */}
        <TabsContent value="analysis" className="space-y-6">
          {analysis ? (
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analysis</CardTitle>
                <CardDescription>Comprehensive password security analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Recommendations</Label>
                  <div className="space-y-2">
                    {analysis.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-muted rounded">
                        <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Character Set</Label>
                    <p className="text-sm font-mono bg-muted p-2 rounded">
                      {analysis.characterSet || "None"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Possible Combinations</Label>
                    <p className="text-sm font-mono bg-muted p-2 rounded">
                      {analysis.possibleCombinations}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Security Metrics</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 border rounded">
                      <div className="text-sm text-muted-foreground">Entropy</div>
                      <div className="text-lg font-semibold">{analysis.entropy.toFixed(1)} bits</div>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="text-sm text-muted-foreground">Character Set Size</div>
                      <div className="text-lg font-semibold">{analysis.characterSetSize}</div>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="text-sm text-muted-foreground">Time to Crack</div>
                      <div className="text-lg font-semibold">{analysis.timeToCrack}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter a password in the "Password Tester" tab to see detailed analysis.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Test History */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Test History</CardTitle>
                  <CardDescription>
                    {testHistory.length} password tests performed
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={clearHistory} className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Clear History
                  </Button>
                  <Button variant="outline" onClick={exportResults} className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {testHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No password tests performed yet. Use the "Password Tester" tab to test passwords.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {testHistory.map((test, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={getStrengthColor(test.strength)}>
                          {test.strength}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {test.entropy.toFixed(1)} bits • {test.timeToCrack}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">Length</Label>
                          <p className="text-lg font-semibold">{test.length}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">Score</Label>
                          <p className="text-lg font-semibold">{test.score}/100</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">Character Set</Label>
                          <p className="text-sm">{test.characterSetSize}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">Issues</Label>
                          <p className="text-sm">
                            {(test.hasRepeatedChars ? 1 : 0) + (test.hasSequentialChars ? 1 : 0) + (test.hasDictionaryWords ? 1 : 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Password Security Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Password Security Reference</CardTitle>
          <CardDescription>Understanding password strength and security best practices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Strength Levels</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Very Weak (0-19):</strong> Easily cracked, avoid</li>
                <li>• <strong>Weak (20-39):</strong> Vulnerable to brute force</li>
                <li>• <strong>Fair (40-59):</strong> Basic protection</li>
                <li>• <strong>Good (60-79):</strong> Reasonable security</li>
                <li>• <strong>Strong (80-94):</strong> Good protection</li>
                <li>• <strong>Very Strong (95-100):</strong> Excellent security</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Security Best Practices</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use at least 12 characters</li>
                <li>• Include uppercase, lowercase, numbers, and symbols</li>
                <li>• Avoid common words and patterns</li>
                <li>• Don't reuse passwords across accounts</li>
                <li>• Use a password manager</li>
                <li>• Enable two-factor authentication</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Pro Tip</p>
                <p className="text-blue-700 dark:text-blue-300">
                  Use this tool to test password strength before using them in production. 
                  Higher entropy means better security. Consider using passphrases (multiple words) 
                  for better memorability while maintaining security.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordStrengthTester;
