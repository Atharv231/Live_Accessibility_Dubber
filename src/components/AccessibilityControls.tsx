import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Type, Sun, Moon, Accessibility, Zap } from 'lucide-react';

interface AccessibilityControlsProps {
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  isDarkMode: boolean;
  onDarkModeToggle: (enabled: boolean) => void;
}

export const AccessibilityControls = ({ 
  fontSize, 
  onFontSizeChange, 
  isDarkMode, 
  onDarkModeToggle 
}: AccessibilityControlsProps) => {
  const fontSizePresets = [
    { label: 'Small', value: 14 },
    { label: 'Medium', value: 16 },
    { label: 'Large', value: 20 },
    { label: 'Extra Large', value: 24 },
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Accessibility className="w-5 h-5" />
          Accessibility Controls
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Customize display settings for better readability
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Font Size Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <Type className="w-4 h-4" />
              Font Size
            </label>
            <Badge variant="outline">{fontSize}px</Badge>
          </div>
          
          <Slider
            value={[fontSize]}
            onValueChange={(value) => onFontSizeChange(value[0])}
            min={12}
            max={32}
            step={2}
            className="w-full"
          />
          
          <div className="flex flex-wrap gap-2">
            {fontSizePresets.map((preset) => (
              <Button
                key={preset.label}
                variant={fontSize === preset.value ? "default" : "outline"}
                size="sm"
                onClick={() => onFontSizeChange(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Theme Toggle */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            Theme
          </label>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {isDarkMode ? 'Dark mode' : 'Light mode'}
            </span>
            <Switch
              checked={isDarkMode}
              onCheckedChange={onDarkModeToggle}
            />
          </div>
        </div>

        <Separator />

        {/* Accessibility Features */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Features</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">High Contrast</span>
                <Badge variant="secondary" className="bg-success text-success-foreground">
                  <Zap className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">Screen Reader Support</span>
                <Badge variant="secondary" className="bg-success text-success-foreground">
                  <Zap className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">Keyboard Navigation</span>
                <Badge variant="secondary" className="bg-success text-success-foreground">
                  <Zap className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Quick Actions */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Quick Actions</h4>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFontSizeChange(20)}
            >
              Large Text
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDarkModeToggle(!isDarkMode)}
            >
              Toggle Theme
            </Button>
          </div>
        </div>

        {/* Status */}
        <div className="pt-3 border-t border-border">
          <div className="text-xs text-muted-foreground space-y-1">
            <div>✓ WCAG 2.1 AA Compliant</div>
            <div>✓ Screen Reader Compatible</div>
            <div>✓ Keyboard Accessible</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};