import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { LiveCaptionsPanel } from '@/components/LiveCaptionsPanel';
import { TranslationPanel } from '@/components/TranslationPanel';
import { NotesPanel } from '@/components/NotesPanel';
import { AccessibilityControls } from '@/components/AccessibilityControls';
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
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        isConnected={isConnected}
        activePanel={activePanel}
        panels={panels}
        onPanelChange={setActivePanel}
      />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="h-full">
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

          {/* Sidebar */}
          <div className="space-y-6">
            <AccessibilityControls
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
              isDarkMode={isDarkMode}
              onDarkModeToggle={setIsDarkMode}
            />
            
            {/* Panel Navigation for Mobile */}
            <div className="lg:hidden">
              <nav className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Panels</h3>
                <div className="space-y-2">
                  {panels.map((panel) => (
                    <button
                      key={panel.id}
                      onClick={() => setActivePanel(panel.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                        activePanel === panel.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      <span>{panel.icon}</span>
                      <span>{panel.label}</span>
                    </button>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;