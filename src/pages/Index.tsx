import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Send,
  Database,
  Network,
  Sparkles,
  GitCommit,
  Star,
  Download,
  Users,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Filter,
  Image,
  Layout,
  Timer,
  Dice1,
  ArrowRightLeft,
  GitBranch,
  Smartphone,
  Camera,
  GitMerge,
  Calendar,
  Heart
} from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
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
import CurlGenerator from "@/components/tools/CurlGenerator";
import SubnetCalculator from "@/components/tools/SubnetCalculator";
import SslChecker from "@/components/tools/SslChecker";
import CronGenerator from "@/components/tools/CronGenerator";
import SlugGenerator from "@/components/tools/SlugGenerator";
import SqlFormatter from "@/components/tools/SqlFormatter";
import MockDataGenerator from "@/components/tools/MockDataGenerator";
import { FaviconGenerator } from "@/components/tools/FaviconGenerator";
import { FlexboxCreator } from "@/components/tools/FlexboxCreator";
import { TimezoneConverter } from "@/components/tools/TimezoneConverter";
import { RandomNumberGenerator } from "@/components/tools/RandomNumberGenerator";
import { UnitConverter } from "@/components/tools/UnitConverter";
import { ChecksumTool } from "@/components/tools/ChecksumTool";
import { APKAnalyzer } from "@/components/tools/APKAnalyzer";
import { EXIFInspector } from "@/components/tools/EXIFInspector";
import { BarcodeGenerator } from "@/components/tools/BarcodeGenerator";
import { SequenceDiagrams } from "@/components/tools/SequenceDiagrams";
import { MatrixCalculator } from "@/components/tools/MatrixCalculator";
import { ASCIIUnicodeExplorer } from "@/components/tools/ASCIIUnicodeExplorer";
import { ManifestGenerator } from "@/components/tools/ManifestGenerator";
import { StatisticsCalculator } from "@/components/tools/StatisticsCalculator";
import { NanoIDULIDGenerator } from "@/components/tools/NanoIDULIDGenerator";
import { WorkdayCalculator } from "@/components/tools/WorkdayCalculator";
import { PasswordStrengthTester } from "@/components/tools/PasswordStrengthTester";

