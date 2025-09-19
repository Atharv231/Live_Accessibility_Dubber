import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Languages, ArrowRight, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TranslationPanelProps {
  fontSize: number;
}

export const TranslationPanel = ({ fontSize }: TranslationPanelProps) => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const languages = [
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  ];

  // Mock translation function
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast({
        title: "No text to translate",
        description: "Please enter some text to translate",
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const selectedLang = languages.find(lang => lang.code === targetLanguage);
      const mockTranslations: Record<string, string> = {
        'es': `[Traducción simulada al español] ${inputText}`,
        'fr': `[Traduction simulée en français] ${inputText}`,
        'de': `[Simulierte Übersetzung ins Deutsche] ${inputText}`,
        'it': `[Traduzione simulata in italiano] ${inputText}`,
        'pt': `[Tradução simulada para português] ${inputText}`,
        'zh': `[模拟中文翻译] ${inputText}`,
        'ja': `[日本語のシミュレーション翻訳] ${inputText}`,
        'ko': `[한국어 시뮬레이션 번역] ${inputText}`,
        'ar': `[ترجمة محاكاة باللغة العربية] ${inputText}`,
        'hi': `[हिंदी अनुकरण अनुवाद] ${inputText}`,
      };
      
      setTranslatedText(mockTranslations[targetLanguage] || `[Simulated translation] ${inputText}`);
      setIsTranslating(false);
      
      toast({
        title: "Translation complete",
        description: `Translated to ${selectedLang?.name}`,
      });
    }, 1500);
  };

  const handleCopy = async () => {
    if (translatedText) {
      await navigator.clipboard.writeText(translatedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      
      toast({
        title: "Copied to clipboard",
        description: "Translation copied successfully",
      });
    }
  };

  const handleQuickTranslate = (text: string) => {
    setInputText(text);
  };

  const quickPhrases = [
    "Hello, how are you?",
    "Thank you very much",
    "Please help me",
    "Where is the bathroom?",
    "I don't understand",
    "Can you repeat that?",
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          🌐 Translation
          <Badge variant="secondary" className="bg-accent text-accent-foreground">
            Free Models
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Translate text using open-source models
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Language Selection */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Translate to:</span>
          <Select value={targetLanguage} onValueChange={setTargetLanguage}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <div className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Phrases */}
        <div>
          <p className="text-sm font-medium mb-2">Quick phrases:</p>
          <div className="flex flex-wrap gap-2">
            {quickPhrases.map((phrase, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickTranslate(phrase)}
              >
                {phrase}
              </Button>
            ))}
          </div>
        </div>

        {/* Input Text Area */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Text to translate:</label>
          <Textarea
            placeholder="Enter text to translate..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[120px] resize-none"
            style={{ fontSize: `${fontSize}px` }}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {inputText.length} characters
            </span>
            <Button 
              onClick={handleTranslate}
              disabled={isTranslating || !inputText.trim()}
              className="flex items-center gap-2"
            >
              {isTranslating ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Translating...
                </>
              ) : (
                <>
                  <Languages className="w-4 h-4" />
                  Translate
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Translation Result */}
        {translatedText && (
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Translation:</label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div 
              className="p-4 rounded-lg bg-accent text-accent-foreground min-h-[120px] animate-fadeInUp"
              style={{ fontSize: `${fontSize}px` }}
            >
              <p className="leading-relaxed">{translatedText}</p>
            </div>
          </div>
        )}

        {/* Status */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Target: {languages.find(l => l.code === targetLanguage)?.name}
            </span>
            <span>
              Font size: {fontSize}px
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};