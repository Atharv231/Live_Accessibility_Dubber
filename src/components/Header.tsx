import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Sparkles, Bot } from 'lucide-react';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

interface HeaderProps {
  isConnected: boolean;
  activePanel: string;
  panels: Array<{ id: string; label: string; icon: string }>;
  onPanelChange: (panel: any) => void;
}

export const Header = ({ isConnected, activePanel, panels, onPanelChange }: HeaderProps) => {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');

  useEffect(() => {
    if (isConnected) {
      setStatus('connected');
    } else {
      setStatus('connecting');
    }
  }, [isConnected]);

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-success text-success-foreground';
      case 'connecting':
        return 'bg-warning text-warning-foreground animate-pulse';
      case 'disconnected':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return '🟢 Connected';
      case 'connecting':
        return '🟡 Connecting...';
      case 'disconnected':
        return '🔴 Disconnected';
      default:
        return 'Unknown';
    }
  };

  return (
    <header className="border-b border-border bg-gradient-to-r from-card via-card/95 to-card backdrop-blur-sm relative overflow-hidden">
      {/* AI Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 animate-gradient-x"></div>
      <div className="absolute inset-0 ai-dots-pattern opacity-20"></div>
      
      <div className="container mx-auto px-4 py-4 max-w-6xl relative z-10">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative group">
                {/* Main logo container */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-accent to-primary p-0.5 animate-gradient-rotate">
                  <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                    <Brain className="w-6 h-6 text-primary animate-pulse" />
                  </div>
                </div>
                {/* Floating AI icons */}
                <Zap className="w-3 h-3 text-accent absolute -top-1 -right-1 animate-bounce" />
                <Sparkles className="w-2 h-2 text-primary absolute -bottom-1 -left-1 animate-ping" />
                <Bot className="w-2 h-2 text-accent absolute top-0 left-0 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-x">
                  Live Accessibility Dubber
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">AI-Powered Free Version</p>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-accent rounded-full animate-ping"></div>
                    <div className="w-1 h-1 bg-primary rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 bg-accent rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-2">
            {panels.map((panel) => (
              <Button
                key={panel.id}
                variant={activePanel === panel.id ? "default" : "ghost"}
                onClick={() => onPanelChange(panel.id)}
                className={`flex items-center gap-2 transition-all duration-300 ${
                  activePanel === panel.id 
                    ? 'bg-gradient-to-r from-primary to-accent shadow-lg scale-105' 
                    : 'hover:bg-primary/5 hover:scale-105'
                }`}
              >
                <span className="text-lg">{panel.icon}</span>
                <span>{panel.label}</span>
                {activePanel === panel.id && <Sparkles className="w-3 h-3 animate-spin" />}
              </Button>
            ))}
          </nav>

          {/* Enhanced Connection Status */}
          <div className="flex items-center gap-3">
            <Badge 
              variant="secondary" 
              className={`${getStatusColor()} transition-all duration-300 transform hover:scale-105 shadow-lg relative overflow-hidden`}
            >
              <div className="relative z-10 flex items-center gap-2">
                {status === 'connected' && <Brain className="w-3 h-3 animate-pulse" />}
                {status === 'connecting' && <Zap className="w-3 h-3 animate-spin" />}
                {status === 'disconnected' && <Bot className="w-3 h-3" />}
                {getStatusText()}
              </div>
              {status === 'connected' && (
                <div className="absolute inset-0 bg-gradient-to-r from-success/20 to-accent/20 animate-pulse"></div>
              )}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
};