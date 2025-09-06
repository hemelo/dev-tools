import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Copy, Globe, Shield, AlertCircle, CheckCircle, Clock, Server } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DnsRecord {
  type: string;
  name: string;
  value: string;
  ttl: number;
  priority?: number;
}

interface DnsResult {
  domain: string;
  records: DnsRecord[];
  time: number;
  error?: string;
}

const DnsLookup = () => {
  const [domain, setDomain] = useState("");
  const [recordType, setRecordType] = useState("A");
  const [results, setResults] = useState<DnsResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const recordTypes = [
    { value: "A", label: "A (IPv4 Address)", description: "Maps domain to IPv4 address" },
    { value: "AAAA", label: "AAAA (IPv6 Address)", description: "Maps domain to IPv6 address" },
    { value: "CNAME", label: "CNAME (Canonical Name)", description: "Alias for another domain" },
    { value: "MX", label: "MX (Mail Exchange)", description: "Mail server for the domain" },
    { value: "TXT", label: "TXT (Text Record)", description: "Text information (SPF, DKIM, etc.)" },
    { value: "NS", label: "NS (Name Server)", description: "Authoritative name servers" },
    { value: "SOA", label: "SOA (Start of Authority)", description: "Zone authority information" },
    { value: "PTR", label: "PTR (Pointer)", description: "Reverse DNS lookup" },
    { value: "SRV", label: "SRV (Service)", description: "Service location record" },
    { value: "CAA", label: "CAA (Certificate Authority)", description: "Certificate authority authorization" }
  ];

  const sampleDomains = [
    "google.com",
    "github.com",
    "stackoverflow.com",
    "wikipedia.org",
    "example.com"
  ];

  const validateDomain = (domain: string): boolean => {
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return domainRegex.test(domain);
  };

  const performDnsLookup = async () => {
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

    const startTime = Date.now();

    try {
      // Using a public DNS API (Cloudflare's 1.1.1.1)
      const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=${recordType}`, {
        headers: {
          'Accept': 'application/dns-json'
        }
      });

      if (!response.ok) {
        throw new Error(`DNS lookup failed: ${response.statusText}`);
      }

      const data = await response.json();
      const endTime = Date.now();

      if (data.Status !== 0) {
        throw new Error(`DNS error: ${data.Comment || 'Unknown error'}`);
      }

      const records: DnsRecord[] = (data.Answer || []).map((record: { type: number; name: string; data: string; TTL: number }) => ({
        type: record.type.toString(),
        name: record.name,
        value: record.data,
        ttl: record.TTL,
        priority: record.data.includes(' ') ? parseInt(record.data.split(' ')[0]) : undefined
      }));

      const result: DnsResult = {
        domain,
        records,
        time: endTime - startTime
      };

      setResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results

    } catch (err) {
      setError(err instanceof Error ? err.message : "DNS lookup failed");
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

  const loadSampleDomain = (sampleDomain: string) => {
    setDomain(sampleDomain);
  };

  const clearResults = () => {
    setResults([]);
  };

  const getRecordTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'A': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'AAAA': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'CNAME': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'MX': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'TXT': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      'NS': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'SOA': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'PTR': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'SRV': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'CAA': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const formatTtl = (ttl: number) => {
    if (ttl < 60) return `${ttl}s`;
    if (ttl < 3600) return `${Math.floor(ttl / 60)}m`;
    if (ttl < 86400) return `${Math.floor(ttl / 3600)}h`;
    return `${Math.floor(ttl / 86400)}d`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">DNS Lookup</h2>
        <p className="text-muted-foreground">
          Query DNS records for any domain with detailed information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              DNS Query
            </CardTitle>
            <CardDescription>
              Enter a domain and select record type to query
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="domain-input">Domain Name</Label>
              <div className="flex gap-2">
                <Input
                  id="domain-input"
                  placeholder="example.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => loadSampleDomain(sampleDomains[Math.floor(Math.random() * sampleDomains.length)])}
                >
                  Random
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              {sampleDomains.slice(0, 3).map(sampleDomain => (
                <Button
                  key={sampleDomain}
                  variant="outline"
                  size="sm"
                  onClick={() => loadSampleDomain(sampleDomain)}
                >
                  {sampleDomain}
                </Button>
              ))}
            </div>

            <div>
              <Label htmlFor="record-type">Record Type</Label>
              <Select value={recordType} onValueChange={setRecordType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {recordTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-gray-500">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={performDnsLookup}
              disabled={loading || !domain.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Querying DNS...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Lookup DNS Records
                </>
              )}
            </Button>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Query Information
            </CardTitle>
            <CardDescription>
              Learn about DNS record types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recordTypes.slice(0, 5).map(type => (
                <div key={type.value} className="flex items-start gap-3">
                  <Badge className={getRecordTypeColor(type.value)}>
                    {type.value}
                  </Badge>
                  <div>
                    <div className="font-medium text-sm">{type.label}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {type.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                DNS Results
              </span>
              <Button variant="outline" size="sm" onClick={clearResults}>
                Clear All
              </Button>
            </CardTitle>
            <CardDescription>
              Recent DNS lookup results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{result.domain}</h4>
                      <Badge variant="outline">{result.records.length} records</Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        {result.time}ms
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {result.records.length > 0 ? (
                    <div className="space-y-2">
                      {result.records.map((record, recordIndex) => (
                        <div key={recordIndex} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <Badge className={getRecordTypeColor(record.type)}>
                            {record.type}
                          </Badge>
                          <div className="flex-1">
                            <div className="font-mono text-sm">{record.value}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              TTL: {formatTtl(record.ttl)}
                              {record.priority && ` • Priority: ${record.priority}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No {recordType} records found</p>
                    </div>
                  )}
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
            DNS Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>• DNS queries are performed using Cloudflare's public DNS service (1.1.1.1)</p>
            <p>• No personal data is stored or logged during DNS lookups</p>
            <p>• All queries are performed over HTTPS for security</p>
            <p>• Results are cached temporarily in your browser only</p>
            <p>• For privacy-sensitive domains, consider using a VPN or private DNS</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DnsLookup;
