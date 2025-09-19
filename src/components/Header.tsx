import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">🎤</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Live Accessibility Dubber</h1>
                <p className="text-sm text-muted-foreground">Free Version</p>
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
                className="flex items-center gap-2"
              >
                <span>{panel.icon}</span>
                <span>{panel.label}</span>
              </Button>
            ))}
          </nav>

          {/* Connection Status */}
          <div className="flex items-center gap-3">
            <Badge 
              variant="secondary" 
              className={`${getStatusColor()} transition-colors duration-200`}
            >
              {getStatusText()}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
};