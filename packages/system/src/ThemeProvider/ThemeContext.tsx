import { createContext, useContext } from 'react';
import { BaseTheme, defaultTheme } from '@spark-ui/styles';

export type SparkMode = 'dark' | 'light' | 'system';

interface ThemeContextProps {
  /** The resolved theme as JS values, for charts, canvas and other non-CSS uses. */
  theme: BaseTheme;
  mode: SparkMode;
  resolvedMode: 'dark' | 'light';
  setMode: (mode: SparkMode) => void;
  toggleTheme: () => void;
}

const fallback: ThemeContextProps = {
  theme: defaultTheme as BaseTheme,
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
