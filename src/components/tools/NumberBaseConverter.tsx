import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Check, AlertCircle, Calculator, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BaseConversion {
  binary: string;
  octal: string;
  decimal: string;
  hexadecimal: string;
}

export const NumberBaseConverter = () => {
  const [inputValue, setInputValue] = useState("");
  const [inputBase, setInputBase] = useState<keyof BaseConversion>("decimal");
  const [conversions, setConversions] = useState<BaseConversion>({
    binary: "",
    octal: "",
    decimal: "",
    hexadecimal: ""
  });
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  // Convert number from one base to another
  const convertBase = (value: string, fromBase: number, toBase: number): string => {
    if (value === "") return "";
    
    // Handle negative numbers
    const isNegative = value.startsWith("-");
    const absValue = isNegative ? value.slice(1) : value;
    
    if (absValue === "") return "";
    
    // Convert to decimal first
    let decimal: number;
    try {
      decimal = parseInt(absValue, fromBase);
      if (isNaN(decimal)) throw new Error("Invalid number");
    } catch (err) {
      throw new Error(`Invalid ${getBaseName(fromBase)} number`);
    }
    
    // Convert from decimal to target base
    if (toBase === 10) {
      return isNegative ? `-${decimal}` : decimal.toString();
    }
    
    let result = "";
    let num = Math.abs(decimal);
    
    if (num === 0) {
      result = "0";
    } else {
      while (num > 0) {
        const remainder = num % toBase;
        result = (remainder < 10 ? remainder.toString() : String.fromCharCode(65 + remainder - 10)) + result;
        num = Math.floor(num / toBase);
      }
    }
    
    return isNegative ? `-${result}` : result;
  };

  const getBaseName = (base: number): string => {
    switch (base) {
      case 2: return "binary";
      case 8: return "octal";
      case 10: return "decimal";
      case 16: return "hexadecimal";
      default: return "base-" + base;
    }
  };

  const getBaseNumber = (baseName: keyof BaseConversion): number => {
    switch (baseName) {
      case "binary": return 2;
      case "octal": return 8;
      case "decimal": return 10;
      case "hexadecimal": return 16;
      default: return 10;
    }
  };

  const validateInput = (value: string, base: number): boolean => {
    if (value === "") return true;
    
    const isNegative = value.startsWith("-");
    const absValue = isNegative ? value.slice(1) : value;
    
    if (absValue === "") return false;
    
    // Define valid characters for each base
    const validChars: { [key: number]: RegExp } = {
      2: /^[01]+$/,
      8: /^[0-7]+$/,
      10: /^[0-9]+$/,
      16: /^[0-9A-Fa-f]+$/
    };
    
    return validChars[base]?.test(absValue) || false;
  };

  const performConversion = () => {
    if (!inputValue.trim()) {
      setConversions({
        binary: "",
        octal: "",
        decimal: "",
        hexadecimal: ""
      });
      setError("");
      return;
    }

    try {
      const inputBaseNum = getBaseNumber(inputBase);
      
      if (!validateInput(inputValue, inputBaseNum)) {
        setError(`Invalid ${getBaseName(inputBaseNum)} number`);
        setConversions({
          binary: "",
          octal: "",
          decimal: "",
          hexadecimal: ""
        });
        return;
      }

      const newConversions: BaseConversion = {
        binary: convertBase(inputValue, inputBaseNum, 2),
        octal: convertBase(inputValue, inputBaseNum, 8),
        decimal: convertBase(inputValue, inputBaseNum, 10),
        hexadecimal: convertBase(inputValue, inputBaseNum, 16)
      };

      setConversions(newConversions);
      setError("");
    } catch (err) {
      setError((err as Error).message);
      setConversions({
        binary: "",
        octal: "",
        decimal: "",
        hexadecimal: ""
      });
    }
  };

  useEffect(() => {
    performConversion();
  }, [inputValue, inputBase]);

  const copyToClipboard = async (text: string, base: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(base);
      toast({
        title: "Copied!",
        description: `${base} value copied to clipboard`,
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
    setInputValue("");
    setConversions({
      binary: "",
      octal: "",
      decimal: "",
      hexadecimal: ""
    });
    setError("");
  };

  const getInputPlaceholder = () => {
    switch (inputBase) {
      case "binary": return "1010";
      case "octal": return "12";
      case "decimal": return "10";
      case "hexadecimal": return "A";
      default: return "Enter number";
    }
  };

  const getInputDescription = () => {
    switch (inputBase) {
      case "binary": return "Enter binary number (0-1)";
      case "octal": return "Enter octal number (0-7)";
      case "decimal": return "Enter decimal number (0-9)";
      case "hexadecimal": return "Enter hexadecimal number (0-9, A-F)";
      default: return "Enter number";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Number Base Converter</h2>
        <p className="text-muted-foreground">
          Convert numbers between binary, octal, decimal, and hexadecimal bases
        </p>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Input Number</CardTitle>
          <CardDescription>Enter a number in any base and see all conversions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="input-base">From Base</Label>
              <Select value={inputBase} onValueChange={(value: keyof BaseConversion) => setInputBase(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="binary">Binary (Base 2)</SelectItem>
                  <SelectItem value="octal">Octal (Base 8)</SelectItem>
                  <SelectItem value="decimal">Decimal (Base 10)</SelectItem>
                  <SelectItem value="hexadecimal">Hexadecimal (Base 16)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="input-value">Number</Label>
              <div className="flex gap-2">
                <Input
                  id="input-value"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={getInputPlaceholder()}
                  className="font-mono"
                />
                <Button variant="outline" onClick={clearAll} size="sm">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {getInputDescription()}
          </div>
          
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-sm text-destructive/80 mt-1">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conversion Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Binary */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Binary</CardTitle>
              <Badge variant="secondary">Base 2</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-code-bg rounded-md p-3 min-h-[60px] flex items-center">
              <code className="text-sm font-mono break-all">
                {conversions.binary || "—"}
              </code>
            </div>
            {conversions.binary && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(conversions.binary, "Binary")}
                className="w-full gap-2"
              >
                {copied === "Binary" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === "Binary" ? "Copied!" : "Copy"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Octal */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Octal</CardTitle>
              <Badge variant="secondary">Base 8</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-code-bg rounded-md p-3 min-h-[60px] flex items-center">
              <code className="text-sm font-mono break-all">
                {conversions.octal || "—"}
              </code>
            </div>
            {conversions.octal && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(conversions.octal, "Octal")}
                className="w-full gap-2"
              >
                {copied === "Octal" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === "Octal" ? "Copied!" : "Copy"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Decimal */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Decimal</CardTitle>
              <Badge variant="secondary">Base 10</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-code-bg rounded-md p-3 min-h-[60px] flex items-center">
              <code className="text-sm font-mono break-all">
                {conversions.decimal || "—"}
              </code>
            </div>
            {conversions.decimal && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(conversions.decimal, "Decimal")}
                className="w-full gap-2"
              >
                {copied === "Decimal" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === "Decimal" ? "Copied!" : "Copy"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Hexadecimal */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Hexadecimal</CardTitle>
              <Badge variant="secondary">Base 16</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-code-bg rounded-md p-3 min-h-[60px] flex items-center">
              <code className="text-sm font-mono break-all">
                {conversions.hexadecimal || "—"}
              </code>
            </div>
            {conversions.hexadecimal && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(conversions.hexadecimal, "Hexadecimal")}
                className="w-full gap-2"
              >
                {copied === "Hexadecimal" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === "Hexadecimal" ? "Copied!" : "Copy"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Examples</CardTitle>
          <CardDescription>Click on any example to see the conversion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Binary Examples</Label>
              <div className="space-y-1">
                {["1010", "1111", "1000000"].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInputBase("binary");
                      setInputValue(example);
                    }}
                    className="w-full justify-start text-xs font-mono"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Decimal Examples</Label>
              <div className="space-y-1">
                {["10", "255", "1024"].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInputBase("decimal");
                      setInputValue(example);
                    }}
                    className="w-full justify-start text-xs font-mono"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Hexadecimal Examples</Label>
              <div className="space-y-1">
                {["A", "FF", "3E8"].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInputBase("hexadecimal");
                      setInputValue(example);
                    }}
                    className="w-full justify-start text-xs font-mono"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Octal Examples</Label>
              <div className="space-y-1">
                {["12", "377", "2000"].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInputBase("octal");
                      setInputValue(example);
                    }}
                    className="w-full justify-start text-xs font-mono"
                  >
                    {example}
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
