import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, Volume2, VolumeX, Mic, MicOff, Brain, Zap, Languages, Globe, Settings, Key } from 'lucide-react';

interface CaptionLine {
  id: string;
  originalText: string;
  translatedText?: string;
  timestamp: Date;
  isFinal: boolean;
  isTranslating?: boolean;
}

interface LiveCaptionsPanelProps {
  isConnected: boolean;
  fontSize: number;
}

const TRANSLATION_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
];

const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
  { code: 'nl-NL', name: 'Dutch', flag: '🇳🇱' },
  { code: 'sv-SE', name: 'Swedish', flag: '🇸🇪' },
];

export const LiveCaptionsPanel = ({ isConnected, fontSize }: LiveCaptionsPanelProps) => {
  const [captions, setCaptions] = useState<CaptionLine[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentInterim, setCurrentInterim] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [isTranslationEnabled, setIsTranslationEnabled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const captionIdRef = useRef(0);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    // Create speech recognition instance
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLanguage;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        const newCaption: CaptionLine = {
          id: `caption-${captionIdRef.current++}`,
          originalText: finalTranscript,
          timestamp: new Date(),
          isFinal: true,
        };
        
        setCaptions(prev => [...prev, newCaption]);
        setCurrentInterim('');
        
        // Translate if enabled and API key is available
        if (isTranslationEnabled && apiKey.trim()) {
          translateCaption(newCaption);
        }
      } else if (interimTranscript) {
        setCurrentInterim(interimTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(`Recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (isConnected && !isPaused && !isMuted) {
        // Restart recognition if it should be running
        setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            console.log('Recognition restart failed:', e);
          }
        }, 100);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [selectedLanguage]); // Restart recognition when language changes

  // Start/stop recognition based on connection and pause state
  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isConnected && !isPaused && !isMuted) {
      if (!isListening) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.log('Recognition already started');
        }
      }
    } else {
      if (isListening) {
        recognitionRef.current.stop();
      }
    }
  }, [isConnected, isPaused, isMuted, isListening]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current && !isPaused) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [captions, isPaused]);

  const handleMicToggle = () => {
    setIsMuted(!isMuted);
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  const clearCaptions = () => {
    setCaptions([]);
    setCurrentInterim('');
  };

  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
    // Stop current recognition if running
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const translateCaption = async (caption: CaptionLine) => {
    if (!apiKey.trim()) return;
    
    // Mark as translating
    setCaptions(prev => prev.map(c => 
      c.id === caption.id ? { ...c, isTranslating: true } : c
    ));
    
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: `Translate the following text to ${TRANSLATION_LANGUAGES.find(l => l.code === targetLanguage)?.name || targetLanguage}. Return only the translation, nothing else.`
            },
            {
              role: 'user',
              content: caption.originalText
            }
          ],
          temperature: 0.2,
          max_tokens: 500,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const translatedText = data.choices?.[0]?.message?.content?.trim() || caption.originalText;
        
        setCaptions(prev => prev.map(c => 
          c.id === caption.id ? { 
            ...c, 
            translatedText,
            isTranslating: false 
          } : c
        ));
      } else {
        throw new Error('Translation failed');
      }
    } catch (error) {
      console.error('Translation error:', error);
      setCaptions(prev => prev.map(c => 
        c.id === caption.id ? { 
          ...c, 
          translatedText: caption.originalText,
          isTranslating: false 
        } : c
      ));
    }
  };

  return (
    <div className="relative h-full">
      {/* AI Background Animation */}
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        <div className="ai-background-grid"></div>
        <div className="ai-neural-network"></div>
        <div className="ai-particles"></div>
      </div>
      
      <Card className="h-full flex flex-col relative z-10 glass-effect ai-glow">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="relative">
                <Brain className="w-6 h-6 text-primary animate-pulse" />
                <Zap className="w-3 h-3 text-accent absolute -top-1 -right-1 animate-bounce" />
              </div>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Live AI Captions
              </span>
              {isConnected && isListening && (
                <Badge variant="secondary" className="bg-success text-success-foreground animate-pulse">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-success-foreground rounded-full animate-ping"></div>
                    Live
                  </div>
                </Badge>
              )}
            </CardTitle>
            
            <div className="flex items-center gap-2 flex-wrap">
              {/* Translation Toggle */}
              <Button
                variant={isTranslationEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setIsTranslationEnabled(!isTranslationEnabled)}
                className="min-w-fit"
              >
                <Languages className="w-4 h-4 mr-1" />
                Translate
              </Button>

              {/* API Key Input */}
              {isTranslationEnabled && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                  className={apiKey.trim() ? "bg-success/10 border-success" : ""}
                >
                  <Key className="w-4 h-4" />
                  {apiKey.trim() ? "✓" : "API Key"}
                </Button>
              )}

              {/* Target Language Selector */}
              {isTranslationEnabled && (
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger className="w-auto min-w-[120px] h-9 bg-card/50 border-primary/20">
                    <div className="flex items-center gap-2">
                      <Languages className="w-4 h-4 text-accent" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {TRANSLATION_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Speech Language Selector */}
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-auto min-w-[140px] h-9 bg-card/50 border-primary/20">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={handleMicToggle}
                disabled={!isConnected}
                className={`${isMuted ? 'bg-destructive/10 border-destructive' : 'bg-success/10 border-success'}`}
              >
                {isMuted ? (
                  <MicOff className="w-4 h-4 text-destructive" />
                ) : (
                  <Mic className={`w-4 h-4 text-success ${isListening ? 'animate-pulse' : ''}`} />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handlePauseToggle}
                disabled={!isConnected}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={clearCaptions}
                disabled={!isConnected || captions.length === 0}
              >
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col min-h-0">
          {/* API Key Input Modal */}
          {showApiKeyInput && (
            <div className="mb-4 p-4 bg-muted/50 border border-primary/20 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="api-key" className="text-sm font-medium">Perplexity API Key</Label>
                <Button variant="ghost" size="sm" onClick={() => setShowApiKeyInput(false)}>×</Button>
              </div>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your Perplexity API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Get your API key from <a href="https://www.perplexity.ai/settings/api" target="_blank" rel="noopener noreferrer" className="text-primary underline">Perplexity Settings</a>
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {!isConnected ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="animate-spin w-12 h-12 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <Brain className="w-6 h-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <p className="text-muted-foreground">Initializing AI Speech Recognition...</p>
              </div>
            </div>
          ) : (
            <div 
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto scrollbar-hide pr-2"
              style={{ fontSize: `${fontSize}px` }}
            >
              {captions.length === 0 && !currentInterim && (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  <div className="text-center space-y-2">
                    <Mic className="w-8 h-8 mx-auto animate-pulse" />
                    <p>Start speaking to see live captions...</p>
                  </div>
                </div>
              )}

              {captions.map((caption) => (
                <div
                  key={caption.id}
                  className="caption-fade-in p-4 rounded-lg bg-gradient-to-r from-card to-card/50 border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 space-y-2">
                      {!isTranslationEnabled && (
                        <p className="leading-relaxed text-foreground">
                          {caption.originalText}
                        </p>
                      )}
                      
                      {isTranslationEnabled && (
                        <>
                          <p className="text-xs text-muted-foreground opacity-70">
                            Original: {caption.originalText}
                          </p>
                          
                          {caption.isTranslating ? (
                            <div className="flex items-center gap-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                              <span className="text-sm text-accent">Translating...</span>
                            </div>
                          ) : (
                            <p className="leading-relaxed text-foreground font-medium">
                              {caption.translatedText || caption.originalText}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                    <span className="text-xs opacity-60 whitespace-nowrap">
                      {caption.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {isTranslationEnabled && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Languages className="w-3 h-3" />
                      <span>
                        {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name} → {TRANSLATION_LANGUAGES.find(l => l.code === targetLanguage)?.name}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Interim caption */}
              {currentInterim && (
                <div className="p-4 rounded-lg bg-gradient-to-r from-muted/50 to-primary/5 border border-primary/20 caption-interim animate-pulse">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <p className="leading-relaxed text-muted-foreground italic">{currentInterim}</p>
                  </div>
                </div>
              )}
              
              <div className="h-1"></div>
            </div>
          )}

              {/* Enhanced Status bar */}
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-success animate-pulse' : 'bg-muted'}`}></div>
                      {captions.length} captions
                    </span>
                    <span>{isPaused ? '⏸️ Paused' : isListening ? '🎤 Listening' : '⏹️ Stopped'}</span>
                    {isTranslationEnabled && (
                      <span className="flex items-center gap-1">
                        <Languages className="w-3 h-3" />
                        Translation: {apiKey.trim() ? 'Active' : 'Need API Key'}
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-2">
                    <Zap className="w-3 h-3" />
                    AI Enhanced • {fontSize}px
                  </span>
                </div>
              </div>
        </CardContent>
      </Card>
    </div>
  );
};