const tools = [
  {
    id: "sequence-diagrams",
    name: "Sequence Diagrams",
    description: "Create PlantUML-style sequence diagrams with live preview and professional rendering",
    icon: GitMerge,
    category: "Web Development",
    isNew: true
  },
  {
    id: "matrix-calculator",
    name: "Matrix Calculator",
    description: "Perform matrix operations including determinant, inverse, transpose, and more",
    icon: Calculator,
    category: "Mathematics",
    isNew: true
  },
  {
    id: "ascii-unicode-explorer",
    name: "ASCII/Unicode Explorer",
    description: "Explore ASCII and Unicode characters with detailed information and encoding details",
    icon: Type,
    category: "Text & Data",
    isNew: true
  },
  {
    id: "manifest-generator",
    name: "PWA Manifest Generator",
    description: "Create and customize Progressive Web App manifests with comprehensive configuration options",
    icon: FileText,
    category: "Web Development",
    isNew: true
  },
  {
    id: "statistics-calculator",
    name: "Statistics Calculator",
    description: "Calculate descriptive statistics, generate probability distributions, and analyze data with comprehensive statistical tools",
    icon: BarChart3,
    category: "Mathematics",
    isNew: true
  },
  {
    id: "nanoid-ulid-generator",
    name: "NanoID / ULID Generator",
    description: "Generate unique identifiers using NanoID and ULID algorithms with comprehensive customization options",
    icon: Hash,
    category: "Generators",
    isNew: true
  },
  {
    id: "workday-calculator",
    name: "Workday Calculator",
    description: "Calculate business days, working hours, and project timelines with comprehensive holiday and weekend management",
    icon: Calendar,
    category: "Business",
    isNew: true
  },
  {
    id: "password-strength-tester",
    name: "Password Strength Tester",
    description: "Analyze password strength, calculate entropy, and get security recommendations",
    icon: Shield,
    category: "Cryptography & Security",
    isNew: true
  },
  {
    id: "barcode-generator",
    name: "Barcode Generator",
    description: "Generate professional barcodes in multiple formats with customizable options",
    icon: BarChart3,
    category: "Generator",
    isNew: true
  },
  {
    id: "exif-inspector",
    name: "EXIF Inspector",
    description: "Analyze image metadata and EXIF data for privacy, technical details, and location information",
    icon: Camera,
    category: "Security",
    isNew: true
  },
  {
    id: "apk-analyzer",
    name: "APK Analyzer",
    description: "Analyze Android APK files for security, permissions, and structure information",
    icon: Smartphone,
    category: "Security",
    isNew: true
  },
  {
    id: "checksum-tool",
    name: "Checksum Tool",
    description: "Professional file integrity verification with multiple hash algorithms and batch processing",
    icon: Shield,
    category: "Security",
    isNew: true
  },
  {
    id: "unit-converter",
    name: "Unit Converter",
    description: "Professional unit conversion with comprehensive categories, precision control, and conversion history",
    icon: ArrowRightLeft,
    category: "Utilities",
    isNew: true
  },
  {
    id: "random-generator",
    name: "Random Number Generator",
    description: "Professional random number generation with statistical analysis and seed support",
    icon: Dice1,
    category: "Utilities",
    isNew: true
  },
  {
    id: "timezone-converter",
    name: "Timezone Converter",
    description: "Professional timezone conversion with DST support and global coverage",
    icon: Timer,
    category: "Web Development",
    isNew: true
  },
  {
    id: "flexbox-creator",
    name: "Flexbox Creator",
    description: "Create and experiment with flexbox layouts with real-time visual feedback",
    icon: Layout,
    category: "Web Development",
    isNew: true
  },
  {
    id: "favicon-generator",
    name: "Favicon Generator",
    description: "Create favicons from emojis, text, or images with multiple formats",
    icon: Image,
    category: "Web Development",
    isNew: true
  },
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
    icon: Palette,
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
  },
  {
    id: "curl-generator",
    name: "cURL Command Generator",
    description: "Generate cURL commands for API testing and debugging",
    icon: Send,
    category: "Network"
  },
  {
    id: "subnet-calculator",
    name: "Subnet Calculator",
    description: "Calculate network information and subnet masks",
    icon: Network,
    category: "Network"
  },
  {
    id: "ssl-checker",
    name: "SSL/TLS Checker",
    description: "Check SSL certificate validity and security grade",
    icon: Shield,
    category: "Network"
  },
  {
    id: "cron-generator",
    name: "Cron Expression Generator",
    description: "Generate and validate cron expressions with visual interface",
    icon: Clock,
    category: "Development"
  },
  {
    id: "slug-generator",
    name: "Slug Generator",
    description: "Generate URL-friendly slugs from any text",
    icon: Hash,
    category: "Text"
  },
  {
    id: "sql-formatter",
    name: "SQL Formatter",
    description: "Format, validate and minify SQL queries with statistics",
    icon: Database,
    category: "Text"
  },
  {
    id: "mock-data-generator",
    name: "Mock Data Generator",
    description: "Generate fake names, emails, addresses, phones and more",
    icon: Users,
    category: "Generator"
  }
];

const categories = ["All", ...Array.from(new Set(tools.map(tool => tool.category)))];

