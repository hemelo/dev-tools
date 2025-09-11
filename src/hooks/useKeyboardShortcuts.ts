import { useEffect, useCallback, useRef } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  description: string;
  action: () => void;
  category: string;
  allowInInputs?: boolean; // New option to allow shortcuts in input fields
}

export interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  preventDefault?: boolean;
  debug?: boolean; // Add debug option
}

// Platform detection
const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
const isWindows = typeof navigator !== 'undefined' && /Win/.test(navigator.platform);

export const useKeyboardShortcuts = (
  shortcuts: KeyboardShortcut[],
  options: UseKeyboardShortcutsOptions = {}
) => {
  const { enabled = true, preventDefault = true, debug = false } = options;
  const shortcutsRef = useRef(shortcuts);

  // Update shortcuts ref when shortcuts change
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Debug logging
    if (debug) {
      console.log('Key pressed:', {
        key: event.key,
        code: event.code,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        target: event.target
      });
    }

    // Check if we're in an input field
    const target = event.target as HTMLElement;
    const isInputField = target && (
      target.tagName === 'INPUT' || 
      target.tagName === 'TEXTAREA' || 
      target.contentEditable === 'true' ||
      target.closest('[contenteditable="true"]') ||
      target.closest('[role="textbox"]') ||
      target.closest('[contenteditable]')
    );

    // Normalize the pressed key
    const pressedKey = event.key;
    const pressedKeyLower = pressedKey.toLowerCase();
    
    // Handle special keys
    const normalizedKey = (() => {
      switch (pressedKey) {
        case ' ': return 'Space';
        case 'ArrowUp': return 'ArrowUp';
        case 'ArrowDown': return 'ArrowDown';
        case 'ArrowLeft': return 'ArrowLeft';
        case 'ArrowRight': return 'ArrowRight';
        case 'Enter': return 'Enter';
        case 'Escape': return 'Escape';
        case 'Tab': return 'Tab';
        case 'Backspace': return 'Backspace';
        case 'Delete': return 'Delete';
        case 'Home': return 'Home';
        case 'End': return 'End';
        case 'PageUp': return 'PageUp';
        case 'PageDown': return 'PageDown';
        default: return pressedKey;
      }
    })();

    // Find matching shortcut
    const matchingShortcut = shortcutsRef.current.find(shortcut => {
      // Check if shortcut is allowed in input fields
      if (isInputField && !shortcut.allowInInputs) {
        return false;
      }

      // Normalize shortcut key
      const shortcutKey = shortcut.key.toLowerCase();
      const normalizedShortcutKey = shortcutKey === ' ' ? 'space' : shortcutKey;
      const normalizedPressedKey = normalizedKey.toLowerCase();

      // Key matching (case insensitive)
      const keyMatches = normalizedShortcutKey === normalizedPressedKey;

      // Modifier matching with cross-platform support
      const isCtrlPressed = event.ctrlKey;
      const isMetaPressed = event.metaKey;
      const isShiftPressed = event.shiftKey;
      const isAltPressed = event.altKey;

      // For cross-platform compatibility:
      // - On Mac: metaKey (Cmd) is primary, ctrlKey is secondary
      // - On Windows/Linux: ctrlKey is primary
      const isModifierPressed = isMac 
        ? (shortcut.metaKey && isMetaPressed) || (shortcut.ctrlKey && isCtrlPressed)
        : (shortcut.ctrlKey && isCtrlPressed) || (shortcut.metaKey && isMetaPressed);

      const ctrlMatches = shortcut.ctrlKey ? isCtrlPressed : !isCtrlPressed;
      const metaMatches = shortcut.metaKey ? isMetaPressed : !isMetaPressed;
      const shiftMatches = shortcut.shiftKey ? isShiftPressed : !isShiftPressed;
      const altMatches = shortcut.altKey ? isAltPressed : !isAltPressed;

      // For cross-platform, we need to check if the appropriate modifier is pressed
      const modifierMatches = isMac 
        ? (shortcut.metaKey ? isMetaPressed : !isMetaPressed) && 
          (shortcut.ctrlKey ? isCtrlPressed : !isCtrlPressed)
        : (shortcut.ctrlKey ? isCtrlPressed : !isCtrlPressed) && 
          (shortcut.metaKey ? isMetaPressed : !isMetaPressed);

      return keyMatches && modifierMatches && shiftMatches && altMatches;
    });

    if (matchingShortcut) {
      if (debug) {
        console.log('Shortcut matched:', matchingShortcut);
      }
      
      if (preventDefault) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      try {
        matchingShortcut.action();
      } catch (error) {
        console.error('Error executing shortcut action:', error);
      }
    }
  }, [enabled, preventDefault, debug]);

  useEffect(() => {
    if (!enabled) return;

    // Use capture phase to ensure we get the event before other handlers
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [handleKeyDown, enabled]);

  return {
    shortcuts: shortcutsRef.current,
    isMac,
    isWindows,
  };
};

// Helper function to create keyboard shortcuts
export const createShortcut = (
  key: string,
  action: () => void,
  description: string,
  category: string,
  modifiers: {
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
    allowInInputs?: boolean;
  } = {}
): KeyboardShortcut => ({
  key,
  action,
  description,
  category,
  ...modifiers,
});

// Cross-platform shortcut helper
const createCrossPlatformShortcut = (
  key: string,
  action: () => void,
  description: string,
  category: string,
  options: {
    allowInInputs?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
  } = {}
): KeyboardShortcut => {
  // On Mac, use Cmd (metaKey), on Windows/Linux use Ctrl
  const modifiers = isMac 
    ? { metaKey: true, ...options }
    : { ctrlKey: true, ...options };
  
  return createShortcut(key, action, description, category, modifiers);
};

// Common shortcut patterns - Simplified
export const SHORTCUT_PATTERNS = {
  // Navigation
  SEARCH: (action: () => void) => createShortcut('/', action, 'Focus search', 'Navigation', { allowInInputs: false }),
  
  // Category navigation
  NEXT_CATEGORY: (action: () => void) => createCrossPlatformShortcut('j', action, 'Next category', 'Navigation'),
  PREV_CATEGORY: (action: () => void) => createCrossPlatformShortcut('k', action, 'Previous category', 'Navigation'),
  
  // Help - Use Cmd+i for Mac, Ctrl+i for Windows (no Safari conflict)
  HELP: (action: () => void) => createCrossPlatformShortcut('i', action, 'Show keyboard shortcuts', 'Help', { allowInInputs: true }),
} as const;
