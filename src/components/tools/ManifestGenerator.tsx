import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Upload, 
  Copy, 
  Check, 
  Eye, 
  Settings, 
  Smartphone, 
  Monitor, 
  Tablet,
  Palette,
  Image,
  FileText,
  Code,
  Globe,
  Shield,
  Zap,
  Info,
  AlertCircle,
  CheckCircle,
  RotateCcw,
  Play,
  Square,
  Volume2,
  VolumeX,
  RefreshCw,
  Trash2,
  Plus,
  Minus,
  Edit,
  Save,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ManifestData {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: "fullscreen" | "standalone" | "minimal-ui" | "browser";
  orientation: "portrait" | "landscape" | "any";
  theme_color: string;
  background_color: string;
  scope: string;
  lang: string;
  dir: "ltr" | "rtl" | "auto";
  categories: string[];
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose?: string;
  }>;
  screenshots?: Array<{
    src: string;
    sizes: string;
    type: string;
    form_factor: "narrow" | "wide";
  }>;
  shortcuts?: Array<{
    name: string;
    short_name: string;
    description: string;
    url: string;
    icons: Array<{
      src: string;
      sizes: string;
    }>;
  }>;
  related_applications?: Array<{
    platform: string;
    url: string;
    id?: string;
  }>;
  prefer_related_applications?: boolean;
  edge_side_panel?: {
    preferred_width: number;
  };
  launch_handler?: {
    client_mode: "navigate-existing" | "navigate-new" | "focus-existing";
  };
  handle_links?: "preferred" | "not-preferred" | "auto";
  protocol_handlers?: Array<{
    protocol: string;
    url: string;
  }>;
  file_handlers?: Array<{
    action: string;
    accept: Record<string, string[]>;
  }>;
}

interface IconSize {
  size: number;
  label: string;
  required: boolean;
}

