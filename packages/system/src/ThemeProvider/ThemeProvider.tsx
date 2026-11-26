import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import ThemeContext, { SparkMode } from './ThemeContext';
import { BaseTheme, DeepPartial, Theme, createTheme, defaultTheme, lightTheme, themeToCssVars } from '@sparkwire/styles';

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
  /**
   * Also apply the mode (and any `theme` overrides) to `<html>`, so the page background,
   * scrollbars and anything rendered outside the provider match. Use it on the provider
   * at the root of your app. Default `false`.
   */
  global?: boolean;
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
 * Optional. Spark UI components are styled by `@sparkwire/core/styles.css`
 * and its CSS variables, so they render correctly without any provider
 * (including in React Server Components). Use the provider to switch modes
 * at runtime, or to apply token overrides to a part of the page.
 */
declare const process: { env: { NODE_ENV?: string } };
let warnedInitialTheme = false;
function warnInitialTheme() {
  if (warnedInitialTheme) return;
  warnedInitialTheme = true;
  let env: string | undefined;
  try {
    env = process.env.NODE_ENV;
  } catch {
    env = undefined;
  }
  if (env !== 'production') {
    console.warn('[Sparkwire]', 'ThemeProvider: `initialTheme` is deprecated and will be removed in 1.0. Use `theme`.');
  }
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  mode,
  defaultMode = 'dark',
  theme: overrides,
  initialTheme,
  className,
  global = false,
}) => {
  if (initialTheme) warnInitialTheme();
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

  // Mirror onto <html> for the app's root provider; put things back as they were on unmount.
  useEffect(() => {
    if (!global || typeof document === 'undefined') return;
    const html = document.documentElement;
    const before = { attr: html.getAttribute('data-spark-theme'), scheme: html.style.colorScheme };
    html.setAttribute('data-spark-theme', activeMode);
    html.style.colorScheme = resolved;
    const vars = style ? Object.entries(style).filter(([k]) => k.startsWith('--')) : [];
    vars.forEach(([k, v]) => html.style.setProperty(k, String(v)));
    return () => {
      if (before.attr === null) html.removeAttribute('data-spark-theme');
      else html.setAttribute('data-spark-theme', before.attr);
      html.style.colorScheme = before.scheme;
      vars.forEach(([k]) => html.style.removeProperty(k));
    };
  }, [global, activeMode, resolved, style]);

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
