import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import ThemeContext, { SparkMode } from './ThemeContext';
import { BaseTheme, DeepPartial, Theme, createTheme, defaultTheme, lightTheme, themeToCssVars } from '@spark-ui/styles';

export interface ThemeProviderProps {
  children: ReactNode;
  /**
   * Colour mode. `system` follows the operating system. Components read
   * CSS variables, so this works without the provider too: set
   * `data-spark-theme="light"` on any element (e.g. `<html>`).
   */
  mode?: SparkMode;
  /** Start in this mode but let `setMode` change it (uncontrolled). */
  defaultMode?: SparkMode;
  /** Change only the tokens you need; the rest keep their Live Wire values. */
  theme?: DeepPartial<Theme>;
  /** @deprecated Pass `theme` instead. A full theme object is still accepted. */
  initialTheme?: BaseTheme;
  /** Wrapper element's class, e.g. for a font or background. */
  className?: string;
}

const usePrefersLight = () => {
  const [light, setLight] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const update = () => setLight(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  return light;
};

/**
 * Optional. Spark UI components are styled by `@spark-ui/core/styles.css`
 * and its CSS variables, so they render correctly without any provider
 * (including in React Server Components). Use the provider to switch modes
 * at runtime, or to apply token overrides to a part of the page.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  mode,
  defaultMode = 'dark',
  theme: overrides,
  initialTheme,
  className,
}) => {
  const [innerMode, setInnerMode] = useState<SparkMode>(defaultMode);
  const activeMode = mode ?? innerMode;
  const prefersLight = usePrefersLight();
  const resolved: Theme['mode'] =
    activeMode === 'system' ? (prefersLight ? 'light' : 'dark') : activeMode;

  const theme = useMemo<BaseTheme>(() => {
    if (initialTheme && !overrides) return initialTheme;
    return createTheme(overrides, resolved) as BaseTheme;
  }, [initialTheme, overrides, resolved]);

  // Only emit inline variables when the app overrides tokens.
  const style = useMemo(() => {
    if (!overrides && !initialTheme) return undefined;
    return { ...themeToCssVars(theme), display: 'contents' } as React.CSSProperties;
  }, [overrides, initialTheme, theme]);

  const value = useMemo(
    () => ({
      theme,
      mode: activeMode,
      resolvedMode: resolved,
      setMode: setInnerMode,
      toggleTheme: () => setInnerMode((m) => (m === 'light' ? 'dark' : 'light')),
    }),
    [theme, activeMode, resolved],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div data-spark-theme={activeMode} className={className} style={style ?? { display: 'contents' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export { defaultTheme, lightTheme };
