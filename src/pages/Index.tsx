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
  Globe,
  Shield,
  CreditCard,
  Settings,
  Zap,
  Table,
  Palette,
  Calculator,
  Clock,
  Type,
  Search,
  QrCode,
  GitCompare,
  FileCode,
  Layers,
  BarChart3,
  MapPin,
  Eye,
  Palette as GradientIcon,
  Send,
  Database,
  Network,
  Sparkles,
  GitCommit
} from "lucide-react";
import { useState } from "react";
import { JsonFormatter } from "@/components/tools/JsonFormatter";
import { UuidGenerator } from "@/components/tools/UuidGenerator";
import { Base64Tool } from "@/components/tools/Base64Tool";
import { UrlTool } from "@/components/tools/UrlTool";
import { HashGenerator } from "@/components/tools/HashGenerator";
import { PasswordGenerator } from "@/components/tools/PasswordGenerator";
import { JwtTool } from "@/components/tools/JwtTool";
import { HmacGenerator } from "@/components/tools/HmacGenerator";
import { AesTool } from "@/components/tools/AesTool";
import { CsvJsonConverter } from "@/components/tools/CsvJsonConverter";
import { ColorPicker } from "@/components/tools/ColorPicker";
import { NumberBaseConverter } from "@/components/tools/NumberBaseConverter";
import { TimestampConverter } from "@/components/tools/TimestampConverter";
import CaseConverter from "@/components/tools/CaseConverter";
import { RegexTester } from "@/components/tools/RegexTester";
import { QrCodeGenerator } from "@/components/tools/QrCodeGenerator";
import { TextDiffTool } from "@/components/tools/TextDiffTool";
import { YamlJsonConverter } from "@/components/tools/YamlJsonConverter";
import { XmlFormatter } from "@/components/tools/XmlFormatter";
import DataVisualizer from "@/components/tools/DataVisualizer";
import IpGeolocation from "@/components/tools/IpGeolocation";
import MarkdownEditor from "@/components/tools/MarkdownEditor";
import CssGradientGenerator from "@/components/tools/CssGradientGenerator";
import ApiTester from "@/components/tools/ApiTester";
import JsonSchemaGenerator from "@/components/tools/JsonSchemaGenerator";
import DnsLookup from "@/components/tools/DnsLookup";
import LoremIpsumGenerator from "@/components/tools/LoremIpsumGenerator";
import ColorPaletteGenerator from "@/components/tools/ColorPaletteGenerator";
import GitCommitGenerator from "@/components/tools/GitCommitGenerator";

