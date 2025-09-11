import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Copy, 
  Check, 
  Hash, 
  FileText, 
  Link, 
  Settings, 
  Info, 
  Zap,
  Globe,
  Code,
  Type,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SlugGenerator = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [separator, setSeparator] = useState("-");
  const [lowercase, setLowercase] = useState(true);
  const [removeAccents, setRemoveAccents] = useState(true);
  const [removeSpecialChars, setRemoveSpecialChars] = useState(true);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [maxLength, setMaxLength] = useState(100);
  const [preserveCase, setPreserveCase] = useState(false);

  const { toast } = useToast();

  const generateSlug = (text: string): string => {
    let slug = text;

    // Trim whitespace
    if (trimWhitespace) {
      slug = slug.trim();
    }

    // Remove accents and diacritics
    if (removeAccents) {
      slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    // Convert to lowercase (unless preserve case is enabled)
    if (lowercase && !preserveCase) {
      slug = slug.toLowerCase();
    }

    // Remove special characters and replace with separator
    if (removeSpecialChars) {
      // Keep alphanumeric characters, spaces, and the selected separator
      const allowedChars = `a-zA-Z0-9\\s${separator === "-" ? "\\-" : separator === "_" ? "_" : separator}`;
      slug = slug.replace(new RegExp(`[^${allowedChars}]`, "g"), separator);
    }

    // Replace multiple consecutive separators with single separator
    slug = slug.replace(new RegExp(`\\${separator}+`, "g"), separator);

    // Replace spaces with separator
    slug = slug.replace(/\s+/g, separator);

    // Remove leading/trailing separators
    slug = slug.replace(new RegExp(`^\\${separator}+|\\${separator}+$`, "g"), "");

    // Limit length
    if (maxLength > 0 && slug.length > maxLength) {
      slug = slug.substring(0, maxLength);
      // Remove trailing separator if it exists after truncation
      slug = slug.replace(new RegExp(`\\${separator}+$`, "g"), "");
    }

    return slug;
  };

  const handleGenerate = () => {
    if (!input.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to generate a slug.",
        variant: "destructive",
      });
      return;
    }

    const slug = generateSlug(input);
    setOutput(slug);
    
    toast({
      title: "Slug Generated",
      description: "Your URL-friendly slug has been created successfully.",
    });
  };

  const copyToClipboard = async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Copied to Clipboard",
        description: "Slug has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy slug to clipboard.",
        variant: "destructive",
      });
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setCopied(false);
  };

  const loadExample = (example: string) => {
    setInput(example);
    setOutput("");
    setCopied(false);
  };

  const downloadSlug = () => {
    if (!output) return;

    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "slug.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Slug has been downloaded as a text file.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Hash className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Slug Generator</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Generate URL-friendly slugs from any text. Perfect for creating clean URLs, 
          file names, and identifiers for your projects.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Input Text
            </CardTitle>
            <CardDescription>
              Enter the text you want to convert into a URL-friendly slug
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input">Text to Convert</Label>
              <Textarea
                id="input"
                placeholder="Enter your text here... (e.g., 'My Awesome Blog Post!')"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button onClick={handleGenerate} disabled={!input.trim()}>
                <Hash className="h-4 w-4 mr-2" /> Generate Slug
              </Button>
              <Button variant="outline" onClick={clearAll}>
                <RefreshCw className="h-4 w-4 mr-2" /> Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Generated Slug
            </CardTitle>
            <CardDescription>
              Your URL-friendly slug will appear here
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="output">Generated Slug</Label>
              <Textarea
                id="output"
                placeholder="Generated slug will appear here..."
                value={output}
                readOnly
                className="min-h-[120px] bg-muted/50"
              />
            </div>

            {output && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={downloadSlug} className="gap-2">
                  <FileText className="h-4 w-4" /> Download
                </Button>
                <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-2">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Slug Configuration
          </CardTitle>
          <CardDescription>
            Customize how your slug is generated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Separator */}
            <div className="space-y-2">
              <Label htmlFor="separator">Separator</Label>
              <Select value={separator} onValueChange={setSeparator}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-">Hyphen (-)</SelectItem>
                  <SelectItem value="_">Underscore (_)</SelectItem>
                  <SelectItem value=".">Dot (.)</SelectItem>
                  <SelectItem value="">No Separator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Max Length */}
            <div className="space-y-2">
              <Label htmlFor="maxLength">Max Length</Label>
              <Input
                id="maxLength"
                type="number"
                min="0"
                max="500"
                value={maxLength}
                onChange={(e) => setMaxLength(parseInt(e.target.value) || 0)}
                placeholder="100"
              />
            </div>

            {/* Case Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="lowercase">Convert to Lowercase</Label>
                <Switch
                  id="lowercase"
                  checked={lowercase}
                  onCheckedChange={setLowercase}
                  disabled={preserveCase}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="preserveCase">Preserve Original Case</Label>
                <Switch
                  id="preserveCase"
                  checked={preserveCase}
                  onCheckedChange={setPreserveCase}
                />
              </div>
            </div>

            {/* Character Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="removeAccents">Remove Accents</Label>
                <Switch
                  id="removeAccents"
                  checked={removeAccents}
                  onCheckedChange={setRemoveAccents}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="removeSpecialChars">Remove Special Characters</Label>
                <Switch
                  id="removeSpecialChars"
                  checked={removeSpecialChars}
                  onCheckedChange={setRemoveSpecialChars}
                />
              </div>
            </div>

            {/* Whitespace Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="trimWhitespace">Trim Whitespace</Label>
                <Switch
                  id="trimWhitespace"
                  checked={trimWhitespace}
                  onCheckedChange={setTrimWhitespace}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Examples
          </CardTitle>
          <CardDescription>
            Try these examples to see how the slug generator works
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Blog Posts */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-primary">Blog Posts</Label>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => loadExample("My Awesome Blog Post About Web Development!")}
                >
                  <div>
                    <div className="font-medium">My Awesome Blog Post...</div>
                    <div className="text-xs text-muted-foreground">Blog title example</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => loadExample("10 Tips for Better React Performance in 2024")}
                >
                  <div>
                    <div className="font-medium">10 Tips for Better React...</div>
                    <div className="text-xs text-muted-foreground">Numbered list example</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* File Names */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-primary">File Names</Label>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => loadExample("User Profile Component.tsx")}
                >
                  <div>
                    <div className="font-medium">User Profile Component.tsx</div>
                    <div className="text-xs text-muted-foreground">React component</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => loadExample("API Documentation v2.1.pdf")}
                >
                  <div>
                    <div className="font-medium">API Documentation v2.1.pdf</div>
                    <div className="text-xs text-muted-foreground">Document with version</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* URLs & Identifiers */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-primary">URLs & Identifiers</Label>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => loadExample("How to Build a REST API with Node.js & Express")}
                >
                  <div>
                    <div className="font-medium">How to Build a REST API...</div>
                    <div className="text-xs text-muted-foreground">Tutorial URL</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => loadExample("Product Category: Electronics & Gadgets")}
                >
                  <div>
                    <div className="font-medium">Product Category: Electronics...</div>
                    <div className="text-xs text-muted-foreground">E-commerce category</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Slug Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            About URL Slugs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">What is a Slug?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                A slug is a URL-friendly version of a string, typically used in web addresses, 
                file names, and database identifiers. It contains only lowercase letters, numbers, 
                and hyphens (or other separators).
              </p>
              
              <h4 className="font-semibold mb-2">Common Use Cases</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Blog post URLs</li>
                <li>• File and folder names</li>
                <li>• Database identifiers</li>
                <li>• API endpoints</li>
                <li>• SEO-friendly URLs</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Best Practices</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Keep slugs short and descriptive</li>
                <li>• Use hyphens as separators</li>
                <li>• Remove special characters</li>
                <li>• Convert to lowercase</li>
                <li>• Avoid duplicate slugs</li>
              </ul>
              
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Pro Tip</p>
                    <p className="text-blue-700 dark:text-blue-300">
                      Use the configuration options to customize your slug generation. 
                      Different projects may require different formatting rules.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SlugGenerator;
