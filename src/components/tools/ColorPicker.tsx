import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Palette, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ColorValues {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  cmyk: { c: number; m: number; y: number; k: number };
}

const ColorPicker = () => {
  const [color, setColor] = useState("#3b82f6");
  const [colorValues, setColorValues] = useState<ColorValues>({
    hex: "#3b82f6",
    rgb: { r: 59, g: 130, b: 246 },
    hsl: { h: 217, s: 91, l: 60 },
    cmyk: { c: 76, m: 47, y: 0, k: 4 }
  });
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  // Convert hex to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // Convert RGB to CMYK
  const rgbToCmyk = (r: number, g: number, b: number): { c: number; m: number; y: number; k: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const k = 1 - Math.max(r, g, b);
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  };

  // Convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  // Convert HSL to RGB
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

  // Update color values when color changes
  useEffect(() => {
    const rgb = hexToRgb(color);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    setColorValues({
      hex: color,
      rgb,
      hsl,
      cmyk
    });
  }, [color]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const generateRandomColor = () => {
    const randomHex = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setColor(randomHex);
  };

  const handleHexChange = (value: string) => {
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      setColor(value);
    }
  };

  const handleRgbChange = (component: 'r' | 'g' | 'b', value: string) => {
    const num = parseInt(value) || 0;
    if (num >= 0 && num <= 255) {
      const newRgb = { ...colorValues.rgb, [component]: num };
      const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
      setColor(hex);
    }
  };

  const handleHslChange = (component: 'h' | 's' | 'l', value: string) => {
    const num = parseInt(value) || 0;
    if (component === 'h' && num >= 0 && num <= 360) {
      const newHsl = { ...colorValues.hsl, [component]: num };
      const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      setColor(hex);
    } else if ((component === 's' || component === 'l') && num >= 0 && num <= 100) {
      const newHsl = { ...colorValues.hsl, [component]: num };
      const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      setColor(hex);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Color Picker & Converter</h2>
        <p className="text-muted-foreground">
          Pick colors and convert between different color formats (HEX, RGB, HSL, CMYK)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color Picker */}
        <Card>
          <CardHeader>
            <CardTitle>Color Picker</CardTitle>
            <CardDescription>Select a color using the color picker or input values</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Visual Color Display */}
            <div className="flex items-center gap-4">
              <div 
                className="w-24 h-24 rounded-lg border-2 border-border shadow-lg"
                style={{ backgroundColor: color }}
              />
              <div className="flex-1">
                <div className="text-2xl font-bold mb-2">{color}</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateRandomColor}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Random Color
                </Button>
              </div>
            </div>

            {/* HTML Color Input */}
            <div className="space-y-2">
              <Label htmlFor="color-picker">Color Picker</Label>
              <div className="flex gap-2">
                <Input
                  id="color-picker"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-20 h-10 p-1 border rounded"
                />
                <Input
                  value={color}
                  onChange={(e) => handleHexChange(e.target.value)}
                  placeholder="#000000"
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(color, "HEX")}
                  className="gap-2"
                >
                  {copied === "HEX" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Values */}
        <Card>
          <CardHeader>
            <CardTitle>Color Values</CardTitle>
            <CardDescription>View and edit color values in different formats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* RGB */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>RGB</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(`rgb(${colorValues.rgb.r}, ${colorValues.rgb.g}, ${colorValues.rgb.b})`, "RGB")}
                  className="gap-2"
                >
                  {copied === "RGB" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="rgb-r" className="text-xs">R</Label>
                  <Input
                    id="rgb-r"
                    type="number"
                    min="0"
                    max="255"
                    value={colorValues.rgb.r}
                    onChange={(e) => handleRgbChange('r', e.target.value)}
                    className="text-center"
                  />
                </div>
                <div>
                  <Label htmlFor="rgb-g" className="text-xs">G</Label>
                  <Input
                    id="rgb-g"
                    type="number"
                    min="0"
                    max="255"
                    value={colorValues.rgb.g}
                    onChange={(e) => handleRgbChange('g', e.target.value)}
                    className="text-center"
                  />
                </div>
                <div>
                  <Label htmlFor="rgb-b" className="text-xs">B</Label>
                  <Input
                    id="rgb-b"
                    type="number"
                    min="0"
                    max="255"
                    value={colorValues.rgb.b}
                    onChange={(e) => handleRgbChange('b', e.target.value)}
                    className="text-center"
                  />
                </div>
              </div>
            </div>

            {/* HSL */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>HSL</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(`hsl(${colorValues.hsl.h}, ${colorValues.hsl.s}%, ${colorValues.hsl.l}%)`, "HSL")}
                  className="gap-2"
                >
                  {copied === "HSL" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="hsl-h" className="text-xs">H</Label>
                  <Input
                    id="hsl-h"
                    type="number"
                    min="0"
                    max="360"
                    value={colorValues.hsl.h}
                    onChange={(e) => handleHslChange('h', e.target.value)}
                    className="text-center"
                  />
                </div>
                <div>
                  <Label htmlFor="hsl-s" className="text-xs">S</Label>
                  <Input
                    id="hsl-s"
                    type="number"
                    min="0"
                    max="100"
                    value={colorValues.hsl.s}
                    onChange={(e) => handleHslChange('s', e.target.value)}
                    className="text-center"
                  />
                </div>
                <div>
                  <Label htmlFor="hsl-l" className="text-xs">L</Label>
                  <Input
                    id="hsl-l"
                    type="number"
                    min="0"
                    max="100"
                    value={colorValues.hsl.l}
                    onChange={(e) => handleHslChange('l', e.target.value)}
                    className="text-center"
                  />
                </div>
              </div>
            </div>

            {/* CMYK */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>CMYK</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(`cmyk(${colorValues.cmyk.c}%, ${colorValues.cmyk.m}%, ${colorValues.cmyk.y}%, ${colorValues.cmyk.k}%)`, "CMYK")}
                  className="gap-2"
                >
                  {copied === "CMYK" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <Label htmlFor="cmyk-c" className="text-xs">C</Label>
                  <Input
                    id="cmyk-c"
                    type="number"
                    min="0"
                    max="100"
                    value={colorValues.cmyk.c}
                    readOnly
                    className="text-center bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="cmyk-m" className="text-xs">M</Label>
                  <Input
                    id="cmyk-m"
                    type="number"
                    min="0"
                    max="100"
                    value={colorValues.cmyk.m}
                    readOnly
                    className="text-center bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="cmyk-y" className="text-xs">Y</Label>
                  <Input
                    id="cmyk-y"
                    type="number"
                    min="0"
                    max="100"
                    value={colorValues.cmyk.y}
                    readOnly
                    className="text-center bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="cmyk-k" className="text-xs">K</Label>
                  <Input
                    id="cmyk-k"
                    type="number"
                    min="0"
                    max="100"
                    value={colorValues.cmyk.k}
                    readOnly
                    className="text-center bg-muted"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Color Palette Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Color Variations</CardTitle>
          <CardDescription>Different shades and tints of the selected color</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {[20, 40, 60, 80, 100].map((lightness) => {
              const hsl = { ...colorValues.hsl, l: lightness };
              const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
              const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
              
              return (
                <div key={lightness} className="text-center">
                  <div 
                    className="w-full h-16 rounded border cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: hex }}
                    onClick={() => setColor(hex)}
                  />
                  <div className="text-xs mt-1 font-mono">{hex}</div>
                  <div className="text-xs text-muted-foreground">{lightness}%</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorPicker;
