import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Trash2, 
  MoreHorizontal, 
  ArrowRight,
  History,
  TrendingUp,
  X
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  ToolHistoryEntry, 
  getRecentlyUsedTools, 
  getMostUsedTools, 
  clearToolHistory,
  removeFromToolHistory,
  getToolHistoryStats
} from '@/lib/toolHistory';
import { getToolUrl } from '@/lib/toolUtils';
import { useNavigate } from 'react-router-dom';

interface RecentToolsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToolClick?: (toolId: string) => void;
  showStats?: boolean;
  maxItems?: number;
}

export const RecentToolsModal = ({ 
  open, 
  onOpenChange, 
  onToolClick, 
  showStats = true, 
  maxItems = 10 
}: RecentToolsModalProps) => {
  const navigate = useNavigate();
  const [recentTools, setRecentTools] = useState<ToolHistoryEntry[]>([]);
  const [viewMode, setViewMode] = useState<'recent' | 'most-used'>('recent');
  const [stats, setStats] = useState(getToolHistoryStats());

  const loadTools = () => {
    const tools = viewMode === 'recent' 
      ? getRecentlyUsedTools(maxItems)
      : getMostUsedTools(maxItems);
    setRecentTools(tools);
    setStats(getToolHistoryStats());
  };

  useEffect(() => {
    if (open) {
      loadTools();
    }
  }, [open, viewMode, maxItems]);

  const handleToolClick = (toolId: string) => {
    if (onToolClick) {
      onToolClick(toolId);
    } else {
      const toolUrl = getToolUrl(toolId);
      navigate(toolUrl);
    }
    onOpenChange(false); // Close modal after tool selection
  };

  const handleClearHistory = () => {
    clearToolHistory();
    loadTools();
  };

  const handleRemoveTool = (toolId: string) => {
    removeFromToolHistory(toolId);
    loadTools();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="pr-12">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-primary" />
              <div>
                <DialogTitle>Recent Tools</DialogTitle>
                <DialogDescription>
                  {viewMode === 'recent' 
                    ? 'Your recently accessed tools'
                    : 'Your most frequently used tools'
                  }
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'recent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('recent')}
                className="gap-2"
              >
                <Clock className="h-4 w-4" />
                Recent
              </Button>
              <Button
                variant={viewMode === 'most-used' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('most-used')}
                className="gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Most Used
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto max-h-96">
          {recentTools.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 rounded-full bg-muted w-fit mx-auto mb-4">
                <History className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No recent tools</h3>
              <p className="text-muted-foreground">
                Start using tools to see them appear here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTools.map((tool) => (
                <div
                  key={tool.toolId}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{tool.toolName}</h4>
                        <Badge variant="outline" className="text-xs">
                          {tool.toolCategory}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(tool.lastUsed).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {tool.useCount} {tool.useCount === 1 ? 'use' : 'uses'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToolClick(tool.toolId)}
                      className="gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      Open Tool
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRemoveTool(tool.toolId)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove from history
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showStats && stats.totalTools > 0 && (
          <div className="border-t pt-4 flex-shrink-0">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>Total tools used: {stats.totalTools}</span>
                <span>Total uses: {stats.totalUses}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearHistory}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Clear History
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
