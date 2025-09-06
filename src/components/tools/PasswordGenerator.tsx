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
    if (score < 3) return "text-red-500";
    if (score < 4) return "text-yellow-500";
    return "text-green-500";
  };

  const getStrengthText = (score: number) => {
    if (score < 2) return "Very Weak";
    if (score < 3) return "Weak";
    if (score < 4) return "Medium";
    if (score < 5) return "Strong";
    return "Very Strong";
  };

  const calculateStrength = () => {
    let score = 0;
    if (length[0] >= 12) score++;
    if (length[0] >= 16) score++;
    if (includeUppercase) score++;
    if (includeLowercase) score++;
    if (includeNumbers) score++;
    if (includeSymbols) score++;
    return Math.min(score, 5);
  };

  const strength = calculateStrength();

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
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="text-sm">Strength:</span>
              <span className={`text-sm font-medium ${getStrengthColor(strength)}`}>
                {getStrengthText(strength)}
              </span>
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