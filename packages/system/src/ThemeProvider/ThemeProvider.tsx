import React, { useState, ReactNode, useMemo } from 'react';
import ThemeContext from './ThemeContext';
import { BaseTheme, defaultTheme } from '@spark-ui/styles'; // Import the BaseTheme and defaultTheme from your styles package

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: BaseTheme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = defaultTheme,
}) => {
  const [theme, setTheme] = useState<BaseTheme>(initialTheme);

  // Optional: Implement theme toggling logic
  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === defaultTheme
        ? { ...defaultTheme, colors: { ...defaultTheme.colors, primary: '#000000' } } // Example toggling logic
        : defaultTheme
    );
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