// Cookie management functions
const setCookie = (name: string, value: string, days: number = 365) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Favorites management functions
const getFavorites = (): string[] => {
  try {
    const favorites = localStorage.getItem('devtools_favorites');
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

const saveFavorites = (favorites: string[]) => {
  try {
    localStorage.setItem('devtools_favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
};

const Index = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [hasVisitedBefore, setHasVisitedBefore] = useState<boolean>(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState<boolean>(false);
  const [hasScrolledInSession, setHasScrolledInSession] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const toolsSectionRef = useRef<HTMLElement>(null);

  const filteredTools = useMemo(() => {
    const filtered = tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesCategory;
      if (selectedCategory === "All") {
        matchesCategory = true;
      } else if (selectedCategory === "Favorites") {
        matchesCategory = favorites.includes(tool.id);
      } else {
        matchesCategory = tool.category === selectedCategory;
      }
      
      return matchesSearch && matchesCategory;
    });

    // Sort to show favorites first, then by name
    return filtered.sort((a, b) => {
      const aIsFavorite = favorites.includes(a.id);
      const bIsFavorite = favorites.includes(b.id);
      
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
      
      // If both are favorites or both are not favorites, sort by name
      return a.name.localeCompare(b.name);
    });
  }, [searchQuery, selectedCategory, favorites]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  // Toggle favorite function
  const toggleFavorite = (toolId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent tool selection when clicking favorite button
    
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.includes(toolId)
        ? prevFavorites.filter(id => id !== toolId)
        : [...prevFavorites, toolId];
      
      saveFavorites(newFavorites);
      return newFavorites;
    });
  };

  // Add smooth scroll CSS to the document (only once)
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: smooth;
      }
      @media (prefers-reduced-motion: no-preference) {
        html {
          scroll-behavior: smooth;
        }
      }
    `;
    document.head.appendChild(style);

    // Cleanup function to remove the style when component unmounts
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Handle visit tracking and scroll animation (only on main page and only once per session)
  useEffect(() => {
    // Only trigger scroll animation when on the main page (no tool selected) and haven't scrolled in this session
    if (selectedTool !== null || hasScrolledInSession) {
      return;
    }

    const visitCookie = getCookie('devtools_visited');
    
    if (visitCookie === 'true') {
      // User has visited before, scroll to tools section
      setHasVisitedBefore(true);
      setHasScrolledInSession(true); // Mark that we've scrolled in this session
      
      // Small delay to ensure the page is fully loaded
      setTimeout(() => {
        if (toolsSectionRef.current) {
          // Enhanced smooth scroll with better browser support
          const element = toolsSectionRef.current;
          const elementPosition = element.offsetTop;
          const offsetPosition = elementPosition - 20; // Small offset from top

          // Try native smooth scroll first
          if ('scrollBehavior' in document.documentElement.style) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
          } else {
            // Fallback for older browsers
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
          
          // Show welcome message after scroll animation
          setTimeout(() => {
            setShowWelcomeMessage(true);
          }, 1200);
        }
      }, 300);
    } else {
      // First visit, set the cookie
      setCookie('devtools_visited', 'true', 365);
      setHasVisitedBefore(false);
    }
  }, [selectedTool, hasScrolledInSession]); // Add hasScrolledInSession as dependency

  // Scroll to top when accessing a tool
  useEffect(() => {
    if (selectedTool !== null) {
      // Scroll to top when a tool is selected with delay for mobile
      setTimeout(() => {
        // Force scroll to top, especially important for mobile
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
        
        // Additional fallback for mobile devices
        setTimeout(() => {
          // Try multiple methods to ensure scroll to top works on all devices
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }, 100);
      }, 200);
    }
  }, [selectedTool]);

  const renderTool = () => {
    switch (selectedTool) {
      case "sequence-diagrams":
        return <SequenceDiagrams />;
      case "matrix-calculator":
        return <MatrixCalculator />;
      case "ascii-unicode-explorer":
        return <ASCIIUnicodeExplorer />;
      case "manifest-generator":
        return <ManifestGenerator />;
      case "statistics-calculator":
        return <StatisticsCalculator />;
      case "nanoid-ulid-generator":
        return <NanoIDULIDGenerator />;
      case "workday-calculator":
        return <WorkdayCalculator />;
      case "password-strength-tester":
        return <PasswordStrengthTester />;
      case "barcode-generator":
        return <BarcodeGenerator />;
      case "exif-inspector":
        return <EXIFInspector />;
      case "apk-analyzer":
        return <APKAnalyzer />;
      case "checksum-tool":
        return <ChecksumTool />;
      case "unit-converter":
        return <UnitConverter />;
      case "random-generator":
        return <RandomNumberGenerator />;
      case "timezone-converter":
        return <TimezoneConverter />;
      case "flexbox-creator":
        return <FlexboxCreator />;
      case "favicon-generator":
        return <FaviconGenerator />;
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
      case "curl-generator":
        return <CurlGenerator />;
      case "subnet-calculator":
        return <SubnetCalculator />;
      case "ssl-checker":
        return <SslChecker />;
      case "cron-generator":
        return <CronGenerator />;
      case "slug-generator":
        return <SlugGenerator />;
      case "sql-formatter":
        return <SqlFormatter />;
      case "mock-data-generator":
        return <MockDataGenerator />;
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
                  onClick={() => {
                    setSelectedTool(null);
                    // Scroll to Developer Tools section after a small delay
                    setTimeout(() => {
                      if (toolsSectionRef.current) {
                        toolsSectionRef.current.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                          inline: 'nearest'
                        });
                      }
                    }, 100);
                  }}
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
      {/* Hero Section with Stunning Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-primary/10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent opacity-40"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
              <Code2 className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              DevTools Hub
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            The ultimate collection of developer tools for modern web development. 
            <span className="text-primary font-semibold"> Fast, secure, and works offline</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => {
                if (toolsSectionRef.current) {
                  toolsSectionRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                  });
                }
              }}
            >
              <Star className="mr-2 h-5 w-5" />
              Explore Tools
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 rounded-xl border-primary/50 hover:bg-primary/10 hover:border-primary transition-all duration-300"
              onClick={() => window.open('https://github.com/hemelo/dev-tools', '_blank')}
            >
              <Github className="mr-2 h-5 w-5" />
              View GitHub
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{tools.length}+</div>
              <div className="text-sm text-muted-foreground">Developer Tools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Offline First</div>
            </div>
          <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">Free</div>
              <div className="text-sm text-muted-foreground">Forever</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowRight className="h-6 w-6 text-primary rotate-90" />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-background to-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose DevTools Hub?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built by developers, for developers. Experience the difference with our comprehensive tool suite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/50 group">
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Works Offline</h3>
              <p className="text-muted-foreground">All processing happens locally in your browser. No internet required.</p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/50 group">
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Privacy First</h3>
              <p className="text-muted-foreground">Your data never leaves your browser. Complete privacy guaranteed.</p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/50 group">
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground">Optimized for speed. Get results instantly without any delays.</p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/50 group">
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
              <p className="text-muted-foreground">Built by developers, for developers. Open source and always improving.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section ref={toolsSectionRef} className="py-20 bg-gradient-to-b from-card/50 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Developer Tools</h2>
            {showWelcomeMessage && (
              <div className="mb-4 animate-in fade-in duration-500">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  Welcome back! 🎉
                </Badge>
              </div>
            )}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Everything you need for modern development in one place
            </p>

            {/* Search and Filter */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg rounded-xl border-primary/20 focus:border-primary"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant={selectedCategory === "Favorites" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("Favorites")}
                  className="rounded-full"
                >
                  <Heart className={`h-4 w-4 mr-2 ${favorites.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                  Favorites ({favorites.length})
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className="rounded-full"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Card 
                key={tool.id} 
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-primary/50 group hover:-translate-y-1"
                onClick={() => setSelectedTool(tool.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                      <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="h-6 w-6 text-primary group-hover:scale-110 transition-all duration-200" />
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-transparent"
                            onClick={(e) => toggleFavorite(tool.id, e)}
                          >
                            <Heart 
                              className={`h-4 w-4 transition-all duration-200 ${
                                favorites.includes(tool.id) 
                                  ? 'fill-red-500 text-red-500 scale-110' 
                                  : 'text-muted-foreground hover:text-red-500 hover:scale-110'
                              }`} 
                            />
                          </Button>
                    <Badge variant="secondary" className="text-xs">
                      {tool.category}
                    </Badge>
                  </div>
                        {('isNew' in tool && tool.isNew) && (
                          <Badge variant="default" className="text-xs bg-green-500 hover:bg-green-600">
                            NEW
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors text-lg">
                    {tool.name}
                  </CardTitle>
                    <CardDescription className="text-sm">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5 transition-all duration-200">
                      <ArrowRight className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    Open Tool
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              {selectedCategory === "Favorites" && favorites.length === 0 ? (
                <>
                  <div className="p-4 rounded-full bg-muted w-fit mx-auto mb-4">
                    <Heart className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground">Click the heart icon on any tool to add it to your favorites</p>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-full bg-muted w-fit mx-auto mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No tools found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Code2 className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">DevTools Hub</h3>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                The ultimate collection of developer tools for modern web development. 
                Built with ❤️ by developers who understand your needs.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full hover:bg-primary/10 hover:border-primary transition-all duration-200"
                  onClick={() => window.open('https://github.com/hemelo/dev-tools', '_blank')}
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full hover:bg-primary/10 hover:border-primary transition-all duration-200"
                  onClick={() => window.open('https://x.com/hemelodev', '_blank')}
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full hover:bg-primary/10 hover:border-primary transition-all duration-200"
                  onClick={() => window.open('https://www.linkedin.com/in/henriquefcmelo/', '_blank')}
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full hover:bg-primary/10 hover:border-primary transition-all duration-200"
                  onClick={() => window.open('mailto:hemelo@pm.me', '_blank')}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Tools</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">JSON Tools</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cryptography</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Web Development</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Data Analysis</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Developer</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  <a 
                    href="https://github.com/hemelo" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    GitHub Profile
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  <a 
                    href="https://x.com/hemelodev" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    Twitter Profile
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  <a 
                    href="https://www.linkedin.com/in/henriquefcmelo/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    LinkedIn Profile
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a 
                    href="mailto:henrique@hemelo.fyi" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    hemelo@pm.me
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 DevTools Hub by <a href="https://github.com/hemelo" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@hemelo</a>. Built with React, TypeScript, and Tailwind CSS. Open source and free forever.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;