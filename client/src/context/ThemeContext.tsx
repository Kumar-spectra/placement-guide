import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'cosmic-dark' | 'midnight-cyber' | 'royal-amethyst' | 'clean-light';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('pg_theme') as ThemeMode;
    return saved || 'cosmic-dark';
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('pg_theme', newTheme);
  };

  const isDark = theme !== 'clean-light';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-cosmic-dark', 'theme-midnight-cyber', 'theme-royal-amethyst', 'theme-clean-light', 'dark', 'light');
    
    root.classList.add(`theme-${theme}`);
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
  }, [theme, isDark]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
