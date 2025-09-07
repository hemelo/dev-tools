import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Download, 
  Copy, 
  Check, 
  RotateCcw, 
  Settings, 
  Palette, 
  Eye, 
  Zap, 
  BarChart3,
  Type,
  Image as ImageIcon,
  FileText,
  AlertCircle,
  CheckCircle,
  Info,
  Trash2,
  RefreshCw,
  Maximize2,
  Minimize2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import JsBarcode from 'jsbarcode';

interface BarcodeConfig {
  format: string;
  width: number;
  height: number;
  displayValue: boolean;
  fontSize: number;
  textAlign: string;
  textPosition: string;
  textMargin: number;
  background: string;
  lineColor: string;
  margin: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  valid: boolean;
}

interface BarcodeTemplate {
  name: string;
  description: string;
  data: string;
  format: string;
  config: Partial<BarcodeConfig>;
}

export const BarcodeGenerator = () => {
  const [input, setInput] = useState("");
  const [config, setConfig] = useState<BarcodeConfig>({
    format: "CODE128",
    width: 2,
    height: 100,
    displayValue: true,
    fontSize: 20,
    textAlign: "center",
    textPosition: "bottom",
    textMargin: 2,
    background: "#ffffff",
    lineColor: "#000000",
    margin: 10,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    valid: true
  });
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const barcodeRef = useRef<SVGSVGElement>(null);
  const { toast } = useToast();

  const barcodeFormats = [
    { value: "CODE128", label: "Code 128", description: "Alphanumeric, high density" },
    { value: "CODE39", label: "Code 39", description: "Alphanumeric, self-checking" },
    { value: "EAN13", label: "EAN-13", description: "13-digit product codes" },
    { value: "EAN8", label: "EAN-8", description: "8-digit product codes" },
    { value: "UPC", label: "UPC-A", description: "12-digit product codes" },
    { value: "UPCE", label: "UPC-E", description: "6-digit product codes" },
    { value: "CODE93", label: "Code 93", description: "Alphanumeric, compact" },
    { value: "CODABAR", label: "Codabar", description: "Numeric, variable length" },
    { value: "MSI", label: "MSI", description: "Numeric, retail inventory" },
    { value: "pharmacode", label: "Pharmacode", description: "Binary, pharmaceutical" },
    { value: "ITF14", label: "ITF-14", description: "14-digit shipping codes" },
    { value: "ITF", label: "ITF", description: "Interleaved 2 of 5" }
  ];

  const templates: BarcodeTemplate[] = [
    {
      name: "Product Code",
      description: "EAN-13 product barcode",
      data: "1234567890123",
      format: "EAN13",
      config: { width: 2, height: 100, displayValue: true }
    },
    {
      name: "ISBN Book",
      description: "ISBN book identifier",
      data: "9781234567897",
      format: "EAN13",
      config: { width: 2, height: 100, displayValue: true }
    },
    {
      name: "Inventory Code",
      description: "Code 128 inventory tracking",
      data: "INV-2024-001",
      format: "CODE128",
      config: { width: 2, height: 100, displayValue: true }
    },
    {
      name: "Serial Number",
      description: "Code 39 serial number",
      data: "SN123456789",
      format: "CODE39",
      config: { width: 2, height: 100, displayValue: true }
    },
    {
      name: "UPC Product",
      description: "UPC-A product code",
      data: "123456789012",
      format: "UPC",
      config: { width: 2, height: 100, displayValue: true }
    },
    {
      name: "Shipping Label",
      description: "ITF-14 shipping code",
      data: "12345678901234",
      format: "ITF14",
      config: { width: 2, height: 100, displayValue: true }
    }
  ];

  const colorPresets = [
    { name: "Black on White", background: "#ffffff", lineColor: "#000000" },
    { name: "White on Black", background: "#000000", lineColor: "#ffffff" },
    { name: "Blue on White", background: "#ffffff", lineColor: "#0066cc" },
    { name: "Red on White", background: "#ffffff", lineColor: "#cc0000" },
    { name: "Green on White", background: "#ffffff", lineColor: "#00cc00" },
    { name: "Dark Theme", background: "#1a1a1a", lineColor: "#ffffff" }
  ];

  const generateBarcode = () => {
    if (!input.trim()) {
      setError("Please enter data to generate barcode");
      return;
    }

    try {
      if (barcodeRef.current) {
        // Clear previous barcode
        barcodeRef.current.innerHTML = "";
        
        // Generate new barcode
        JsBarcode(barcodeRef.current, input, {
          format: config.format,
          width: config.width,
          height: config.height,
          displayValue: config.displayValue,
          fontSize: config.fontSize,
          textAlign: config.textAlign,
          textPosition: config.textPosition,
          textMargin: config.textMargin,
          background: config.background,
          lineColor: config.lineColor,
          margin: config.margin,
          marginTop: config.marginTop,
          marginBottom: config.marginBottom,
          marginLeft: config.marginLeft,
          marginRight: config.marginRight,
          valid: (valid) => {
            setConfig(prev => ({ ...prev, valid }));
            if (!valid) {
              setError("Invalid data for selected barcode format");
            } else {
              setError("");
            }
          }
        });
      }
    } catch (err) {
      setError((err as Error).message);
      toast({
        title: "Generation Failed",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  const loadTemplate = (template: BarcodeTemplate) => {
    setInput(template.data);
    setConfig(prev => ({
      ...prev,
      format: template.format,
      ...template.config
    }));
    setError("");
  };

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    setConfig(prev => ({
      ...prev,
      background: preset.background,
      lineColor: preset.lineColor
    }));
  };

  const copyToClipboard = async () => {
    if (!barcodeRef.current) return;
    
    try {
      const svgData = new XMLSerializer().serializeToString(barcodeRef.current);
      await navigator.clipboard.writeText(svgData);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Barcode SVG copied to clipboard",
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
    if (!barcodeRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(barcodeRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `barcode-${config.format.toLowerCase()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "SVG barcode has been downloaded",
    });
  };

  const downloadPNG = async () => {
    if (!barcodeRef.current) return;
    
    try {
      const svgElement = barcodeRef.current;
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
        ctx.fillStyle = config.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `barcode-${config.format.toLowerCase()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            toast({
              title: "Downloaded!",
              description: "PNG barcode has been downloaded",
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
    setError("");
    if (barcodeRef.current) {
      barcodeRef.current.innerHTML = "";
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Auto-generate barcode when input or config changes
  useEffect(() => {
    if (input.trim()) {
      generateBarcode();
    }
  }, [input, config]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Barcode Generator</h2>
        <p className="text-muted-foreground">
          Generate professional barcodes in multiple formats with customizable options
        </p>
      </div>

      <div className={`grid gap-6 ${isFullscreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
        {/* Input and Configuration */}
        <div className="space-y-6">
          {/* Data Input */}
          <Card>
            <CardHeader>
              <CardTitle>Barcode Data</CardTitle>
              <CardDescription>Enter the data you want to encode in the barcode</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="barcode-input">Data to Encode</Label>
                <Input
                  id="barcode-input"
                  placeholder="Enter text, numbers, or codes..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="format-select">Barcode Format</Label>
                <Select value={config.format} onValueChange={(value) => setConfig(prev => ({ ...prev, format: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {barcodeFormats.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{format.label}</span>
                          <span className="text-xs text-muted-foreground">{format.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={generateBarcode} disabled={!input.trim()} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Generate
                </Button>
                <Button variant="outline" onClick={clearAll} className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Clear
                </Button>
                <Button variant="outline" onClick={toggleFullscreen} className="gap-2">
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
                  <div className="flex items-center gap-2 text-destructive mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Generation Error</span>
                  </div>
                  <p className="text-sm text-destructive/80">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Barcode Settings</CardTitle>
              <CardDescription>Customize the appearance and behavior of your barcode</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Size Settings */}
              <div className="space-y-4">
                <h4 className="font-medium">Size & Spacing</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Line Width: {config.width}</Label>
                    <Slider
                      value={[config.width]}
                      onValueChange={([value]) => setConfig(prev => ({ ...prev, width: value }))}
                      min={1}
                      max={5}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Height: {config.height}px</Label>
                    <Slider
                      value={[config.height]}
                      onValueChange={([value]) => setConfig(prev => ({ ...prev, height: value }))}
                      min={50}
                      max={300}
                      step={10}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Margin: {config.margin}px</Label>
                    <Slider
                      value={[config.margin]}
                      onValueChange={([value]) => setConfig(prev => ({ ...prev, margin: value }))}
                      min={0}
                      max={50}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Text Settings */}
              <div className="space-y-4">
                <h4 className="font-medium">Text Display</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Show Text</Label>
                    <Switch
                      checked={config.displayValue}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, displayValue: checked }))}
                    />
                  </div>
                  {config.displayValue && (
                    <>
                      <div className="space-y-2">
                        <Label>Font Size: {config.fontSize}px</Label>
                        <Slider
                          value={[config.fontSize]}
                          onValueChange={([value]) => setConfig(prev => ({ ...prev, fontSize: value }))}
                          min={10}
                          max={40}
                          step={2}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Text Position</Label>
                        <Select value={config.textPosition} onValueChange={(value) => setConfig(prev => ({ ...prev, textPosition: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bottom">Bottom</SelectItem>
                            <SelectItem value="top">Top</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Color Settings */}
              <div className="space-y-4">
                <h4 className="font-medium">Colors</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Background</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.background}
                        onChange={(e) => setConfig(prev => ({ ...prev, background: e.target.value }))}
                        className="w-8 h-8 rounded border"
                      />
                      <Input
                        value={config.background}
                        onChange={(e) => setConfig(prev => ({ ...prev, background: e.target.value }))}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Line Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.lineColor}
                        onChange={(e) => setConfig(prev => ({ ...prev, lineColor: e.target.value }))}
                        className="w-8 h-8 rounded border"
                      />
                      <Input
                        value={config.lineColor}
                        onChange={(e) => setConfig(prev => ({ ...prev, lineColor: e.target.value }))}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Color Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {colorPresets.map((preset, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => applyColorPreset(preset)}
                        className="justify-start gap-2"
                      >
                        <div 
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: preset.lineColor }}
                        />
                        <span className="text-xs">{preset.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barcode Preview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Barcode Preview</CardTitle>
              {input && (
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="gap-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              )}
            </div>
            <CardDescription>Real-time barcode preview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="min-h-[200px] bg-white dark:bg-gray-900 rounded-md border flex items-center justify-center p-8">
              {input ? (
                <div className="flex flex-col items-center space-y-4">
                  <svg
                    ref={barcodeRef}
                    className="max-w-full h-auto"
                    style={{ backgroundColor: config.background }}
                  />
                  {!config.valid && (
                    <div className="text-center text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4 mx-auto mb-1" />
                      Invalid data for {config.format} format
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter data to generate barcode</p>
                  <p className="text-sm">Choose a format and customize the appearance</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Barcode Templates</CardTitle>
          <CardDescription>Click on any template to load it into the generator</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template, index) => (
              <div key={index} className="space-y-2">
                <Label className="text-sm font-medium">{template.name}</Label>
                <div className="space-y-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadTemplate(template)}
                    className="w-full justify-start text-xs"
                  >
                    <Type className="h-3 w-3 mr-2" />
                    {template.description}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Barcode Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Barcode Tips & Formats</CardTitle>
          <CardDescription>Understanding different barcode formats and best practices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Format Guidelines</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Code 128:</strong> Alphanumeric, high density, most versatile</li>
                <li>• <strong>Code 39:</strong> Alphanumeric, self-checking, widely supported</li>
                <li>• <strong>EAN-13:</strong> 13 digits, product codes, retail standard</li>
                <li>• <strong>UPC-A:</strong> 12 digits, North American product codes</li>
                <li>• <strong>EAN-8:</strong> 8 digits, compact product codes</li>
                <li>• <strong>ITF-14:</strong> 14 digits, shipping and logistics</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Best Practices</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use appropriate format for your data type</li>
                <li>• Ensure sufficient contrast for scanning</li>
                <li>• Test barcodes with actual scanners</li>
                <li>• Consider size requirements for your use case</li>
                <li>• Use high resolution for printing</li>
                <li>• Validate data before generating</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Pro Tip</p>
                <p className="text-blue-700 dark:text-blue-300">
                  Different barcode formats have specific data requirements. Code 128 supports alphanumeric characters, 
                  while EAN-13 requires exactly 13 digits. The generator will validate your data and show errors 
                  if the format doesn't match the requirements.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

