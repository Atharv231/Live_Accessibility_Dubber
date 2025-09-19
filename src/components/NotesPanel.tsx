import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Sparkles, Copy, Check, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotesPanelProps {
  fontSize: number;
}

interface GeneratedNotes {
  summary: string;
  bulletPoints: string[];
  keyTakeaways: string[];
  timestamp: Date;
}

export const NotesPanel = ({ fontSize }: NotesPanelProps) => {
  const [inputTranscript, setInputTranscript] = useState('');
  const [generatedNotes, setGeneratedNotes] = useState<GeneratedNotes | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  // Mock AI notes generation
  const handleGenerateNotes = async () => {
    if (!inputTranscript.trim()) {
      toast({
        title: "No transcript provided",
        description: "Please enter a transcript to generate notes",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const mockNotes: GeneratedNotes = {
        summary: "This transcript discusses the key features and benefits of the Live Accessibility Dubber system, emphasizing its real-time captioning capabilities, translation features, and AI-powered note generation for improved accessibility.",
        bulletPoints: [
          "Real-time speech-to-text captioning with high accuracy",
          "Multi-language translation using open-source models",
          "AI-powered note generation and summarization",
          "Accessibility-first design with customizable fonts and themes",
          "Privacy-focused approach using open-source technology",
          "WebSocket-based live streaming for low latency",
        ],
        keyTakeaways: [
          "Open-source models ensure privacy and cost-effectiveness",
          "Accessibility features make content available to all users",
          "Real-time processing enables live event captioning",
          "AI summarization saves time and improves comprehension",
        ],
        timestamp: new Date(),
      };
      
      setGeneratedNotes(mockNotes);
      setIsGenerating(false);
      
      toast({
        title: "Notes generated successfully",
        description: "AI has analyzed your transcript and created structured notes",
      });
    }, 2500);
  };

  const handleCopyNotes = async () => {
    if (generatedNotes) {
      const notesText = `
# AI Generated Notes
Generated on: ${generatedNotes.timestamp.toLocaleString()}

## Summary
${generatedNotes.summary}

## Key Points
${generatedNotes.bulletPoints.map(point => `• ${point}`).join('\n')}

## Key Takeaways  
${generatedNotes.keyTakeaways.map(takeaway => `• ${takeaway}`).join('\n')}
      `.trim();
      
      await navigator.clipboard.writeText(notesText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      
      toast({
        title: "Notes copied to clipboard",
        description: "All notes have been copied in markdown format",
      });
    }
  };

  const handleDownloadNotes = () => {
    if (generatedNotes) {
      const notesText = `
# AI Generated Notes
Generated on: ${generatedNotes.timestamp.toLocaleString()}

## Summary
${generatedNotes.summary}

## Key Points
${generatedNotes.bulletPoints.map(point => `• ${point}`).join('\n')}

## Key Takeaways  
${generatedNotes.keyTakeaways.map(takeaway => `• ${takeaway}`).join('\n')}
      `.trim();
      
      const blob = new Blob([notesText], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notes-${Date.now()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Notes downloaded",
        description: "Notes saved as markdown file",
      });
    }
  };

  const sampleTranscript = `Welcome to today's presentation on accessibility technology. We'll be discussing the importance of real-time captioning and translation services for inclusive communication. These tools help bridge language barriers and ensure that content is accessible to people with hearing difficulties. The latest advances in AI and speech recognition have made it possible to provide high-quality, real-time transcription services at no cost to users. This democratization of accessibility technology is crucial for creating more inclusive digital experiences.`;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          📝 AI Notes
          <Badge variant="secondary" className="bg-accent text-accent-foreground">
            Free LLM
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Generate structured notes and summaries from transcripts
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Sample Data Button */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputTranscript(sampleTranscript)}
          >
            Load Sample Transcript
          </Button>
        </div>

        {/* Input Transcript */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Transcript text:</label>
          <Textarea
            placeholder="Paste your transcript here..."
            value={inputTranscript}
            onChange={(e) => setInputTranscript(e.target.value)}
            className="min-h-[150px] resize-none"
            style={{ fontSize: `${fontSize}px` }}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {inputTranscript.length} characters • {inputTranscript.split(' ').length} words
            </span>
            <Button 
              onClick={handleGenerateNotes}
              disabled={isGenerating || !inputTranscript.trim()}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Notes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Generated Notes */}
        {generatedNotes && (
          <div className="flex-1 space-y-4 animate-fadeInUp">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Generated Notes
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyNotes}
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadNotes}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>

            <div className="space-y-4 overflow-y-auto" style={{ fontSize: `${fontSize}px` }}>
              {/* Summary */}
              <div className="space-y-2">
                <h4 className="font-medium text-accent-foreground">📋 Summary</h4>
                <p className="leading-relaxed bg-muted p-3 rounded-lg">
                  {generatedNotes.summary}
                </p>
              </div>

              <Separator />

              {/* Bullet Points */}
              <div className="space-y-2">
                <h4 className="font-medium text-accent-foreground">🔍 Key Points</h4>
                <ul className="space-y-2">
                  {generatedNotes.bulletPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 bg-muted p-3 rounded-lg">
                      <span className="text-accent font-bold mt-0.5">•</span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Key Takeaways */}
              <div className="space-y-2">
                <h4 className="font-medium text-accent-foreground">💡 Key Takeaways</h4>
                <ul className="space-y-2">
                  {generatedNotes.keyTakeaways.map((takeaway, index) => (
                    <li key={index} className="flex items-start gap-2 bg-accent text-accent-foreground p-3 rounded-lg">
                      <span className="font-bold mt-0.5">→</span>
                      <span className="leading-relaxed">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 text-xs text-muted-foreground">
              Generated on {generatedNotes.timestamp.toLocaleString()}
            </div>
          </div>
        )}

        {/* Status */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {generatedNotes ? 'Notes ready' : 'Waiting for transcript'}
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