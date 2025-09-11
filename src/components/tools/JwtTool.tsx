import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Copy, Check, Key, AlertCircle, Shield, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const JwtTool = () => {
  const [jwtToken, setJwtToken] = useState("");
  const [decodedHeader, setDecodedHeader] = useState("");
  const [decodedPayload, setDecodedPayload] = useState("");
  const [signature, setSignature] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [copiedPart, setCopiedPart] = useState<string | null>(null);
  const { toast } = useToast();

  const decodeJwt = () => {
    if (!jwtToken.trim()) {
      setError("Please enter a JWT token");
      return;
    }

    try {
      const parts = jwtToken.split('.');
      
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format. JWT must have 3 parts separated by dots.");
      }

      // Decode header
      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      setDecodedHeader(JSON.stringify(header, null, 2));

      // Decode payload
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      setDecodedPayload(JSON.stringify(payload, null, 2));

      // Set signature
      setSignature(parts[2]);

      // Basic validation checks
      const now = Math.floor(Date.now() / 1000);
      let validationIssues = [];

      if (payload.exp && payload.exp < now) {
        validationIssues.push("Token is expired");
      }
      
      if (payload.nbf && payload.nbf > now) {
        validationIssues.push("Token is not yet valid");
      }

      setIsValid(validationIssues.length === 0);
      setError(validationIssues.join(", "));
    } catch (err) {
      setError(`Invalid JWT token: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setDecodedHeader("");
      setDecodedPayload("");
      setSignature("");
      setIsValid(null);
    }
  };

  const copyToClipboard = async (text: string, part: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPart(part);
      toast({
        title: "Copied!",
        description: `${part} copied to clipboard`,
      });
      setTimeout(() => setCopiedPart(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const clearAll = () => {
    setJwtToken("");
    setDecodedHeader("");
    setDecodedPayload("");
    setSignature("");
    setIsValid(null);
    setError("");
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const loadExample = (example: string) => {
    setJwtToken(example);
    setDecodedHeader("");
    setDecodedPayload("");
    setSignature("");
    setIsValid(null);
    setError("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">JWT Decoder</h2>
        <p className="text-muted-foreground">
          Decode and validate JSON Web Tokens (JWT) to inspect headers, payloads, and signatures
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>JWT Token</CardTitle>
          <CardDescription>
            Paste your JWT token to decode and analyze
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your JWT token here..."
            value={jwtToken}
            onChange={(e) => setJwtToken(e.target.value)}
            className="min-h-[120px] resize-none font-mono text-sm bg-code-bg"
          />
          <div className="flex gap-4">
            <Button onClick={decodeJwt} disabled={!jwtToken.trim()}>
              <Key className="h-4 w-4 mr-2" />
              Decode JWT
            </Button>
            <Button variant="outline" onClick={clearAll}>
              Clear
            </Button>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-md">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}
          
          {isValid !== null && !error && (
            <div className="flex items-center gap-2">
              <Badge variant={isValid ? "default" : "destructive"}>
                {isValid ? "Valid Token" : "Invalid Token"}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {decodedHeader && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Header</CardTitle>
                <CardDescription>
                  Algorithm and token type information
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(decodedHeader, "Header")}
                className="gap-2"
              >
                {copiedPart === "Header" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-code-bg p-4 rounded-md text-sm overflow-auto">
              {decodedHeader}
            </pre>
          </CardContent>
        </Card>
      )}

      {decodedPayload && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Payload</CardTitle>
                <CardDescription>
                  Claims and user data
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(decodedPayload, "Payload")}
                className="gap-2"
              >
                {copiedPart === "Payload" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-code-bg p-4 rounded-md text-sm overflow-auto">
              {decodedPayload}
            </pre>
          </CardContent>
        </Card>
      )}

      {signature && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Signature</CardTitle>
                <CardDescription>
                  Encoded signature for verification
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(signature, "Signature")}
                className="gap-2"
              >
                {copiedPart === "Signature" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Input
              value={signature}
              readOnly
              className="font-mono bg-code-bg text-sm"
            />
          </CardContent>
        </Card>
      )}

      {/* Quick Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Examples</CardTitle>
          <CardDescription>Click on any example to load it</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                <Label className="text-sm font-medium">Basic JWT</Label>
              </div>
              <div className="space-y-1">
                {[
                  { 
                    jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c", 
                    desc: "Standard User Token" 
                  },
                  { 
                    jwt: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2V4YW1wbGUuY29tIiwic3ViIjoiMTIzNDU2Nzg5MCIsImF1ZCI6Im15YXBwIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.EkN-DOsnsuRjRO6BxXemmJDm3HbxrbRzXglbN2S4sOkopdU4IsDxTI8jO19W_A4K8ZPJijNLtr4gn4pG1MhsA", 
                    desc: "RSA Signed Token" 
                  }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample(example.jwt)}
                    className="w-full justify-start text-xs font-mono"
                  >
                    {example.desc}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <Label className="text-sm font-medium">API Tokens</Label>
              </div>
              <div className="space-y-1">
                {[
                  { 
                    jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjMsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjI0MjYyMn0.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz", 
                    desc: "Admin Token" 
                  },
                  { 
                    jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiYWJjZGVmZ2hpaiIsInNjb3BlcyI6WyJyZWFkIiwid3JpdGUiXSwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.xyz789abc123def456ghi789jkl012mno345pqr678stu901vwx", 
                    desc: "API Key Token" 
                  }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample(example.jwt)}
                    className="w-full justify-start text-xs font-mono"
                  >
                    {example.desc}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <Label className="text-sm font-medium">Time-based</Label>
              </div>
              <div className="space-y-1">
                {[
                  { 
                    jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MDAwMDAwMDB9.invalid_signature_for_demo", 
                    desc: "Future Expiration" 
                  },
                  { 
                    jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJuYmYiOjE3MDAwMDAwMDB9.invalid_signature_for_demo", 
                    desc: "Not Before Time" 
                  }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample(example.jwt)}
                    className="w-full justify-start text-xs font-mono"
                  >
                    {example.desc}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* JWT Information */}
      <Card>
        <CardHeader>
          <CardTitle>About JWT Tokens</CardTitle>
          <CardDescription>Understanding JWT structure and common claims</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-2">Structure:</h4>
              <ul className="space-y-1">
                <li><strong>Header:</strong> Algorithm and token type</li>
                <li><strong>Payload:</strong> Claims and user data</li>
                <li><strong>Signature:</strong> Verification hash</li>
                <li>Format: header.payload.signature</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Common Claims:</h4>
              <ul className="space-y-1">
                <li>• <strong>iss:</strong> Issuer</li>
                <li>• <strong>sub:</strong> Subject</li>
                <li>• <strong>aud:</strong> Audience</li>
                <li>• <strong>exp:</strong> Expiration time</li>
                <li>• <strong>iat:</strong> Issued at</li>
                <li>• <strong>nbf:</strong> Not before</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Security Note</p>
                <p className="text-blue-700 dark:text-blue-300">
                  This tool only decodes JWT tokens for inspection. It does not verify signatures or validate tokens against a secret key. 
                  Always verify tokens properly in production environments.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JwtTool;