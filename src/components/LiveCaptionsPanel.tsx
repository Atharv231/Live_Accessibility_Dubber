import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface CaptionLine {
  id: string;
  text: string;
  timestamp: Date;
  isFinal: boolean;
}

interface LiveCaptionsPanelProps {
  isConnected: boolean;
  fontSize: number;
}

export const LiveCaptionsPanel = ({ isConnected, fontSize }: LiveCaptionsPanelProps) => {
  const [captions, setCaptions] = useState<CaptionLine[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentInterim, setCurrentInterim] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const captionIdRef = useRef(0);

  // Mock live captions data
  const mockCaptions = [
    "Welcome to the Live Accessibility Dubber demo.",
    "This system provides real-time speech-to-text captions",
    "with support for multiple languages and translation.",
    "The captions appear with smooth animations",
    "and automatically scroll as new text arrives.",
    "You can pause, resume, and adjust the font size",
    "to ensure optimal accessibility for all users.",
    "The system uses open-source speech recognition models",
    "to provide accurate transcription without privacy concerns.",
    "Thank you for using Live Accessibility Dubber!"
  ];

  // Simulate live captions
  useEffect(() => {
    if (!isConnected || isPaused) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < mockCaptions.length) {
        const text = mockCaptions[currentIndex];
        const newCaption: CaptionLine = {
          id: `caption-${captionIdRef.current++}`,
          text,
          timestamp: new Date(),
          isFinal: true,
        };

        setCaptions(prev => [...prev, newCaption]);
        currentIndex++;
      } else {
        // Reset and loop
        currentIndex = 0;
        setCaptions([]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isConnected, isPaused]);

  // Simulate interim captions
  useEffect(() => {
    if (!isConnected || isPaused) return;

    const interimTexts = [
      "Processing audio...",
      "Analyzing speech patterns...",
      "Generating captions...",
      ""
    ];

    let interimIndex = 0;
    const interimInterval = setInterval(() => {
      setCurrentInterim(interimTexts[interimIndex]);
      interimIndex = (interimIndex + 1) % interimTexts.length;
    }, 1500);

    return () => clearInterval(interimInterval);
  }, [isConnected, isPaused]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current && !isPaused) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [captions, isPaused]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            🎤 Live Captions
            {isConnected && (
              <Badge variant="secondary" className="bg-success text-success-foreground">
                Live
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              disabled={!isConnected}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
              disabled={!isConnected}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0">
        {!isConnected ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-muted-foreground">Connecting to live captions...</p>
            </div>
          </div>
        ) : (
          <div 
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto scrollbar-hide pr-2"
            style={{ fontSize: `${fontSize}px` }}
          >
            {captions.map((caption) => (
              <div
                key={caption.id}
                className={`caption-fade-in p-3 rounded-lg ${
                  caption.isFinal 
                    ? 'bg-caption-bg text-caption-text caption-final' 
                    : 'bg-muted text-muted-foreground caption-interim'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="flex-1 leading-relaxed">
                    {caption.text}
                  </p>
                  <span className="text-xs opacity-60 whitespace-nowrap">
                    {caption.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Interim caption */}
            {currentInterim && (
              <div className="p-3 rounded-lg bg-muted text-muted-foreground caption-interim animate-pulse">
                <p className="leading-relaxed">{currentInterim}</p>
              </div>
            )}
            
            {/* Scroll indicator */}
            <div className="h-1"></div>
          </div>
        )}

        {/* Status bar */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {captions.length} captions • {isPaused ? 'Paused' : 'Live'}
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