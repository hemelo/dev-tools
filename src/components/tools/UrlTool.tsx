import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, ArrowUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UrlTool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState("encode");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const encodeUrl = () => {
    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
    } catch (err) {
      toast({
        title: "Encoding failed",
        description: "Could not encode the input text",
        variant: "destructive",
      });
    }
  };

  const decodeUrl = () => {
    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
    } catch (err) {
      toast({
        title: "Decoding failed",
        description: "Invalid URL encoded input",
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

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  const examples = {
    encode: [
      "Hello World!",
      "user@example.com",
      "search query with spaces",
      "special chars: &=+%#"
    ],
    decode: [
      "Hello%20World%21",
      "user%40example.com",
      "search%20query%20with%20spaces",
      "special%20chars%3A%20%26%3D%2B%25%23"
    ]
  };

  const loadExample = (example: string) => {
    setInput(example);
    setOutput("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">URL Encoder/Decoder</h2>
        <p className="text-muted-foreground">
          Encode text for safe URL transmission or decode URL-encoded strings
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
                  Enter the text you want to URL encode
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter text to encode..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[200px] resize-none bg-code-bg"
                />
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={encodeUrl} disabled={!input.trim()}>
                    URL Encode
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    Clear
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Examples:</p>
                  <div className="flex flex-wrap gap-1">
                    {examples.encode.map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => loadExample(example)}
                        className="text-xs"
                      >
                        {example}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>URL Encoded Output</CardTitle>
                    <CardDescription>
                      URL-safe encoded string
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
                    URL encoded text will appear here
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
                <CardTitle>URL Encoded Input</CardTitle>
                <CardDescription>
                  Enter the URL-encoded string you want to decode
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter URL-encoded string to decode..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="font-mono min-h-[200px] resize-none bg-code-bg"
                />
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={decodeUrl} disabled={!input.trim()}>
                    URL Decode
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    Clear
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Examples:</p>
                  <div className="flex flex-wrap gap-1">
                    {examples.decode.map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => loadExample(example)}
                        className="text-xs font-mono"
                      >
                        {example}
                      </Button>
                    ))}
                  </div>
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

      <Card>
        <CardHeader>
          <CardTitle>About URL Encoding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>URL Encoding</strong> (also called Percent Encoding) converts characters 
            into a format that can be safely transmitted over the internet in URLs.
          </p>
          <p>
            Special characters like spaces, ampersands, and non-ASCII characters are converted 
            to percent signs followed by hexadecimal values (e.g., space becomes %20).
          </p>
          <p>
            Essential for form data submission, query parameters, and any text that needs to be 
            included in a URL.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UrlTool;