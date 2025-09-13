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
import { useNavigate } from "react-router-dom";
import { getToolUrl } from "@/lib/toolUtils";
import { SEOHead } from "@/components/SEOHead";
import { useKeyboardShortcuts, SHORTCUT_PATTERNS } from "@/hooks/useKeyboardShortcuts";
import { KeyboardShortcutsModal } from "@/components/KeyboardShortcutsModal";
import { KeyboardShortcutsButton, KeyboardShortcutIndicator } from "@/components/KeyboardShortcutIndicator";
import { RecentToolsModal } from "@/components/RecentToolsModal";
import { RecentToolsFloatingButton } from "@/components/RecentToolsFloatingButton";
import { useLoading } from "@/hooks/useLoading";
import { LoadingWrapper, LoadingOverlay } from "@/components/LoadingWrapper";
import { 
  ToolGridSkeleton
} from "@/components/SkeletonComponents";
import { 
  StaggerContainer, 
  StaggerItem, 
  AnimatedToolCard,
  FadeIn 
} from "@/components/LoadingAnimations";
import { Footer } from "@/components/Footer";


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
  },
  {
    id: "sql-query-builder",
    name: "SQL Query Builder",
    description: "Build SQL queries visually with drag-and-drop interface and real-time generation",
    icon: Database,
    category: "Database",
    isNew: true
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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [hasVisitedBefore, setHasVisitedBefore] = useState<boolean>(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState<boolean>(false);
  const [hasScrolledInSession, setHasScrolledInSession] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);
  const [showRecentToolsModal, setShowRecentToolsModal] = useState<boolean>(false);
  const [selectedToolIndex, setSelectedToolIndex] = useState<number>(-1);
  const [isToolsLoading, setIsToolsLoading] = useState<boolean>(false);
  const toolsSectionRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Handle search loading state
  useEffect(() => {
    if (searchQuery) {
      setIsToolsLoading(true);
      const timer = setTimeout(() => {
        setIsToolsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setIsToolsLoading(false);
    }
  }, [searchQuery]);

  // Handle category loading state
  useEffect(() => {
    setIsToolsLoading(true);
    const timer = setTimeout(() => {
      setIsToolsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedCategory]);

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
    // Only trigger scroll animation when on the main page and haven't scrolled in this session
    if (hasScrolledInSession) {
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
  }, [hasScrolledInSession]); // Add hasScrolledInSession as dependency

  const handleToolClick = (toolId: string) => {
    const toolUrl = getToolUrl(toolId);
    navigate(toolUrl);
  };

  // Keyboard shortcut handlers - Simplified
  const focusSearch = () => {
    searchInputRef.current?.focus();
  };

  const navigateToNextCategory = () => {
    const categories = ["All", "Text", "Cryptography", "Web Development", "Generator", "Network", "Utilities", "Security", "Data", "Favorites"];
    const currentIndex = categories.indexOf(selectedCategory);
    const nextIndex = currentIndex < categories.length - 1 ? currentIndex + 1 : 0;
    setCategory(categories[nextIndex]);
  };

  const navigateToPrevCategory = () => {
    const categories = ["All", "Text", "Cryptography", "Web Development", "Generator", "Network", "Utilities", "Security", "Data", "Favorites"];
    const currentIndex = categories.indexOf(selectedCategory);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : categories.length - 1;
    setCategory(categories[prevIndex]);
  };

  const setCategory = (category: string) => {
    setSelectedCategory(category);
    setSelectedToolIndex(-1);
  };

  // Keyboard shortcuts configuration - Simplified
  const shortcuts = [
    // Navigation
    SHORTCUT_PATTERNS.SEARCH(focusSearch),
    
    // Category navigation
    SHORTCUT_PATTERNS.NEXT_CATEGORY(navigateToNextCategory),
    SHORTCUT_PATTERNS.PREV_CATEGORY(navigateToPrevCategory),
    
    // Help
    SHORTCUT_PATTERNS.HELP(() => setShowShortcutsModal(true)),
  ];

  // Apply keyboard shortcuts
  useKeyboardShortcuts(shortcuts, { enabled: true, debug: false });

  // Remove page-level skeleton loading for immediate hero section display

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="DevTools Hub - Essential Developer Tools"
        description="Free online developer tools including JSON formatter, UUID generator, Base64 encoder/decoder, URL encoder, and hash generators. Fast, secure, and works offline."
        keywords="developer tools, json formatter, uuid generator, base64 encoder, url encoder, hash generator, password generator, qr code generator, free tools, online tools, web development, programming tools"
        canonical="https://devtools.hemelo.fyi"
      />
      
      {/* Skip Navigation Links */}
      <nav className="sr-only focus-within:not-sr-only" aria-label="Skip navigation">
        <a 
          href="#main-content" 
          className="absolute top-4 left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <a 
          href="#tools-section" 
          className="absolute top-16 left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Skip to tools
        </a>
      </nav>

      {/* Hero Section with Stunning Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" aria-label="Hero section">
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
        <main id="main-content" className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <header className="mb-8">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20" aria-hidden="true">
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
          </header>

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
              aria-label="Explore Tools - Scroll to developer tools section"
            >
              <Star className="mr-2 h-5 w-5" aria-hidden="true" />
              Explore Tools
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 rounded-xl border-primary/50 hover:bg-primary/10 hover:border-primary transition-all duration-300"
              onClick={() => window.open('https://github.com/hemelo/dev-tools', '_blank')}
              aria-label="View project on GitHub (opens in new tab)"
            >
              <Github className="mr-2 h-5 w-5" aria-hidden="true" />
              View GitHub
            </Button>
          </div>

          {/* Stats */}
          <section aria-label="Platform statistics" className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2" aria-label={`${tools.length} plus`}>{tools.length}+</div>
              <div className="text-sm text-muted-foreground">Developer Tools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2" aria-label="100 percent">100%</div>
              <div className="text-sm text-muted-foreground">Offline First</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">Free</div>
              <div className="text-sm text-muted-foreground">Forever</div>
            </div>
          </section>

        </main>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce" aria-hidden="true">
            <ArrowRight className="h-6 w-6 text-primary rotate-90" />
          </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-background to-card/50" aria-labelledby="benefits-heading">
        <div className="container mx-auto px-4">
          <header className="text-center mb-16">
            <h2 id="benefits-heading" className="text-4xl font-bold mb-4">Why Choose DevTools Hub?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built by developers, for developers. Experience the difference with our comprehensive tool suite.
            </p>
          </header>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" aria-label="Platform benefits">
            <li className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/50 group">
              <article>
                <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-6 group-hover:bg-primary/20 transition-colors" aria-hidden="true">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Works Offline</h3>
                <p className="text-muted-foreground">All processing happens locally in your browser. No internet required.</p>
              </article>
            </li>

            <li className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/50 group">
              <article>
                <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-6 group-hover:bg-primary/20 transition-colors" aria-hidden="true">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Privacy First</h3>
                <p className="text-muted-foreground">Your data never leaves your browser. Complete privacy guaranteed.</p>
              </article>
            </li>

            <li className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/50 group">
              <article>
                <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-6 group-hover:bg-primary/20 transition-colors" aria-hidden="true">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground">Optimized for speed. Get results instantly without any delays.</p>
              </article>
            </li>

            <li className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/50 group">
              <article>
                <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-6 group-hover:bg-primary/20 transition-colors" aria-hidden="true">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
                <p className="text-muted-foreground">Built by developers, for developers. Open source and always improving.</p>
              </article>
            </li>
          </ul>
        </div>
      </section>

      {/* Tools Section */}
      <section ref={toolsSectionRef} id="tools-section" className="py-20 bg-gradient-to-b from-card/50 to-background" aria-labelledby="tools-heading">
        <div className="container mx-auto px-4">
          <header className="text-center mb-16">
            <h2 id="tools-heading" className="text-4xl font-bold mb-4">Developer Tools</h2>
            {showWelcomeMessage && (
              <div className="mb-4 animate-in fade-in duration-500" role="status" aria-live="polite">
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
                <label htmlFor="tool-search" className="sr-only">Search developer tools</label>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="tool-search"
                  ref={searchInputRef}
                  placeholder="Search tools... (Ctrl+K to focus)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg rounded-xl border-primary/20 focus:border-primary"
                  aria-describedby="search-help"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2" aria-hidden="true">
                  <kbd className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                    /
                  </kbd>
                </div>
              </div>
              <div id="search-help" className="sr-only">
                Use the search field to find developer tools by name or description. Press Ctrl+K to focus the search field.
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center items-center" role="group" aria-label="Filter tools by category">
                <Button
                  variant={selectedCategory === "Favorites" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("Favorites")}
                  className="rounded-full"
                  aria-pressed={selectedCategory === "Favorites"}
                  aria-label={`Show favorites (${favorites.length} tools)`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${favorites.length > 0 ? 'fill-red-500 text-red-500' : ''}`} aria-hidden="true" />
                  Favorites ({favorites.length})
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className="rounded-full"
                    aria-pressed={selectedCategory === category}
                    aria-label={`Filter by ${category} category`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </header>

          {/* Screen reader announcement for filtered results */}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {filteredTools.length === 0 
              ? "No tools found matching your search criteria" 
              : `Showing ${filteredTools.length} developer tool${filteredTools.length === 1 ? '' : 's'}`
            }
          </div>

          <LoadingWrapper
            isLoading={isToolsLoading}
            skeleton={<ToolGridSkeleton count={filteredTools.length || 9} />}
          >
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Developer tools grid">
            {filteredTools.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <StaggerItem key={tool.id}>
                <article
                  className={`hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-primary/50 group ${
                    selectedToolIndex === index ? 'ring-2 ring-primary border-primary/50' : ''
                  }`}
                  onClick={() => handleToolClick(tool.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleToolClick(tool.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open ${tool.name} tool - ${tool.description}`}
                  aria-describedby={`tool-${tool.id}-description`}
                >
                  <AnimatedToolCard>
                    <Card className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                      <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="h-6 w-6 text-primary group-hover:scale-110 transition-all duration-200" aria-hidden="true" />
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-transparent"
                            onClick={(e) => toggleFavorite(tool.id, e)}
                            aria-label={favorites.includes(tool.id) ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`}
                          >
                            <Heart 
                              className={`h-4 w-4 transition-all duration-200 ${
                                favorites.includes(tool.id) 
                                  ? 'fill-red-500 text-red-500 scale-110' 
                                  : 'text-muted-foreground hover:text-red-500 hover:scale-110'
                              }`} 
                              aria-hidden="true"
                            />
                          </Button>
                    <Badge variant="secondary" className="text-xs" aria-label={`Category: ${tool.category}`}>
                      {tool.category}
                    </Badge>
                  </div>
                        {('isNew' in tool && tool.isNew) && (
                          <Badge variant="default" className="text-xs bg-green-500 hover:bg-green-600" aria-label="New tool">
                            NEW
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors text-lg">
                    {tool.name}
                  </CardTitle>
                    <CardDescription id={`tool-${tool.id}-description`} className="text-sm">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5 transition-all duration-200"
                      aria-label={`Open ${tool.name} tool`}
                    >
                      <ArrowRight className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    Open Tool
                  </Button>
                </CardContent>
              </Card>
                  </AnimatedToolCard>
                </article>
              </StaggerItem>
            );
          })}
            </StaggerContainer>
          </LoadingWrapper>

          {filteredTools.length === 0 && (
            <div className="text-center py-12" role="status" aria-live="polite">
              {selectedCategory === "Favorites" && favorites.length === 0 ? (
                <>
                  <div className="p-4 rounded-full bg-muted w-fit mx-auto mb-4" aria-hidden="true">
                    <Heart className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground">Click the heart icon on any tool to add it to your favorites</p>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-full bg-muted w-fit mx-auto mb-4" aria-hidden="true">
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
      <Footer />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        open={showShortcutsModal}
        onOpenChange={setShowShortcutsModal}
        shortcuts={shortcuts}
      />

      {/* Keyboard Shortcut Indicator */}
      <KeyboardShortcutIndicator
        shortcuts={shortcuts}
        onShowHelp={() => setShowShortcutsModal(true)}
      />

      {/* Recent Tools Floating Button */}
      <RecentToolsFloatingButton
        onClick={() => setShowRecentToolsModal(true)}
      />

      {/* Recent Tools Modal */}
      <RecentToolsModal
        open={showRecentToolsModal}
        onOpenChange={setShowRecentToolsModal}
        onToolClick={handleToolClick}
        showStats={true}
        maxItems={10}
      />
    </div>
  );
};

export default Index;