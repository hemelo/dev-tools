import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, RefreshCw, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const UuidGenerator = () => {
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

      <Card>
        <CardHeader>
          <CardTitle>About UUID v4</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>UUID (Universally Unique Identifier)</strong> is a 128-bit identifier 
            used to uniquely identify objects in computer systems.
          </p>
          <p>
            <strong>Version 4 UUIDs</strong> are randomly generated and have extremely low 
            probability of collision. The format is: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
          </p>
          <p>
            Common use cases include database primary keys, session IDs, and object identifiers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};