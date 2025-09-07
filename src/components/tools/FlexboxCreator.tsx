import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Copy, Check, Download, RotateCcw, Plus, Minus, Eye, Code, Layout, 
  Undo, Redo, Save, Settings, Grid, Smartphone, Tablet, Monitor,
  Zap, BookOpen, Palette, Ruler, Layers, Target, AlertCircle, Upload
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FlexboxProperties {
  // Container properties
  flexDirection: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  flexWrap: 'nowrap' | 'wrap' | 'wrap-reverse';
  justifyContent: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
  alignContent: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  gap: number;
  rowGap: number;
  columnGap: number;
  
  // Container dimensions
  containerWidth: number;
  containerHeight: number;
  
  // Item properties
  itemCount: number;
  itemMinWidth: number;
  itemMinHeight: number;
  itemMaxWidth: number;
  itemMaxHeight: number;
  
  // Individual item properties (for first few items)
  itemFlexGrow: number[];
  itemFlexShrink: number[];
  itemFlexBasis: string[];
  itemAlignSelf: ('auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch')[];
  
  // Professional features
  useCSSVariables: boolean;
  responsiveMode: boolean;
  showGridOverlay: boolean;
  showFlexLines: boolean;
  showItemNumbers: boolean;
  customCSS: string;
  breakpoints: BreakpointConfig[];
  preset: string;
}

interface BreakpointConfig {
  name: string;
  width: number;
  properties: Partial<FlexboxProperties>;
}

interface Preset {
  name: string;
  description: string;
  properties: Partial<FlexboxProperties>;
  category: 'layout' | 'navigation' | 'cards' | 'forms' | 'custom';
}

const DEFAULT_PROPERTIES: FlexboxProperties = {
  flexDirection: 'row',
  flexWrap: 'nowrap',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  alignContent: 'stretch',
  gap: 0,
  rowGap: 0,
  columnGap: 0,
  containerWidth: 600,
  containerHeight: 300,
  itemCount: 4,
  itemMinWidth: 80,
  itemMinHeight: 60,
  itemMaxWidth: 200,
  itemMaxHeight: 150,
  itemFlexGrow: [1, 1, 1, 1],
  itemFlexShrink: [1, 1, 1, 1],
  itemFlexBasis: ['auto', 'auto', 'auto', 'auto'],
  itemAlignSelf: ['auto', 'auto', 'auto', 'auto'],
  useCSSVariables: false,
  responsiveMode: false,
  showGridOverlay: false,
  showFlexLines: false,
  showItemNumbers: true,
  customCSS: '',
  breakpoints: [],
  preset: 'custom'
};

const PROFESSIONAL_PRESETS: Preset[] = [
  {
    name: 'Card Grid',
    description: 'Responsive card layout with equal spacing',
    category: 'cards',
    properties: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      gap: 20,
      itemCount: 6,
      itemMinWidth: 200,
      itemMaxWidth: 300,
      itemFlexGrow: [1, 1, 1, 1, 1, 1],
      itemFlexBasis: ['300px', '300px', '300px', '300px', '300px', '300px']
    }
  },
  {
    name: 'Navigation Bar',
    description: 'Horizontal navigation with logo and menu items',
    category: 'navigation',
    properties: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 20,
      itemCount: 4,
      itemMinWidth: 100,
      itemFlexGrow: [0, 1, 0, 0],
      itemFlexShrink: [0, 1, 0, 0],
      itemFlexBasis: ['auto', '1fr', 'auto', 'auto']
    }
  },
  {
    name: 'Form Layout',
    description: 'Vertical form with labels and inputs',
    category: 'forms',
    properties: {
      flexDirection: 'column',
      gap: 16,
      itemCount: 4,
      itemMinHeight: 40,
      itemFlexGrow: [0, 0, 0, 0],
      itemFlexBasis: ['auto', 'auto', 'auto', 'auto']
    }
  },
  {
    name: 'Hero Section',
    description: 'Centered content with call-to-action',
    category: 'layout',
    properties: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 24,
      itemCount: 3,
      itemMinWidth: 200,
      itemFlexGrow: [0, 0, 0],
      itemFlexBasis: ['auto', 'auto', 'auto']
    }
  },
  {
    name: 'Sidebar Layout',
    description: 'Two-column layout with sidebar and main content',
    category: 'layout',
    properties: {
      flexDirection: 'row',
      gap: 20,
      itemCount: 2,
      itemMinWidth: 200,
      itemFlexGrow: [0, 1],
      itemFlexBasis: ['250px', '1fr']
    }
  }
];

