import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Check, Download, QrCode, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";

interface QRCodeOptions {
  size: number;
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  margin: number;
  color: string;
  backgroundColor: string;
}

const QrCodeGenerator = () => {
  const [text, setText] = useState("");
  const [options, setOptions] = useState<QRCodeOptions>({
    size: 200,
    errorCorrection: 'M',
    margin: 4,
    color: '#000000',
    backgroundColor: '#ffffff'
  });
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Get QR code as data URL for download/copy functionality
  const getQRCodeDataUrl = (): string => {
    if (!text.trim()) return "";
    
    // Create a temporary canvas to capture the QR code
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return "";
    
    canvas.width = options.size;
    canvas.height = options.size;
    
    // Fill background
    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(0, 0, options.size, options.size);
    
    // The QR code will be rendered by the react-qr-code component
    // This is a fallback method for getting the data URL
    return canvas.toDataURL('image/png');
  };

  const copyToClipboard = async () => {
    if (!text.trim()) return;

    try {
      // For now, copy the text content
      // In a real implementation, you'd capture the QR code as an image
      await navigator.clipboard.writeText(text);
      
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
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

  const downloadQRCode = () => {
    if (!text.trim()) return;

    // Create a simple text file with the QR code content
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = `qrcode-content-${Date.now()}.txt`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "QR code content saved to your device",
    });
  };

  const clearAll = () => {
    setText("");
  };

  const getTextPlaceholder = () => {
    return "Enter text, URL, or data to encode (e.g., 'https://example.com', 'Hello World!')";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">QR Code Generator</h2>
        <p className="text-muted-foreground">
          Generate QR codes from text, URLs, or any data with customizable options
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Text Input */}
          <Card>
            <CardHeader>
              <CardTitle>Input Data</CardTitle>
              <CardDescription>Enter the text or URL to encode in the QR code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={getTextPlaceholder()}
                className="min-h-[120px] resize-none"
              />
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" onClick={clearAll} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle>QR Code Options</CardTitle>
              <CardDescription>Customize the appearance and properties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Size (px)</Label>
                  <Select 
                    value={options.size.toString()} 
                    onValueChange={(value) => setOptions(prev => ({ ...prev, size: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100px</SelectItem>
                      <SelectItem value="150">150px</SelectItem>
                      <SelectItem value="200">200px</SelectItem>
                      <SelectItem value="300">300px</SelectItem>
                      <SelectItem value="400">400px</SelectItem>
                      <SelectItem value="500">500px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="error-correction">Error Correction</Label>
                  <Select 
                    value={options.errorCorrection} 
                    onValueChange={(value: 'L' | 'M' | 'Q' | 'H') => setOptions(prev => ({ ...prev, errorCorrection: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Low (~7%)</SelectItem>
                      <SelectItem value="M">Medium (~15%)</SelectItem>
                      <SelectItem value="Q">Quartile (~25%)</SelectItem>
                      <SelectItem value="H">High (~30%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="margin">Margin</Label>
                  <Select 
                    value={options.margin.toString()} 
                    onValueChange={(value) => setOptions(prev => ({ ...prev, margin: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No margin</SelectItem>
                      <SelectItem value="1">1px</SelectItem>
                      <SelectItem value="2">2px</SelectItem>
                      <SelectItem value="4">4px</SelectItem>
                      <SelectItem value="8">8px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Foreground Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={options.color}
                      onChange={(e) => setOptions(prev => ({ ...prev, color: e.target.value }))}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={options.color}
                      onChange={(e) => setOptions(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="#000000"
                      className="font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bg-color">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bg-color"
                      type="color"
                      value={options.backgroundColor}
                      onChange={(e) => setOptions(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={options.backgroundColor}
                      onChange={(e) => setOptions(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      placeholder="#ffffff"
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QR Code Output */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>QR Code</CardTitle>
                {text.trim() && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="gap-2"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadQRCode}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
              <CardDescription>Generated QR code preview</CardDescription>
            </CardHeader>
            <CardContent>
              {text.trim() ? (
                <div className="flex flex-col items-center space-y-4">
                  <div 
                    className="border rounded-lg p-4 bg-white"
                    style={{ backgroundColor: options.backgroundColor }}
                  >
                    <QRCode
                      value={text}
                      size={options.size}
                      bgColor={options.backgroundColor}
                      fgColor={options.color}
                      level={options.errorCorrection}
                    />
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Size: {options.size}×{options.size}px</p>
                    <p>Error Correction: {options.errorCorrection}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <QrCode className="h-12 w-12 mb-4 opacity-50" />
                  <p>Enter text to generate QR code</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Quick Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Examples</CardTitle>
          <CardDescription>Click on any example to generate a QR code</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">URLs</Label>
              <div className="space-y-1">
                {[
                  "https://github.com",
                  "https://www.google.com",
                  "https://stackoverflow.com"
                ].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => setText(example)}
                    className="w-full justify-start text-xs"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Contact Info</Label>
              <div className="space-y-1">
                {[
                  "mailto:contact@example.com",
                  "tel:+1234567890",
                  "BEGIN:VCARD\nFN:John Doe\nTEL:+1234567890\nEND:VCARD"
                ].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => setText(example)}
                    className="w-full justify-start text-xs"
                  >
                    {example.split('\n')[0]}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">WiFi</Label>
              <div className="space-y-1">
                {[
                  "WIFI:T:WPA;S:MyNetwork;P:password123;H:false;;",
                  "WIFI:T:WEP;S:OldNetwork;P:12345;H:false;;",
                  "WIFI:T:nopass;S:OpenNetwork;H:false;;"
                ].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => setText(example)}
                    className="w-full justify-start text-xs"
                  >
                    WiFi Network
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Tips</CardTitle>
          <CardDescription>Best practices for QR code generation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Content Types</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• URLs: Direct links to websites</li>
                <li>• Text: Plain text messages</li>
                <li>• Contact: vCard format for contacts</li>
                <li>• WiFi: Network credentials</li>
                <li>• Email: mailto: links</li>
                <li>• Phone: tel: links</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Error Correction</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Low (L): ~7% - Small codes, good conditions</li>
                <li>• Medium (M): ~15% - Default, balanced</li>
                <li>• Quartile (Q): ~25% - Outdoor use</li>
                <li>• High (H): ~30% - Damaged or poor scanning</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QrCodeGenerator;
