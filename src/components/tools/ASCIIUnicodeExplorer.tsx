import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Copy, 
  Check, 
  Filter, 
  Info, 
  Zap,
  Eye,
  Download,
  Upload,
  Hash,
  Type,
  Globe,
  Code,
  FileText,
  Calculator,
  Grid3X3,
  List,
  Table,
  BookOpen,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  RotateCcw,
  Settings,
  Palette,
  Layers,
  Database,
  Network,
  Shield,
  Lock,
  Key,
  Star,
  Heart,
  Smile,
  Frown,
  Meh,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MapPin,
  Clock,
  Calendar,
  Mail,
  Phone,
  CreditCard,
  DollarSign,
  Percent,
  Plus,
  Minus,
  X,
  Divide,
  Equal,
  LessThan,
  GreaterThan,
  QuestionMark,
  AlertTriangle,
  AtSign,
  Hash as HashIcon,
  DollarSign as DollarIcon,
  Percent as PercentIcon,
  Ampersand,
  Asterisk,
  Parentheses,
  Brackets,
  Braces,
  Quotes,
  Apostrophe,
  Backslash,
  ForwardSlash,
  Pipe,
  Tilde,
  Backtick,
  Underscore,
  Period,
  Comma,
  Semicolon,
  Colon,
  Space,
  Square
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CharacterInfo {
  code: number;
  char: string;
  name: string;
  category: string;
  description: string;
  htmlEntity?: string;
  cssEscape?: string;
  unicodeBlock?: string;
  isPrintable: boolean;
  isControl: boolean;
  isWhitespace: boolean;
  isDigit: boolean;
  isLetter: boolean;
  isSymbol: boolean;
  isPunctuation: boolean;
}

interface UnicodeBlock {
  name: string;
  start: number;
  end: number;
  description: string;
  icon: any;
}

