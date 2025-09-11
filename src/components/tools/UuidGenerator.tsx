import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Copy, Check, RefreshCw, Trash2, Database, Key, User, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const UuidGenerator = () => {
  const [currentUuid, setCurrentUuid] = useState("");
  const [uuidHistory, setUuidHistory] = useState<string[]>([]);
  const [copiedUuid, setCopiedUuid] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    generateNewUuid();
  }, []);

  const generateNewUuid = () => {
    const newUuid = generateUUID();
    setCurrentUuid(newUuid);
    setUuidHistory(prev => [newUuid, ...prev.slice(0, 9)]); // Keep last 10
  };

  const copyToClipboard = async (uuid: string) => {
    try {
      await navigator.clipboard.writeText(uuid);
      setCopiedUuid(uuid);
      toast({
        title: "Copied!",
        description: "UUID copied to clipboard",
      });
      setTimeout(() => setCopiedUuid(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const clearHistory = () => {
    setUuidHistory([]);
    toast({
      title: "History cleared",
      description: "UUID history has been cleared",
    });
  };

  const generateMultiple = (count: number) => {
    const newUuids = Array.from({ length: count }, () => generateUUID());
    setUuidHistory(prev => [...newUuids, ...prev.slice(0, 10 - count)]);
    setCurrentUuid(newUuids[0]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">UUID Generator</h2>
        <p className="text-muted-foreground">
          Generate universally unique identifiers (UUID v4) for your applications
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current UUID</CardTitle>
          <CardDescription>
            Click generate to create a new UUID v4
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={currentUuid}
              readOnly
              className="font-mono bg-code-bg"
            />
            <Button
              variant="outline"
              onClick={() => copyToClipboard(currentUuid)}
              className="gap-2 whitespace-nowrap"
            >
              {copiedUuid === currentUuid ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copiedUuid === currentUuid ? "Copied!" : "Copy"}
            </Button>
          </div>
          <Button onClick={generateNewUuid} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Generate New UUID
          </Button>
        </CardContent>
      </Card>

      {uuidHistory.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent UUIDs</CardTitle>
                <CardDescription>
                  Your last {uuidHistory.length} generated UUIDs
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearHistory}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uuidHistory.map((uuid, index) => (
                <div
                  key={uuid}
                  className="flex items-center gap-2 p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                >
                  <Badge variant="outline" className="text-xs min-w-[3rem] justify-center">
                    {index === 0 ? "Latest" : `#${index + 1}`}
                  </Badge>
                  <Input
                    value={uuid}
                    readOnly
                    className="font-mono bg-transparent border-none text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(uuid)}
                  >
                    {copiedUuid === uuid ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Generate multiple UUIDs or use common examples</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-600" />
                <Label className="text-sm font-medium">Bulk Generate</Label>
              </div>
              <div className="space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateMultiple(5)}
                  className="w-full justify-start text-xs"
                >
                  Generate 5 UUIDs
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateMultiple(10)}
                  className="w-full justify-start text-xs"
                >
                  Generate 10 UUIDs
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-green-600" />
                <Label className="text-sm font-medium">Common Uses</Label>
              </div>
              <div className="space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const uuid = generateUUID();
                    setCurrentUuid(uuid);
                    setUuidHistory(prev => [uuid, ...prev.slice(0, 9)]);
                  }}
                  className="w-full justify-start text-xs"
                >
                  Database Primary Key
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const uuid = generateUUID();
                    setCurrentUuid(uuid);
                    setUuidHistory(prev => [uuid, ...prev.slice(0, 9)]);
                  }}
                  className="w-full justify-start text-xs"
                >
                  Session ID
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-purple-600" />
                <Label className="text-sm font-medium">User IDs</Label>
              </div>
              <div className="space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const uuid = generateUUID();
                    setCurrentUuid(uuid);
                    setUuidHistory(prev => [uuid, ...prev.slice(0, 9)]);
                  }}
                  className="w-full justify-start text-xs"
                >
                  User ID
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const uuid = generateUUID();
                    setCurrentUuid(uuid);
                    setUuidHistory(prev => [uuid, ...prev.slice(0, 9)]);
                  }}
                  className="w-full justify-start text-xs"
                >
                  API Key ID
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-orange-600" />
                <Label className="text-sm font-medium">File IDs</Label>
              </div>
              <div className="space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const uuid = generateUUID();
                    setCurrentUuid(uuid);
                    setUuidHistory(prev => [uuid, ...prev.slice(0, 9)]);
                  }}
                  className="w-full justify-start text-xs"
                >
                  File ID
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const uuid = generateUUID();
                    setCurrentUuid(uuid);
                    setUuidHistory(prev => [uuid, ...prev.slice(0, 9)]);
                  }}
                  className="w-full justify-start text-xs"
                >
                  Document ID
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* UUID Information */}
      <Card>
        <CardHeader>
          <CardTitle>About UUID v4</CardTitle>
          <CardDescription>Understanding UUIDs and their applications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-2">What is UUID?</h4>
              <ul className="space-y-1">
                <li>• 128-bit unique identifier</li>
                <li>• Version 4: Random generation</li>
                <li>• Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</li>
                <li>• Extremely low collision probability</li>
                <li>• Globally unique across systems</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Common Use Cases:</h4>
              <ul className="space-y-1">
                <li>• Database primary keys</li>
                <li>• Session identifiers</li>
                <li>• API request IDs</li>
                <li>• File and document IDs</li>
                <li>• Distributed system identifiers</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Database className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">UUID Versions</p>
                <p className="text-blue-700 dark:text-blue-300">
                  This generator creates UUID v4 (random UUIDs). Other versions include v1 (timestamp-based), 
                  v3/v5 (name-based with MD5/SHA-1), but v4 is most commonly used for its simplicity and randomness.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UuidGenerator;