const tools = [
  {
    id: "json",
    name: "JSON Formatter",
    description: "Format, validate and minify JSON data",
    icon: Braces,
    category: "Text"
  },
  {
    id: "csv-json",
    name: "CSV ↔ JSON Converter",
    description: "Convert between CSV and JSON formats",
    icon: Table,
    category: "Text"
  },
  {
    id: "yaml-json",
    name: "YAML ↔ JSON Converter",
    description: "Convert between YAML and JSON formats",
    icon: Layers,
    category: "Text"
  },
  {
    id: "xml-formatter",
    name: "XML Formatter",
    description: "Format, validate and minify XML documents",
    icon: FileCode,
    category: "Text"
  },
  {
    id: "case-converter",
    name: "Text Case Converter",
    description: "Convert text between different case formats",
    icon: Type,
    category: "Text"
  },
  {
    id: "text-diff",
    name: "Text Diff Tool",
    description: "Compare two text documents and see differences",
    icon: GitCompare,
    category: "Text"
  },
  {
    id: "regex-tester",
    name: "Regex Tester",
    description: "Test regular expressions with live preview",
    icon: Search,
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
    id: "qr-code",
    name: "QR Code Generator",
    description: "Generate QR codes from text or URLs",
    icon: QrCode,
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
    id: "color-picker",
    name: "Color Picker & Converter",
    description: "Pick colors and convert between formats",
    icon: Palette,
    category: "Web Development"
  },
  {
    id: "number-base",
    name: "Number Base Converter",
    description: "Convert between binary, octal, decimal, hex",
    icon: Calculator,
    category: "Data"
  },
  {
    id: "timestamp",
    name: "Timestamp Converter",
    description: "Convert between Unix timestamps and dates",
    icon: Clock,
    category: "Data"
  },
  {
    id: "hash",
    name: "Hash Generator",
    description: "Generate MD5, SHA256, and other hashes",
    icon: Hash,
    category: "Cryptography"
  },
  {
    id: "password",
    name: "Password Generator",
    description: "Generate secure passwords with custom options",
    icon: Shield,
    category: "Cryptography"
  },
  {
    id: "jwt",
    name: "JWT Decoder",
    description: "Decode and validate JSON Web Tokens",
    icon: CreditCard,
    category: "Cryptography"
  },
  {
    id: "hmac",
    name: "HMAC Generator",
    description: "Generate HMAC signatures for authentication",
    icon: Settings,
    category: "Cryptography"
  },
  {
    id: "aes",
    name: "AES Encryption",
    description: "Encrypt and decrypt data with AES algorithm",
    icon: Zap,
    category: "Cryptography"
  },
  {
    id: "data-visualizer",
    name: "Data Visualizer",
    description: "Create charts from CSV and JSON data",
    icon: BarChart3,
    category: "Data Analysis"
  },
  {
    id: "ip-geolocation",
    name: "IP Geolocation",
    description: "Get location and network info from IP addresses",
    icon: MapPin,
    category: "Network"
  },
  {
    id: "markdown-editor",
    name: "Markdown Editor",
    description: "Write and preview markdown with live rendering",
    icon: Eye,
    category: "Content"
  },
  {
    id: "css-gradient-generator",
    name: "CSS Gradient Generator",
    description: "Create beautiful CSS gradients with visual preview",
    icon: GradientIcon,
    category: "Web Development"
  },
  {
    id: "api-tester",
    name: "API Tester",
    description: "Test REST APIs with detailed response analysis",
    icon: Send,
    category: "Network"
  },
  {
    id: "json-schema-generator",
    name: "JSON Schema Generator",
    description: "Generate JSON Schema from JSON data automatically",
    icon: Database,
    category: "Data Analysis"
  },
  {
    id: "dns-lookup",
    name: "DNS Lookup",
    description: "Query DNS records for any domain",
    icon: Network,
    category: "Network"
  },
  {
    id: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text in multiple languages",
    icon: Sparkles,
    category: "Content"
  },
  {
    id: "color-palette-generator",
    name: "Color Palette Generator",
    description: "Create color palettes with harmony rules and image extraction",
    icon: Palette,
    category: "Web Development"
  },
  {
    id: "git-commit-generator",
    name: "Git Commit Generator",
    description: "Generate conventional commit messages",
    icon: GitCommit,
    category: "Development"
  }
];

const Index = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const renderTool = () => {
    switch (selectedTool) {
      case "json":
        return <JsonFormatter />;
      case "csv-json":
        return <CsvJsonConverter />;
      case "yaml-json":
        return <YamlJsonConverter />;
      case "xml-formatter":
        return <XmlFormatter />;
      case "case-converter":
        return <CaseConverter />;
      case "text-diff":
        return <TextDiffTool />;
      case "regex-tester":
        return <RegexTester />;
      case "uuid":
        return <UuidGenerator />;
      case "qr-code":
        return <QrCodeGenerator />;
      case "base64":
        return <Base64Tool />;
      case "url":
        return <UrlTool />;
      case "color-picker":
        return <ColorPicker />;
      case "number-base":
        return <NumberBaseConverter />;
      case "timestamp":
        return <TimestampConverter />;
      case "hash":
        return <HashGenerator />;
      case "password":
        return <PasswordGenerator />;
      case "jwt":
        return <JwtTool />;
      case "hmac":
        return <HmacGenerator />;
      case "aes":
        return <AesTool />;
      case "data-visualizer":
        return <DataVisualizer />;
      case "ip-geolocation":
        return <IpGeolocation />;
      case "markdown-editor":
        return <MarkdownEditor />;
      case "css-gradient-generator":
        return <CssGradientGenerator />;
      case "api-tester":
        return <ApiTester />;
      case "json-schema-generator":
        return <JsonSchemaGenerator />;
      case "dns-lookup":
        return <DnsLookup />;
      case "lorem-ipsum-generator":
        return <LoremIpsumGenerator />;
      case "color-palette-generator":
        return <ColorPaletteGenerator />;
      case "git-commit-generator":
        return <GitCommitGenerator />;
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