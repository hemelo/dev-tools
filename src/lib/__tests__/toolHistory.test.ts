import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  addToToolHistory, 
  getToolHistory, 
  clearToolHistory, 
  getRecentlyUsedTools,
  getMostUsedTools,
  removeFromToolHistory
} from '../toolHistory';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('toolHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('addToToolHistory', () => {
    it('should add a new tool to history', () => {
      addToToolHistory('json', 'JSON Formatter', 'Text');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'devtools_tool_history',
        expect.stringContaining('"toolId":"json"')
      );
    });

    it('should update existing tool in history', () => {
      const existingHistory = JSON.stringify([{
        toolId: 'json',
        toolName: 'JSON Formatter',
        toolCategory: 'Text',
        lastUsed: 1000,
        useCount: 1
      }]);
      
      localStorageMock.getItem.mockReturnValue(existingHistory);
      
      addToToolHistory('json', 'JSON Formatter', 'Text');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'devtools_tool_history',
        expect.stringContaining('"useCount":2')
      );
    });
  });

  describe('getToolHistory', () => {
    it('should return empty array when no history exists', () => {
      const history = getToolHistory();
      expect(history).toEqual([]);
    });

    it('should return parsed history when it exists', () => {
      const mockHistory = [{
        toolId: 'json',
        toolName: 'JSON Formatter',
        toolCategory: 'Text',
        lastUsed: 1000,
        useCount: 1
      }];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockHistory));
      
      const history = getToolHistory();
      expect(history).toEqual(mockHistory);
    });
  });

  describe('clearToolHistory', () => {
    it('should remove history from localStorage', () => {
      clearToolHistory();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('devtools_tool_history');
    });
  });

  describe('removeFromToolHistory', () => {
    it('should remove specific tool from history', () => {
      const existingHistory = [{
        toolId: 'json',
        toolName: 'JSON Formatter',
        toolCategory: 'Text',
        lastUsed: 1000,
        useCount: 1
      }, {
        toolId: 'uuid',
        toolName: 'UUID Generator',
        toolCategory: 'Generator',
        lastUsed: 2000,
        useCount: 2
      }];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingHistory));
      
      removeFromToolHistory('json');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'devtools_tool_history',
        JSON.stringify([{
          toolId: 'uuid',
          toolName: 'UUID Generator',
          toolCategory: 'Generator',
          lastUsed: 2000,
          useCount: 2
        }])
      );
    });
  });
});
