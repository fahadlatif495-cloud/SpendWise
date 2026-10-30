import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { darkColors, lightColors, type AppColors } from '@/theme';

const THEME_KEY = 'spendwise.theme';

export type ThemeChoice = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  colors: AppColors;
  isDark: boolean;
  choice: ThemeChoice;
  setChoice: (choice: ThemeChoice) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemeChoice(value: string | null): value is ThemeChoice {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [choice, setChoiceState] = useState<ThemeChoice>('system');

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY)
      .then((saved) => {
        if (isThemeChoice(saved)) {
          setChoiceState(saved);
        }
      })
      .catch(() => {});
  }, []);

  const setChoice = useCallback((next: ThemeChoice) => {
    setChoiceState(next);
    AsyncStorage.setItem(THEME_KEY, next).catch(() => {});
  }, []);

  const isDark = choice === 'system' ? system === 'dark' : choice === 'dark';

  const toggle = useCallback(() => {
    setChoice(isDark ? 'light' : 'dark');
  }, [isDark, setChoice]);

  const value = useMemo(
    () => ({
      colors: isDark ? darkColors : lightColors,
      isDark,
      choice,
      setChoice,
      toggle,
    }),
    [choice, isDark, setChoice, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useColors() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useColors must be used inside ThemeProvider');
  }
  return value.colors;
}

export function useThemeChoice() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useThemeChoice must be used inside ThemeProvider');
  }
  return value;
}
