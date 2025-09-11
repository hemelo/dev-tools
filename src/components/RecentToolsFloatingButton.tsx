import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, Clock } from 'lucide-react';
import { getRecentlyUsedTools } from '@/lib/toolHistory';
import { useUIStore } from '@/stores/uiStore';

interface RecentToolsFloatingButtonProps {
  onClick: () => void;
  className?: string;
}

export const RecentToolsFloatingButton = ({ 
  onClick, 
  className = "" 
}: RecentToolsFloatingButtonProps) => {
  const [recentToolsCount, setRecentToolsCount] = useState(0);
  const { isShortcutIndicatorVisible } = useUIStore();

  useEffect(() => {
    const recentTools = getRecentlyUsedTools(10);
    setRecentToolsCount(recentTools.length);
  }, []);

  // Don't show the button if there are no recent tools
  if (recentToolsCount === 0) {
    return null;
  }

  // Dynamic positioning based on shortcut indicator visibility
  const bottomPosition = isShortcutIndicatorVisible ? 'bottom-48' : 'bottom-4';
  
  return (
    <div className={`fixed ${bottomPosition} right-4 z-50 transition-all duration-300 ${className}`}>
      <Button
        onClick={onClick}
        className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 text-primary-foreground group relative"
        size="icon"
        aria-label="Open recent tools"
      >
        <History className="h-5 w-5 group-hover:scale-110 transition-transform" />
        {recentToolsCount > 0 && (
          <Badge 
            variant="secondary" 
            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-background text-foreground border-2 border-primary"
          >
            {recentToolsCount}
          </Badge>
        )}
      </Button>
    </div>
  );
};
