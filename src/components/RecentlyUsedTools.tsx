import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Trash2, 
  MoreHorizontal, 
  ArrowRight,
  History,
  TrendingUp
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

interface RecentlyUsedToolsProps {
  onToolClick?: (toolId: string) => void;
  showStats?: boolean;
  maxItems?: number;
}

export const RecentlyUsedTools = ({ 
  onToolClick, 
  showStats = false, 
  maxItems = 5 
}: RecentlyUsedToolsProps) => {
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
    loadTools();
  }, [viewMode, maxItems]);

  const handleToolClick = (toolId: string) => {
    if (onToolClick) {
      onToolClick(toolId);
    } else {
      const toolUrl = getToolUrl(toolId);
      navigate(toolUrl);
    }
  };

  const handleClearHistory = () => {
    clearToolHistory();
    loadTools();
  };

  const handleRemoveTool = (toolId: string) => {
    removeFromToolHistory(toolId);
    loadTools();
  };

  if (recentTools.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">
              {viewMode === 'recent' ? 'Recently Used' : 'Most Used'} Tools
            </CardTitle>
            {showStats && (
              <Badge variant="secondary" className="ml-2">
                {stats.totalTools} tools
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border">
              <Button
                variant={viewMode === 'recent' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('recent')}
                className="rounded-r-none"
              >
                <Clock className="h-4 w-4 mr-1" />
                Recent
              </Button>
              <Button
                variant={viewMode === 'most-used' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('most-used')}
                className="rounded-l-none"
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Popular
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleClearHistory}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear History
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardDescription>
          {viewMode === 'recent' 
            ? 'Your recently accessed tools'
            : 'Your most frequently used tools'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recentTools.map((tool) => (
            <div
              key={tool.toolId}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
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
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToolClick(tool.toolId)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleToolClick(tool.toolId)}>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Open Tool
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleRemoveTool(tool.toolId)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove from History
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
        
        {showStats && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Uses:</span>
                <span className="ml-2 font-medium">{stats.totalUses}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Avg per Tool:</span>
                <span className="ml-2 font-medium">{stats.averageUsesPerTool}</span>
              </div>
            </div>
            {stats.mostUsedTool && (
              <div className="mt-2 text-sm">
                <span className="text-muted-foreground">Most Used:</span>
                <span className="ml-2 font-medium">{stats.mostUsedTool.toolName}</span>
                <span className="ml-1 text-muted-foreground">
                  ({stats.mostUsedTool.useCount} uses)
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
