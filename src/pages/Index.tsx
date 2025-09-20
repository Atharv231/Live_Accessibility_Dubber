import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { LiveCaptionsPanel } from '@/components/LiveCaptionsPanel';
import { TranslationPanel } from '@/components/TranslationPanel';
import { NotesPanel } from '@/components/NotesPanel';
import { AccessibilityControls } from '@/components/AccessibilityControls';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ActivePanel = 'captions' | 'translation' | 'notes';

const Index = () => {
  const [activePanel, setActivePanel] = useState<ActivePanel>('captions');
  const [isConnected, setIsConnected] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  // Mock connection status for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnected(true);
      toast({
        title: "Connected",
        description: "Live captions are now active",
        variant: "default",
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [toast]);

  // Handle dark mode toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const panels = [
    { id: 'captions' as const, label: 'Live Captions', icon: '🎤' },
    { id: 'translation' as const, label: 'Translation', icon: '🌐' },
    { id: 'notes' as const, label: 'AI Notes', icon: '📝' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 ai-background-grid opacity-30"></div>
      <div className="absolute inset-0 ai-neural-network opacity-20"></div>
      <div className="absolute inset-0 ai-particles opacity-10"></div>
      
      <Header 
        isConnected={isConnected}
        activePanel={activePanel}
        panels={panels}
        onPanelChange={setActivePanel}
      />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="h-full transform transition-all duration-500 hover:scale-[1.01]">
              {activePanel === 'captions' && (
                <LiveCaptionsPanel 
                  isConnected={isConnected}
                  fontSize={fontSize}
                />
              )}
              {activePanel === 'translation' && (
                <TranslationPanel fontSize={fontSize} />
              )}
              {activePanel === 'notes' && (
                <NotesPanel fontSize={fontSize} />
              )}
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6 transform transition-all duration-300">
            <div className="glass-effect ai-glow rounded-lg">
              <AccessibilityControls
                fontSize={fontSize}
                onFontSizeChange={setFontSize}
                isDarkMode={isDarkMode}
                onDarkModeToggle={setIsDarkMode}
              />
            </div>
            
            {/* Panel Navigation for Mobile */}
            <div className="lg:hidden">
              <nav className="glass-effect ai-glow border border-primary/20 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-foreground">Panels</h3>
                <div className="space-y-2">
                  {panels.map((panel) => (
                    <button
                      key={panel.id}
                      onClick={() => setActivePanel(panel.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-300 transform hover:scale-105 ${
                        activePanel === panel.id
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      <span className="text-lg">{panel.icon}</span>
                      <span className="font-medium">{panel.label}</span>
                    </button>
                  ))}
                </div>
              </nav>
            </div>
            
            {/* AI Status Indicator */}
            <div className="glass-effect ai-glow border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary animate-pulse" />
                AI Status
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Speech Recognition</span>
                  <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
                    {isConnected ? "Active" : "Initializing"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Translation Engine</span>
                  <Badge variant="secondary" className="text-xs">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">AI Notes</span>
                  <Badge variant="secondary" className="text-xs">Ready</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-primary/10 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};

export default Index;