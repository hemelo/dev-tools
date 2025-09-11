export interface ToolHistoryEntry {
  toolId: string;
  toolName: string;
  toolCategory: string;
  lastUsed: number; // timestamp
  useCount: number;
}

const HISTORY_STORAGE_KEY = 'devtools_tool_history';
const MAX_HISTORY_ENTRIES = 10;

/**
 * Get tool history from localStorage
 */
export const getToolHistory = (): ToolHistoryEntry[] => {
  try {
    const history = localStorage.getItem(HISTORY_STORAGE_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error loading tool history:', error);
    return [];
  }
};

/**
 * Save tool history to localStorage
 */
export const saveToolHistory = (history: ToolHistoryEntry[]): void => {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving tool history:', error);
  }
};

/**
 * Add a tool to history or update existing entry
 */
export const addToToolHistory = (
  toolId: string,
  toolName: string,
  toolCategory: string
): void => {
  const history = getToolHistory();
  const now = Date.now();
  
  // Find existing entry
  const existingIndex = history.findIndex(entry => entry.toolId === toolId);
  
  if (existingIndex >= 0) {
    // Update existing entry
    history[existingIndex] = {
      toolId,
      toolName,
      toolCategory,
      lastUsed: now,
      useCount: history[existingIndex].useCount + 1
    };
  } else {
    // Add new entry
    history.unshift({
      toolId,
      toolName,
      toolCategory,
      lastUsed: now,
      useCount: 1
    });
  }
  
  // Sort by lastUsed (most recent first) and limit entries
  const sortedHistory = history
    .sort((a, b) => b.lastUsed - a.lastUsed)
    .slice(0, MAX_HISTORY_ENTRIES);
  
  saveToolHistory(sortedHistory);
};

/**
 * Remove a tool from history
 */
export const removeFromToolHistory = (toolId: string): void => {
  const history = getToolHistory();
  const filteredHistory = history.filter(entry => entry.toolId !== toolId);
  saveToolHistory(filteredHistory);
};

/**
 * Clear all tool history
 */
export const clearToolHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing tool history:', error);
  }
};

/**
 * Get recently used tools (sorted by last used)
 */
export const getRecentlyUsedTools = (limit: number = 5): ToolHistoryEntry[] => {
  const history = getToolHistory();
  return history.slice(0, limit);
};

/**
 * Get most used tools (sorted by use count)
 */
export const getMostUsedTools = (limit: number = 5): ToolHistoryEntry[] => {
  const history = getToolHistory();
  return history
    .sort((a, b) => b.useCount - a.useCount)
    .slice(0, limit);
};

/**
 * Check if a tool is in history
 */
export const isToolInHistory = (toolId: string): boolean => {
  const history = getToolHistory();
  return history.some(entry => entry.toolId === toolId);
};

/**
 * Get tool history statistics
 */
export const getToolHistoryStats = () => {
  const history = getToolHistory();
  const totalTools = history.length;
  const totalUses = history.reduce((sum, entry) => sum + entry.useCount, 0);
  const mostUsedTool = history.length > 0 
    ? history.reduce((prev, current) => 
        prev.useCount > current.useCount ? prev : current
      )
    : null;
  
  return {
    totalTools,
    totalUses,
    mostUsedTool,
    averageUsesPerTool: totalTools > 0 ? Math.round(totalUses / totalTools) : 0
  };
};

