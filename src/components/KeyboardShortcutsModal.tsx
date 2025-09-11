import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Keyboard, 
  Search, 
  ArrowDown, 
  ArrowUp, 
  HelpCircle
} from 'lucide-react';
import { KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shortcuts: KeyboardShortcut[];
}

const getKeyIcon = (key: string) => {
  switch (key.toLowerCase()) {
    case '/':
      return <Search className="h-3 w-3" />;
    case 'j':
      return <ArrowDown className="h-3 w-3" />;
    case 'k':
      return <ArrowUp className="h-3 w-3" />;
    case 'i':
      return <HelpCircle className="h-3 w-3" />;
    default:
      return null;
  }
};

const formatKey = (key: string) => {
  const specialKeys: Record<string, string> = {
    ' ': 'Space',
    'Escape': 'Esc',
    'Enter': 'Enter',
    'ArrowDown': '↓',
    'ArrowUp': '↑',
    'ArrowLeft': '←',
    'ArrowRight': '→',
    'F1': 'F1',
    'F2': 'F2',
    'F3': 'F3',
    'F4': 'F4',
    'F5': 'F5',
    'F6': 'F6',
    'F7': 'F7',
    'F8': 'F8',
    'F9': 'F9',
    'F10': 'F10',
    'F11': 'F11',
    'F12': 'F12',
  };

  return specialKeys[key] || key.toUpperCase();
};

const KeyDisplay = ({ shortcut }: { shortcut: KeyboardShortcut }) => {
  const modifiers = [];
  if (shortcut.ctrlKey || shortcut.metaKey) {
    modifiers.push(navigator.platform.includes('Mac') ? '⌘' : 'Ctrl');
  }
  if (shortcut.altKey) {
    modifiers.push('Alt');
  }
  if (shortcut.shiftKey) {
    modifiers.push('Shift');
  }

  return (
    <div className="flex items-center gap-1">
      {modifiers.map((mod, index) => (
        <div key={index} className="flex items-center gap-1">
          <Badge variant="outline" className="text-xs font-mono">
            {mod}
          </Badge>
          {index < modifiers.length - 1 && <span className="text-muted-foreground">+</span>}
        </div>
      ))}
      {modifiers.length > 0 && <span className="text-muted-foreground">+</span>}
      <Badge variant="outline" className="text-xs font-mono flex items-center gap-1">
        {getKeyIcon(shortcut.key)}
        {formatKey(shortcut.key)}
      </Badge>
    </div>
  );
};

export const KeyboardShortcutsModal = ({ 
  open, 
  onOpenChange, 
  shortcuts 
}: KeyboardShortcutsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Simple shortcuts to navigate DevTools Hub efficiently
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getKeyIcon(shortcut.key)}
                <div>
                  <p className="font-medium">{shortcut.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {shortcut.category === 'Navigation' ? 'Navigation' : 'Help'}
                  </p>
                </div>
              </div>
              <KeyDisplay shortcut={shortcut} />
            </div>
          ))}
        </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Press <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded">⌘i</kbd> (Mac) or <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded">Ctrl+i</kbd> (Windows) to toggle this help
                  </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
