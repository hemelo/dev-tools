import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Type, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CaseConversion {
  camelCase: string;
  PascalCase: string;
  snake_case: string;
  kebab_case: string;
  CONSTANT_CASE: string;
  Title_Case: string;
  sentence_case: string;
  lowercase: string;
  UPPERCASE: string;
}

const CaseConverter = () => {
  const [input, setInput] = useState("");
  const [conversions, setConversions] = useState<CaseConversion>({
    camelCase: "",
    PascalCase: "",
    snake_case: "",
    kebab_case: "",
    CONSTANT_CASE: "",
    Title_Case: "",
    sentence_case: "",
    lowercase: "",
    UPPERCASE: ""
  });
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const toCamelCase = (text: string): string => {
    return text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  };

  const toPascalCase = (text: string): string => {
    return text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
        return word.toUpperCase();
      })
      .replace(/\s+/g, '');
  };

  const toSnakeCase = (text: string): string => {
    return text
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('_');
  };

  const toKebabCase = (text: string): string => {
    return text
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('-');
  };

  const toConstantCase = (text: string): string => {
    return text
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toUpperCase())
      .join('_');
  };

  const toTitleCase = (text: string): string => {
    return text
      .replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
  };

  const toSentenceCase = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/(^\w|\.\s+\w)/g, (txt) => {
        return txt.toUpperCase();
      });
  };

  const performConversions = () => {
    if (!input.trim()) {
      setConversions({
        camelCase: "",
        PascalCase: "",
        snake_case: "",
        kebab_case: "",
        CONSTANT_CASE: "",
        Title_Case: "",
        sentence_case: "",
        lowercase: "",
        UPPERCASE: ""
      });
      return;
    }

    const newConversions: CaseConversion = {
      camelCase: toCamelCase(input),
      PascalCase: toPascalCase(input),
      snake_case: toSnakeCase(input),
      kebab_case: toKebabCase(input),
      CONSTANT_CASE: toConstantCase(input),
      Title_Case: toTitleCase(input),
      sentence_case: toSentenceCase(input),
      lowercase: input.toLowerCase(),
      UPPERCASE: input.toUpperCase()
    };

    setConversions(newConversions);
  };

  const copyToClipboard = async (text: string, caseType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(caseType);
      toast({
        title: "Copied!",
        description: `${caseType} copied to clipboard`,
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

  const clearAll = () => {
    setInput("");
    setConversions({
      camelCase: "",
      PascalCase: "",
      snake_case: "",
      kebab_case: "",
      CONSTANT_CASE: "",
      Title_Case: "",
      sentence_case: "",
      lowercase: "",
      UPPERCASE: ""
    });
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    // Perform conversions in real-time
    setTimeout(() => {
      if (value === input) {
        performConversions();
      }
    }, 100);
  };

  // Perform conversions when input changes
  useState(() => {
    performConversions();
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Text Case Converter</h2>
        <p className="text-muted-foreground">
          Convert text between different case formats (camelCase, snake_case, kebab-case, etc.)
        </p>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Input Text</CardTitle>
          <CardDescription>Enter text to convert between different case formats</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter text to convert (e.g., 'hello world', 'userName', 'my_variable')"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            className="font-mono min-h-[120px] resize-none"
          />
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={clearAll} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* camelCase */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">camelCase</CardTitle>
              <Badge variant="secondary">JavaScript</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-code-bg rounded-md p-3 min-h-[60px] flex items-center">
              <code className="text-sm font-mono break-all">
                {conversions.camelCase || "—"}
              </code>
            </div>
            {conversions.camelCase && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(conversions.camelCase, "camelCase")}
                className="w-full gap-2"
              >
                {copied === "camelCase" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === "camelCase" ? "Copied!" : "Copy"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* PascalCase */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">PascalCase</CardTitle>
              <Badge variant="secondary">Classes</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-code-bg rounded-md p-3 min-h-[60px] flex items-center">
              <code className="text-sm font-mono break-all">
                {conversions.PascalCase || "—"}
              </code>
            </div>
            {conversions.PascalCase && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(conversions.PascalCase, "PascalCase")}
                className="w-full gap-2"
              >
                {copied === "PascalCase" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === "PascalCase" ? "Copied!" : "Copy"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* snake_case */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">snake_case</CardTitle>
              <Badge variant="secondary">Python</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-code-bg rounded-md p-3 min-h-[60px] flex items-center">
              <code className="text-sm font-mono break-all">
                {conversions.snake_case || "—"}
              </code>
            </div>
            {conversions.snake_case && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(conversions.snake_case, "snake_case")}
                className="w-full gap-2"
              >
                {copied === "snake_case" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === "snake_case" ? "Copied!" : "Copy"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* kebab-case */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">kebab-case</CardTitle>
              <Badge variant="secondary">CSS</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-code-bg rounded-md p-3 min-h-[60px] flex items-center">
              <code className="text-sm font-mono break-all">
                {conversions.kebab_case || "—"}
              </code>
            </div>
            {conversions.kebab_case && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(conversions.kebab_case, "kebab-case")}
                className="w-full gap-2"
              >
                {copied === "kebab-case" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === "kebab-case" ? "Copied!" : "Copy"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* CONSTANT_CASE */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">CONSTANT_CASE</CardTitle>
              <Badge variant="secondary">Constants</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-code-bg rounded-md p-3 min-h-[60px] flex items-center">
              <code className="text-sm font-mono break-all">
                {conversions.CONSTANT_CASE || "—"}
              </code>
            </div>
            {conversions.CONSTANT_CASE && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(conversions.CONSTANT_CASE, "CONSTANT_CASE")}
                className="w-full gap-2"
              >
                {copied === "CONSTANT_CASE" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === "CONSTANT_CASE" ? "Copied!" : "Copy"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Title Case */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Title Case</CardTitle>
              <Badge variant="secondary">Titles</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-code-bg rounded-md p-3 min-h-[60px] flex items-center">
              <code className="text-sm font-mono break-all">
                {conversions.Title_Case || "—"}
              </code>
            </div>
            {conversions.Title_Case && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(conversions.Title_Case, "Title Case")}
                className="w-full gap-2"
              >
                {copied === "Title Case" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === "Title Case" ? "Copied!" : "Copy"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* sentence case */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Sentence case</CardTitle>
              <Badge variant="secondary">Sentences</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-code-bg rounded-md p-3 min-h-[60px] flex items-center">
              <code className="text-sm font-mono break-all">
                {conversions.sentence_case || "—"}
              </code>
            </div>
            {conversions.sentence_case && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(conversions.sentence_case, "Sentence case")}
                className="w-full gap-2"
              >
                {copied === "Sentence case" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === "Sentence case" ? "Copied!" : "Copy"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* lowercase */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">lowercase</CardTitle>
              <Badge variant="secondary">Lower</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-code-bg rounded-md p-3 min-h-[60px] flex items-center">
              <code className="text-sm font-mono break-all">
                {conversions.lowercase || "—"}
              </code>
            </div>
            {conversions.lowercase && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(conversions.lowercase, "lowercase")}
                className="w-full gap-2"
              >
                {copied === "lowercase" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === "lowercase" ? "Copied!" : "Copy"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* UPPERCASE */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">UPPERCASE</CardTitle>
              <Badge variant="secondary">Upper</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-code-bg rounded-md p-3 min-h-[60px] flex items-center">
              <code className="text-sm font-mono break-all">
                {conversions.UPPERCASE || "—"}
              </code>
            </div>
            {conversions.UPPERCASE && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(conversions.UPPERCASE, "UPPERCASE")}
                className="w-full gap-2"
              >
                {copied === "UPPERCASE" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === "UPPERCASE" ? "Copied!" : "Copy"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Examples</CardTitle>
          <CardDescription>Click on any example to see the conversions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Programming</Label>
              <div className="space-y-1">
                {["userName", "myVariable", "getUserData"].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(example)}
                    className="w-full justify-start text-xs font-mono"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Descriptive</Label>
              <div className="space-y-1">
                {["hello world", "my awesome project", "user authentication"].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(example)}
                    className="w-full justify-start text-xs"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Mixed Case</Label>
              <div className="space-y-1">
                {["XMLHttpRequest", "iOS", "iPhone"].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(example)}
                    className="w-full justify-start text-xs font-mono"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CaseConverter;
