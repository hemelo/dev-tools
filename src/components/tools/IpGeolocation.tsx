import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Globe, Shield, Wifi, Clock, Copy, Search, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GeolocationData {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
  status: string;
}

const IpGeolocation = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [geolocationData, setGeolocationData] = useState<GeolocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [myIp, setMyIp] = useState("");
  const { toast } = useToast();

  const getMyIp = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setMyIp(data.ip);
      setIpAddress(data.ip);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to get your IP address",
        variant: "destructive",
      });
    }
  };

  const validateIpAddress = (ip: string): boolean => {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  };

  const lookupIp = async () => {
    if (!ipAddress.trim()) {
      setError("Please enter an IP address");
      return;
    }

    if (!validateIpAddress(ipAddress)) {
      setError("Please enter a valid IP address");
      return;
    }

    setLoading(true);
    setError("");
    setGeolocationData(null);

    try {
      // Using ip-api.com (free tier)
      const response = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
      const data = await response.json();

      if (data.status === 'fail') {
        throw new Error(data.message || 'Failed to lookup IP address');
      }

      setGeolocationData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to lookup IP address");
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

  const getGoogleMapsUrl = (lat: number, lon: number) => {
    return `https://www.google.com/maps?q=${lat},${lon}`;
  };

  const getCountryFlag = (countryCode: string) => {
    return `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`;
  };

  const formatTimezone = (timezone: string) => {
    try {
      const now = new Date();
      const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
      const localTime = new Date(utc.getTime() + (new Date().getTimezoneOffset() * 60000));
      return `${timezone} (${localTime.toLocaleTimeString()})`;
    } catch {
      return timezone;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">IP Geolocation</h2>
        <p className="text-muted-foreground">
          Get detailed information about any IP address including location, ISP, and network details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              IP Lookup
            </CardTitle>
            <CardDescription>
              Enter an IP address to get geolocation information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ip-input">IP Address</Label>
              <div className="flex gap-2">
                <Input
                  id="ip-input"
                  placeholder="192.168.1.1 or 2001:db8::1"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={getMyIp}
                  disabled={loading}
                >
                  My IP
                </Button>
              </div>
            </div>

            <Button
              onClick={lookupIp}
              disabled={loading || !ipAddress.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Looking up...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Lookup IP
                </>
              )}
            </Button>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
              </div>
            )}

            {myIp && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-medium">Your IP: {myIp}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(myIp)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {geolocationData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Information
              </CardTitle>
              <CardDescription>
                Geographic details for {geolocationData.ip}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Country</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <img 
                      src={getCountryFlag(geolocationData.countryCode)} 
                      alt={geolocationData.country}
                      className="w-6 h-4"
                    />
                    <span className="font-medium">{geolocationData.country}</span>
                    <Badge variant="secondary">{geolocationData.countryCode}</Badge>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Region</Label>
                  <div className="mt-1">
                    <span className="font-medium">{geolocationData.regionName}</span>
                    <Badge variant="outline" className="ml-2">{geolocationData.region}</Badge>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">City</Label>
                  <div className="mt-1 font-medium">{geolocationData.city}</div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">ZIP Code</Label>
                  <div className="mt-1 font-medium">{geolocationData.zip || 'N/A'}</div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Coordinates</Label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-mono text-sm">
                    {geolocationData.lat}, {geolocationData.lon}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(getGoogleMapsUrl(geolocationData.lat, geolocationData.lon), '_blank')}
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    View on Map
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {geolocationData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                Network Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">ISP</Label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-medium">{geolocationData.isp}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(geolocationData.isp)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Organization</Label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-medium">{geolocationData.org}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(geolocationData.org)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">AS Number</Label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-mono text-sm">{geolocationData.as}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(geolocationData.as)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Time & Timezone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Timezone</Label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-medium">{formatTimezone(geolocationData.timezone)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(geolocationData.timezone)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Local Time</Label>
                <div className="mt-1 font-mono text-sm">
                  {new Date().toLocaleString('en-US', { 
                    timeZone: geolocationData.timezone,
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
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
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• This tool uses public IP geolocation services and does not store any data</p>
            <p>• IP addresses are only used for lookup purposes and are not logged</p>
            <p>• All lookups are performed client-side with external APIs</p>
            <p>• For privacy, consider using VPN services when testing</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IpGeolocation;
