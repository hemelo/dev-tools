import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Copy, Download, RotateCcw, Shuffle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ColorStop {
  color: string;
  position: number;
}

interface GradientConfig {
  type: 'linear' | 'radial' | 'conic';
  direction: string;
  stops: ColorStop[];
  angle: number;
}

const CssGradientGenerator = () => {
  const [gradientConfig, setGradientConfig] = useState<GradientConfig>({
    type: 'linear',
    direction: 'to right',
    stops: [
      { color: '#3B82F6', position: 0 },
      { color: '#8B5CF6', position: 100 }
    ],
    angle: 90
  });

  const [previewSize, setPreviewSize] = useState(400);
  const { toast } = useToast();

  const predefinedGradients = [
    { name: 'Ocean Blue', stops: [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }] },
    { name: 'Sunset', stops: [{ color: '#f093fb', position: 0 }, { color: '#f5576c', position: 100 }] },
    { name: 'Forest', stops: [{ color: '#4facfe', position: 0 }, { color: '#00f2fe', position: 100 }] },
    { name: 'Fire', stops: [{ color: '#fa709a', position: 0 }, { color: '#fee140', position: 100 }] },
    { name: 'Purple Haze', stops: [{ color: '#a8edea', position: 0 }, { color: '#fed6e3', position: 100 }] },
    { name: 'Dark Mode', stops: [{ color: '#2c3e50', position: 0 }, { color: '#34495e', position: 100 }] },
    { name: 'Neon', stops: [{ color: '#00c9ff', position: 0 }, { color: '#92fe9d', position: 100 }] },
    { name: 'Warm', stops: [{ color: '#ff9a9e', position: 0 }, { color: '#fecfef', position: 100 }] }
  ];

  const directions = {
    linear: [
      { value: 'to right', label: '→ Right' },
      { value: 'to left', label: '← Left' },
      { value: 'to bottom', label: '↓ Bottom' },
      { value: 'to top', label: '↑ Top' },
      { value: 'to bottom right', label: '↘ Bottom Right' },
      { value: 'to bottom left', label: '↙ Bottom Left' },
      { value: 'to top right', label: '↗ Top Right' },
      { value: 'to top left', label: '↖ Top Left' }
    ],
    radial: [
      { value: 'circle', label: 'Circle' },
      { value: 'ellipse', label: 'Ellipse' },
      { value: 'circle at center', label: 'Circle at Center' },
      { value: 'ellipse at center', label: 'Ellipse at Center' }
    ],
    conic: [
      { value: 'from 0deg', label: 'From 0°' },
      { value: 'from 90deg', label: 'From 90°' },
      { value: 'from 180deg', label: 'From 180°' },
      { value: 'from 270deg', label: 'From 270°' }
    ]
  };

  const generateCss = useMemo(() => {
    const { type, direction, stops } = gradientConfig;
    
    const colorStops = stops
      .sort((a, b) => a.position - b.position)
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ');

    if (type === 'linear') {
      return `background: linear-gradient(${direction}, ${colorStops});`;
    } else if (type === 'radial') {
      return `background: radial-gradient(${direction}, ${colorStops});`;
    } else if (type === 'conic') {
      return `background: conic-gradient(${direction}, ${colorStops});`;
    }
    
    return '';
  }, [gradientConfig]);

  const addColorStop = () => {
    const newStop: ColorStop = {
      color: '#FFFFFF',
      position: 50
    };
    
    setGradientConfig(prev => ({
      ...prev,
      stops: [...prev.stops, newStop].sort((a, b) => a.position - b.position)
    }));
  };

  const removeColorStop = (index: number) => {
    if (gradientConfig.stops.length <= 2) return;
    
    setGradientConfig(prev => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index)
    }));
  };

  const updateColorStop = (index: number, field: keyof ColorStop, value: string | number) => {
    setGradientConfig(prev => ({
      ...prev,
      stops: prev.stops.map((stop, i) => 
        i === index ? { ...stop, [field]: value } : stop
      ).sort((a, b) => a.position - b.position)
    }));
  };

  const randomizeGradient = () => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
    ];
    
    const randomColors = colors.sort(() => 0.5 - Math.random()).slice(0, 3);
    const newStops = randomColors.map((color, index) => ({
      color,
      position: (index / (randomColors.length - 1)) * 100
    }));
    
    setGradientConfig(prev => ({
      ...prev,
      stops: newStops
    }));
  };

  const loadPreset = (preset: typeof predefinedGradients[0]) => {
    setGradientConfig(prev => ({
      ...prev,
      stops: preset.stops
    }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCss);
    toast({
      title: "Copied!",
      description: "CSS copied to clipboard!",
    });
  };

  const downloadAsImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Create gradient
    let gradient;
    if (gradientConfig.type === 'linear') {
      gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    } else if (gradientConfig.type === 'radial') {
      gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, Math.max(canvas.width, canvas.height)/2);
    } else {
      gradient = ctx.createConicGradient(0, canvas.width/2, canvas.height/2);
    }
    
    gradientConfig.stops.forEach(stop => {
      gradient.addColorStop(stop.position / 100, stop.color);
    });
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Download
    const link = document.createElement('a');
    link.download = `gradient-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    toast({
      title: "Success!",
      description: "Gradient image downloaded!",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">CSS Gradient Generator</h2>
        <p className="text-muted-foreground">
          Create beautiful CSS gradients with live preview and export options
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Gradient Configuration
            </CardTitle>
            <CardDescription>
              Customize your gradient settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="gradient-type">Gradient Type</Label>
              <Select 
                value={gradientConfig.type} 
                onValueChange={(value: any) => setGradientConfig(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="radial">Radial</SelectItem>
                  <SelectItem value="conic">Conic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="gradient-direction">Direction</Label>
              <Select 
                value={gradientConfig.direction} 
                onValueChange={(value) => setGradientConfig(prev => ({ ...prev, direction: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {directions[gradientConfig.type].map(dir => (
                    <SelectItem key={dir.value} value={dir.value}>
                      {dir.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Color Stops</Label>
              <div className="space-y-3 mt-2">
                {gradientConfig.stops.map((stop, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={stop.color}
                      onChange={(e) => updateColorStop(index, 'color', e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={stop.color}
                      onChange={(e) => updateColorStop(index, 'color', e.target.value)}
                      className="flex-1 font-mono text-sm"
                    />
                    <div className="flex items-center gap-2 w-24">
                      <Slider
                        value={[stop.position]}
                        onValueChange={([value]) => updateColorStop(index, 'position', value)}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm w-8">{stop.position}%</span>
                    </div>
                    {gradientConfig.stops.length > 2 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeColorStop(index)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addColorStop}
                className="mt-2"
              >
                + Add Color Stop
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={randomizeGradient}>
                <Shuffle className="h-4 w-4 mr-2" />
                Randomize
              </Button>
              <Button variant="outline" onClick={() => setGradientConfig({
                type: 'linear',
                direction: 'to right',
                stops: [
                  { color: '#3B82F6', position: 0 },
                  { color: '#8B5CF6', position: 100 }
                ],
                angle: 90
              })}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Live Preview
            </CardTitle>
            <CardDescription>
              See your gradient in real-time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Preview Size</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[previewSize]}
                  onValueChange={([value]) => setPreviewSize(value)}
                  min={200}
                  max={600}
                  step={50}
                  className="w-24"
                />
                <span className="text-sm w-12">{previewSize}px</span>
              </div>
            </div>
            
            <div 
              className="rounded-lg border-2 border-gray-200 dark:border-gray-700 mx-auto"
              style={{
                width: previewSize,
                height: previewSize / 2,
                background: generateCss.replace('background: ', '').replace(';', '')
              }}
            />
            
            <div className="space-y-2">
              <Label>Generated CSS</Label>
              <div className="p-3 bg-code-bg rounded-lg">
                <code className="text-sm font-mono break-all">{generateCss}</code>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-2" />
                Copy CSS
              </Button>
              <Button variant="outline" onClick={downloadAsImage}>
                <Download className="h-4 w-4 mr-2" />
                Download Image
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Predefined Gradients</CardTitle>
          <CardDescription>
            Click on any gradient to load it into the editor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {predefinedGradients.map((preset, index) => (
              <div
                key={index}
                className="cursor-pointer group"
                onClick={() => loadPreset(preset)}
              >
                <div
                  className="h-20 rounded-lg border-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-500 transition-colors"
                  style={{
                    background: `linear-gradient(to right, ${preset.stops.map(s => `${s.color} ${s.position}%`).join(', ')})`
                  }}
                />
                <p className="text-sm text-center mt-2 font-medium">{preset.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="html" className="space-y-4">
            <TabsList>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="react">React</TabsTrigger>
            </TabsList>
            
            <TabsContent value="html">
              <div className="p-4 bg-code-bg rounded-lg">
                <pre className="text-sm"><code>{`<div class="gradient-bg"></div>

<style>
.gradient-bg {
  ${generateCss}
  width: 100%;
  height: 200px;
}
</style>`}</code></pre>
              </div>
            </TabsContent>
            
            <TabsContent value="css">
              <div className="p-4 bg-code-bg rounded-lg">
                <pre className="text-sm"><code>{`.my-gradient {
  ${generateCss}
  width: 100%;
  height: 200px;
  border-radius: 8px;
}`}</code></pre>
              </div>
            </TabsContent>
            
            <TabsContent value="react">
              <div className="p-4 bg-code-bg rounded-lg">
                <pre className="text-sm"><code>{`const GradientComponent = () => {
  return (
    <div 
      style={{
        ${generateCss.replace('background: ', '').replace(';', '')},
        width: '100%',
        height: '200px',
        borderRadius: '8px'
      }}
    />
  );
};`}</code></pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CssGradientGenerator;
