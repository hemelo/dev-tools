import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, ArrowUpDown } from "lucide-react";
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

      <Card>
        <CardHeader>
          <CardTitle>About Base64</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Base64</strong> is a binary-to-text encoding scheme that represents binary data 
            in ASCII string format using 64 printable characters.
          </p>
          <p>
            Common use cases include encoding binary data for transmission over text-based protocols, 
            embedding images in HTML/CSS, and storing binary data in JSON or XML.
          </p>
          <p>
            Base64 encoded data is approximately 33% larger than the original binary data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};