const RESPONSIVE_BREAKPOINTS = [
  { name: 'Mobile', width: 375 },
  { name: 'Tablet', width: 768 },
  { name: 'Desktop', width: 1024 },
  { name: 'Large Desktop', width: 1440 }
];

const FLEX_DIRECTIONS = [
  { value: 'row', label: 'Row (→)' },
  { value: 'row-reverse', label: 'Row Reverse (←)' },
  { value: 'column', label: 'Column (↓)' },
  { value: 'column-reverse', label: 'Column Reverse (↑)' }
];

const FLEX_WRAPS = [
  { value: 'nowrap', label: 'No Wrap' },
  { value: 'wrap', label: 'Wrap' },
  { value: 'wrap-reverse', label: 'Wrap Reverse' }
];

const JUSTIFY_CONTENT = [
  { value: 'flex-start', label: 'Flex Start' },
  { value: 'flex-end', label: 'Flex End' },
  { value: 'center', label: 'Center' },
  { value: 'space-between', label: 'Space Between' },
  { value: 'space-around', label: 'Space Around' },
  { value: 'space-evenly', label: 'Space Evenly' }
];

const ALIGN_ITEMS = [
  { value: 'stretch', label: 'Stretch' },
  { value: 'flex-start', label: 'Flex Start' },
  { value: 'flex-end', label: 'Flex End' },
  { value: 'center', label: 'Center' },
  { value: 'baseline', label: 'Baseline' }
];

const ALIGN_CONTENT = [
  { value: 'stretch', label: 'Stretch' },
  { value: 'flex-start', label: 'Flex Start' },
  { value: 'flex-end', label: 'Flex End' },
  { value: 'center', label: 'Center' },
  { value: 'space-between', label: 'Space Between' },
  { value: 'space-around', label: 'Space Around' }
];

const ALIGN_SELF = [
  { value: 'auto', label: 'Auto' },
  { value: 'flex-start', label: 'Flex Start' },
  { value: 'flex-end', label: 'Flex End' },
  { value: 'center', label: 'Center' },
  { value: 'baseline', label: 'Baseline' },
  { value: 'stretch', label: 'Stretch' }
];

