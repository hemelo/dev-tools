import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Check, Clock, Calendar, RotateCcw, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TimestampFormats {
  unix: string;
  unixMs: string;
  iso: string;
  utc: string;
  local: string;
  readable: string;
}

const TimestampConverter = () => {
  const [inputValue, setInputValue] = useState("");
  const [inputType, setInputType] = useState<"unix" | "unix-ms" | "iso" | "date">("unix");
  const [formats, setFormats] = useState<TimestampFormats>({
    unix: "",
    unixMs: "",
    iso: "",
    utc: "",
    local: "",
    readable: ""
  });
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const formatDate = (date: Date): TimestampFormats => {
    const unix = Math.floor(date.getTime() / 1000).toString();
    const unixMs = date.getTime().toString();
    const iso = date.toISOString();
    const utc = date.toUTCString();
    const local = date.toString();
    const readable = date.toLocaleString();

    return {
      unix,
      unixMs,
      iso,
      utc,
      local,
      readable
    };
  };

  const parseInput = (value: string, type: string): Date | null => {
    if (!value.trim()) return null;

    try {
      switch (type) {
        case "unix":
          const unixTimestamp = parseInt(value);
          if (isNaN(unixTimestamp)) throw new Error("Invalid Unix timestamp");
          return new Date(unixTimestamp * 1000);
        
        case "unix-ms":
          const unixMsTimestamp = parseInt(value);
          if (isNaN(unixMsTimestamp)) throw new Error("Invalid Unix timestamp (milliseconds)");
          return new Date(unixMsTimestamp);
        
        case "iso":
          const isoDate = new Date(value);
          if (isNaN(isoDate.getTime())) throw new Error("Invalid ISO date string");
          return isoDate;
        
        case "date":
          const date = new Date(value);
          if (isNaN(date.getTime())) throw new Error("Invalid date string");
          return date;
        
        default:
          return null;
      }
    } catch (err) {
      throw err;
    }
  };

  const performConversion = () => {
    if (!inputValue.trim()) {
      setFormats({
        unix: "",
        unixMs: "",
        iso: "",
        utc: "",
        local: "",
        readable: ""
      });
      setError("");
      return;
    }

    try {
      const date = parseInput(inputValue, inputType);
      
      if (!date) {
        setFormats({
          unix: "",
          unixMs: "",
          iso: "",
          utc: "",
          local: "",
          readable: ""
        });
        setError("");
        return;
      }

      const newFormats = formatDate(date);
      setFormats(newFormats);
      setError("");
    } catch (err) {
      setError((err as Error).message);
      setFormats({
        unix: "",
        unixMs: "",
        iso: "",
        utc: "",
        local: "",
        readable: ""
      });
    }
  };

  useEffect(() => {
    performConversion();
  }, [inputValue, inputType]);

  const copyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(format);
      toast({
        title: "Copied!",
        description: `${format} copied to clipboard`,
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
    setFormats({
      unix: "",
      unixMs: "",
      iso: "",
      utc: "",
      local: "",
      readable: ""
    });
    setError("");
  };

  const setCurrentTime = () => {
    const now = new Date();
    setInputType("unix");
    setInputValue(Math.floor(now.getTime() / 1000).toString());
  };

  const getInputPlaceholder = () => {
    switch (inputType) {
      case "unix": return "1640995200";
      case "unix-ms": return "1640995200000";
      case "iso": return "2022-01-01T00:00:00.000Z";
      case "date": return "2022-01-01 00:00:00";
      default: return "Enter timestamp";
    }
  };

  const getInputDescription = () => {
    switch (inputType) {
      case "unix": return "Unix timestamp in seconds (e.g., 1640995200)";
      case "unix-ms": return "Unix timestamp in milliseconds (e.g., 1640995200000)";
      case "iso": return "ISO 8601 date string (e.g., 2022-01-01T00:00:00.000Z)";
      case "date": return "Date string (e.g., 2022-01-01 00:00:00)";
      default: return "Enter timestamp";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Timestamp Converter</h2>
        <p className="text-muted-foreground">
          Convert between Unix timestamps, ISO dates, and human-readable formats
        </p>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Input Timestamp</CardTitle>
          <CardDescription>Enter a timestamp in any format and see all conversions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="input-type">Input Type</Label>
              <Select value={inputType} onValueChange={(value: "unix" | "unix-ms" | "iso" | "date") => setInputType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unix">Unix Timestamp (seconds)</SelectItem>
                  <SelectItem value="unix-ms">Unix Timestamp (milliseconds)</SelectItem>
                  <SelectItem value="iso">ISO 8601 Date</SelectItem>
                  <SelectItem value="date">Date String</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="input-value">Timestamp</Label>
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
          
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={setCurrentTime} className="gap-2">
              <Zap className="h-4 w-4" />
              Current Time
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {getInputDescription()}
          </div>
          
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <div className="flex items-center gap-2 text-destructive">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-sm text-destructive/80 mt-1">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conversion Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Unix Timestamp */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Unix Timestamp</CardTitle>
              <Badge variant="secondary">Seconds</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-code-bg rounded-md p-3 min-h-[60px] flex items-center">
              <code className="text-sm font-mono break-all">
                {formats.unix || "—"}
              </code>
            </div>
            {formats.unix && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(formats.unix, "Unix Timestamp")}
                className="w-full gap-2"
              >
                {copied === "Unix Timestamp" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === "Unix Timestamp" ? "Copied!" : "Copy"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Unix Timestamp (ms) */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Unix Timestamp</CardTitle>
              <Badge variant="secondary">Milliseconds</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-code-bg rounded-md p-3 min-h-[60px] flex items-center">
              <code className="text-sm font-mono break-all">
                {formats.unixMs || "—"}
              </code>
            </div>
            {formats.unixMs && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(formats.unixMs, "Unix Timestamp (ms)")}
                className="w-full gap-2"
              >
                {copied === "Unix Timestamp (ms)" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === "Unix Timestamp (ms)" ? "Copied!" : "Copy"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* ISO 8601 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">ISO 8601</CardTitle>
              <Badge variant="secondary">UTC</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-code-bg rounded-md p-3 min-h-[60px] flex items-center">
              <code className="text-sm font-mono break-all">
                {formats.iso || "—"}
              </code>
            </div>
            {formats.iso && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(formats.iso, "ISO 8601")}
                className="w-full gap-2"
              >
                {copied === "ISO 8601" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === "ISO 8601" ? "Copied!" : "Copy"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* UTC String */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">UTC String</CardTitle>
              <Badge variant="secondary">GMT</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-code-bg rounded-md p-3 min-h-[60px] flex items-center">
              <code className="text-sm font-mono break-all">
                {formats.utc || "—"}
              </code>
            </div>
            {formats.utc && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(formats.utc, "UTC String")}
                className="w-full gap-2"
              >
                {copied === "UTC String" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === "UTC String" ? "Copied!" : "Copy"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Local String */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Local String</CardTitle>
              <Badge variant="secondary">Local Time</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-code-bg rounded-md p-3 min-h-[60px] flex items-center">
              <code className="text-sm font-mono break-all">
                {formats.local || "—"}
              </code>
            </div>
            {formats.local && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(formats.local, "Local String")}
                className="w-full gap-2"
              >
                {copied === "Local String" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === "Local String" ? "Copied!" : "Copy"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Readable Format */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Readable</CardTitle>
              <Badge variant="secondary">Human</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-code-bg rounded-md p-3 min-h-[60px] flex items-center">
              <code className="text-sm font-mono break-all">
                {formats.readable || "—"}
              </code>
            </div>
            {formats.readable && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(formats.readable, "Readable")}
                className="w-full gap-2"
              >
                {copied === "Readable" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === "Readable" ? "Copied!" : "Copy"}
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
              <Label className="text-sm font-medium">Unix Timestamps</Label>
              <div className="space-y-1">
                {["1640995200", "1609459200", "1672531200"].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInputType("unix");
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
              <Label className="text-sm font-medium">ISO Dates</Label>
              <div className="space-y-1">
                {["2022-01-01T00:00:00.000Z", "2021-01-01T00:00:00.000Z", "2023-01-01T00:00:00.000Z"].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInputType("iso");
                      setInputValue(example);
                    }}
                    className="w-full justify-start text-xs font-mono"
                  >
                    {example.split('T')[0]}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date Strings</Label>
              <div className="space-y-1">
                {["2022-01-01", "2022-12-31", "2023-06-15"].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInputType("date");
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
              <Label className="text-sm font-medium">Special Dates</Label>
              <div className="space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={setCurrentTime}
                  className="w-full justify-start text-xs"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Now
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInputType("unix");
                    setInputValue("0");
                  }}
                  className="w-full justify-start text-xs font-mono"
                >
                  Unix Epoch
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInputType("unix");
                    setInputValue("1000000000");
                  }}
                  className="w-full justify-start text-xs font-mono"
                >
                  Y2K38 Problem
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimestampConverter;
