import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts, createShortcut, SHORTCUT_PATTERNS } from '../useKeyboardShortcuts';

// Mock document.addEventListener and document.removeEventListener
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

Object.defineProperty(document, 'addEventListener', {
  value: mockAddEventListener,
  writable: true,
});

Object.defineProperty(document, 'removeEventListener', {
  value: mockRemoveEventListener,
  writable: true,
});

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should register event listener when enabled', () => {
    const mockAction = vi.fn();
    const shortcuts = [createShortcut('k', mockAction, 'Test shortcut', 'Test')];

    renderHook(() => useKeyboardShortcuts(shortcuts, { enabled: true }));

    expect(mockAddEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('should not register event listener when disabled', () => {
    const mockAction = vi.fn();
    const shortcuts = [createShortcut('k', mockAction, 'Test shortcut', 'Test')];

    renderHook(() => useKeyboardShortcuts(shortcuts, { enabled: false }));

    expect(mockAddEventListener).not.toHaveBeenCalled();
  });

  it('should clean up event listener on unmount', () => {
    const mockAction = vi.fn();
    const shortcuts = [createShortcut('k', mockAction, 'Test shortcut', 'Test')];

    const { unmount } = renderHook(() => useKeyboardShortcuts(shortcuts));

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});

describe('createShortcut', () => {
  it('should create a shortcut with default values', () => {
    const mockAction = vi.fn();
    const shortcut = createShortcut('k', mockAction, 'Test shortcut', 'Test');

    expect(shortcut).toEqual({
      key: 'k',
      action: mockAction,
      description: 'Test shortcut',
      category: 'Test',
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    });
  });

  it('should create a shortcut with modifiers', () => {
    const mockAction = vi.fn();
    const shortcut = createShortcut('k', mockAction, 'Test shortcut', 'Test', {
      ctrlKey: true,
      shiftKey: true,
    });

    expect(shortcut).toEqual({
      key: 'k',
      action: mockAction,
      description: 'Test shortcut',
      category: 'Test',
      ctrlKey: true,
      shiftKey: true,
      altKey: false,
      metaKey: false,
    });
  });
});

describe('SHORTCUT_PATTERNS', () => {
  it('should create search shortcut', () => {
    const mockAction = vi.fn();
    const shortcut = SHORTCUT_PATTERNS.SEARCH(mockAction);

    expect(shortcut.key).toBe('k');
    expect(shortcut.ctrlKey).toBe(true);
    expect(shortcut.description).toBe('Focus search');
    expect(shortcut.category).toBe('Navigation');
  });

  it('should create home shortcut', () => {
    const mockAction = vi.fn();
    const shortcut = SHORTCUT_PATTERNS.HOME(mockAction);

    expect(shortcut.key).toBe('h');
    expect(shortcut.ctrlKey).toBe(true);
    expect(shortcut.description).toBe('Go to homepage');
    expect(shortcut.category).toBe('Navigation');
  });

  it('should create escape shortcut', () => {
    const mockAction = vi.fn();
    const shortcut = SHORTCUT_PATTERNS.ESCAPE(mockAction);

    expect(shortcut.key).toBe('Escape');
    expect(shortcut.ctrlKey).toBe(false);
    expect(shortcut.description).toBe('Close modal/clear search');
    expect(shortcut.category).toBe('Navigation');
  });
});

