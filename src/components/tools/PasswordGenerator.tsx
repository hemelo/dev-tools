import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Copy, Check, RefreshCw, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generatePassword = () => {
    let charset = "";
    
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    if (excludeSimilar) {
      charset = charset.replace(/[0O1lI]/g, "");
    }
    
    if (!charset) {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive",
      });
      return;
    }

    let newPassword = "";
    const array = new Uint32Array(length[0]);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length[0]; i++) {
      newPassword += charset[array[i] % charset.length];
    }
    
    setPassword(newPassword);
  };

  const copyToClipboard = async () => {
    if (!password) return;
    
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Password copied to clipboard",
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

  const getStrengthColor = (score: number) => {
    if (score < 2) return "text-red-500";
    if (score < 3) return "text-orange-500";
    if (score < 4) return "text-yellow-500";
    if (score < 5) return "text-green-500";
    return "text-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score < 2) return "Very Weak";
    if (score < 3) return "Weak";
    if (score < 4) return "Fair";
    if (score < 5) return "Strong";
    return "Very Strong";
  };

  const calculateEntropy = (password: string) => {
    if (!password) return 0;
    
    let charsetSize = 0;
    let hasUppercase = false;
    let hasLowercase = false;
    let hasNumbers = false;
    let hasSymbols = false;
    
    // Analyze actual character usage in the password
    for (const char of password) {
      if (/[A-Z]/.test(char)) {
        hasUppercase = true;
        charsetSize += 26;
      } else if (/[a-z]/.test(char)) {
        hasLowercase = true;
        charsetSize += 26;
      } else if (/[0-9]/.test(char)) {
        hasNumbers = true;
        charsetSize += 10;
      } else if (/[^A-Za-z0-9]/.test(char)) {
        hasSymbols = true;
        charsetSize += 32; // Common symbols
      }
    }
    
    // Calculate entropy: log2(charset_size^length)
    const entropy = Math.log2(Math.pow(charsetSize, password.length));
    return entropy;
  };

  const calculateStrength = (password: string) => {
    if (!password) return 0;
    
    let score = 0;
    const entropy = calculateEntropy(password);
    
    // Length scoring (more important for longer passwords)
    if (password.length >= 8) score += 0.5;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    if (password.length >= 20) score += 0.5;
    
    // Character diversity scoring
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^A-Za-z0-9]/.test(password);
    
    let diversityScore = 0;
    if (hasUppercase) diversityScore += 0.5;
    if (hasLowercase) diversityScore += 0.5;
    if (hasNumbers) diversityScore += 0.5;
    if (hasSymbols) diversityScore += 1; // Symbols are more valuable
    
    score += diversityScore;
    
    // Entropy-based scoring
    if (entropy >= 30) score += 0.5;
    if (entropy >= 40) score += 0.5;
    if (entropy >= 50) score += 0.5;
    if (entropy >= 60) score += 0.5;
    
    // Pattern penalties
    if (/(.)\1{2,}/.test(password)) score -= 0.5; // Repeated characters
    if (/123|abc|qwe|asd/i.test(password)) score -= 0.5; // Common sequences
    if (/password|admin|user/i.test(password)) score -= 1; // Common words
    
    // Bonus for very long passwords
    if (password.length >= 24) score += 0.5;
    
    return Math.max(0, Math.min(5, Math.round(score * 2) / 2)); // Round to nearest 0.5
  };

  const strength = calculateStrength(password);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Password Generator</h2>
        <p className="text-muted-foreground">
          Generate cryptographically secure passwords with customizable options
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated Password</CardTitle>
          <CardDescription>
            Your secure password will appear here
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={password}
              readOnly
              placeholder="Click generate to create a password"
              className="font-mono bg-code-bg"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              disabled={!password}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          {password && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Strength:</span>
                <span className={`text-sm font-medium ${getStrengthColor(strength)}`}>
                  {getStrengthText(strength)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({strength}/5)
                </span>
              </div>
              
              {/* Strength bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    strength < 2 ? 'bg-red-500' :
                    strength < 3 ? 'bg-orange-500' :
                    strength < 4 ? 'bg-yellow-500' :
                    strength < 5 ? 'bg-green-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${(strength / 5) * 100}%` }}
                />
              </div>
              
              {/* Entropy display */}
              <div className="text-xs text-muted-foreground">
                Entropy: {calculateEntropy(password).toFixed(1)} bits
                {calculateEntropy(password) >= 50 && (
                  <span className="ml-2 text-green-600">✓ Excellent</span>
                )}
                {calculateEntropy(password) >= 30 && calculateEntropy(password) < 50 && (
                  <span className="ml-2 text-yellow-600">✓ Good</span>
                )}
                {calculateEntropy(password) < 30 && (
                  <span className="ml-2 text-red-600">⚠ Low</span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password Options</CardTitle>
          <CardDescription>
            Customize your password generation settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">Length: {length[0]}</label>
            </div>
            <Slider
              value={length}
              onValueChange={setLength}
              min={4}
              max={128}
              step={1}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="uppercase"
                checked={includeUppercase}
                onCheckedChange={(checked) => setIncludeUppercase(checked === true)}
              />
              <label htmlFor="uppercase" className="text-sm">Uppercase (A-Z)</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lowercase"
                checked={includeLowercase}
                onCheckedChange={(checked) => setIncludeLowercase(checked === true)}
              />
              <label htmlFor="lowercase" className="text-sm">Lowercase (a-z)</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="numbers"
                checked={includeNumbers}
                onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
              />
              <label htmlFor="numbers" className="text-sm">Numbers (0-9)</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="symbols"
                checked={includeSymbols}
                onCheckedChange={(checked) => setIncludeSymbols(checked === true)}
              />
              <label htmlFor="symbols" className="text-sm">Symbols (!@#$%)</label>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="exclude-similar"
              checked={excludeSimilar}
              onCheckedChange={(checked) => setExcludeSimilar(checked === true)}
            />
            <label htmlFor="exclude-similar" className="text-sm">
              Exclude similar characters (0, O, 1, l, I)
            </label>
          </div>

          <Button onClick={generatePassword} className="w-full gap-2">
            <RefreshCw className="h-4 w-4" />
            Generate Password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password Security Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">Strong Passwords:</h4>
              <ul className="space-y-1">
                <li>• At least 12 characters long</li>
                <li>• Mix of uppercase and lowercase</li>
                <li>• Include numbers and symbols</li>
                <li>• Avoid dictionary words</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Best Practices:</h4>
              <ul className="space-y-1">
                <li>• Use unique passwords for each account</li>
                <li>• Store in a password manager</li>
                <li>• Enable two-factor authentication</li>
                <li>• Never share passwords</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};