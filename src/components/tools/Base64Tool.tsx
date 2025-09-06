import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Copy, Check, ArrowUpDown, FileText, Code, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const Base64Tool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState("encode");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const encodeBase64 = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
    } catch (err) {
      toast({
        title: "Encoding failed",
        description: "Could not encode the input text",
        variant: "destructive",
      });
    }
  };

  const decodeBase64 = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
    } catch (err) {
      toast({
        title: "Decoding failed",
        description: "Invalid Base64 input or corrupted data",
        variant: "destructive",
      });
    }
  };

  const swapInputOutput = () => {
    const temp = input;
    setInput(output);
    setOutput(temp);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Result copied to clipboard",
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

  const loadExample = (example: string) => {
    setInput(example);
    setOutput("");
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Base64 Encoder/Decoder</h2>
        <p className="text-muted-foreground">
          Encode text to Base64 or decode Base64 strings back to readable text
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encode">Encode</TabsTrigger>
          <TabsTrigger value="decode">Decode</TabsTrigger>
        </TabsList>

        <TabsContent value="encode" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Plain Text Input</CardTitle>
                <CardDescription>
                  Enter the text you want to encode to Base64
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter text to encode..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[200px] resize-none bg-code-bg"
                />
                <div className="flex gap-2">
                  <Button onClick={encodeBase64} disabled={!input.trim()}>
                    Encode to Base64
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Base64 Output</CardTitle>
                    <CardDescription>
                      Encoded Base64 string
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {output && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="gap-2"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    )}
                    {input && output && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={swapInputOutput}
                        className="gap-2"
                      >
                        <ArrowUpDown className="h-4 w-4" />
                        Swap
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {output ? (
                  <Textarea
                    value={output}
                    readOnly
                    className="font-mono min-h-[200px] resize-none bg-code-bg"
                  />
                ) : (
                  <div className="min-h-[200px] bg-code-bg rounded-md border flex items-center justify-center text-muted-foreground">
                    Base64 encoded text will appear here
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="decode" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Base64 Input</CardTitle>
                <CardDescription>
                  Enter the Base64 string you want to decode
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter Base64 string to decode..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="font-mono min-h-[200px] resize-none bg-code-bg"
                />
                <div className="flex gap-2">
                  <Button onClick={decodeBase64} disabled={!input.trim()}>
                    Decode from Base64
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Decoded Output</CardTitle>
                    <CardDescription>
                      Plain text result
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {output && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="gap-2"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    )}
                    {input && output && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={swapInputOutput}
                        className="gap-2"
                      >
                        <ArrowUpDown className="h-4 w-4" />
                        Swap
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {output ? (
                  <Textarea
                    value={output}
                    readOnly
                    className="min-h-[200px] resize-none bg-code-bg"
                  />
                ) : (
                  <div className="min-h-[200px] bg-code-bg rounded-md border flex items-center justify-center text-muted-foreground">
                    Decoded text will appear here
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Examples</CardTitle>
          <CardDescription>Click on any example to load it</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <Label className="text-sm font-medium">Text Examples</Label>
              </div>
              <div className="space-y-1">
                {[
                  { text: "Hello World!", desc: "Simple Text" },
                  { text: "user@example.com", desc: "Email Address" },
                  { text: "Special chars: !@#$%^&*()", desc: "Special Characters" },
                  { text: "Unicode: 你好世界 🌍", desc: "Unicode Text" }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      loadExample(example.text);
                      setActiveTab("encode");
                    }}
                    className="w-full justify-start text-xs"
                  >
                    {example.desc}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-green-600" />
                <Label className="text-sm font-medium">Base64 Examples</Label>
              </div>
              <div className="space-y-1">
                {[
                  { base64: "SGVsbG8gV29ybGQh", desc: "Hello World!" },
                  { base64: "dXNlckBleGFtcGxlLmNvbQ==", desc: "Email Address" },
                  { base64: "U3BlY2lhbCBjaGFyczogIUAjJCVeJiooKQ==", desc: "Special Chars" },
                  { base64: "VW5pY29kZTog5L2g5aW95LiW55WMIPCfpI0=", desc: "Unicode Text" }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      loadExample(example.base64);
                      setActiveTab("decode");
                    }}
                    className="w-full justify-start text-xs font-mono"
                  >
                    {example.desc}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4 text-purple-600" />
                <Label className="text-sm font-medium">Common Uses</Label>
              </div>
              <div className="space-y-1">
                {[
                  { text: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", desc: "1x1 PNG Image" },
                  { text: "eyJ1c2VyIjoiSm9obiIsImFnZSI6MzB9", desc: "JSON Data" },
                  { text: "PHNjcmlwdD5hbGVydCgnSGVsbG8nKTwvc2NyaXB0Pg==", desc: "HTML Script" },
                  { text: "LS0tCmlkOiAxCm5hbWU6IEpvaG4KLS0t", desc: "YAML Data" }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      loadExample(example.text);
                      setActiveTab("decode");
                    }}
                    className="w-full justify-start text-xs"
                  >
                    {example.desc}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Base64 Information */}
      <Card>
        <CardHeader>
          <CardTitle>About Base64</CardTitle>
          <CardDescription>Understanding Base64 encoding and its applications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-2">What is Base64?</h4>
              <ul className="space-y-1">
                <li>• Binary-to-text encoding scheme</li>
                <li>• Uses 64 printable ASCII characters</li>
                <li>• Characters: A-Z, a-z, 0-9, +, /</li>
                <li>• Padding with = for proper length</li>
                <li>• ~33% size increase over binary</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Common Use Cases:</h4>
              <ul className="space-y-1">
                <li>• Email attachments (MIME)</li>
                <li>• Data URLs in HTML/CSS</li>
                <li>• JSON/XML binary data</li>
                <li>• HTTP Basic Authentication</li>
                <li>• Image embedding in web pages</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Code className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Encoding Process</p>
                <p className="text-blue-700 dark:text-blue-300">
                  Base64 converts every 3 bytes (24 bits) of binary data into 4 Base64 characters (6 bits each). 
                  This ensures safe transmission over text-based protocols.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};