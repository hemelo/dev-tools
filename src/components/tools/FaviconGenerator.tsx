import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Download, Image, Type, Smile, RotateCcw, Eye, FileImage } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FaviconOptions {
  size: number;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  borderRadius: number;
  padding: number;
}

interface FaviconFormat {
  name: string;
  size: number;
  format: string;
  description: string;
}

const FAVICON_FORMATS: FaviconFormat[] = [
  { name: "favicon.ico", size: 32, format: "ico", description: "Classic favicon (16x16, 32x32)" },
  { name: "favicon-16x16.png", size: 16, format: "png", description: "16x16 PNG" },
  { name: "favicon-32x32.png", size: 32, format: "png", description: "32x32 PNG" },
  { name: "apple-touch-icon.png", size: 180, format: "png", description: "Apple Touch Icon" },
  { name: "android-chrome-192x192.png", size: 192, format: "png", description: "Android Chrome 192x192" },
  { name: "android-chrome-512x512.png", size: 512, format: "png", description: "Android Chrome 512x512" },
  { name: "favicon.svg", size: 512, format: "svg", description: "Scalable Vector Graphics" }
];

const FONT_FAMILIES = [
  { name: "System Default", value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Helvetica", value: "Helvetica, sans-serif" },
  { name: "Times New Roman", value: "Times New Roman, serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Verdana", value: "Verdana, sans-serif" },
  { name: "Courier New", value: "Courier New, monospace" },
  { name: "Impact", value: "Impact, sans-serif" },
  { name: "Comic Sans MS", value: "Comic Sans MS, cursive" },
  { name: "Trebuchet MS", value: "Trebuchet MS, sans-serif" }
];

const FONT_WEIGHTS = [
  { name: "Light", value: "300" },
  { name: "Normal", value: "400" },
  { name: "Medium", value: "500" },
  { name: "Semi Bold", value: "600" },
  { name: "Bold", value: "700" },
  { name: "Extra Bold", value: "800" },
  { name: "Black", value: "900" }
];

const POPULAR_EMOJIS = [
  "🚀", "💻", "⚡", "🔥", "⭐", "❤️", "🎯", "🎨", "🔧", "📱",
  "🌐", "💡", "🎉", "🚀", "⚙️", "🔒", "📊", "🎪", "🌟", "💎",
  "🏆", "🎭", "🎵", "🎮", "📚", "🔍", "📝", "💼", "🏠", "🌍"
];

export const FaviconGenerator = () => {
  const [inputType, setInputType] = useState<"emoji" | "text" | "image">("emoji");
  const [emoji, setEmoji] = useState("🚀");
  const [text, setText] = useState("A");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [options, setOptions] = useState<FaviconOptions>({
    size: 32,
    backgroundColor: "#3b82f6",
    textColor: "#ffffff",
    fontFamily: FONT_FAMILIES[0].value,
    fontSize: 20,
    fontWeight: "700",
    borderRadius: 8,
    padding: 4
  });
  const [generatedFavicons, setGeneratedFavicons] = useState<{ [key: string]: string }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image file upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, GIF, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      toast({
        title: "Image loaded",
        description: "Image uploaded successfully. You can now generate favicons.",
      });
    };
    
    reader.onerror = () => {
      toast({
        title: "Upload failed",
        description: "Failed to read the image file. Please try again.",
        variant: "destructive",
      });
    };
    
    reader.readAsDataURL(file);
  };

  // Helper function to draw rounded rectangle
  const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  // Generate favicon for a specific size and format
  const generateFavicon = async (size: number, format: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = size;
      canvas.height = size;

      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Set background
      ctx.fillStyle = options.backgroundColor;
      if (options.borderRadius > 0) {
        drawRoundedRect(ctx, 0, 0, size, size, options.borderRadius * (size / 32));
        ctx.fill();
      } else {
        ctx.fillRect(0, 0, size, size);
      }

      // Draw content based on input type
      if (inputType === "emoji") {
        ctx.font = `${size * 0.7}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, size / 2, size / 2);
        resolve(canvas.toDataURL(`image/${format === 'ico' ? 'png' : format}`));
      } else if (inputType === "text") {
        ctx.font = `${options.fontWeight} ${options.fontSize * (size / 32)}px ${options.fontFamily}`;
        ctx.fillStyle = options.textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, size / 2, size / 2);
        resolve(canvas.toDataURL(`image/${format === 'ico' ? 'png' : format}`));
      } else if (inputType === "image" && imagePreview) {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Handle CORS if needed
        
        // Set a timeout for image loading
        const timeout = setTimeout(() => {
          reject(new Error('Image loading timeout. Please try with a smaller image.'));
        }, 10000); // 10 second timeout
        
        img.onload = () => {
          clearTimeout(timeout);
          try {
            // Validate image dimensions
            if (img.width === 0 || img.height === 0) {
              reject(new Error('Invalid image dimensions'));
              return;
            }

            // Calculate dimensions to fit within padding
            const padding = options.padding * (size / 32);
            const maxWidth = size - (padding * 2);
            const maxHeight = size - (padding * 2);
            
            let drawWidth = img.width;
            let drawHeight = img.height;
            
            // Scale to fit
            if (drawWidth > maxWidth || drawHeight > maxHeight) {
              const scale = Math.min(maxWidth / drawWidth, maxHeight / drawHeight);
              drawWidth *= scale;
              drawHeight *= scale;
            }
            
            const x = (size - drawWidth) / 2;
            const y = (size - drawHeight) / 2;
            
            // Apply border radius if needed
            if (options.borderRadius > 0) {
              ctx.save();
              drawRoundedRect(ctx, 0, 0, size, size, options.borderRadius * (size / 32));
              ctx.clip();
            }
            
            // Draw the image
            ctx.drawImage(img, x, y, drawWidth, drawHeight);
            
            if (options.borderRadius > 0) {
              ctx.restore();
            }
            
            // Generate data URL with error handling
            let dataUrl: string;
            try {
              dataUrl = canvas.toDataURL(`image/${format === 'ico' ? 'png' : format}`);
              if (!dataUrl || dataUrl === 'data:,') {
                throw new Error('Failed to generate data URL');
              }
            } catch (dataError) {
              reject(new Error(`Failed to generate data URL: ${dataError}`));
              return;
            }
            
            resolve(dataUrl);
          } catch (error) {
            console.error('Image drawing error:', error);
            reject(new Error(`Failed to draw image: ${error}`));
          }
        };
        
        img.onerror = (error) => {
          clearTimeout(timeout);
          console.error('Image load error:', error);
          reject(new Error('Failed to load image. Please check if the image file is valid.'));
        };
        
        img.src = imagePreview;
      } else {
        resolve(canvas.toDataURL(`image/${format === 'ico' ? 'png' : format}`));
      }
    });
  };

  // Generate all favicon formats
  const generateAllFavicons = async () => {
    if (!emoji && !text && !imageFile) {
      toast({
        title: "No input provided",
        description: "Please provide an emoji, text, or image to generate favicons",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    const favicons: { [key: string]: string } = {};

    try {
      for (const format of FAVICON_FORMATS) {
        try {
          const dataUrl = await generateFavicon(format.size, format.format);
          favicons[format.name] = dataUrl;
        } catch (error) {
          console.error(`Failed to generate ${format.name}:`, error);
          toast({
            title: "Generation failed",
            description: `Failed to generate ${format.name}. Please check your input and try again.`,
            variant: "destructive",
          });
          setIsGenerating(false);
          return;
        }
      }
      setGeneratedFavicons(favicons);
      
      toast({
        title: "Favicons generated!",
        description: "All favicon formats have been generated successfully",
      });
    } catch (error) {
      console.error("Favicon generation error:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate favicons. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Download individual favicon
  const downloadFavicon = (filename: string, dataUrl: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Downloaded!",
      description: `${filename} has been downloaded`,
    });
  };

  // Download all favicons as ZIP (simplified - downloads individually)
  const downloadAllFavicons = () => {
    Object.entries(generatedFavicons).forEach(([filename, dataUrl]) => {
      setTimeout(() => downloadFavicon(filename, dataUrl), 100);
    });
  };

  // Copy favicon data URL to clipboard
  const copyFavicon = async (dataUrl: string, filename: string) => {
    try {
      await navigator.clipboard.writeText(dataUrl);
      toast({
        title: "Copied!",
        description: `${filename} data URL copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  // Clear all inputs
  const clearAll = () => {
    setEmoji("🚀");
    setText("A");
    setImageFile(null);
    setImagePreview("");
    setGeneratedFavicons({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Favicon Generator</h2>
        <p className="text-muted-foreground">
          Create favicons from emojis, text, or images with multiple formats and sizes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Input Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Input Type</CardTitle>
              <CardDescription>Choose how you want to create your favicon</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={inputType} onValueChange={(value) => setInputType(value as "emoji" | "text" | "image")}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="emoji" className="gap-2">
                    <Smile className="h-4 w-4" />
                    Emoji
                  </TabsTrigger>
                  <TabsTrigger value="text" className="gap-2">
                    <Type className="h-4 w-4" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="image" className="gap-2">
                    <Image className="h-4 w-4" />
                    Image
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="emoji" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="emoji">Emoji</Label>
                    <Input
                      id="emoji"
                      value={emoji}
                      onChange={(e) => setEmoji(e.target.value)}
                      placeholder="🚀"
                      className="text-2xl text-center"
                      maxLength={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Popular Emojis</Label>
                    <div className="grid grid-cols-10 gap-2">
                      {POPULAR_EMOJIS.map((emojiOption) => (
                        <Button
                          key={emojiOption}
                          variant="outline"
                          size="sm"
                          onClick={() => setEmoji(emojiOption)}
                          className="text-lg p-2"
                        >
                          {emojiOption}
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="text" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="text">Text</Label>
                    <Input
                      id="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="A"
                      className="text-center font-bold"
                      maxLength={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="font-family">Font Family</Label>
                      <Select value={options.fontFamily} onValueChange={(value) => setOptions(prev => ({ ...prev, fontFamily: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FONT_FAMILIES.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="font-weight">Font Weight</Label>
                      <Select value={options.fontWeight} onValueChange={(value) => setOptions(prev => ({ ...prev, fontWeight: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FONT_WEIGHTS.map((weight) => (
                            <SelectItem key={weight.value} value={weight.value}>
                              {weight.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size</Label>
                    <Input
                      id="font-size"
                      type="number"
                      min="8"
                      max="32"
                      value={options.fontSize}
                      onChange={(e) => setOptions(prev => ({ ...prev, fontSize: parseInt(e.target.value) || 20 }))}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="image" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="image-upload">Upload Image</Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                    />
                  </div>
                  {imagePreview && (
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <div className="border rounded-lg p-4 bg-muted/20">
                        <img
                          src={imagePreview}
                          alt="Upload preview"
                          className="max-w-full max-h-32 mx-auto rounded"
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Design Options */}
          <Card>
            <CardHeader>
              <CardTitle>Design Options</CardTitle>
              <CardDescription>Customize the appearance of your favicon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                      placeholder="#3b82f6"
                      className="font-mono"
                    />
                  </div>
                </div>
                {inputType === "text" && (
                  <div className="space-y-2">
                    <Label htmlFor="text-color">Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="text-color"
                        type="color"
                        value={options.textColor}
                        onChange={(e) => setOptions(prev => ({ ...prev, textColor: e.target.value }))}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={options.textColor}
                        onChange={(e) => setOptions(prev => ({ ...prev, textColor: e.target.value }))}
                        placeholder="#ffffff"
                        className="font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="border-radius">Border Radius</Label>
                  <Input
                    id="border-radius"
                    type="number"
                    min="0"
                    max="16"
                    value={options.borderRadius}
                    onChange={(e) => setOptions(prev => ({ ...prev, borderRadius: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="padding">Padding</Label>
                  <Input
                    id="padding"
                    type="number"
                    min="0"
                    max="8"
                    value={options.padding}
                    onChange={(e) => setOptions(prev => ({ ...prev, padding: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={generateAllFavicons}
                  disabled={isGenerating || (!emoji && !text && !imageFile)}
                  className="gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      Generate Favicons
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={clearAll} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview and Download Section */}
        <div className="space-y-6">
          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Preview your favicon at different sizes</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedFavicons['favicon-32x32.png'] ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {[16, 32, 64, 128].map((size) => (
                      <div key={size} className="text-center">
                        <div 
                          className="border rounded bg-white p-2"
                          style={{ width: size, height: size }}
                        >
                          <img
                            src={generatedFavicons['favicon-32x32.png']}
                            alt="Favicon preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{size}×{size}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <FileImage className="h-12 w-12 mb-4 opacity-50" />
                  <p>Generate favicons to see preview</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Download Section */}
          {Object.keys(generatedFavicons).length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Download Favicons</CardTitle>
                  <Button onClick={downloadAllFavicons} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download All
                  </Button>
                </div>
                <CardDescription>Download individual favicon formats or all at once</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {FAVICON_FORMATS.map((format) => (
                    <div key={format.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{format.name}</div>
                        <div className="text-sm text-muted-foreground">{format.description}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyFavicon(generatedFavicons[format.name], format.name)}
                          className="gap-2"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadFavicon(format.name, generatedFavicons[format.name])}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Tips</CardTitle>
          <CardDescription>Best practices for favicon generation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Design Guidelines</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Keep designs simple and recognizable at small sizes</li>
                <li>• Use high contrast colors for better visibility</li>
                <li>• Avoid fine details that may be lost at 16x16 pixels</li>
                <li>• Test your favicon in different browsers and contexts</li>
                <li>• Consider both light and dark backgrounds</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Implementation</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Place favicon.ico in your website root directory</li>
                <li>• Add meta tags for different formats in your HTML head</li>
                <li>• Use apple-touch-icon for iOS home screen bookmarks</li>
                <li>• Include android-chrome icons for Android devices</li>
                <li>• Consider using SVG for modern browsers</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
