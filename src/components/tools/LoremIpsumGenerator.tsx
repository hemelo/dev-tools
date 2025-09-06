import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Copy, Download, Shuffle, Type, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoremConfig {
  type: 'paragraphs' | 'sentences' | 'words' | 'lists';
  count: number;
  language: 'latin' | 'english' | 'spanish' | 'french' | 'german' | 'italian' | 'portuguese';
  startWithLorem: boolean;
  includeHtml: boolean;
  htmlTag: 'p' | 'div' | 'span' | 'li';
}

const LoremIpsumGenerator = () => {
  const [config, setConfig] = useState<LoremConfig>({
    type: 'paragraphs',
    count: 3,
    language: 'latin',
    startWithLorem: true,
    includeHtml: false,
    htmlTag: 'p'
  });

  const [generatedText, setGeneratedText] = useState('');
  const { toast } = useToast();

  const loremTexts = {
    latin: {
      words: ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'],
      sentences: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
        'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      ]
    },
    english: {
      words: ['the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'pack', 'my', 'box', 'with', 'five', 'dozen', 'liquor', 'jugs', 'how', 'vexingly', 'quick', 'daft', 'zebras', 'jump', 'bright', 'vixens', 'jump', 'for', 'quick', 'waltz', 'bad', 'zombies', 'make', 'vexed', 'queens', 'jump', 'and', 'dance', 'waltzing', 'bad', 'zombies', 'make', 'vexed', 'queens', 'jump', 'and', 'dance', 'waltzing', 'bad', 'zombies', 'make', 'vexed', 'queens', 'jump', 'and', 'dance'],
      sentences: [
        'The quick brown fox jumps over the lazy dog.',
        'Pack my box with five dozen liquor jugs.',
        'How vexingly quick daft zebras jump.',
        'Bright vixens jump for quick waltz bad zombies.',
        'Make vexed queens jump and dance waltzing bad zombies make vexed queens jump and dance.'
      ]
    },
    spanish: {
      words: ['el', 'perro', 'marron', 'rapido', 'salta', 'sobre', 'el', 'zorro', 'perezoso', 'empaqueta', 'mi', 'caja', 'con', 'cinco', 'docenas', 'de', 'jarros', 'de', 'licor', 'que', 'rapidamente', 'saltan', 'las', 'cebras', 'torpes', 'las', 'zorras', 'brillantes', 'saltan', 'por', 'el', 'vals', 'rapido', 'de', 'los', 'zombies', 'malos', 'hacen', 'que', 'las', 'reinas', 'molestas', 'salten', 'y', 'bailen', 'vals', 'zombies', 'malos', 'hacen', 'que', 'las', 'reinas', 'molestas', 'salten', 'y', 'bailen'],
      sentences: [
        'El perro marrón rápido salta sobre el zorro perezoso.',
        'Empaqueta mi caja con cinco docenas de jarros de licor.',
        'Qué rápidamente saltan las cebras torpes.',
        'Las zorras brillantes saltan por el vals rápido de los zombies malos.',
        'Hacen que las reinas molestas salten y bailen vals zombies malos hacen que las reinas molestas salten y bailen.'
      ]
    },
    french: {
      words: ['le', 'chien', 'brun', 'rapide', 'saute', 'par', 'dessus', 'le', 'renard', 'paresseux', 'emballe', 'ma', 'boite', 'avec', 'cinq', 'douzaines', 'de', 'cruches', 'de', 'liqueur', 'comme', 'rapidement', 'sautent', 'les', 'zebres', 'niais', 'les', 'renardes', 'brillantes', 'sautent', 'pour', 'la', 'valse', 'rapide', 'des', 'zombies', 'mauvais', 'font', 'que', 'les', 'reines', 'vexees', 'sautent', 'et', 'dansent', 'valsant', 'zombies', 'mauvais', 'font', 'que', 'les', 'reines', 'vexees', 'sautent', 'et', 'dansent'],
      sentences: [
        'Le chien brun rapide saute par dessus le renard paresseux.',
        'Emballe ma boîte avec cinq douzaines de cruches de liqueur.',
        'Comme rapidement sautent les zèbres niais.',
        'Les renardes brillantes sautent pour la valse rapide des zombies mauvais.',
        'Font que les reines vexées sautent et dansent valsant zombies mauvais font que les reines vexées sautent et dansent.'
      ]
    },
    german: {
      words: ['der', 'schnelle', 'braune', 'hund', 'springt', 'uber', 'den', 'faulen', 'fuchs', 'packe', 'meine', 'box', 'mit', 'funf', 'dutzend', 'likor', 'krugen', 'wie', 'verargert', 'schnell', 'dumme', 'zebras', 'springen', 'helle', 'fuchse', 'springen', 'fur', 'den', 'schnellen', 'walzer', 'schlechte', 'zombies', 'machen', 'dass', 'die', 'verargerten', 'koniginnen', 'springen', 'und', 'tanzen', 'walzend', 'schlechte', 'zombies', 'machen', 'dass', 'die', 'verargerten', 'koniginnen', 'springen', 'und', 'tanzen'],
      sentences: [
        'Der schnelle braune Hund springt über den faulen Fuchs.',
        'Packe meine Box mit fünf Dutzend Likörkrügen.',
        'Wie verärgert schnell dumme Zebras springen.',
        'Helle Füchse springen für den schnellen Walzer schlechte Zombies.',
        'Machen dass die verärgerten Königinnen springen und tanzen walzend schlechte Zombies machen dass die verärgerten Königinnen springen und tanzen.'
      ]
    },
    italian: {
      words: ['il', 'cane', 'marrone', 'veloce', 'salta', 'sopra', 'la', 'volpe', 'pigra', 'impacchetta', 'la', 'mia', 'scatola', 'con', 'cinque', 'dozzine', 'di', 'brocche', 'di', 'liquore', 'come', 'velocemente', 'saltano', 'le', 'zebre', 'sciocche', 'le', 'volpi', 'brillanti', 'saltano', 'per', 'il', 'valzer', 'veloce', 'dei', 'zombie', 'cattivi', 'fanno', 'che', 'le', 'regine', 'irritate', 'saltino', 'e', 'ballino', 'valzando', 'zombie', 'cattivi', 'fanno', 'che', 'le', 'regine', 'irritate', 'saltino', 'e', 'ballino'],
      sentences: [
        'Il cane marrone veloce salta sopra la volpe pigra.',
        'Impacchetta la mia scatola con cinque dozzine di brocche di liquore.',
        'Come velocemente saltano le zebre sciocche.',
        'Le volpi brillanti saltano per il valzer veloce dei zombie cattivi.',
        'Fanno che le regine irritate saltino e ballino valzando zombie cattivi fanno che le regine irritate saltino e ballino.'
      ]
    },
    portuguese: {
      words: ['o', 'cao', 'marrom', 'rapido', 'pula', 'sobre', 'a', 'raposa', 'preguicosa', 'embale', 'minha', 'caixa', 'com', 'cinco', 'duzias', 'de', 'jarros', 'de', 'licor', 'como', 'rapidamente', 'pulam', 'as', 'zebras', 'tolos', 'as', 'raposas', 'brilhantes', 'pulam', 'para', 'a', 'valsa', 'rapida', 'dos', 'zumbis', 'ruins', 'fazem', 'que', 'as', 'rainhas', 'irritadas', 'pulem', 'e', 'dancem', 'valsando', 'zumbis', 'ruins', 'fazem', 'que', 'as', 'rainhas', 'irritadas', 'pulem', 'e', 'dancem'],
      sentences: [
        'O cão marrom rápido pula sobre a raposa preguiçosa.',
        'Embale minha caixa com cinco dúzias de jarros de licor.',
        'Como rapidamente pulam as zebras tolos.',
        'As raposas brilhantes pulam para a valsa rápida dos zumbis ruins.',
        'Fazem que as rainhas irritadas pulem e dancem valsando zumbis ruins fazem que as rainhas irritadas pulem e dancem.'
      ]
    }
  };

  const generateText = () => {
    const textData = loremTexts[config.language];
    let result = '';

    if (config.type === 'words') {
      const words = [];
      for (let i = 0; i < config.count; i++) {
        words.push(textData.words[Math.floor(Math.random() * textData.words.length)]);
      }
      result = words.join(' ');
    } else if (config.type === 'sentences') {
      const sentences = [];
      for (let i = 0; i < config.count; i++) {
        sentences.push(textData.sentences[Math.floor(Math.random() * textData.sentences.length)]);
      }
      result = sentences.join(' ');
    } else if (config.type === 'paragraphs') {
      const paragraphs = [];
      for (let i = 0; i < config.count; i++) {
        const sentences = [];
        const sentenceCount = Math.floor(Math.random() * 3) + 3; // 3-5 sentences per paragraph
        for (let j = 0; j < sentenceCount; j++) {
          sentences.push(textData.sentences[Math.floor(Math.random() * textData.sentences.length)]);
        }
        paragraphs.push(sentences.join(' '));
      }
      result = paragraphs.join('\n\n');
    } else if (config.type === 'lists') {
      const items = [];
      for (let i = 0; i < config.count; i++) {
        const words = [];
        const wordCount = Math.floor(Math.random() * 5) + 3; // 3-7 words per item
        for (let j = 0; j < wordCount; j++) {
          words.push(textData.words[Math.floor(Math.random() * textData.words.length)]);
        }
        items.push(words.join(' '));
      }
      result = items.join('\n');
    }

    if (config.includeHtml) {
      if (config.type === 'paragraphs') {
        result = result.split('\n\n').map(paragraph => 
          `<${config.htmlTag}>${paragraph}</${config.htmlTag}>`
        ).join('\n');
      } else if (config.type === 'lists') {
        result = result.split('\n').map(item => 
          `<li>${item}</li>`
        ).join('\n');
        result = `<ul>\n${result}\n</ul>`;
      } else {
        result = `<${config.htmlTag}>${result}</${config.htmlTag}>`;
      }
    }

    setGeneratedText(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard!",
    });
  };

  const downloadAsFile = () => {
    const blob = new Blob([generatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lorem-ipsum-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success!",
      description: "File downloaded!",
    });
  };

  const randomizeConfig = () => {
    const types: LoremConfig['type'][] = ['paragraphs', 'sentences', 'words', 'lists'];
    const languages: LoremConfig['language'][] = ['latin', 'english', 'spanish', 'french', 'german', 'italian', 'portuguese'];
    const htmlTags: LoremConfig['htmlTag'][] = ['p', 'div', 'span', 'li'];
    
    setConfig(prev => ({
      ...prev,
      type: types[Math.floor(Math.random() * types.length)],
      count: Math.floor(Math.random() * 10) + 1,
      language: languages[Math.floor(Math.random() * languages.length)],
      startWithLorem: Math.random() > 0.5,
      includeHtml: Math.random() > 0.5,
      htmlTag: htmlTags[Math.floor(Math.random() * htmlTags.length)]
    }));
  };

  const wordCount = generatedText.split(/\s+/).filter(word => word.length > 0).length;
  const characterCount = generatedText.length;
  const lineCount = generatedText.split('\n').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Lorem Ipsum Generator</h2>
        <p className="text-muted-foreground">
          Generate placeholder text in multiple languages and formats
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Configuration
            </CardTitle>
            <CardDescription>
              Customize your placeholder text
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="text-type">Text Type</Label>
              <Select 
                value={config.type} 
                onValueChange={(value: any) => setConfig(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paragraphs">Paragraphs</SelectItem>
                  <SelectItem value="sentences">Sentences</SelectItem>
                  <SelectItem value="words">Words</SelectItem>
                  <SelectItem value="lists">Lists</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="count">Count</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="100"
                value={config.count}
                onChange={(e) => setConfig(prev => ({ ...prev, count: parseInt(e.target.value) || 1 }))}
              />
            </div>

            <div>
              <Label htmlFor="language">Language</Label>
              <Select 
                value={config.language} 
                onValueChange={(value: any) => setConfig(prev => ({ ...prev, language: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latin">Latin (Lorem Ipsum)</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="portuguese">Portuguese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.startWithLorem}
                    onChange={(e) => setConfig(prev => ({ ...prev, startWithLorem: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Start with "Lorem ipsum"</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.includeHtml}
                    onChange={(e) => setConfig(prev => ({ ...prev, includeHtml: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Include HTML tags</span>
                </label>
              </div>
            </div>

            {config.includeHtml && (
              <div>
                <Label htmlFor="html-tag">HTML Tag</Label>
                <Select 
                  value={config.htmlTag} 
                  onValueChange={(value: any) => setConfig(prev => ({ ...prev, htmlTag: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="p">Paragraph (&lt;p&gt;)</SelectItem>
                    <SelectItem value="div">Div (&lt;div&gt;)</SelectItem>
                    <SelectItem value="span">Span (&lt;span&gt;)</SelectItem>
                    <SelectItem value="li">List Item (&lt;li&gt;)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={generateText} className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Generate Text
              </Button>
              <Button variant="outline" onClick={randomizeConfig}>
                <Shuffle className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Generated Text
            </CardTitle>
            <CardDescription>
              <div className="flex items-center gap-4">
                <Badge variant="secondary">{wordCount} words</Badge>
                <Badge variant="secondary">{characterCount} chars</Badge>
                <Badge variant="secondary">{lineCount} lines</Badge>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!generatedText}>
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={downloadAsFile} disabled={!generatedText}>
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </div>
            
            <Textarea
              value={generatedText}
              readOnly
              className="min-h-[400px] font-mono text-sm"
              placeholder="Click 'Generate Text' to create placeholder content..."
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Examples</CardTitle>
          <CardDescription>
            Common use cases for placeholder text
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="web" className="space-y-4">
            <TabsList>
              <TabsTrigger value="web">Web Development</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>
            
            <TabsContent value="web" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-code-bg rounded-lg">
                  <h4 className="font-semibold mb-2">HTML Paragraphs</h4>
                  <pre className="text-sm"><code>{`<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
<p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`}</code></pre>
                </div>
                <div className="p-4 bg-code-bg rounded-lg">
                  <h4 className="font-semibold mb-2">CSS Content</h4>
                  <pre className="text-sm"><code>{`.placeholder::before {
  content: "Lorem ipsum dolor sit amet...";
}`}</code></pre>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="design" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Mockup Text</h4>
                  <p className="text-sm text-muted-foreground">
                    Use for wireframes, prototypes, and design mockups to show text placement and layout.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Typography Testing</h4>
                  <p className="text-sm text-muted-foreground">
                    Test different fonts, sizes, and spacing with realistic text content.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Blog Posts</h4>
                  <p className="text-sm text-muted-foreground">
                    Generate multiple paragraphs for testing blog layouts and content structure.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Product Descriptions</h4>
                  <p className="text-sm text-muted-foreground">
                    Create placeholder product descriptions for e-commerce mockups.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoremIpsumGenerator;
