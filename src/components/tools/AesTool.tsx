import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Lock, Unlock, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AesTool = () => {
  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("AES-GCM");
  const [keySize, setKeySize] = useState("256");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();

  const deriveKey = async (password: string, salt: Uint8Array) => {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: parseInt(keySize) },
      false,
      ['encrypt', 'decrypt']
    );
  };

  const encrypt = async () => {
    if (!plaintext.trim() || !password.trim()) {
      toast({
        title: "Missing input",
        description: "Please provide both plaintext and password",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(plaintext);

      // Generate random salt and IV
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // Derive key from password
      const key = await deriveKey(password, salt);

      // Encrypt the data
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        data
      );

      // Combine salt, iv, and encrypted data
      const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
      result.set(salt, 0);
      result.set(iv, salt.length);
      result.set(new Uint8Array(encrypted), salt.length + iv.length);

      // Convert to base64
      const base64 = btoa(String.fromCharCode(...result));
      setCiphertext(base64);

      toast({
        title: "Encrypted successfully",
        description: "Your data has been encrypted",
      });
    } catch (error) {
      toast({
        title: "Encryption failed",
        description: "Could not encrypt the data",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const decrypt = async () => {
    if (!ciphertext.trim() || !password.trim()) {
      toast({
        title: "Missing input",
        description: "Please provide both ciphertext and password",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Decode from base64
      const data = new Uint8Array(atob(ciphertext).split('').map(char => char.charCodeAt(0)));

      // Extract salt, iv, and encrypted data
      const salt = data.slice(0, 16);
      const iv = data.slice(16, 28);
      const encrypted = data.slice(28);

      // Derive key from password
      const key = await deriveKey(password, salt);

      // Decrypt the data
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encrypted
      );

      // Convert back to text
      const decoder = new TextDecoder();
      const result = decoder.decode(decrypted);
      setPlaintext(result);

      toast({
        title: "Decrypted successfully",
        description: "Your data has been decrypted",
      });
    } catch (error) {
      toast({
        title: "Decryption failed",
        description: "Could not decrypt the data. Check your password and ciphertext.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast({
        title: "Copied!",
        description: `${field} copied to clipboard`,
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const generateRandomPassword = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const randomPassword = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    setPassword(randomPassword);
  };

  const clearAll = () => {
    setPlaintext("");
    setCiphertext("");
    setPassword("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">AES Encryption/Decryption</h2>
        <p className="text-muted-foreground">
          Encrypt and decrypt data using Advanced Encryption Standard (AES) with password-based key derivation
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Encryption Settings</CardTitle>
          <CardDescription>
            Configure your encryption parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Mode:</label>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AES-GCM">AES-GCM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Key Size:</label>
              <Select value={keySize} onValueChange={setKeySize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="128">128 bits</SelectItem>
                  <SelectItem value="192">192 bits</SelectItem>
                  <SelectItem value="256">256 bits</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Enter your encryption password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Enter your password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-mono bg-code-bg"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(password, "Password")}
              disabled={!password}
            >
              {copiedField === "Password" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <Button variant="outline" onClick={generateRandomPassword} size="sm" className="gap-2">
            <Key className="h-4 w-4" />
            Generate Random Password
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="encrypt">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
          <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
        </TabsList>
        
        <TabsContent value="encrypt" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plaintext</CardTitle>
              <CardDescription>
                Enter the text you want to encrypt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter text to encrypt..."
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
                className="min-h-[120px] resize-none bg-code-bg"
              />
              <Button 
                onClick={encrypt} 
                disabled={!plaintext.trim() || !password.trim() || isProcessing}
                className="gap-2"
              >
                <Lock className="h-4 w-4" />
                {isProcessing ? "Encrypting..." : "Encrypt"}
              </Button>
            </CardContent>
          </Card>

          {ciphertext && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Encrypted Text</CardTitle>
                    <CardDescription>
                      Base64-encoded encrypted data
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(ciphertext, "Ciphertext")}
                    className="gap-2"
                  >
                    {copiedField === "Ciphertext" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    Copy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={ciphertext}
                  readOnly
                  className="min-h-[120px] font-mono bg-code-bg text-sm"
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="decrypt" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Encrypted Text</CardTitle>
              <CardDescription>
                Enter the encrypted text to decrypt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter encrypted text (Base64)..."
                value={ciphertext}
                onChange={(e) => setCiphertext(e.target.value)}
                className="min-h-[120px] resize-none font-mono bg-code-bg"
              />
              <Button 
                onClick={decrypt} 
                disabled={!ciphertext.trim() || !password.trim() || isProcessing}
                className="gap-2"
              >
                <Unlock className="h-4 w-4" />
                {isProcessing ? "Decrypting..." : "Decrypt"}
              </Button>
            </CardContent>
          </Card>

          {plaintext && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Decrypted Text</CardTitle>
                    <CardDescription>
                      Original plaintext data
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(plaintext, "Plaintext")}
                    className="gap-2"
                  >
                    {copiedField === "Plaintext" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    Copy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={plaintext}
                  readOnly
                  className="min-h-[120px] bg-code-bg"
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex gap-2">
        <Button variant="outline" onClick={clearAll}>
          Clear All
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About AES Encryption</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">AES Features:</h4>
              <ul className="space-y-1">
                <li>• Advanced Encryption Standard</li>
                <li>• Symmetric encryption algorithm</li>
                <li>• Supports 128, 192, 256-bit keys</li>
                <li>• GCM mode provides authentication</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Security Notes:</h4>
              <ul className="space-y-1">
                <li>• Uses PBKDF2 for key derivation</li>
                <li>• 100,000 iterations for key stretching</li>
                <li>• Random salt and IV for each encryption</li>
                <li>• Keep your password secure and private</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AesTool;