import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Copy, Download, Upload, Shuffle, Eye, Camera, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  name?: string;
}

interface PaletteConfig {
  method: 'manual' | 'harmony' | 'image' | 'random';
  harmonyType: 'complementary' | 'triadic' | 'tetradic' | 'analogous' | 'monochromatic';
  colorCount: number;
  baseColor: string;
}

const ColorPaletteGenerator = () => {
  const [palette, setPalette] = useState<Color[]>([]);
  const [config, setConfig] = useState<PaletteConfig>({
    method: 'harmony',
    harmonyType: 'complementary',
    colorCount: 5,
    baseColor: '#3B82F6'
  });
  const [paletteName, setPaletteName] = useState('My Palette');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const colorNames: Record<string, string> = {
    '#FF0000': 'Red',
    '#FF8000': 'Orange',
    '#FFFF00': 'Yellow',
    '#80FF00': 'Lime',
    '#00FF00': 'Green',
    '#00FF80': 'Spring Green',
    '#00FFFF': 'Cyan',
    '#0080FF': 'Azure',
    '#0000FF': 'Blue',
    '#8000FF': 'Violet',
    '#FF00FF': 'Magenta',
    '#FF0080': 'Rose',
    '#000000': 'Black',
    '#808080': 'Gray',
    '#FFFFFF': 'White'
  };

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360;
    s /= 100;
    l /= 100;
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const createColor = (hex: string): Color => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return {
      hex,
      rgb,
      hsl,
      name: colorNames[hex.toUpperCase()]
    };
  };

  const generateHarmonyPalette = (baseColor: string, type: string, count: number): Color[] => {
    const baseRgb = hexToRgb(baseColor);
    const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
    const colors: Color[] = [createColor(baseColor)];

    const hueStep = 360 / count;
    let hueOffsets: number[] = [];

    switch (type) {
      case 'complementary':
        hueOffsets = [0, 180];
        break;
      case 'triadic':
        hueOffsets = [0, 120, 240];
        break;
      case 'tetradic':
        hueOffsets = [0, 90, 180, 270];
        break;
      case 'analogous':
        hueOffsets = [0, 30, 60, 90, 120];
        break;
      case 'monochromatic':
        hueOffsets = [0, 0, 0, 0, 0];
        break;
    }

    for (let i = 1; i < count; i++) {
      let newHue = baseHsl.h + (hueOffsets[i] || i * hueStep);
      if (newHue >= 360) newHue -= 360;
      
      let newSaturation = baseHsl.s;
      let newLightness = baseHsl.l;

      if (type === 'monochromatic') {
        newLightness = Math.max(10, Math.min(90, baseHsl.l + (i - 2) * 15));
      } else if (type === 'analogous') {
        newSaturation = Math.max(20, baseHsl.s - i * 5);
      }

      const newRgb = hslToRgb(newHue, newSaturation, newLightness);
      const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
      colors.push(createColor(newHex));
    }

    return colors;
  };

  const generateRandomPalette = (count: number): Color[] => {
    const colors: Color[] = [];
    for (let i = 0; i < count; i++) {
      const hue = Math.random() * 360;
      const saturation = 60 + Math.random() * 40;
      const lightness = 30 + Math.random() * 40;
      const rgb = hslToRgb(hue, saturation, lightness);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      colors.push(createColor(hex));
    }
    return colors;
  };

  const extractColorsFromImage = (imageData: ImageData): Color[] => {
    const data = imageData.data;
    const colorMap = new Map<string, number>();
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const hex = rgbToHex(r, g, b);
      colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
    }

    const sortedColors = Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, config.colorCount)
      .map(([hex]) => createColor(hex));

    return sortedColors;
  };

  const generatePalette = () => {
    let newPalette: Color[] = [];

    switch (config.method) {
      case 'harmony':
        newPalette = generateHarmonyPalette(config.baseColor, config.harmonyType, config.colorCount);
        break;
      case 'random':
        newPalette = generateRandomPalette(config.colorCount);
        break;
      case 'manual':
        // Manual mode - user will add colors individually
        return;
    }

    setPalette(newPalette);
  };

  const addManualColor = (hex: string) => {
    const newColor = createColor(hex);
    setPalette(prev => [...prev, newColor]);
  };

  const removeColor = (index: number) => {
    setPalette(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 100;
        canvas.height = 100;
        ctx.drawImage(img, 0, 0, 100, 100);
        
        const imageData = ctx.getImageData(0, 0, 100, 100);
        const extractedColors = extractColorsFromImage(imageData);
        setPalette(extractedColors);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const copyColor = (color: Color) => {
    navigator.clipboard.writeText(color.hex);
    toast({
      title: "Copied!",
      description: `${color.hex} copied to clipboard!`,
    });
  };

  const copyPalette = () => {
    const paletteText = palette.map(color => color.hex).join('\n');
    navigator.clipboard.writeText(paletteText);
    toast({
      title: "Copied!",
      description: "Palette copied to clipboard!",
    });
  };

  const downloadPalette = () => {
    const paletteData = {
      name: paletteName,
      colors: palette.map(color => ({
        hex: color.hex,
        rgb: color.rgb,
        hsl: color.hsl,
        name: color.name
      }))
    };

    const blob = new Blob([JSON.stringify(paletteData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${paletteName.toLowerCase().replace(/\s+/g, '-')}-palette.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success!",
      description: "Palette downloaded!",
    });
  };

  const exportAsCss = () => {
    const cssVars = palette.map((color, index) => 
      `  --color-${index + 1}: ${color.hex};`
    ).join('\n');
    
    const css = `:root {\n${cssVars}\n}`;
    
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${paletteName.toLowerCase().replace(/\s+/g, '-')}-palette.css`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success!",
      description: "CSS file downloaded!",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Color Palette Generator</h2>
        <p className="text-muted-foreground">
          Create beautiful color palettes with harmony rules, image extraction, or manual selection
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Palette Configuration
            </CardTitle>
            <CardDescription>
              Choose how to generate your color palette
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="method">Generation Method</Label>
              <Select 
                value={config.method} 
                onValueChange={(value: any) => setConfig(prev => ({ ...prev, method: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="harmony">Color Harmony</SelectItem>
                  <SelectItem value="random">Random Colors</SelectItem>
                  <SelectItem value="image">Extract from Image</SelectItem>
                  <SelectItem value="manual">Manual Selection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {config.method === 'harmony' && (
              <>
                <div>
                  <Label htmlFor="harmony-type">Harmony Type</Label>
                  <Select 
                    value={config.harmonyType} 
                    onValueChange={(value: any) => setConfig(prev => ({ ...prev, harmonyType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="complementary">Complementary</SelectItem>
                      <SelectItem value="triadic">Triadic</SelectItem>
                      <SelectItem value="tetradic">Tetradic</SelectItem>
                      <SelectItem value="analogous">Analogous</SelectItem>
                      <SelectItem value="monochromatic">Monochromatic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="base-color">Base Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="base-color"
                      type="color"
                      value={config.baseColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, baseColor: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={config.baseColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, baseColor: e.target.value }))}
                      className="flex-1 font-mono"
                    />
                  </div>
                </div>
              </>
            )}

            {config.method === 'image' && (
              <div>
                <Label>Upload Image</Label>
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Image
                  </Button>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="color-count">Number of Colors</Label>
              <Input
                id="color-count"
                type="number"
                min="2"
                max="10"
                value={config.colorCount}
                onChange={(e) => setConfig(prev => ({ ...prev, colorCount: parseInt(e.target.value) || 5 }))}
              />
            </div>

            <div>
              <Label htmlFor="palette-name">Palette Name</Label>
              <Input
                id="palette-name"
                value={paletteName}
                onChange={(e) => setPaletteName(e.target.value)}
                placeholder="My Color Palette"
              />
            </div>

            {config.method !== 'manual' && (
              <Button onClick={generatePalette} className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Palette
              </Button>
            )}

            {config.method === 'manual' && (
              <div>
                <Label>Add Color</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="color"
                    onChange={(e) => addManualColor(e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    placeholder="#000000"
                    onChange={(e) => {
                      if (e.target.value.match(/^#[0-9A-Fa-f]{6}$/)) {
                        addManualColor(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="flex-1 font-mono"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Generated Palette
            </CardTitle>
            <CardDescription>
              {palette.length > 0 && `${palette.length} colors generated`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {palette.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {palette.map((color, index) => (
                    <div key={index} className="space-y-2">
                      <div
                        className="w-full h-20 rounded-lg border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:scale-105 transition-transform"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => copyColor(color)}
                      />
                      <div className="text-center">
                        <div className="font-mono text-sm font-medium">{color.hex}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                        </div>
                        {color.name && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            {color.name}
                          </Badge>
                        )}
                        {config.method === 'manual' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeColor(index)}
                            className="mt-1 h-6 w-6 p-0"
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyPalette}>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy All
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadPalette}>
                    <Download className="h-3 w-3 mr-1" />
                    Download JSON
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportAsCss}>
                    <Download className="h-3 w-3 mr-1" />
                    Export CSS
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No colors generated yet</p>
                  <p className="text-sm">Configure and generate your palette</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Color Harmony Guide</CardTitle>
          <CardDescription>
            Understanding different color harmony types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Complementary</h4>
              <p className="text-sm text-muted-foreground">
                Colors opposite on the color wheel. Creates high contrast and vibrant combinations.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Triadic</h4>
              <p className="text-sm text-muted-foreground">
                Three colors evenly spaced around the color wheel. Balanced and harmonious.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Analogous</h4>
              <p className="text-sm text-muted-foreground">
                Colors next to each other on the color wheel. Creates serene and comfortable designs.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Monochromatic</h4>
              <p className="text-sm text-muted-foreground">
                Variations in lightness and saturation of a single hue. Elegant and cohesive.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Tetradic</h4>
              <p className="text-sm text-muted-foreground">
                Four colors forming a rectangle on the color wheel. Rich and varied palette.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorPaletteGenerator;
