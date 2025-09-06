import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Check, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const HmacGenerator = () => {
  const [message, setMessage] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [algorithm, setAlgorithm] = useState("SHA-256");
  const [hmac, setHmac] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateHmac = async () => {
    if (!message.trim() || !secretKey.trim()) {
      toast({
        title: "Missing input",
        description: "Please provide both message and secret key",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secretKey);
      const messageData = encoder.encode(message);

      // Import the key
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: algorithm },
        false,
        ['sign']
      );

      // Generate HMAC
      const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
      const hashArray = Array.from(new Uint8Array(signature));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setHmac(hashHex);
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Could not generate HMAC",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!hmac) return;
    
    try {
      await navigator.clipboard.writeText(hmac);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "HMAC copied to clipboard",
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

  const clearAll = () => {
    setMessage("");
    setSecretKey("");
    setHmac("");
  };

  const generateRandomKey = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const key = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    setSecretKey(key);
  };

  // Auto-generate when inputs change (debounced)
  useEffect(() => {
    if (!message.trim() || !secretKey.trim()) {
      setHmac("");
      return;
    }

    const timeout = setTimeout(() => {
      generateHmac();
    }, 500);

    return () => clearTimeout(timeout);
  }, [message, secretKey, algorithm]);

  const algorithmInfo = {
    "SHA-1": { bits: 160, description: "Legacy algorithm, avoid for new applications" },
    "SHA-256": { bits: 256, description: "Recommended for most applications" },
    "SHA-384": { bits: 384, description: "Higher security variant" },
    "SHA-512": { bits: 512, description: "Maximum security, larger output" }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">HMAC Generator</h2>
        <p className="text-muted-foreground">
          Generate Hash-based Message Authentication Code (HMAC) for message integrity and authentication
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Message</CardTitle>
          <CardDescription>
            Enter the message you want to authenticate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px] resize-none bg-code-bg"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Secret Key</CardTitle>
          <CardDescription>
            Enter your secret key for HMAC generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your secret key..."
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="min-h-[80px] resize-none font-mono bg-code-bg"
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={generateRandomKey} size="sm">
              Generate Random Key
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>
            Select the HMAC algorithm
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Algorithm:</label>
              <Select value={algorithm} onValueChange={setAlgorithm}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(algorithmInfo).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={generateHmac} 
              disabled={!message.trim() || !secretKey.trim() || isGenerating}
              className="gap-2"
            >
              <Key className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate HMAC"}
            </Button>
            <Button variant="outline" onClick={clearAll}>
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {hmac && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  HMAC-{algorithm} ({algorithmInfo[algorithm as keyof typeof algorithmInfo].bits} bits)
                </CardTitle>
                <CardDescription>
                  {algorithmInfo[algorithm as keyof typeof algorithmInfo].description}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="gap-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Input
              value={hmac}
              readOnly
              className="font-mono bg-code-bg text-sm"
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>About HMAC</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">What is HMAC:</h4>
              <ul className="space-y-1">
                <li>• Hash-based Message Authentication Code</li>
                <li>• Provides message integrity and authenticity</li>
                <li>• Requires a secret key shared between parties</li>
                <li>• Resistant to length extension attacks</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Use Cases:</h4>
              <ul className="space-y-1">
                <li>• API request signing</li>
                <li>• Webhook verification</li>
                <li>• Message authentication</li>
                <li>• Data integrity checking</li>
                <li>• JWT signing</li>
              </ul>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">Security Notes:</h4>
            <ul className="space-y-1">
              <li>• Keep your secret key confidential and secure</li>
              <li>• Use a cryptographically strong random key</li>
              <li>• SHA-256 or higher is recommended for new applications</li>
              <li>• Key length should be at least as long as the hash output</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};