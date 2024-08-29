import React, { createContext, useContext } from 'react';
import { BaseTheme } from '@spark-ui/styles';

interface ThemeContextProps {
  theme: BaseTheme;
  toggleTheme?: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
