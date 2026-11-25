import { Theme } from './types/theme';
import { defaultTheme, lightTheme } from './theme';

/** Every key optional, at every depth. */
export type DeepPartial<T> = T extends (infer U)[]
  ? U[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

function deepMerge<T>(base: T, patch: DeepPartial<T> | undefined): T {
  if (!patch) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(patch)) {
    // A theme parsed from JSON can carry "__proto__"; never let it reach the object's prototype.
    if (value === undefined || key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
    const current = out[key];
    out[key] = isObject(current) && isObject(value) ? deepMerge(current, value as never) : value;
  }
  return out as T;
}

/**
 * Build a theme by changing only what you need. Everything you leave out keeps
 * its Live Wire value for the chosen mode.
 *
 * @example
 * const ocean = createTheme({ energy: { current: '#3AF2FF', ink: '#3AF2FF' } });
 * const oceanLight = createTheme({ tones: { brand: { fill: '#3AF2FF' } } }, 'light');
 */
export function createTheme(overrides?: DeepPartial<Theme>, mode: Theme['mode'] = 'dark'): Theme {
  const base = mode === 'light' ? lightTheme : defaultTheme;
  return deepMerge(base, overrides);
}
