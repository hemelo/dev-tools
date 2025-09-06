import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Key, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const JwtTool = () => {
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

  const getExampleToken = () => {
    // This is a sample JWT token for demonstration (expired)
    const exampleJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    setJwtToken(exampleJwt);
    decodeJwt();
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
              Decode JWT
            </Button>
            <Button variant="outline" onClick={getExampleToken}>
              Load Example
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

      <Card>
        <CardHeader>
          <CardTitle>About JWT Tokens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </CardContent>
      </Card>
    </div>
  );
};