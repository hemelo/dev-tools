import { create } from 'zustand';

interface UIState {
  isShortcutIndicatorVisible: boolean;
  setShortcutIndicatorVisible: (visible: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isShortcutIndicatorVisible: false,
  setShortcutIndicatorVisible: (visible) => set({ isShortcutIndicatorVisible: visible }),
}));
