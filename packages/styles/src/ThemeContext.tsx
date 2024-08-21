import * as React from 'react';
import { Theme, defaultTheme } from './theme';

interface ThemeProviderProps {
  theme?: Theme;
  children: React.ReactNode;
}

const ThemeContext = React.createContext<Theme>(defaultTheme);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ theme = defaultTheme, children }) => {
  return <ThemeContext.Provider value={theme}>
    {children}
  </ThemeContext.Provider>;
};

export const useTheme = (): Theme => {
  return React.useContext(ThemeContext);
};