export const FlexboxCreator = () => {
  const [properties, setProperties] = useState<FlexboxProperties>(DEFAULT_PROPERTIES);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("container");
  const [history, setHistory] = useState<FlexboxProperties[]>([DEFAULT_PROPERTIES]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [currentBreakpoint, setCurrentBreakpoint] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();
  const historyRef = useRef<FlexboxProperties[]>([]);
  const historyIndexRef = useRef(0);

  // History management
  const addToHistory = useCallback((newProperties: FlexboxProperties) => {
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push(newProperties);
    if (newHistory.length > 50) newHistory.shift(); // Limit history size
    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
    setHistory(newHistory);
    setHistoryIndex(historyIndexRef.current);
  }, []);

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      setHistoryIndex(historyIndexRef.current);
      setProperties(historyRef.current[historyIndexRef.current]);
    }
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      setHistoryIndex(historyIndexRef.current);
      setProperties(historyRef.current[historyIndexRef.current]);
    }
  }, []);

  const savePreset = useCallback(() => {
    const presetName = prompt("Enter preset name:");
    if (presetName) {
      // In a real app, this would save to localStorage or a backend
      toast({
        title: "Preset Saved",
        description: `${presetName} has been saved to your presets`,
      });
    }
  }, [toast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 's':
            e.preventDefault();
            savePreset();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, savePreset]);

  // Update item arrays when item count changes
  useEffect(() => {
    setProperties(prev => {
      const newItemCount = prev.itemCount;
      const newFlexGrow = [...prev.itemFlexGrow];
      const newFlexShrink = [...prev.itemFlexShrink];
      const newFlexBasis = [...prev.itemFlexBasis];
      const newAlignSelf = [...prev.itemAlignSelf];

      // Extend arrays if needed
      while (newFlexGrow.length < newItemCount) {
        newFlexGrow.push(1);
        newFlexShrink.push(1);
        newFlexBasis.push('auto');
        newAlignSelf.push('auto');
      }

      // Trim arrays if needed
      if (newFlexGrow.length > newItemCount) {
        newFlexGrow.splice(newItemCount);
        newFlexShrink.splice(newItemCount);
        newFlexBasis.splice(newItemCount);
        newAlignSelf.splice(newItemCount);
      }

      const newProps = {
        ...prev,
        itemFlexGrow: newFlexGrow,
        itemFlexShrink: newFlexShrink,
        itemFlexBasis: newFlexBasis,
        itemAlignSelf: newAlignSelf
      };

      addToHistory(newProps);
      return newProps;
    });
  }, [properties.itemCount, addToHistory]);

  const updateProperty = <K extends keyof FlexboxProperties>(key: K, value: FlexboxProperties[K]) => {
    setProperties(prev => {
      const newProps = { ...prev, [key]: value };
      addToHistory(newProps);
      return newProps;
    });
  };

  const updateItemProperty = (index: number, property: 'itemFlexGrow' | 'itemFlexShrink' | 'itemFlexBasis' | 'itemAlignSelf', value: number | string) => {
    setProperties(prev => {
      const newArray = [...prev[property]];
      newArray[index] = value;
      const newProps = { ...prev, [property]: newArray };
      addToHistory(newProps);
      return newProps;
    });
  };

  const applyPreset = (preset: Preset) => {
    const newProps = { ...properties, ...preset.properties, preset: preset.name };
    addToHistory(newProps);
    setProperties(newProps);
    toast({
      title: "Preset Applied",
      description: `${preset.name} preset has been applied`,
    });
  };

  const exportConfig = () => {
    const config = {
      properties,
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'flexbox-config.json';
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target?.result as string);
          if (config.properties) {
            setProperties(config.properties);
            addToHistory(config.properties);
            toast({
              title: "Config Imported",
              description: "Configuration has been imported successfully",
            });
          }
        } catch (error) {
          toast({
            title: "Import Failed",
            description: "Invalid configuration file",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const generateCSS = () => {
    const cssVars = properties.useCSSVariables ? `
:root {
  --flex-direction: ${properties.flexDirection};
  --flex-wrap: ${properties.flexWrap};
  --justify-content: ${properties.justifyContent};
  --align-items: ${properties.alignItems};
  --align-content: ${properties.alignContent};
  --gap: ${properties.gap}px;
  --row-gap: ${properties.rowGap}px;
  --column-gap: ${properties.columnGap}px;
  --container-width: ${properties.containerWidth}px;
  --container-height: ${properties.containerHeight}px;
}` : '';

    const containerCSS = `
.flex-container {
  display: flex;
  flex-direction: ${properties.useCSSVariables ? 'var(--flex-direction)' : properties.flexDirection};
  flex-wrap: ${properties.useCSSVariables ? 'var(--flex-wrap)' : properties.flexWrap};
  justify-content: ${properties.useCSSVariables ? 'var(--justify-content)' : properties.justifyContent};
  align-items: ${properties.useCSSVariables ? 'var(--align-items)' : properties.alignItems};
  align-content: ${properties.useCSSVariables ? 'var(--align-content)' : properties.alignContent};
  gap: ${properties.useCSSVariables ? 'var(--gap)' : `${properties.gap}px`};
  row-gap: ${properties.useCSSVariables ? 'var(--row-gap)' : `${properties.rowGap}px`};
  column-gap: ${properties.useCSSVariables ? 'var(--column-gap)' : `${properties.columnGap}px`};
  width: ${properties.useCSSVariables ? 'var(--container-width)' : `${properties.containerWidth}px`};
  height: ${properties.useCSSVariables ? 'var(--container-height)' : `${properties.containerHeight}px`};
  border: 2px dashed #ccc;
  padding: 10px;
  background-color: #f8f9fa;
}`;

    const itemCSS = properties.itemFlexGrow.map((grow, index) => `
.flex-item-${index + 1} {
  flex-grow: ${grow};
  flex-shrink: ${properties.itemFlexShrink[index]};
  flex-basis: ${properties.itemFlexBasis[index]};
  align-self: ${properties.itemAlignSelf[index]};
  min-width: ${properties.itemMinWidth}px;
  min-height: ${properties.itemMinHeight}px;
  max-width: ${properties.itemMaxWidth}px;
  max-height: ${properties.itemMaxHeight}px;
  background-color: hsl(${(index * 60) % 360}, 70%, 80%);
  border: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #333;
}`).join('');

    const responsiveCSS = properties.responsiveMode && properties.breakpoints.length > 0 ? 
      properties.breakpoints.map(bp => `
@media (max-width: ${bp.width}px) {
  .flex-container {
    ${bp.properties.flexDirection ? `flex-direction: ${bp.properties.flexDirection};` : ''}
    ${bp.properties.flexWrap ? `flex-wrap: ${bp.properties.flexWrap};` : ''}
    ${bp.properties.justifyContent ? `justify-content: ${bp.properties.justifyContent};` : ''}
    ${bp.properties.alignItems ? `align-items: ${bp.properties.alignItems};` : ''}
    ${bp.properties.gap ? `gap: ${bp.properties.gap}px;` : ''}
  }
}`).join('') : '';

    const customCSS = properties.customCSS ? `
/* Custom CSS */
${properties.customCSS}` : '';

    return cssVars + containerCSS + itemCSS + responsiveCSS + customCSS;
  };

  const generateHTML = () => {
    const items = Array.from({ length: properties.itemCount }, (_, i) => 
      `  <div class="flex-item-${i + 1}">${i + 1}</div>`
    ).join('\n');

    return `<div class="flex-container">
${items}
</div>`;
  };

  const copyToClipboard = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content);
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

  const downloadCode = () => {
    const fullCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flexbox Layout</title>
    <style>
${generateCSS()}
    </style>
</head>
<body>
${generateHTML()}
</body>
</html>`;

    const blob = new Blob([fullCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'flexbox-layout.html';
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Flexbox layout saved as HTML file",
    });
  };

  const resetToDefaults = () => {
    setProperties(DEFAULT_PROPERTIES);
    toast({
      title: "Reset!",
      description: "All properties reset to defaults",
    });
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: properties.flexDirection,
    flexWrap: properties.flexWrap,
    justifyContent: properties.justifyContent,
    alignItems: properties.alignItems,
    alignContent: properties.alignContent,
    gap: properties.gap > 0 ? `${properties.gap}px` : undefined,
    rowGap: properties.rowGap > 0 ? `${properties.rowGap}px` : undefined,
    columnGap: properties.columnGap > 0 ? `${properties.columnGap}px` : undefined,
    width: `${properties.containerWidth}px`,
    height: `${properties.containerHeight}px`,
    border: '2px dashed #ccc',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    margin: '0 auto'
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold">Flexbox Creator</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Zap className="h-3 w-3" />
              Professional
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">
          Professional flexbox layout builder with real-time visual feedback, presets, and advanced features
        </p>
      </div>

      {/* Professional Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="gap-2"
                >
                  <Undo className="h-4 w-4" />
                  Undo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="gap-2"
                >
                  <Redo className="h-4 w-4" />
                  Redo
                </Button>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={savePreset}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Preset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportConfig}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={importConfig}
                  className="hidden"
                  id="import-config"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('import-config')?.click()}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Import
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Smartphone className="h-4 w-4" />
                <Tablet className="h-4 w-4" />
                <Monitor className="h-4 w-4" />
              </div>
              <span className="text-sm text-muted-foreground">
                {properties.containerWidth}×{properties.containerHeight}px
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Professional Presets
          </CardTitle>
          <CardDescription>Quick-start layouts for common use cases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROFESSIONAL_PRESETS.map((preset) => (
              <Card key={preset.name} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4" onClick={() => applyPreset(preset)}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{preset.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {preset.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{preset.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="container" className="gap-2">
                <Layout className="h-4 w-4" />
                Container
              </TabsTrigger>
              <TabsTrigger value="items" className="gap-2">
                <Plus className="h-4 w-4" />
                Items
              </TabsTrigger>
              <TabsTrigger value="advanced" className="gap-2">
                <Settings className="h-4 w-4" />
                Advanced
              </TabsTrigger>
              <TabsTrigger value="code" className="gap-2">
                <Code className="h-4 w-4" />
                Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="container" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Container Properties</CardTitle>
                  <CardDescription>Configure the flex container behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="flex-direction">Flex Direction</Label>
                      <Select value={properties.flexDirection} onValueChange={(value: 'row' | 'row-reverse' | 'column' | 'column-reverse') => updateProperty('flexDirection', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FLEX_DIRECTIONS.map((dir) => (
                            <SelectItem key={dir.value} value={dir.value}>
                              {dir.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="flex-wrap">Flex Wrap</Label>
                      <Select value={properties.flexWrap} onValueChange={(value: 'nowrap' | 'wrap' | 'wrap-reverse') => updateProperty('flexWrap', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FLEX_WRAPS.map((wrap) => (
                            <SelectItem key={wrap.value} value={wrap.value}>
                              {wrap.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="justify-content">Justify Content</Label>
                      <Select value={properties.justifyContent} onValueChange={(value: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly') => updateProperty('justifyContent', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {JUSTIFY_CONTENT.map((justify) => (
                            <SelectItem key={justify.value} value={justify.value}>
                              {justify.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="align-items">Align Items</Label>
                      <Select value={properties.alignItems} onValueChange={(value: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline') => updateProperty('alignItems', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ALIGN_ITEMS.map((align) => (
                            <SelectItem key={align.value} value={align.value}>
                              {align.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="align-content">Align Content</Label>
                      <Select value={properties.alignContent} onValueChange={(value: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around') => updateProperty('alignContent', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ALIGN_CONTENT.map((align) => (
                            <SelectItem key={align.value} value={align.value}>
                              {align.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Gap: {properties.gap}px</Label>
                      <Slider
                        value={[properties.gap]}
                        onValueChange={(value) => updateProperty('gap', value[0])}
                        max={50}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Row Gap: {properties.rowGap}px</Label>
                        <Slider
                          value={[properties.rowGap]}
                          onValueChange={(value) => updateProperty('rowGap', value[0])}
                          max={50}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Column Gap: {properties.columnGap}px</Label>
                        <Slider
                          value={[properties.columnGap]}
                          onValueChange={(value) => updateProperty('columnGap', value[0])}
                          max={50}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Container Dimensions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="container-width">Width: {properties.containerWidth}px</Label>
                      <Slider
                        value={[properties.containerWidth]}
                        onValueChange={(value) => updateProperty('containerWidth', value[0])}
                        min={200}
                        max={1000}
                        step={10}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="container-height">Height: {properties.containerHeight}px</Label>
                      <Slider
                        value={[properties.containerHeight]}
                        onValueChange={(value) => updateProperty('containerHeight', value[0])}
                        min={100}
                        max={600}
                        step={10}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="items" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Item Properties</CardTitle>
                  <CardDescription>Configure flex items behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Number of Items: {properties.itemCount}</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateProperty('itemCount', Math.max(1, properties.itemCount - 1))}
                        disabled={properties.itemCount <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center">{properties.itemCount}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateProperty('itemCount', Math.min(12, properties.itemCount + 1))}
                        disabled={properties.itemCount >= 12}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Min Width: {properties.itemMinWidth}px</Label>
                      <Slider
                        value={[properties.itemMinWidth]}
                        onValueChange={(value) => updateProperty('itemMinWidth', value[0])}
                        min={20}
                        max={200}
                        step={5}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Min Height: {properties.itemMinHeight}px</Label>
                      <Slider
                        value={[properties.itemMinHeight]}
                        onValueChange={(value) => updateProperty('itemMinHeight', value[0])}
                        min={20}
                        max={200}
                        step={5}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Width: {properties.itemMaxWidth}px</Label>
                      <Slider
                        value={[properties.itemMaxWidth]}
                        onValueChange={(value) => updateProperty('itemMaxWidth', value[0])}
                        min={50}
                        max={400}
                        step={10}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Height: {properties.itemMaxHeight}px</Label>
                      <Slider
                        value={[properties.itemMaxHeight]}
                        onValueChange={(value) => updateProperty('itemMaxHeight', value[0])}
                        min={50}
                        max={400}
                        step={10}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Individual item properties for first few items */}
                  {properties.itemCount <= 6 && (
                    <div className="space-y-4">
                      <Label className="text-sm font-medium">Individual Item Properties</Label>
                      {Array.from({ length: properties.itemCount }, (_, index) => (
                        <Card key={index} className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Item {index + 1}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Flex Grow</Label>
                              <Input
                                type="number"
                                value={properties.itemFlexGrow[index]}
                                onChange={(e) => updateItemProperty(index, 'itemFlexGrow', parseFloat(e.target.value) || 0)}
                                min="0"
                                step="0.1"
                                className="h-8"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Flex Shrink</Label>
                              <Input
                                type="number"
                                value={properties.itemFlexShrink[index]}
                                onChange={(e) => updateItemProperty(index, 'itemFlexShrink', parseFloat(e.target.value) || 0)}
                                min="0"
                                step="0.1"
                                className="h-8"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Flex Basis</Label>
                              <Input
                                value={properties.itemFlexBasis[index]}
                                onChange={(e) => updateItemProperty(index, 'itemFlexBasis', e.target.value)}
                                placeholder="auto"
                                className="h-8"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Align Self</Label>
                              <Select value={properties.itemAlignSelf[index]} onValueChange={(value: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch') => updateItemProperty(index, 'itemAlignSelf', value)}>
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {ALIGN_SELF.map((align) => (
                                    <SelectItem key={align.value} value={align.value}>
                                      {align.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Features</CardTitle>
                  <CardDescription>Professional development features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>CSS Variables</Label>
                        <p className="text-sm text-muted-foreground">Generate CSS custom properties</p>
                      </div>
                      <Switch
                        checked={properties.useCSSVariables}
                        onCheckedChange={(checked) => updateProperty('useCSSVariables', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Responsive Mode</Label>
                        <p className="text-sm text-muted-foreground">Enable responsive breakpoints</p>
                      </div>
                      <Switch
                        checked={properties.responsiveMode}
                        onCheckedChange={(checked) => updateProperty('responsiveMode', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Grid Overlay</Label>
                        <p className="text-sm text-muted-foreground">Show visual grid overlay</p>
                      </div>
                      <Switch
                        checked={properties.showGridOverlay}
                        onCheckedChange={(checked) => updateProperty('showGridOverlay', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Flex Lines</Label>
                        <p className="text-sm text-muted-foreground">Show flex line indicators</p>
                      </div>
                      <Switch
                        checked={properties.showFlexLines}
                        onCheckedChange={(checked) => updateProperty('showFlexLines', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Item Numbers</Label>
                        <p className="text-sm text-muted-foreground">Display item numbers in preview</p>
                      </div>
                      <Switch
                        checked={properties.showItemNumbers}
                        onCheckedChange={(checked) => updateProperty('showItemNumbers', checked)}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Custom CSS</Label>
                    <Textarea
                      value={properties.customCSS}
                      onChange={(e) => updateProperty('customCSS', e.target.value)}
                      placeholder="/* Add your custom CSS here */"
                      className="min-h-[100px] font-mono text-sm"
                    />
                  </div>
                  
                  {properties.responsiveMode && (
                    <div className="space-y-4">
                      <Label>Responsive Breakpoints</Label>
                      <div className="space-y-2">
                        {RESPONSIVE_BREAKPOINTS.map((bp, index) => (
                          <div key={bp.name} className="flex items-center gap-2 p-2 border rounded">
                            <Badge variant="outline">{bp.name}</Badge>
                            <span className="text-sm">{bp.width}px</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentBreakpoint(index)}
                              className="ml-auto"
                            >
                              Configure
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="code" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Generated CSS</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generateCSS(), "CSS")}
                        className="gap-2"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        Copy CSS
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generateHTML(), "HTML")}
                        className="gap-2"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        Copy HTML
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadCode}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">CSS Code</Label>
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{generateCSS()}</code>
                      </pre>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">HTML Structure</Label>
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{generateHTML()}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Actions</CardTitle>
                <Button variant="outline" onClick={resetToDefaults} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Visual Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>Real-time flexbox visualization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div 
                  style={{
                    ...containerStyle,
                    position: 'relative',
                    backgroundImage: properties.showGridOverlay ? `
                      linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                    ` : undefined,
                    backgroundSize: properties.showGridOverlay ? '20px 20px' : undefined
                  }}
                >
                  {Array.from({ length: properties.itemCount }, (_, index) => {
                    const itemStyle: React.CSSProperties = {
                      flexGrow: properties.itemFlexGrow[index] || 1,
                      flexShrink: properties.itemFlexShrink[index] || 1,
                      flexBasis: properties.itemFlexBasis[index] || 'auto',
                      alignSelf: properties.itemAlignSelf[index] || 'auto',
                      minWidth: `${properties.itemMinWidth}px`,
                      minHeight: `${properties.itemMinHeight}px`,
                      maxWidth: `${properties.itemMaxWidth}px`,
                      maxHeight: `${properties.itemMaxHeight}px`,
                      backgroundColor: `hsl(${(index * 60) % 360}, 70%, 80%)`,
                      border: '1px solid #333',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      color: '#333',
                      fontSize: '14px',
                      position: 'relative'
                    };

                    return (
                      <div key={index} style={itemStyle}>
                        {properties.showItemNumbers && (
                          <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {index + 1}
                          </span>
                        )}
                        {properties.showItemNumbers ? index + 1 : ''}
                      </div>
                    );
                  })}
                  
                  {properties.showFlexLines && (
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Flex line indicators would go here */}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Current Properties</CardTitle>
              <CardDescription>Summary of applied flexbox properties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div><strong>Direction:</strong> {properties.flexDirection}</div>
                  <div><strong>Wrap:</strong> {properties.flexWrap}</div>
                  <div><strong>Justify:</strong> {properties.justifyContent}</div>
                  <div><strong>Align Items:</strong> {properties.alignItems}</div>
                </div>
                <div className="space-y-2">
                  <div><strong>Align Content:</strong> {properties.alignContent}</div>
                  <div><strong>Gap:</strong> {properties.gap}px</div>
                  <div><strong>Items:</strong> {properties.itemCount}</div>
                  <div><strong>Size:</strong> {properties.containerWidth}×{properties.containerHeight}px</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Flexbox Tips</CardTitle>
          <CardDescription>Best practices and common patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Container Properties</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>flex-direction:</strong> Controls main axis direction</li>
                <li>• <strong>justify-content:</strong> Aligns items along main axis</li>
                <li>• <strong>align-items:</strong> Aligns items along cross axis</li>
                <li>• <strong>flex-wrap:</strong> Controls whether items wrap to new lines</li>
                <li>• <strong>gap:</strong> Sets consistent spacing between items</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Item Properties</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>flex-grow:</strong> How much item should grow (0 = no growth)</li>
                <li>• <strong>flex-shrink:</strong> How much item should shrink (0 = no shrink)</li>
                <li>• <strong>flex-basis:</strong> Initial size before free space distribution</li>
                <li>• <strong>align-self:</strong> Override container's align-items for this item</li>
                <li>• <strong>min/max-width/height:</strong> Constrain item dimensions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
