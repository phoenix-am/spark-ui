import { createContext, useContext } from 'react';
import { Theme, defaultTheme } from '@sparkwire/styles';

export type SparkMode = 'dark' | 'light' | 'system';

interface ThemeContextProps {
  /** The resolved theme as JS values, for charts, canvas and other non-CSS uses. */
  theme: Theme;
  mode: SparkMode;
  resolvedMode: 'dark' | 'light';
  setMode: (mode: SparkMode) => void;
  toggleTheme: () => void;
}

const fallback: ThemeContextProps = {
  theme: defaultTheme as Theme,
  mode: 'dark',
  resolvedMode: 'dark',
  setMode: () => {},
  toggleTheme: () => {},
};

const ThemeContext = createContext<ThemeContextProps>(fallback);

/**
 * Read the current theme values and mode. Works without a ThemeProvider
 * (returns the default dark Live Wire theme).
 */
export const useTheme = (): ThemeContextProps => useContext(ThemeContext);

export default ThemeContext;
