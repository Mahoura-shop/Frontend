import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '../utils/translations';

interface UIState {
  isDarkMode: boolean;
  language: Language;
  currentPage: string;
  selectedProductId: string | null;
  toggleDarkMode: () => void;
  setLanguage: (lang: Language) => void;
  setCurrentPage: (page: string) => void;
  setSelectedProductId: (id: string | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      language: 'fa',
      currentPage: 'home',
      selectedProductId: null,
      toggleDarkMode: () =>
        set((state) => ({ isDarkMode: !state.isDarkMode })),
      setLanguage: (lang) => set({ language: lang }),
      setCurrentPage: (page) => set({ currentPage: page }),
      setSelectedProductId: (id) => set({ selectedProductId: id }),
    }),
    {
      name: 'mahoura-ui',
    }
  )
);
