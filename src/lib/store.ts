import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Character {
  name: string;
  description: string;
}

export interface StoryState {
  sessionId: string; // Used for saving/loading instead of character name
  title: string;
  cast: Character[];
  setting: string;
  hiddenHealth: number; // 0-100
  storyHistory: string[]; // For context window
  currentChapter: number;
  globalPageOffset: number; // For absolute true page tracking
  fontSize: number; // For typography controls
  isGameOver: boolean;

  bookmarks: { id: string; title: string; chapter: number; date: string; state: any }[];

  // Actions
  initializeStory: (sessionId: string, title: string, cast: Character[], setting: string, initialNarrative: string) => void;
  updateHealth: (change: number) => void;
  addHistory: (segment: string) => void;
  incrementChapter: () => void;
  addGlobalPages: (count: number) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  setGameOver: (status: boolean) => void;
  resetAdventure: () => void;
  saveBookmark: () => void;
  deleteBookmark: (id: string) => void;
  loadBookmark: (state: any) => void;
}

const initialState = {
  sessionId: '',
  title: '',
  cast: [],
  setting: '',
  hiddenHealth: 80, // Start with a decent sanity/health level
  storyHistory: [],
  currentChapter: 0,
  globalPageOffset: 0,
  fontSize: 18,
  isGameOver: false,
  bookmarks: [],
};

export const useStoryStore = create<StoryState>()(
  persist(
    (set, get) => ({
      ...initialState,

      initializeStory: (sessionId, title, cast, setting, initialNarrative) => set({
        sessionId,
        title,
        cast,
        setting,
        storyHistory: [initialNarrative],
        currentChapter: 1,
        isGameOver: false,
        hiddenHealth: 80
      }),

      updateHealth: (change) => set((state) => {
        const newHealth = Math.max(0, Math.min(100, state.hiddenHealth + change));
        return { hiddenHealth: newHealth };
      }),

      addHistory: (segment) => set((state) => ({
        storyHistory: [...state.storyHistory, segment]
      })),

      incrementChapter: () => set((state) => ({
        currentChapter: state.currentChapter + 1
      })),

      addGlobalPages: (count) => set((state) => ({
        globalPageOffset: state.globalPageOffset + count
      })),

      increaseFontSize: () => set((state) => ({
        fontSize: Math.min(32, state.fontSize + 2)
      })),

      decreaseFontSize: () => set((state) => ({
        fontSize: Math.max(12, state.fontSize - 2)
      })),

      setGameOver: (status) => set({ isGameOver: status }),

      resetAdventure: () => set((state) => ({ ...initialState, bookmarks: [], fontSize: state.fontSize })),

      saveBookmark: () => set((state) => {
        // Avoid saving if no session
        if (!state.sessionId) return state;

        const newBookmark = {
          id: crypto.randomUUID(),
          title: state.title || 'Untitled Session',
          chapter: state.currentChapter,
          date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
          state: { ...state }
        };

        return { bookmarks: [newBookmark, ...state.bookmarks] };
      }),

      deleteBookmark: (id) => set((state) => ({
        bookmarks: state.bookmarks.filter(b => b.id !== id)
      })),

      loadBookmark: (savedState) => set({ ...savedState })
    }),
    {
      name: 'cyoa-storage',
      // We don't necessarily want to persist the absolute currently generating state
      // but for an e-reader, saving current page is standard.
    }
  )
);