const ASCIIUnicodeExplorer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBlock, setSelectedBlock] = useState("all");
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [codeRange, setCodeRange] = useState<{ start: number; end: number }>({ start: 0, end: 127 });
  const { toast } = useToast();

  const unicodeBlocks: UnicodeBlock[] = [
    {
      name: "Basic Latin (ASCII)",
      start: 0,
      end: 127,
      description: "Standard ASCII characters",
      icon: Type
    },
    {
      name: "Latin-1 Supplement",
      start: 128,
      end: 255,
      description: "Extended Latin characters",
      icon: Globe
    },
    {
      name: "Latin Extended-A",
      start: 256,
      end: 383,
      description: "Additional Latin characters",
      icon: Globe
    },
    {
      name: "General Punctuation",
      start: 8192,
      end: 8303,
      description: "Punctuation marks and symbols",
      icon: AlertTriangle
    },
    {
      name: "Currency Symbols",
      start: 8352,
      end: 8399,
      description: "Currency and monetary symbols",
      icon: DollarSign
    },
    {
      name: "Arrows",
      start: 8592,
      end: 8703,
      description: "Arrow symbols and directional indicators",
      icon: ArrowRight
    },
    {
      name: "Mathematical Operators",
      start: 8704,
      end: 8959,
      description: "Mathematical symbols and operators",
      icon: Calculator
    },
    {
      name: "Box Drawing",
      start: 9472,
      end: 9599,
      description: "Box drawing and line characters",
      icon: Grid3X3
    },
    {
      name: "Block Elements",
      start: 9600,
      end: 9631,
      description: "Block and geometric shapes",
      icon: Square
    },
    {
      name: "Geometric Shapes",
      start: 9632,
      end: 9727,
      description: "Geometric and decorative shapes",
      icon: Square
    },
    {
      name: "Miscellaneous Symbols",
      start: 9728,
      end: 9983,
      description: "Various symbols and pictographs",
      icon: Star
    },
    {
      name: "Dingbats",
      start: 9984,
      end: 10175,
      description: "Decorative symbols and dingbats",
      icon: Heart
    },
    {
      name: "Emoticons",
      start: 128512,
      end: 128591,
      description: "Emoji and emoticon characters",
      icon: Smile
    },
    {
      name: "Transport and Map Symbols",
      start: 128640,
      end: 128767,
      description: "Transportation and map symbols",
      icon: MapPin
    },
    {
      name: "Enclosed Characters",
      start: 9312,
      end: 9471,
      description: "Enclosed alphanumeric characters",
      icon: Braces
    }
  ];

  const categories = [
    { value: "all", label: "All Characters", icon: List },
    { value: "printable", label: "Printable", icon: Type },
    { value: "control", label: "Control", icon: Settings },
    { value: "whitespace", label: "Whitespace", icon: Space },
    { value: "digit", label: "Digits", icon: Hash },
    { value: "letter", label: "Letters", icon: Type },
    { value: "symbol", label: "Symbols", icon: Star },
    { value: "punctuation", label: "Punctuation", icon: AlertTriangle }
  ];

  const generateCharacterInfo = (code: number): CharacterInfo => {
    const char = String.fromCharCode(code);
    
    // Get character name
    let name = "";
    try {
      name = char.codePointAt(0)?.toString(16) ? `U+${char.codePointAt(0)?.toString(16).toUpperCase().padStart(4, '0')}` : "";
    } catch {
      name = `U+${code.toString(16).toUpperCase().padStart(4, '0')}`;
    }

    // Determine category and properties
    const isControl = code < 32 || (code >= 127 && code < 160);
    const isWhitespace = /\s/.test(char);
    const isDigit = /\d/.test(char);
    const isLetter = /[a-zA-Z]/.test(char);
    const isSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(char);
    const isPunctuation = /[.,;:!?'"()[\]{}]/.test(char);
    const isPrintable = !isControl || code === 127;

    // Get category
    let category = "Other";
    if (isControl) category = "Control";
    else if (isWhitespace) category = "Whitespace";
    else if (isDigit) category = "Digit";
    else if (isLetter) category = "Letter";
    else if (isSymbol) category = "Symbol";
    else if (isPunctuation) category = "Punctuation";

    // Get description
    let description = "";
    if (isControl) {
      const controlNames: { [key: number]: string } = {
        0: "Null character",
        1: "Start of Heading",
        2: "Start of Text",
        3: "End of Text",
        4: "End of Transmission",
        5: "Enquiry",
        6: "Acknowledge",
        7: "Bell",
        8: "Backspace",
        9: "Horizontal Tab",
        10: "Line Feed",
        11: "Vertical Tab",
        12: "Form Feed",
        13: "Carriage Return",
        14: "Shift Out",
        15: "Shift In",
        16: "Data Link Escape",
        17: "Device Control 1",
        18: "Device Control 2",
        19: "Device Control 3",
        20: "Device Control 4",
        21: "Negative Acknowledge",
        22: "Synchronous Idle",
        23: "End of Transmission Block",
        24: "Cancel",
        25: "End of Medium",
        26: "Substitute",
        27: "Escape",
        28: "File Separator",
        29: "Group Separator",
        30: "Record Separator",
        31: "Unit Separator",
        127: "Delete"
      };
      description = controlNames[code] || "Control character";
    } else if (isWhitespace) {
      const whitespaceNames: { [key: number]: string } = {
        32: "Space",
        160: "Non-breaking space",
        8192: "En quad",
        8193: "Em quad",
        8194: "En space",
        8195: "Em space",
        8196: "Three-per-em space",
        8197: "Four-per-em space",
        8198: "Six-per-em space",
        8199: "Figure space",
        8200: "Punctuation space",
        8201: "Thin space",
        8202: "Hair space",
        8203: "Zero width space",
        8204: "Zero width non-joiner",
        8205: "Zero width joiner",
        8206: "Left-to-right mark",
        8207: "Right-to-left mark",
        8232: "Line separator",
        8233: "Paragraph separator"
      };
      description = whitespaceNames[code] || "Whitespace character";
    } else {
      description = `${category} character`;
    }

    // Get HTML entity
    let htmlEntity = "";
    if (code < 128) {
      htmlEntity = `&#${code};`;
    }

    // Get CSS escape
    let cssEscape = "";
    if (code < 128) {
      cssEscape = `\\${code.toString(16).padStart(2, '0')}`;
    }

    // Get Unicode block
    let unicodeBlock = "";
    for (const block of unicodeBlocks) {
      if (code >= block.start && code <= block.end) {
        unicodeBlock = block.name;
        break;
      }
    }

    return {
      code,
      char,
      name,
      category,
      description,
      htmlEntity,
      cssEscape,
      unicodeBlock,
      isPrintable,
      isControl,
      isWhitespace,
      isDigit,
      isLetter,
      isSymbol,
      isPunctuation
    };
  };

  const characters = useMemo(() => {
    const chars: CharacterInfo[] = [];
    for (let i = codeRange.start; i <= codeRange.end; i++) {
      chars.push(generateCharacterInfo(i));
    }
    return chars;
  }, [codeRange]);

  const filteredCharacters = useMemo(() => {
    let filtered = characters;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(char => 
        char.char.toLowerCase().includes(term) ||
        char.name.toLowerCase().includes(term) ||
        char.description.toLowerCase().includes(term) ||
        char.code.toString().includes(term) ||
        char.htmlEntity?.toLowerCase().includes(term) ||
        char.cssEscape?.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(char => {
        switch (selectedCategory) {
          case "printable": return char.isPrintable;
          case "control": return char.isControl;
          case "whitespace": return char.isWhitespace;
          case "digit": return char.isDigit;
          case "letter": return char.isLetter;
          case "symbol": return char.isSymbol;
          case "punctuation": return char.isPunctuation;
          default: return true;
        }
      });
    }

    // Filter by Unicode block
    if (selectedBlock !== "all") {
      const block = unicodeBlocks.find(b => b.name === selectedBlock);
      if (block) {
        filtered = filtered.filter(char => 
          char.code >= block.start && char.code <= block.end
        );
      }
    }

    return filtered;
  }, [characters, searchTerm, selectedCategory, selectedBlock]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const exportCharacters = () => {
    const data = filteredCharacters.map(char => ({
      code: char.code,
      character: char.char,
      name: char.name,
      category: char.category,
      description: char.description,
      htmlEntity: char.htmlEntity,
      cssEscape: char.cssEscape,
      unicodeBlock: char.unicodeBlock
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ascii-unicode-characters.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exported!",
      description: "Character data has been exported",
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Control": return Settings;
      case "Whitespace": return Space;
      case "Digit": return Hash;
      case "Letter": return Type;
      case "Symbol": return Star;
      case "Punctuation": return AlertTriangle;
      default: return Info;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Control": return "bg-red-500";
      case "Whitespace": return "bg-blue-500";
      case "Digit": return "bg-green-500";
      case "Letter": return "bg-purple-500";
      case "Symbol": return "bg-yellow-500";
      case "Punctuation": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">ASCII/Unicode Explorer</h2>
        <p className="text-muted-foreground">
          Explore ASCII and Unicode characters with detailed information, encoding details, and copy functionality
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find and filter characters by various criteria</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search characters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          {category.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Unicode Block</Label>
              <Select value={selectedBlock} onValueChange={setSelectedBlock}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Blocks</SelectItem>
                  {unicodeBlocks.map((block) => {
                    const IconComponent = block.icon;
                    return (
                      <SelectItem key={block.name} value={block.name}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          {block.name}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>View Mode</Label>
              <Select value={viewMode} onValueChange={(value: "table" | "grid") => setViewMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">
                    <div className="flex items-center gap-2">
                      <Table className="h-4 w-4" />
                      Table View
                    </div>
                  </SelectItem>
                  <SelectItem value="grid">
                    <div className="flex items-center gap-2">
                      <Grid3X3 className="h-4 w-4" />
                      Grid View
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label>Code Range:</Label>
                <span className="font-mono text-sm">
                  {codeRange.start} - {codeRange.end}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Label>Results:</Label>
                <Badge variant="secondary">
                  {filteredCharacters.length} characters
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportCharacters}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedBlock("all");
                setSelectedCharacter(null);
                setShowDetails(false);
              }}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Character Details */}
      {selectedCharacter && showDetails && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Character Details</CardTitle>
              <Button variant="outline" onClick={() => setShowDetails(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-6xl font-mono mb-2 bg-muted rounded-lg p-4">
                    {selectedCharacter.char}
                  </div>
                  <Badge className={`${getCategoryColor(selectedCharacter.category)} text-white`}>
                    {selectedCharacter.category}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Character Code</Label>
                  <p className="font-mono text-lg">{selectedCharacter.code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Unicode</Label>
                  <p className="font-mono text-lg">{selectedCharacter.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                  <p className="text-sm">{selectedCharacter.description}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Unicode Block</Label>
                  <p className="text-sm">{selectedCharacter.unicodeBlock || "N/A"}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">HTML Entity</Label>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-sm">
                      {selectedCharacter.htmlEntity || "N/A"}
                    </code>
                    {selectedCharacter.htmlEntity && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(selectedCharacter.htmlEntity!, "HTML Entity")}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">CSS Escape</Label>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-sm">
                      {selectedCharacter.cssEscape || "N/A"}
                    </code>
                    {selectedCharacter.cssEscape && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(selectedCharacter.cssEscape!, "CSS Escape")}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Properties</Label>
                  <div className="flex flex-wrap gap-1">
                    {selectedCharacter.isPrintable && <Badge variant="secondary">Printable</Badge>}
                    {selectedCharacter.isControl && <Badge variant="destructive">Control</Badge>}
                    {selectedCharacter.isWhitespace && <Badge variant="outline">Whitespace</Badge>}
                    {selectedCharacter.isDigit && <Badge variant="default">Digit</Badge>}
                    {selectedCharacter.isLetter && <Badge variant="default">Letter</Badge>}
                    {selectedCharacter.isSymbol && <Badge variant="secondary">Symbol</Badge>}
                    {selectedCharacter.isPunctuation && <Badge variant="outline">Punctuation</Badge>}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Character Table/Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Characters</CardTitle>
          <CardDescription>
            {viewMode === "table" ? "Table view of characters" : "Grid view of characters"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Code</th>
                    <th className="text-left p-2">Char</th>
                    <th className="text-left p-2">Unicode</th>
                    <th className="text-left p-2">Category</th>
                    <th className="text-left p-2">Description</th>
                    <th className="text-left p-2">HTML</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCharacters.map((char) => {
                    const CategoryIcon = getCategoryIcon(char.category);
                    return (
                      <tr key={char.code} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-mono text-sm">{char.code}</td>
                        <td className="p-2">
                          <div className="text-2xl font-mono">
                            {char.isPrintable ? char.char : "␀"}
                          </div>
                        </td>
                        <td className="p-2 font-mono text-sm">{char.name}</td>
                        <td className="p-2">
                          <Badge className={`${getCategoryColor(char.category)} text-white`}>
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {char.category}
                          </Badge>
                        </td>
                        <td className="p-2 text-sm">{char.description}</td>
                        <td className="p-2 font-mono text-sm">{char.htmlEntity || "—"}</td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCharacter(char);
                                setShowDetails(true);
                              }}
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(char.char, "Character")}
                            >
                              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
              {filteredCharacters.map((char) => {
                const CategoryIcon = getCategoryIcon(char.category);
                return (
                  <div
                    key={char.code}
                    className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedCharacter(char);
                      setShowDetails(true);
                    }}
                  >
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-mono">
                        {char.isPrintable ? char.char : "␀"}
                      </div>
                      <div className="text-xs font-mono text-muted-foreground">
                        {char.code}
                      </div>
                      <Badge className={`${getCategoryColor(char.category)} text-white text-xs`}>
                        <CategoryIcon className="h-2 w-2 mr-1" />
                        {char.category}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ASCII/Unicode Tips */}
      <Card>
        <CardHeader>
          <CardTitle>ASCII/Unicode Reference</CardTitle>
          <CardDescription>Understanding character encoding and Unicode</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Character Categories</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Control:</strong> Non-printable characters (0-31, 127)</li>
                <li>• <strong>Whitespace:</strong> Space, tab, newline characters</li>
                <li>• <strong>Digits:</strong> Numeric characters (0-9)</li>
                <li>• <strong>Letters:</strong> Alphabetic characters (A-Z, a-z)</li>
                <li>• <strong>Symbols:</strong> Special characters and operators</li>
                <li>• <strong>Punctuation:</strong> Punctuation marks and delimiters</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Encoding Information</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>ASCII:</strong> 7-bit encoding (0-127)</li>
                <li>• <strong>Unicode:</strong> Universal character encoding</li>
                <li>• <strong>UTF-8:</strong> Variable-length Unicode encoding</li>
                <li>• <strong>HTML Entities:</strong> Character references in HTML</li>
                <li>• <strong>CSS Escapes:</strong> Character escapes in CSS</li>
                <li>• <strong>Unicode Blocks:</strong> Grouped character ranges</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Pro Tip</p>
                <p className="text-blue-700 dark:text-blue-300">
                  Use this tool to find the right character for your project. Click on any character to see detailed 
                  information including HTML entities and CSS escapes. The search function works across character codes, 
                  names, descriptions, and encoding information. Export the data for use in your applications.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ASCIIUnicodeExplorer;
