import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Download, 
  Copy, 
  Check, 
  RotateCcw, 
  Settings, 
  Eye, 
  Zap, 
  AlertCircle,
  CheckCircle,
  Info,
  Trash2,
  RefreshCw,
  Maximize2,
  Minimize2,
  Play,
  Square,
  FileText,
  Users,
  MessageSquare,
  ArrowRight,
  Database,
  Globe,
  Smartphone,
  Server,
  Code,
  GitBranch
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import mermaid from 'mermaid';

interface DiagramTemplate {
  name: string;
  description: string;
  code: string;
  category: string;
}

interface SequenceConfig {
  theme: string;
  fontSize: number;
  fontFamily: string;
  backgroundColor: string;
  primaryColor: string;
  lineColor: string;
  textColor: string;
  actorBkg: string;
  actorBorder: string;
  actorTextColor: string;
  actorLineColor: string;
  signalColor: string;
  signalTextColor: string;
  labelBoxBkgColor: string;
  labelBoxBorderColor: string;
  labelTextColor: string;
  loopTextColor: string;
  activationBkgColor: string;
  activationBorderColor: string;
  sequenceNumberColor: string;
}

export const SequenceDiagrams = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [isRendering, setIsRendering] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const mermaidRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [config, setConfig] = useState<SequenceConfig>({
    theme: "default",
    fontSize: 12,
    fontFamily: "Inter, system-ui, sans-serif",
    backgroundColor: "#ffffff",
    primaryColor: "#333333",
    lineColor: "#333333",
    textColor: "#333333",
    actorBkg: "#e1f5fe",
    actorBorder: "#01579b",
    actorTextColor: "#333333",
    actorLineColor: "#333333",
    signalColor: "#333333",
    signalTextColor: "#333333",
    labelBoxBkgColor: "#e8f4fd",
    labelBoxBorderColor: "#333333",
    labelTextColor: "#333333",
    loopTextColor: "#333333",
    activationBkgColor: "#f4f4f4",
    activationBorderColor: "#333333",
    sequenceNumberColor: "#333333"
  });

  const themes = [
    { value: "default", label: "Default" },
    { value: "dark", label: "Dark" },
    { value: "forest", label: "Forest" },
    { value: "neutral", label: "Neutral" },
    { value: "base", label: "Base" }
  ];

  const templates: DiagramTemplate[] = [
    {
      name: "User Login Flow",
      description: "Basic user authentication sequence",
      category: "Authentication",
      code: `sequenceDiagram
    participant U as User
    participant W as Web App
    participant A as Auth Service
    participant D as Database
    
    U->>W: Enter credentials
    W->>A: Validate credentials
    A->>D: Check user data
    D-->>A: User data
    A-->>W: Authentication result
    W-->>U: Login success/failure`
    },
    {
      name: "API Request Flow",
      description: "REST API request processing",
      category: "API",
      code: `sequenceDiagram
    participant C as Client
    participant L as Load Balancer
    participant A as API Server
    participant CACHE as Cache
    participant DB as Database
    
    C->>L: HTTP Request
    L->>A: Route request
    A->>CACHE: Check cache
    alt Cache hit
        CACHE-->>A: Return cached data
    else Cache miss
        A->>DB: Query database
        DB-->>A: Return data
        A->>CACHE: Update cache
    end
    A-->>L: Response
    L-->>C: HTTP Response`
    },
    {
      name: "E-commerce Checkout",
      description: "Online shopping checkout process",
      category: "E-commerce",
      code: `sequenceDiagram
    participant C as Customer
    participant W as Website
    participant P as Payment Gateway
    participant I as Inventory
    participant S as Shipping
    
    C->>W: Add items to cart
    C->>W: Proceed to checkout
    W->>I: Check inventory
    I-->>W: Inventory status
    W->>P: Process payment
    P-->>W: Payment result
    W->>I: Reserve items
    W->>S: Create shipment
    S-->>W: Tracking number
    W-->>C: Order confirmation`
    },
    {
      name: "Microservices Communication",
      description: "Service-to-service communication",
      category: "Microservices",
      code: `sequenceDiagram
    participant G as API Gateway
    participant U as User Service
    participant O as Order Service
    participant P as Payment Service
    participant N as Notification Service
    
    G->>U: Validate user
    U-->>G: User valid
    G->>O: Create order
    O->>P: Process payment
    P-->>O: Payment success
    O->>N: Send notification
    N-->>O: Notification sent
    O-->>G: Order created
    G-->>Client: Order response`
    },
    {
      name: "Database Transaction",
      description: "Database transaction with rollback",
      category: "Database",
      code: `sequenceDiagram
    participant A as Application
    participant T as Transaction Manager
    participant D1 as Database 1
    participant D2 as Database 2
    
    A->>T: Begin transaction
    T->>D1: Update table A
    D1-->>T: Success
    T->>D2: Update table B
    alt Update successful
        D2-->>T: Success
        T->>D1: Commit
        T->>D2: Commit
        T-->>A: Transaction committed
    else Update failed
        D2-->>T: Error
        T->>D1: Rollback
        T->>D2: Rollback
        T-->>A: Transaction rolled back
    end`
    },
    {
      name: "WebSocket Communication",
      description: "Real-time WebSocket messaging",
      category: "Real-time",
      code: `sequenceDiagram
    participant C as Client
    participant W as WebSocket Server
    participant R as Redis
    participant U as User Service
    
    C->>W: WebSocket connection
    W-->>C: Connection established
    C->>W: Join room
    W->>R: Subscribe to room
    W->>U: Get user info
    U-->>W: User data
    W-->>C: Room joined
    
    Note over C,W: Real-time messaging
    C->>W: Send message
    W->>R: Publish message
    R-->>W: Message broadcast
    W-->>C: Message received`
    },
    {
      name: "File Upload Process",
      description: "File upload with validation",
      category: "File Processing",
      code: `sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant S as Storage
    participant V as Virus Scanner
    
    U->>F: Select file
    F->>B: Upload file
    B->>V: Scan for viruses
    alt File is clean
        V-->>B: Scan passed
        B->>S: Store file
        S-->>B: File stored
        B-->>F: Upload success
        F-->>U: File uploaded
    else File is infected
        V-->>B: Scan failed
        B-->>F: Upload rejected
        F-->>U: File rejected
    end`
    },
    {
      name: "OAuth Authentication",
      description: "OAuth 2.0 authorization flow",
      category: "Authentication",
      code: `sequenceDiagram
    participant U as User
    participant C as Client App
    participant A as Auth Server
    participant R as Resource Server
    
    U->>C: Access protected resource
    C->>A: Request authorization
    A-->>U: Login page
    U->>A: Enter credentials
    A-->>C: Authorization code
    C->>A: Exchange code for token
    A-->>C: Access token
    C->>R: Request with token
    R-->>C: Protected resource`
    }
  ];

  // Initialize Mermaid
  useEffect(() => {
    const initializeMermaid = async () => {
      try {
        // Check if mermaid is available
        if (typeof mermaid === 'undefined' || !mermaid.initialize) {
          console.error('Mermaid is not available');
          return;
        }

        await mermaid.initialize({
          startOnLoad: false,
          theme: config.theme,
          securityLevel: 'loose',
          fontFamily: config.fontFamily,
          fontSize: config.fontSize,
          sequence: {
            diagramMarginX: 50,
            diagramMarginY: 10,
            actorMargin: 50,
            width: 150,
            height: 65,
            boxMargin: 10,
            boxTextMargin: 5,
            noteMargin: 10,
            messageMargin: 35,
            mirrorActors: true,
            bottomMarginAdj: 1,
            useMaxWidth: true,
            rightAngles: false,
            showSequenceNumbers: false,
            wrap: true,
            wrapPadding: 10
          }
        });
        console.log('Mermaid initialized successfully');
        setIsInitialized(true);
      } catch (err) {
        console.error('Mermaid initialization error:', err);
        setError('Failed to initialize diagram renderer. Please refresh the page.');
        setIsInitialized(false);
      }
    };

    initializeMermaid();

    // Cleanup function
    return () => {
      // Clear any pending operations
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = "";
      }
    };
  }, [config]);

  // Handle output display - use a more robust approach
  useEffect(() => {
    if (output && mermaidRef.current) {
      try {
        // Clear any existing content
        mermaidRef.current.innerHTML = '';
        
        // Create a temporary div to parse the SVG
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = output;
        
        // Move the SVG to the actual container
        const svgElement = tempDiv.querySelector('svg');
        if (svgElement && mermaidRef.current) {
          // Clone the SVG to avoid any reference issues
          const clonedSvg = svgElement.cloneNode(true) as SVGElement;
          mermaidRef.current.appendChild(clonedSvg);
        }
      } catch (err) {
        console.error('Error updating diagram display:', err);
        // Fallback: try direct innerHTML
        try {
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = output;
          }
        } catch (fallbackErr) {
          console.error('Fallback display method also failed:', fallbackErr);
        }
      }
    }
  }, [output]);

  const renderDiagram = async () => {
    if (!input.trim()) {
      setError("Please enter sequence diagram code");
      setIsValid(false);
      setOutput("");
      return;
    }

    // Check if mermaid is initialized
    if (!isInitialized) {
      setError("Diagram renderer is not ready. Please wait for initialization to complete.");
      setIsValid(false);
      setOutput("");
      return;
    }

    // Check if mermaidRef is available
    if (!mermaidRef.current) {
      setError("Diagram container not ready. Please try again.");
      setIsValid(false);
      setOutput("");
      return;
    }

    setIsRendering(true);
    setError("");

    try {
      // Clear previous output first
      setOutput("");
      setError("");

      // Generate unique ID for the diagram
      const id = `sequence-${Date.now()}`;
      
      console.log('Rendering sequence diagram with ID:', id);
      console.log('Input code:', input);
      
      // First validate the syntax
      try {
        await mermaid.parse(input);
        console.log('Diagram syntax is valid');
      } catch (parseError) {
        throw new Error(`Invalid diagram syntax: ${(parseError as Error).message}`);
      }

      // Render the diagram
      const { svg } = await mermaid.render(id, input);
      
      console.log('SVG generated:', svg ? 'Yes' : 'No');
      
      if (!svg) {
        throw new Error('Failed to generate SVG from diagram');
      }
      
      // Set the output - DOM will be updated by useEffect
      setOutput(svg);
      setIsValid(true);
      setError("");
      
      toast({
        title: "Diagram Rendered",
        description: "Sequence diagram rendered successfully",
      });
    } catch (err) {
      const errorMessage = (err as Error).message;
      console.error('Sequence diagram rendering error:', err);
      setError(errorMessage);
      setIsValid(false);
      setOutput("");
      
      toast({
        title: "Rendering Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsRendering(false);
    }
  };

  const loadTemplate = (template: DiagramTemplate) => {
    setInput(template.code);
    setSelectedTemplate(template.name);
    setOutput("");
    setIsValid(null);
    setError("");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(input);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Sequence diagram code copied to clipboard",
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

  const downloadSVG = () => {
    if (!output) return;
    
    const blob = new Blob([output], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sequence-diagram.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "SVG diagram has been downloaded",
    });
  };

  const downloadPNG = async () => {
    if (!output || !mermaidRef.current) return;
    
    try {
      const svgElement = mermaidRef.current.querySelector('svg');
      if (!svgElement) return;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = config.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'sequence-diagram.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            toast({
              title: "Downloaded!",
              description: "PNG diagram has been downloaded",
            });
          }
        }, 'image/png');
      };
      img.src = svgUrl;
    } catch (err) {
      toast({
        title: "Download Failed",
        description: "Could not generate PNG",
        variant: "destructive",
      });
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setIsValid(null);
    setError("");
    setSelectedTemplate("");
    if (mermaidRef.current) {
      mermaidRef.current.innerHTML = "";
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Authentication": return Users;
      case "API": return Globe;
      case "E-commerce": return MessageSquare;
      case "Microservices": return Server;
      case "Database": return Database;
      case "Real-time": return ArrowRight;
      case "File Processing": return FileText;
      default: return Code;
    }
  };

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Sequence Diagrams</h2>
          <p className="text-muted-foreground">
            Create PlantUML-style sequence diagrams with live preview and professional rendering
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Initializing diagram renderer...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Sequence Diagrams</h2>
        <p className="text-muted-foreground">
          Create PlantUML-style sequence diagrams with live preview and professional rendering
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Editor Controls</CardTitle>
          <CardDescription>Configure your diagram settings and actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Label htmlFor="theme-select">Theme:</Label>
              <Select value={config.theme} onValueChange={(value) => setConfig(prev => ({ ...prev, theme: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((theme) => (
                    <SelectItem key={theme.value} value={theme.value}>
                      {theme.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={renderDiagram} 
              disabled={!input.trim() || isRendering}
              className="gap-2"
            >
              {isRendering ? (
                <Square className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isRendering ? "Rendering..." : "Render"}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {
                setInput(`sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob, how are you?
    B-->>A: Great!`);
                setSelectedTemplate("Test");
              }}
              className="gap-2"
            >
              <Code className="h-4 w-4" />
              Test
            </Button>
            
            <Button variant="outline" onClick={copyToClipboard} disabled={!input.trim()}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy Code"}
            </Button>
            
            <Button variant="outline" onClick={clearAll}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear
            </Button>
            
            <Button variant="outline" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className={`grid gap-6 ${isFullscreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
        {/* Code Editor */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Sequence Diagram Code</CardTitle>
              {isValid !== null && (
                <div className="flex items-center gap-2">
                  {isValid ? (
                    <Badge variant="default" className="bg-success text-success-foreground">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Valid
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Error
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <CardDescription>
              Write your sequence diagram code using PlantUML-style syntax
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="sequenceDiagram&#10;    participant A as Alice&#10;    participant B as Bob&#10;    A->>B: Hello Bob, how are you?&#10;    B-->>A: Great!&#10;    B->>B: I am thinking about work"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="font-mono min-h-[400px] resize-none bg-code-bg"
            />
          </CardContent>
        </Card>

        {/* Diagram Preview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Live Preview</CardTitle>
              {output && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadSVG}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    SVG
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadPNG}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    PNG
                  </Button>
                </div>
              )}
            </div>
            <CardDescription>
              Real-time sequence diagram preview
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
                <div className="flex items-center gap-2 text-destructive mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Rendering Error</span>
                </div>
                <p className="text-sm text-destructive/80 font-mono">{error}</p>
              </div>
            ) : (
              <div 
                ref={mermaidRef}
                className="min-h-[400px] bg-white dark:bg-gray-900 rounded-md border flex items-center justify-center text-muted-foreground overflow-auto"
              >
                {!output && !isRendering && (
                  <div className="text-center">
                    <GitBranch className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>Your sequence diagram will appear here</p>
                    <p className="text-sm text-muted-foreground/70">Click "Render" to generate the diagram</p>
                  </div>
                )}
                {isRendering && (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Rendering diagram...</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Diagram Templates</CardTitle>
          <CardDescription>Click on any template to load it into the editor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.map((template, index) => {
              const IconComponent = getCategoryIcon(template.category);
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4 text-primary" />
                    <Label className="text-sm font-medium">{template.name}</Label>
                  </div>
                  <div className="space-y-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadTemplate(template)}
                      className="w-full justify-start text-xs"
                    >
                      <Code className="h-3 w-3 mr-2" />
                      {template.description}
                    </Button>
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sequence Diagram Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Sequence Diagram Syntax</CardTitle>
          <CardDescription>PlantUML-style syntax guide and best practices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Basic Syntax</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <code>sequenceDiagram</code> - Start diagram</li>
                <li>• <code>participant A as Alice</code> - Define participants</li>
                <li>• <code>A-&gt;&gt;B: Message</code> - Solid arrow</li>
                <li>• <code>A--&gt;&gt;B: Response</code> - Dotted arrow</li>
                <li>• <code>A-&gt;&gt;A: Self message</code> - Self reference</li>
                <li>• <code>Note over A,B: Note</code> - Add notes</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Advanced Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <code>alt/else/end</code> - Alternative flows</li>
                <li>• <code>opt/end</code> - Optional flows</li>
                <li>• <code>loop/end</code> - Loops</li>
                <li>• <code>par/and/end</code> - Parallel flows</li>
                <li>• <code>activate/deactivate</code> - Activation</li>
                <li>• <code>rect</code> - Grouping</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Pro Tip</p>
                <p className="text-blue-700 dark:text-blue-300">
                  Sequence diagrams are perfect for documenting API flows, user interactions, and system communications. 
                  Use clear participant names and meaningful message descriptions. The live preview updates automatically 
                  when you render, and you can export your diagrams as SVG or PNG.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
