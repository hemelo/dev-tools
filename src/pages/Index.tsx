import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Code2, 
  Hash, 
  FileText, 
  Lock, 
  Link, 
  Braces,
  Key,
  Globe
} from "lucide-react";
import { useState } from "react";
import { JsonFormatter } from "@/components/tools/JsonFormatter";
import { UuidGenerator } from "@/components/tools/UuidGenerator";
import { Base64Tool } from "@/components/tools/Base64Tool";
import { UrlTool } from "@/components/tools/UrlTool";
import { HashGenerator } from "@/components/tools/HashGenerator";

const tools = [
  {
    id: "json",
    name: "JSON Formatter",
    description: "Format, validate and minify JSON data",
    icon: Braces,
    category: "Text"
  },
  {
    id: "uuid",
    name: "UUID Generator",
    description: "Generate unique identifiers (UUID v4)",
    icon: Key,
    category: "Generator"
  },
  {
    id: "base64",
    name: "Base64 Encoder/Decoder",
    description: "Encode and decode Base64 strings",
    icon: Lock,
    category: "Encoding"
  },
  {
    id: "url",
    name: "URL Encoder/Decoder",
    description: "Encode and decode URL components",
    icon: Link,
    category: "Encoding"
  },
  {
    id: "hash",
    name: "Hash Generator",
    description: "Generate MD5, SHA256, and other hashes",
    icon: Hash,
    category: "Security"
  }
];

const Index = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const renderTool = () => {
    switch (selectedTool) {
      case "json":
        return <JsonFormatter />;
      case "uuid":
        return <UuidGenerator />;
      case "base64":
        return <Base64Tool />;
      case "url":
        return <UrlTool />;
      case "hash":
        return <HashGenerator />;
      default:
        return null;
    }
  };

  if (selectedTool) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedTool(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ← Back to Tools
                </Button>
                <div className="flex items-center gap-2">
                  <Code2 className="h-6 w-6 text-primary" />
                  <h1 className="text-xl font-bold">DevTools Hub</h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {renderTool()}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Code2 className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">DevTools Hub</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Essential developer tools for everyday coding tasks. Fast, secure, and works offline.
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Card 
                key={tool.id} 
                className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-primary/50 group"
                onClick={() => setSelectedTool(tool.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <IconComponent className="h-8 w-8 text-primary group-hover:scale-110 transition-all duration-200" />
                    <Badge variant="secondary" className="text-xs">
                      {tool.category}
                    </Badge>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {tool.name}
                  </CardTitle>
                  <CardDescription>
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary">
                    Open Tool
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Why DevTools Hub?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex flex-col items-center gap-2">
                <Globe className="h-6 w-6 text-primary" />
                <span className="font-medium">Works Offline</span>
                <span className="text-muted-foreground">All processing happens locally</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Lock className="h-6 w-6 text-primary" />
                <span className="font-medium">Privacy First</span>
                <span className="text-muted-foreground">Your data never leaves your browser</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                <span className="font-medium">No Sign-up</span>
                <span className="text-muted-foreground">Free to use, no registration required</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;