import { create } from 'zustand'

type ViewState = '3d' | 'timeline' | 'gallery' | 'messages';

interface AppState {
  language: 'id' | 'en' | 'ko';
  setLanguage: (lang: 'id' | 'en' | 'ko') => void;
  isAudioOn: boolean;
  toggleAudio: () => void;
  hasEnteredCapsule: boolean;
  enterCapsule: () => void;
  activeView: ViewState;
  setActiveView: (view: ViewState) => void;
  isEnding: boolean;
  triggerEnding: () => void;
  resetCapsule: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: 'id',
  setLanguage: (lang) => set({ language: lang }),
  isAudioOn: false,
  toggleAudio: () => set((state) => ({ isAudioOn: !state.isAudioOn })),
  hasEnteredCapsule: false,
  enterCapsule: () => set({ hasEnteredCapsule: true }),
  activeView: '3d',
  setActiveView: (view) => set({ activeView: view }),
  isEnding: false,
  triggerEnding: () => set({ isEnding: true }),
  resetCapsule: () => set({ hasEnteredCapsule: false, isEnding: false, activeView: '3d' }),
  isDarkMode: false,
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode }))
}))