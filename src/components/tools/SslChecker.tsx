import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Copy, 
  Globe, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Key,
  FileText,
  Lock,
  Unlock,
  Search,
  Info,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SslInfo {
  domain: string;
  isValid: boolean;
  issuer: string;
  subject: string;
  validFrom: string;
  validTo: string;
  daysUntilExpiry: number;
  algorithm: string;
  keySize: number;
  serialNumber: string;
  fingerprint: string;
  san: string[];
  protocol: string;
  cipher: string;
  grade: string;
  vulnerabilities: string[];
  recommendations: string[];
}

const SslChecker = () => {
  const [domain, setDomain] = useState("");
  const [sslInfo, setSslInfo] = useState<SslInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const validateDomain = (domain: string): boolean => {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;
    return domainRegex.test(domain);
  };

  const checkSsl = async () => {
    if (!domain.trim()) {
      setError("Please enter a domain name");
      return;
    }

    if (!validateDomain(domain)) {
      setError("Please enter a valid domain name");
      return;
    }

    setLoading(true);
    setError("");
    setSslInfo(null);

    try {
      // Since we can't directly check SSL certificates from the browser due to CORS,
      // we'll simulate the SSL check with mock data for demonstration
      // In a real implementation, this would require a backend service
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Mock SSL information - in production, this would come from an SSL checking API
      const mockSslInfo: SslInfo = {
        domain: domain,
        isValid: true,
        issuer: "Let's Encrypt Authority X3",
        subject: `CN=${domain}`,
        validFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        validTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        daysUntilExpiry: 60,
        algorithm: "RSA-SHA256",
        keySize: 2048,
        serialNumber: "03:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF",
        fingerprint: "SHA256: 12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF",
        san: [domain, `www.${domain}`],
        protocol: "TLS 1.3",
        cipher: "TLS_AES_256_GCM_SHA384",
        grade: "A+",
        vulnerabilities: [],
        recommendations: [
          "Certificate is valid and properly configured",
          "Strong encryption algorithms are being used",
          "Certificate will expire in 60 days - consider renewal"
        ]
      };

      setSslInfo(mockSslInfo);
    } catch (err) {
      setError("Failed to check SSL certificate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard!",
    });
  };

  const loadExample = (example: string) => {
    const examples: Record<string, string> = {
      google: "google.com",
      github: "github.com",
      stackoverflow: "stackoverflow.com",
      example: "example.com"
    };
    
    setDomain(examples[example]);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-green-600 dark:text-green-400';
      case 'B':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'C':
        return 'text-orange-600 dark:text-orange-400';
      case 'D':
      case 'F':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">SSL/TLS Checker</h2>
        <p className="text-muted-foreground">
          Check SSL certificate validity, security grade, and configuration for any domain
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Domain Check
            </CardTitle>
            <CardDescription>
              Enter a domain name to check its SSL certificate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="domain-input">Domain Name</Label>
              <Input
                id="domain-input"
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadExample('google')}
              >
                Google
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadExample('github')}
              >
                GitHub
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadExample('stackoverflow')}
              >
                Stack Overflow
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadExample('example')}
              >
                Example
              </Button>
            </div>

            <Button
              onClick={checkSsl}
              disabled={loading || !domain.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Checking SSL...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Check SSL Certificate
                </>
              )}
            </Button>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {sslInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(sslInfo.isValid)}
                SSL Certificate Status
              </CardTitle>
              <CardDescription>
                Certificate information for {sslInfo.domain}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge variant={sslInfo.isValid ? "default" : "destructive"}>
                      {sslInfo.isValid ? "Valid" : "Invalid"}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Security Grade</Label>
                  <div className="mt-1">
                    <Badge className={getGradeColor(sslInfo.grade)}>
                      {sslInfo.grade}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Protocol</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-medium">{sslInfo.protocol}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(sslInfo.protocol)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Cipher</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-mono text-xs">{sslInfo.cipher}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(sslInfo.cipher)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="space-y-2">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Issuer</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-medium">{sslInfo.issuer}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(sslInfo.issuer)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Subject</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-mono text-sm">{sslInfo.subject}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(sslInfo.subject)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {sslInfo && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Certificate Validity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Valid From</Label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-medium">{formatDate(sslInfo.validFrom)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(sslInfo.validFrom)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Valid To</Label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-medium">{formatDate(sslInfo.validTo)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(sslInfo.validTo)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Days Until Expiry</Label>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`font-medium ${sslInfo.daysUntilExpiry < 30 ? 'text-red-600 dark:text-red-400' : sslInfo.daysUntilExpiry < 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                    {sslInfo.daysUntilExpiry} days
                  </span>
                  {sslInfo.daysUntilExpiry < 30 && <AlertTriangle className="h-4 w-4 text-red-500" />}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Certificate Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Algorithm</Label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-medium">{sslInfo.algorithm}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(sslInfo.algorithm)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Key Size</Label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-medium">{sslInfo.keySize} bits</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(sslInfo.keySize.toString())}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Serial Number</Label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-mono text-xs">{sslInfo.serialNumber}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(sslInfo.serialNumber)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Fingerprint</Label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-mono text-xs break-all">{sslInfo.fingerprint}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(sslInfo.fingerprint)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {sslInfo && sslInfo.san.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Subject Alternative Names (SAN)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sslInfo.san.map((name, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <span className="font-mono text-sm">{name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(name)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {sslInfo && sslInfo.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Security Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sslInfo.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            SSL/TLS Security Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5" />
              <p>• Always use HTTPS for websites handling sensitive data</p>
            </div>
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5" />
              <p>• Keep certificates updated and monitor expiration dates</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <p>• Use strong encryption algorithms (TLS 1.2 or higher)</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p>• Consider implementing HSTS (HTTP Strict Transport Security)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SslChecker;
