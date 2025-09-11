import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Keyboard, HelpCircle, X } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  description: string;
  category: string;
}

interface KeyboardShortcutIndicatorProps {
  shortcuts?: Shortcut[];
  onShowHelp?: () => void;
}

export const KeyboardShortcutIndicator = ({ 
  shortcuts = [], 
  onShowHelp 
}: KeyboardShortcutIndicatorProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [platform, setPlatform] = useState<'mac' | 'windows' | 'unknown'>('unknown');
  const { setShortcutIndicatorVisible } = useUIStore();
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cookie management functions
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  const setCookie = (name: string, value: string, days: number = 30) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  const startHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      if (!isHovered) {
        console.log('Auto-hiding shortcut indicator...'); // Debug log
        setIsVisible(false);
        setShortcutIndicatorVisible(false);
      }
    }, 5000); // Show for 5 seconds
  }, [isHovered, setShortcutIndicatorVisible]);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const handleDismiss = () => {
    console.log('Closing shortcut indicator...'); // Debug log
    clearHideTimer();
    setIsVisible(false);
    setShortcutIndicatorVisible(false);
    setCookie('shortcut-indicator-dismissed', 'true', 30); // Dismiss for 30 days
    console.log('Shortcut indicator dismissed, cookie set'); // Debug log
  };

  // Debug function to clear cookie (for testing)
  const clearDismissalCookie = () => {
    document.cookie = 'shortcut-indicator-dismissed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    console.log('Cookie cleared, refreshing page to test...');
    window.location.reload();
  };

  useEffect(() => {
    // Detect platform
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    const isWindows = /Win/.test(navigator.platform);
    
    if (isMac) {
      setPlatform('mac');
    } else if (isWindows) {
      setPlatform('windows');
    }

    // Check if user has dismissed the indicator before
    const isDismissed = getCookie('shortcut-indicator-dismissed');
    console.log('Cookie dismissed status:', isDismissed); // Debug log
    
    if (!isDismissed) {
      // Show indicator briefly on page load
      console.log('Showing shortcut indicator...'); // Debug log
      setIsVisible(true);
      setShortcutIndicatorVisible(true);
      startHideTimer();
      
      return () => clearHideTimer();
    } else {
      console.log('Shortcut indicator was previously dismissed'); // Debug log
      setShortcutIndicatorVisible(false);
    }
  }, [setShortcutIndicatorVisible, startHideTimer, clearHideTimer]);

  // Handle hover state changes
  useEffect(() => {
    if (isVisible) {
      if (isHovered) {
        // Clear timer when hovering
        clearHideTimer();
      } else {
        // Restart timer when not hovering
        startHideTimer();
      }
    }
  }, [isHovered, isVisible, startHideTimer, clearHideTimer]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => clearHideTimer();
  }, [clearHideTimer]);

  const getModifierSymbol = (shortcut: Shortcut) => {
    if (platform === 'mac') {
      if (shortcut.metaKey) return '⌘';
      if (shortcut.ctrlKey) return '⌃';
    } else {
      if (shortcut.ctrlKey || shortcut.metaKey) return 'Ctrl';
    }
    if (shortcut.shiftKey) return '⇧';
    if (shortcut.altKey) return '⌥';
    return '';
  };

  const getKeyDisplay = (shortcut: Shortcut) => {
    const modifier = getModifierSymbol(shortcut);
    const key = shortcut.key === ' ' ? 'Space' : shortcut.key;
    return modifier ? `${modifier}${platform === 'mac' ? '' : '+'}${key}` : key;
  };

  // Add safety check for shortcuts array
  const safeShortcuts = Array.isArray(shortcuts) ? shortcuts : [];
  const mainShortcuts = safeShortcuts.filter(s => 
    s && s.category && (s.category === 'Navigation' || s.category === 'Tools')
  ).slice(0, 4);

  // Don't render if no shortcuts available
  if (safeShortcuts.length === 0) return null;
  
  console.log('Render check - isVisible:', isVisible, 'onShowHelp:', !!onShowHelp); // Debug log
  
  if (!isVisible || !onShowHelp) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3 max-w-sm relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Close button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDismiss();
          }}
          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-background border shadow-sm hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close keyboard shortcuts"
        >
          <X className="h-3 w-3" />
        </button>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Keyboard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Keyboard Shortcuts</span>
            <Badge variant="secondary" className="text-xs">
              {platform === 'mac' ? 'Mac' : platform === 'windows' ? 'Windows' : 'All'}
            </Badge>
          </div>
          {onShowHelp && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowHelp}
              className="h-6 w-6 p-0"
            >
              <HelpCircle className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        <div className="space-y-1">
          {mainShortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{shortcut.description}</span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
                {getKeyDisplay(shortcut)}
              </kbd>
            </div>
          ))}
        </div>
        
        {onShowHelp && (
          <div className="mt-2 pt-2 border-t space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowHelp}
              className="w-full text-xs h-6"
            >
              View All Shortcuts
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export const KeyboardShortcutsButton = ({ 
  onClick, 
  className = "" 
}: { 
  onClick: () => void; 
  className?: string; 
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={`gap-2 ${className}`}
    >
      <Keyboard className="h-4 w-4" />
      Shortcuts
    </Button>
  );
};