import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Network, 
  Copy, 
  Calculator, 
  Globe, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Info,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SubnetInfo {
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  subnetMask: string;
  wildcardMask: string;
  cidr: string;
  totalHosts: number;
  usableHosts: number;
  networkClass: string;
  binarySubnetMask: string;
  binaryNetworkAddress: string;
  binaryBroadcastAddress: string;
}

const SubnetCalculator = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [subnetMask, setSubnetMask] = useState("");
  const [cidr, setCidr] = useState("");
  const [subnetInfo, setSubnetInfo] = useState<SubnetInfo | null>(null);
  const [error, setError] = useState("");
  const [inputType, setInputType] = useState<'subnet' | 'cidr'>('cidr');
  const { toast } = useToast();

  const cidrToSubnetMask = (cidr: number): string => {
    const mask = (0xffffffff << (32 - cidr)) >>> 0;
    return [
      (mask >>> 24) & 0xff,
      (mask >>> 16) & 0xff,
      (mask >>> 8) & 0xff,
      mask & 0xff
    ].join('.');
  };

  const subnetMaskToCidr = (subnetMask: string): number => {
    const parts = subnetMask.split('.').map(Number);
    let cidr = 0;
    for (const part of parts) {
      cidr += part.toString(2).split('1').length - 1;
    }
    return cidr;
  };

  const ipToNumber = (ip: string): number => {
    const parts = ip.split('.').map(Number);
    return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
  };

  const numberToIp = (num: number): string => {
    return [
      (num >>> 24) & 0xff,
      (num >>> 16) & 0xff,
      (num >>> 8) & 0xff,
      num & 0xff
    ].join('.');
  };

  const toBinary = (ip: string): string => {
    return ip.split('.').map(part => 
      parseInt(part).toString(2).padStart(8, '0')
    ).join('.');
  };

  const getNetworkClass = (ip: string): string => {
    const firstOctet = parseInt(ip.split('.')[0]);
    if (firstOctet >= 1 && firstOctet <= 126) return 'A';
    if (firstOctet >= 128 && firstOctet <= 191) return 'B';
    if (firstOctet >= 192 && firstOctet <= 223) return 'C';
    if (firstOctet >= 224 && firstOctet <= 239) return 'D (Multicast)';
    if (firstOctet >= 240 && firstOctet <= 255) return 'E (Experimental)';
    return 'Unknown';
  };

  const validateIpAddress = (ip: string): boolean => {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    
    return parts.every(part => {
      const num = parseInt(part);
      return num >= 0 && num <= 255 && part === num.toString();
    });
  };

  const validateSubnetMask = (mask: string): boolean => {
    if (!validateIpAddress(mask)) return false;
    
    const parts = mask.split('.').map(Number);
    const binary = parts.map(part => part.toString(2).padStart(8, '0')).join('');
    
    // Check if it's a valid subnet mask (all 1s followed by all 0s)
    let foundZero = false;
    for (const bit of binary) {
      if (bit === '0') {
        foundZero = true;
      } else if (foundZero && bit === '1') {
        return false; // Invalid: 1 after 0
      }
    }
    return true;
  };

  const calculateSubnet = () => {
    setError("");
    setSubnetInfo(null);

    if (!ipAddress.trim()) {
      setError("Please enter an IP address");
      return;
    }

    if (!validateIpAddress(ipAddress)) {
      setError("Please enter a valid IP address");
      return;
    }

    let currentCidr: number;
    let currentSubnetMask: string;

    if (inputType === 'cidr') {
      if (!cidr.trim()) {
        setError("Please enter a CIDR notation");
        return;
      }
      
      const cidrNum = parseInt(cidr);
      if (isNaN(cidrNum) || cidrNum < 0 || cidrNum > 32) {
        setError("CIDR must be between 0 and 32");
        return;
      }
      
      currentCidr = cidrNum;
      currentSubnetMask = cidrToSubnetMask(cidrNum);
    } else {
      if (!subnetMask.trim()) {
        setError("Please enter a subnet mask");
        return;
      }
      
      if (!validateSubnetMask(subnetMask)) {
        setError("Please enter a valid subnet mask");
        return;
      }
      
      currentSubnetMask = subnetMask;
      currentCidr = subnetMaskToCidr(subnetMask);
    }

    const ipNum = ipToNumber(ipAddress);
    const maskNum = ipToNumber(currentSubnetMask);
    
    const networkNum = ipNum & maskNum;
    const broadcastNum = networkNum | (~maskNum >>> 0);
    
    const networkAddress = numberToIp(networkNum);
    const broadcastAddress = numberToIp(broadcastNum);
    
    const firstHostNum = networkNum + 1;
    const lastHostNum = broadcastNum - 1;
    
    const firstHost = numberToIp(firstHostNum);
    const lastHost = numberToIp(lastHostNum);
    
    const wildcardMask = numberToIp(~maskNum >>> 0);
    const totalHosts = Math.pow(2, 32 - currentCidr);
    const usableHosts = Math.max(0, totalHosts - 2);
    
    const info: SubnetInfo = {
      networkAddress,
      broadcastAddress,
      firstHost,
      lastHost,
      subnetMask: currentSubnetMask,
      wildcardMask,
      cidr: `/${currentCidr}`,
      totalHosts,
      usableHosts,
      networkClass: getNetworkClass(ipAddress),
      binarySubnetMask: toBinary(currentSubnetMask),
      binaryNetworkAddress: toBinary(networkAddress),
      binaryBroadcastAddress: toBinary(broadcastAddress)
    };

    setSubnetInfo(info);
    
    // Update the other input type
    if (inputType === 'cidr') {
      setSubnetMask(currentSubnetMask);
    } else {
      setCidr(currentCidr.toString());
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
    const examples: Record<string, { ip: string; cidr: string }> = {
      home: { ip: "192.168.1.1", cidr: "24" },
      office: { ip: "10.0.0.1", cidr: "16" },
      server: { ip: "172.16.0.1", cidr: "20" },
      public: { ip: "8.8.8.8", cidr: "32" }
    };
    
    const exampleData = examples[example];
    setIpAddress(exampleData.ip);
    setCidr(exampleData.cidr);
    setInputType('cidr');
  };

  useEffect(() => {
    if (ipAddress && (cidr || subnetMask)) {
      calculateSubnet();
    }
  }, [ipAddress, cidr, subnetMask, inputType]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Subnet Calculator</h2>
        <p className="text-muted-foreground">
          Calculate network information, subnet masks, and CIDR notation for IP addresses
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Network Configuration
            </CardTitle>
            <CardDescription>
              Enter IP address and subnet information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ip-address">IP Address</Label>
              <Input
                id="ip-address"
                placeholder="192.168.1.1"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className="font-mono"
              />
            </div>

            <div>
              <Label>Input Type</Label>
              <Select value={inputType} onValueChange={(value: any) => setInputType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cidr">CIDR Notation</SelectItem>
                  <SelectItem value="subnet">Subnet Mask</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {inputType === 'cidr' ? (
              <div>
                <Label htmlFor="cidr">CIDR Notation</Label>
                <Input
                  id="cidr"
                  placeholder="24"
                  value={cidr}
                  onChange={(e) => setCidr(e.target.value)}
                  className="font-mono"
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="subnet-mask">Subnet Mask</Label>
                <Input
                  id="subnet-mask"
                  placeholder="255.255.255.0"
                  value={subnetMask}
                  onChange={(e) => setSubnetMask(e.target.value)}
                  className="font-mono"
                />
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadExample('home')}
              >
                Home Network
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadExample('office')}
              >
                Office Network
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadExample('server')}
              >
                Server Network
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadExample('public')}
              >
                Public IP
              </Button>
            </div>

            <Button
              onClick={calculateSubnet}
              disabled={!ipAddress.trim() || (!cidr.trim() && !subnetMask.trim())}
              className="w-full"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Subnet
            </Button>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {subnetInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Network Information
              </CardTitle>
              <CardDescription>
                Calculated network details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Network Address</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-mono text-sm">{subnetInfo.networkAddress}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(subnetInfo.networkAddress)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Broadcast Address</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-mono text-sm">{subnetInfo.broadcastAddress}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(subnetInfo.broadcastAddress)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">First Host</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-mono text-sm">{subnetInfo.firstHost}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(subnetInfo.firstHost)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Host</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-mono text-sm">{subnetInfo.lastHost}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(subnetInfo.lastHost)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Subnet Mask</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-mono text-sm">{subnetInfo.subnetMask}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(subnetInfo.subnetMask)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Wildcard Mask</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-mono text-sm">{subnetInfo.wildcardMask}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(subnetInfo.wildcardMask)}
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

      {subnetInfo && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Network Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">CIDR Notation</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="secondary">{subnetInfo.cidr}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(subnetInfo.cidr)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Network Class</Label>
                  <div className="mt-1">
                    <Badge variant="outline">{subnetInfo.networkClass}</Badge>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Total Hosts</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-medium">{subnetInfo.totalHosts.toLocaleString()}</span>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Usable Hosts</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-medium">{subnetInfo.usableHosts.toLocaleString()}</span>
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Binary Representation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Network Address (Binary)</Label>
                <div className="mt-1 p-2 bg-muted rounded font-mono text-xs break-all">
                  {subnetInfo.binaryNetworkAddress}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Subnet Mask (Binary)</Label>
                <div className="mt-1 p-2 bg-muted rounded font-mono text-xs break-all">
                  {subnetInfo.binarySubnetMask}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Broadcast Address (Binary)</Label>
                <div className="mt-1 p-2 bg-muted rounded font-mono text-xs break-all">
                  {subnetInfo.binaryBroadcastAddress}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Network Security Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5" />
              <p>• Private IP ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16</p>
            </div>
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5" />
              <p>• Loopback range: 127.0.0.0/8 (127.0.0.1 is localhost)</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <p>• Always verify network configurations before applying to production</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p>• Use appropriate subnet sizes to avoid IP address waste</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubnetCalculator;