const ManifestGenerator = () => {
  const [manifestData, setManifestData] = useState<ManifestData>({
    name: "",
    short_name: "",
    description: "",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    theme_color: "#000000",
    background_color: "#ffffff",
    scope: "/",
    lang: "en",
    dir: "ltr",
    categories: [],
    icons: [],
    screenshots: [],
    shortcuts: [],
    related_applications: [],
    prefer_related_applications: false,
    edge_side_panel: { preferred_width: 400 },
    launch_handler: { client_mode: "navigate-existing" },
    handle_links: "preferred",
    protocol_handlers: [],
    file_handlers: []
  });

  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("mobile");
  const [iconFiles, setIconFiles] = useState<File[]>([]);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const iconSizes: IconSize[] = [
    { size: 72, label: "72x72", required: false },
    { size: 96, label: "96x96", required: false },
    { size: 128, label: "128x128", required: false },
    { size: 144, label: "144x144", required: false },
    { size: 152, label: "152x152", required: false },
    { size: 192, label: "192x192", required: true },
    { size: 384, label: "384x384", required: false },
    { size: 512, label: "512x512", required: true }
  ];

  const displayModes = [
    { value: "fullscreen", label: "Fullscreen", description: "Full screen experience" },
    { value: "standalone", label: "Standalone", description: "App-like experience" },
    { value: "minimal-ui", label: "Minimal UI", description: "Minimal browser UI" },
    { value: "browser", label: "Browser", description: "Standard browser experience" }
  ];

  const orientations = [
    { value: "portrait", label: "Portrait", description: "Vertical orientation" },
    { value: "landscape", label: "Landscape", description: "Horizontal orientation" },
    { value: "any", label: "Any", description: "Any orientation" }
  ];

  const categories = [
    "business", "developer", "education", "entertainment", "finance", "fitness", "food", "games",
    "health", "lifestyle", "medical", "music", "news", "photography", "productivity", "shopping",
    "social", "sports", "travel", "utilities", "weather"
  ];

  const updateManifestData = (field: keyof ManifestData, value: any) => {
    setManifestData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      setIconFiles(prev => [...prev, ...imageFiles]);
      
      // Auto-generate icons for different sizes
      imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            iconSizes.forEach(iconSize => {
              if (img.width >= iconSize.size && img.height >= iconSize.size) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = iconSize.size;
                canvas.height = iconSize.size;
                
                if (ctx) {
                  ctx.drawImage(img, 0, 0, iconSize.size, iconSize.size);
                  const dataUrl = canvas.toDataURL('image/png');
                  
                  const existingIcon = manifestData.icons.find(icon => icon.sizes === iconSize.label);
                  if (!existingIcon) {
                    updateManifestData('icons', [
                      ...manifestData.icons,
                      {
                        src: dataUrl,
                        sizes: iconSize.label,
                        type: 'image/png'
                      }
                    ]);
                  }
                }
              }
            });
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
      
      toast({
        title: "Icons uploaded",
        description: `${imageFiles.length} icon(s) processed and added to manifest`,
      });
    }
  };

  const handleScreenshotUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      setScreenshotFiles(prev => [...prev, ...imageFiles]);
      
      imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const formFactor = img.width > img.height ? "wide" : "narrow";
            updateManifestData('screenshots', [
              ...manifestData.screenshots,
              {
                src: e.target?.result as string,
                sizes: `${img.width}x${img.height}`,
                type: file.type,
                form_factor: formFactor
              }
            ]);
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
      
      toast({
        title: "Screenshots uploaded",
        description: `${imageFiles.length} screenshot(s) added to manifest`,
      });
    }
  };

  const removeIcon = (index: number) => {
    const newIcons = manifestData.icons.filter((_, i) => i !== index);
    updateManifestData('icons', newIcons);
  };

  const removeScreenshot = (index: number) => {
    const newScreenshots = manifestData.screenshots.filter((_, i) => i !== index);
    updateManifestData('screenshots', newScreenshots);
  };

  const addShortcut = () => {
    updateManifestData('shortcuts', [
      ...manifestData.shortcuts,
      {
        name: "",
        short_name: "",
        description: "",
        url: "",
        icons: []
      }
    ]);
  };

  const updateShortcut = (index: number, field: string, value: string) => {
    const newShortcuts = [...manifestData.shortcuts];
    newShortcuts[index] = { ...newShortcuts[index], [field]: value };
    updateManifestData('shortcuts', newShortcuts);
  };

  const removeShortcut = (index: number) => {
    const newShortcuts = manifestData.shortcuts.filter((_, i) => i !== index);
    updateManifestData('shortcuts', newShortcuts);
  };

  const validateManifest = () => {
    const errors: string[] = [];
    
    if (!manifestData.name) errors.push("App name is required");
    if (!manifestData.short_name) errors.push("Short name is required");
    if (!manifestData.start_url) errors.push("Start URL is required");
    if (!manifestData.icons.some(icon => icon.sizes === "192x192")) {
      errors.push("192x192 icon is required");
    }
    if (!manifestData.icons.some(icon => icon.sizes === "512x512")) {
      errors.push("512x512 icon is required");
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const generateManifest = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      if (validateManifest()) {
        toast({
          title: "Manifest generated",
          description: "PWA manifest has been generated successfully",
        });
      } else {
        toast({
          title: "Validation failed",
          description: "Please fix the validation errors",
          variant: "destructive",
        });
      }
      setIsGenerating(false);
    }, 1000);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(manifestData, null, 2));
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Manifest JSON copied to clipboard",
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

  const downloadManifest = () => {
    const blob = new Blob([JSON.stringify(manifestData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manifest.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Manifest JSON has been downloaded",
    });
  };

  const loadExample = () => {
    setManifestData({
      name: "My Awesome PWA",
      short_name: "MyPWA",
      description: "A sample Progressive Web Application",
      start_url: "/",
      display: "standalone",
      orientation: "any",
      theme_color: "#3b82f6",
      background_color: "#ffffff",
      scope: "/",
      lang: "en",
      dir: "ltr",
      categories: ["productivity", "utilities"],
      icons: [
        {
          src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiByeD0iMjQiIGZpbGw9IiMzYjgyZjYiLz4KPHN2ZyB4PSI0OCIgeT0iNDgiIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+CjxwYXRoIGQ9Ik0xMiAyTDIgN3YxMGMwIDUuNSA0LjUgMTAgMTAgMTBzMTAtNC41IDEwLTEwVjdMMTIgMnoiLz4KPC9zdmc+Cjwvc3ZnPgo=",
          sizes: "192x192",
          type: "image/svg+xml"
        },
        {
          src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiByeD0iNjQiIGZpbGw9IiMzYjgyZjYiLz4KPHN2ZyB4PSIxMjgiIHk9IjEyOCIgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgo8cGF0aCBkPSJNMTIgMkwyIDd2MTBjMCA1LjUgNC41IDEwIDEwIDEwczEwLTQuNSAxMC0xMFY3TDEyIDJ6Ii8+Cjwvc3ZnPgo8L3N2Zz4K",
          sizes: "512x512",
          type: "image/svg+xml"
        }
      ],
      screenshots: [],
      shortcuts: [],
      related_applications: [],
      prefer_related_applications: false,
      edge_side_panel: { preferred_width: 400 },
      launch_handler: { client_mode: "navigate-existing" },
      handle_links: "preferred",
      protocol_handlers: [],
      file_handlers: []
    });
    
    toast({
      title: "Example loaded",
      description: "Sample PWA manifest has been loaded",
    });
  };

  const resetManifest = () => {
    setManifestData({
      name: "",
      short_name: "",
      description: "",
      start_url: "/",
      display: "standalone",
      orientation: "any",
      theme_color: "#000000",
      background_color: "#ffffff",
      scope: "/",
      lang: "en",
      dir: "ltr",
      categories: [],
      icons: [],
      screenshots: [],
      shortcuts: [],
      related_applications: [],
      prefer_related_applications: false,
      edge_side_panel: { preferred_width: 400 },
      launch_handler: { client_mode: "navigate-existing" },
      handle_links: "preferred",
      protocol_handlers: [],
      file_handlers: []
    });
    setIconFiles([]);
    setScreenshotFiles([]);
    setValidationErrors([]);
    
    toast({
      title: "Manifest reset",
      description: "All fields have been cleared",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">PWA Manifest Generator</h2>
        <p className="text-muted-foreground">
          Create and customize Progressive Web App manifests with comprehensive configuration options
        </p>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900 dark:text-red-100">Validation Errors</h4>
                <ul className="text-sm text-red-700 dark:text-red-300 mt-1 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="icons">Icons & Screenshots</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential PWA manifest properties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">App Name *</Label>
                  <Input
                    id="name"
                    placeholder="My Awesome PWA"
                    value={manifestData.name}
                    onChange={(e) => updateManifestData('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="short_name">Short Name *</Label>
                  <Input
                    id="short_name"
                    placeholder="MyPWA"
                    value={manifestData.short_name}
                    onChange={(e) => updateManifestData('short_name', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="A sample Progressive Web Application"
                  value={manifestData.description}
                  onChange={(e) => updateManifestData('description', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_url">Start URL *</Label>
                  <Input
                    id="start_url"
                    placeholder="/"
                    value={manifestData.start_url}
                    onChange={(e) => updateManifestData('start_url', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scope">Scope</Label>
                  <Input
                    id="scope"
                    placeholder="/"
                    value={manifestData.scope}
                    onChange={(e) => updateManifestData('scope', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lang">Language</Label>
                  <Input
                    id="lang"
                    placeholder="en"
                    value={manifestData.lang}
                    onChange={(e) => updateManifestData('lang', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dir">Direction</Label>
                  <Select value={manifestData.dir} onValueChange={(value: "ltr" | "rtl" | "auto") => updateManifestData('dir', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ltr">Left to Right</SelectItem>
                      <SelectItem value="rtl">Right to Left</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categories">Categories</Label>
                  <Select value="" onValueChange={(value) => {
                    if (value && !manifestData.categories.includes(value)) {
                      updateManifestData('categories', [...manifestData.categories, value]);
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {manifestData.categories.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Categories</Label>
                  <div className="flex flex-wrap gap-2">
                    {manifestData.categories.map((category, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {category}
                        <button
                          onClick={() => updateManifestData('categories', manifestData.categories.filter((_, i) => i !== index))}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Settings */}
        <TabsContent value="display" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>Configure how your PWA appears to users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Display Mode</Label>
                  <Select value={manifestData.display} onValueChange={(value: any) => updateManifestData('display', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {displayModes.map(mode => (
                        <SelectItem key={mode.value} value={mode.value}>
                          <div>
                            <div className="font-medium">{mode.label}</div>
                            <div className="text-sm text-muted-foreground">{mode.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Orientation</Label>
                  <Select value={manifestData.orientation} onValueChange={(value: any) => updateManifestData('orientation', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {orientations.map(orientation => (
                        <SelectItem key={orientation.value} value={orientation.value}>
                          <div>
                            <div className="font-medium">{orientation.label}</div>
                            <div className="text-sm text-muted-foreground">{orientation.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme_color">Theme Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="theme_color"
                      type="color"
                      value={manifestData.theme_color}
                      onChange={(e) => updateManifestData('theme_color', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={manifestData.theme_color}
                      onChange={(e) => updateManifestData('theme_color', e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="background_color">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="background_color"
                      type="color"
                      value={manifestData.background_color}
                      onChange={(e) => updateManifestData('background_color', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={manifestData.background_color}
                      onChange={(e) => updateManifestData('background_color', e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Icons & Screenshots */}
        <TabsContent value="icons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Icons</CardTitle>
              <CardDescription>Upload and manage PWA icons</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Upload Icons</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Icons
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleIconUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Required Icon Sizes</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {iconSizes.map(iconSize => {
                    const icon = manifestData.icons.find(i => i.sizes === iconSize.label);
                    return (
                      <div key={iconSize.size} className="border rounded-lg p-3 text-center">
                        <div className="text-sm font-medium">{iconSize.label}</div>
                        <div className="text-xs text-muted-foreground mb-2">
                          {iconSize.required ? "Required" : "Optional"}
                        </div>
                        {icon ? (
                          <div className="space-y-2">
                            <img
                              src={icon.src}
                              alt={`${iconSize.label} icon`}
                              className="w-12 h-12 mx-auto rounded"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeIcon(manifestData.icons.indexOf(icon))}
                              className="w-full"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="w-12 h-12 mx-auto bg-muted rounded flex items-center justify-center">
                            <Image className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Screenshots</CardTitle>
              <CardDescription>Add screenshots for app stores and PWA install prompts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Upload Screenshots</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => screenshotInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Screenshots
                  </Button>
                  <input
                    ref={screenshotInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {manifestData.screenshots.length > 0 && (
                <div className="space-y-2">
                  <Label>Screenshots</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {manifestData.screenshots.map((screenshot, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={screenshot.form_factor === "wide" ? "default" : "secondary"}>
                            {screenshot.form_factor}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeScreenshot(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <img
                          src={screenshot.src}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          {screenshot.sizes}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shortcuts</CardTitle>
              <CardDescription>Add app shortcuts for quick access to features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={addShortcut} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Shortcut
              </Button>

              {manifestData.shortcuts.map((shortcut, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Shortcut {index + 1}</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeShortcut(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        placeholder="Shortcut name"
                        value={shortcut.name}
                        onChange={(e) => updateShortcut(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Short Name</Label>
                      <Input
                        placeholder="Short name"
                        value={shortcut.short_name}
                        onChange={(e) => updateShortcut(index, 'short_name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        placeholder="Shortcut description"
                        value={shortcut.description}
                        onChange={(e) => updateShortcut(index, 'description', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>URL</Label>
                      <Input
                        placeholder="/shortcut-url"
                        value={shortcut.url}
                        onChange={(e) => updateShortcut(index, 'url', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Options</CardTitle>
              <CardDescription>Configure advanced PWA features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Prefer Related Applications</Label>
                  <p className="text-sm text-muted-foreground">
                    Prefer native apps over PWA when available
                  </p>
                </div>
                <Switch
                  checked={manifestData.prefer_related_applications}
                  onCheckedChange={(checked) => updateManifestData('prefer_related_applications', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Handle Links</Label>
                <Select value={manifestData.handle_links} onValueChange={(value: any) => updateManifestData('handle_links', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preferred">Preferred</SelectItem>
                    <SelectItem value="not-preferred">Not Preferred</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Launch Handler</Label>
                <Select value={manifestData.launch_handler.client_mode} onValueChange={(value: any) => updateManifestData('launch_handler', { client_mode: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="navigate-existing">Navigate Existing</SelectItem>
                    <SelectItem value="navigate-new">Navigate New</SelectItem>
                    <SelectItem value="focus-existing">Focus Existing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Generate, preview, and export your PWA manifest</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={generateManifest} disabled={isGenerating} className="gap-2">
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              Generate Manifest
            </Button>
            <Button variant="outline" onClick={copyToClipboard} className="gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copy JSON
            </Button>
            <Button variant="outline" onClick={downloadManifest} className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" onClick={loadExample} className="gap-2">
              <FileText className="h-4 w-4" />
              Load Example
            </Button>
            <Button variant="outline" onClick={resetManifest} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* JSON Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Manifest JSON Preview</CardTitle>
          <CardDescription>Preview the generated manifest.json</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            {JSON.stringify(manifestData, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* PWA Manifest Tips */}
      <Card>
        <CardHeader>
          <CardTitle>PWA Manifest Reference</CardTitle>
          <CardDescription>Understanding PWA manifest properties and best practices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Required Properties</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>name:</strong> Full application name</li>
                <li>• <strong>short_name:</strong> Short name for home screen</li>
                <li>• <strong>start_url:</strong> URL to load when app starts</li>
                <li>• <strong>icons:</strong> App icons (192x192 and 512x512 required)</li>
                <li>• <strong>display:</strong> How the app is displayed</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Best Practices</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use high-quality icons in multiple sizes</li>
                <li>• Choose appropriate display mode for your app</li>
                <li>• Set theme and background colors</li>
                <li>• Add screenshots for app stores</li>
                <li>• Include shortcuts for key features</li>
                <li>• Test on different devices and browsers</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Pro Tip</p>
                <p className="text-blue-700 dark:text-blue-300">
                  Use this tool to create comprehensive PWA manifests. The manifest.json file is essential for 
                  Progressive Web Apps to be installable and provide a native app-like experience. Make sure to 
                  include all required icons and test your PWA on different devices and browsers.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManifestGenerator;
