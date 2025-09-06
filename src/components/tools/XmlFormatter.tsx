import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Copy, Check, AlertCircle, CheckCircle, RotateCcw, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const XmlFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const formatXml = (xml: string): string => {
    const PADDING = ' '.repeat(2);
    const reg = /(>)(<)(\/*)/g;
    let formatted = xml.replace(reg, '$1\r\n$2$3');
    let pad = 0;

    formatted.split('\r\n').forEach((node) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/) && pad > 0) {
        pad -= 1;
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        indent = 1;
      } else {
        indent = 0;
      }

      const padding = PADDING.repeat(pad);
      formatted = formatted.replace(node, padding + node);
      pad += indent;
    });

    return formatted.trim();
  };

  const minifyXml = (xml: string): string => {
    return xml
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .replace(/\s+>/g, '>')
      .replace(/<\s+/g, '<')
      .trim();
  };

  const validateXml = (xml: string): { isValid: boolean; error?: string } => {
    try {
      // Basic XML validation
      if (!xml.trim()) {
        return { isValid: false, error: "Empty XML content" };
      }

      // Check for basic XML structure
      if (!xml.includes('<') || !xml.includes('>')) {
        return { isValid: false, error: "Invalid XML structure" };
      }

      // Check for unclosed tags
      const openTags = xml.match(/<[^\/][^>]*>/g) || [];
      const closeTags = xml.match(/<\/[^>]*>/g) || [];
      const selfClosingTags = xml.match(/<[^>]*\/>/g) || [];

      // Simple tag matching validation
      const tagStack: string[] = [];
      const tagRegex = /<\/?([^>\s\/]+)[^>]*>/g;
      let match;

      while ((match = tagRegex.exec(xml)) !== null) {
        const fullTag = match[0];
        const tagName = match[1];

        if (fullTag.startsWith('</')) {
          // Closing tag
          if (tagStack.length === 0 || tagStack.pop() !== tagName) {
            return { isValid: false, error: `Mismatched closing tag: ${tagName}` };
          }
        } else if (!fullTag.endsWith('/>')) {
          // Opening tag (not self-closing)
          tagStack.push(tagName);
        }
      }

      if (tagStack.length > 0) {
        return { isValid: false, error: `Unclosed tag: ${tagStack[0]}` };
      }

      return { isValid: true };
    } catch (err) {
      return { isValid: false, error: (err as Error).message };
    }
  };

  const formatXmlInput = () => {
    try {
      if (!input.trim()) {
        setError("Please enter XML data");
        setIsValid(false);
        return;
      }

      const validation = validateXml(input);
      if (!validation.isValid) {
        setError(validation.error || "Invalid XML");
        setIsValid(false);
        setOutput("");
        return;
      }

      const formatted = formatXml(input);
      setOutput(formatted);
      setIsValid(true);
      setError("");
    } catch (err) {
      setError((err as Error).message);
      setIsValid(false);
      setOutput("");
    }
  };

  const minifyXmlInput = () => {
    try {
      if (!input.trim()) {
        setError("Please enter XML data");
        setIsValid(false);
        return;
      }

      const validation = validateXml(input);
      if (!validation.isValid) {
        setError(validation.error || "Invalid XML");
        setIsValid(false);
        setOutput("");
        return;
      }

      const minified = minifyXml(input);
      setOutput(minified);
      setIsValid(true);
      setError("");
    } catch (err) {
      setError((err as Error).message);
      setIsValid(false);
      setOutput("");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "XML copied to clipboard",
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
    setIsValid(null);
    setError("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">XML Formatter & Validator</h2>
        <p className="text-muted-foreground">
          Format, validate, and minify XML documents with syntax highlighting
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Input XML</CardTitle>
              {isValid !== null && (
                <div className="flex items-center gap-2">
                  {isValid ? (
                    <Badge variant="default" className="bg-success text-success-foreground">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Valid
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Invalid
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <CardDescription>
              Paste your XML data here
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder='<?xml version="1.0" encoding="UTF-8"?><root><item>value</item></root>'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="font-mono min-h-[300px] resize-none bg-code-bg"
            />
            <div className="flex gap-2 flex-wrap">
              <Button onClick={formatXmlInput} disabled={!input.trim()}>
                <FileText className="h-4 w-4 mr-2" />
                Format
              </Button>
              <Button variant="outline" onClick={minifyXmlInput} disabled={!input.trim()}>
                Minify
              </Button>
              <Button variant="outline" onClick={clearAll}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Output</CardTitle>
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
            </div>
            <CardDescription>
              Formatted XML output
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
                <div className="flex items-center gap-2 text-destructive mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">XML Parse Error</span>
                </div>
                <p className="text-sm text-destructive/80 font-mono">{error}</p>
              </div>
            ) : output ? (
              <Textarea
                value={output}
                readOnly
                className="font-mono min-h-[300px] resize-none bg-code-bg"
              />
            ) : (
              <div className="min-h-[300px] bg-code-bg rounded-md border flex items-center justify-center text-muted-foreground">
                Formatted XML will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Examples</CardTitle>
          <CardDescription>Click on any example to load it</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Basic XML</Label>
              <div className="space-y-1">
                {[
                  { xml: '<?xml version="1.0" encoding="UTF-8"?><root><item>Hello World</item></root>', desc: "Simple XML" },
                  { xml: '<config><database host="localhost" port="5432"/><server port="3000"/></config>', desc: "Config XML" },
                  { xml: '<users><user id="1"><name>John</name><email>john@example.com</email></user></users>', desc: "User Data" }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(example.xml)}
                    className="w-full justify-start text-xs font-mono"
                  >
                    {example.desc}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Complex XML</Label>
              <div className="space-y-1">
                {[
                  { xml: '<bookstore><book category="fiction"><title>Harry Potter</title><author>J.K. Rowling</author><price>29.99</price></book></bookstore>', desc: "Book Store" },
                  { xml: '<rss version="2.0"><channel><title>News</title><item><title>Breaking News</title><description>Latest updates</description></item></channel></rss>', desc: "RSS Feed" },
                  { xml: '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GetData><id>123</id></GetData></soap:Body></soap:Envelope>', desc: "SOAP Message" }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(example.xml)}
                    className="w-full justify-start text-xs font-mono"
                  >
                    {example.desc}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Invalid XML</Label>
              <div className="space-y-1">
                {[
                  { xml: '<root><item>Unclosed tag', desc: "Unclosed Tag" },
                  { xml: '<root><item></root></item>', desc: "Mismatched Tags" },
                  { xml: '<root><item>No closing tag</item>', desc: "Missing Root Close" }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(example.xml)}
                    className="w-full justify-start text-xs font-mono"
                  >
                    {example.desc}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* XML Tips */}
      <Card>
        <CardHeader>
          <CardTitle>XML Tips</CardTitle>
          <CardDescription>Best practices for XML formatting and validation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Formatting Rules</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• All tags must be properly closed</li>
                <li>• Attributes should be quoted</li>
                <li>• Use consistent indentation (2 spaces)</li>
                <li>• Self-closing tags end with /&gt;</li>
                <li>• XML declaration is optional but recommended</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Common Issues</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Mismatched opening and closing tags</li>
                <li>• Unclosed tags or elements</li>
                <li>• Invalid characters in tag names</li>
                <li>• Missing quotes around attribute values</li>
                <li>• Improper nesting of elements</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
