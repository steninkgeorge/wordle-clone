import { create } from 'zustand';

interface ThemeProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  initTheme: () => void;
}

export const useTheme = create<ThemeProps>((set) => ({
  theme: 'dark',
  setTheme: (theme) => {
    set({ theme: theme });
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
  },
  initTheme: () => {
    const saved = localStorage.getItem('theme');
    const isDark =
      saved === 'dark' ||
      (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    set({ theme: isDark ? 'dark' : 'light' });
    document.documentElement.classList.toggle('dark', isDark);
  },
}));
