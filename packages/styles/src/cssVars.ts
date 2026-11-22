import { Theme } from './types/theme';

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/**
 * Turn a theme into CSS custom properties, e.g. `--spark-energy-current`.
 * The same names are used by `@sparkwire/core/styles.css`, so overriding a
 * variable in plain CSS restyles every component that uses it.
 */
export function themeToCssVars(theme: Theme): Record<string, string> {
  const v: Record<string, string> = {};
  const set = (name: string, value: string | number) => {
    v[`--spark-${name}`] = String(value);
  };

  for (const group of ['primary', 'secondary'] as const) {
    for (const [scale, shades] of Object.entries(theme.colors[group])) {
      for (const [shade, value] of Object.entries(shades as Record<string, string>)) {
        set(`${kebab(scale)}-${shade}`, value);
      }
    }
  }
  for (const [tone, t] of Object.entries(theme.tones)) {
    for (const [k, value] of Object.entries(t)) set(`${tone}-${k}`, value);
  }
  for (const [k, value] of Object.entries(theme.surface)) set(`surface-${kebab(k)}`, value);
  for (const [k, value] of Object.entries(theme.text)) set(`text-${kebab(k)}`, value);
  set('energy-current', theme.energy.current);
  set('energy-ink', theme.energy.ink);
  set('energy-hot', theme.energy.hot);
  set('energy-glow', theme.energy.glow);
  set('energy-off', theme.energy.off);
  theme.energy.sparks.forEach((c, i) => set(`energy-spark-${i + 1}`, c));

  set('font', theme.typography.fontFamily);
  for (const [k, value] of Object.entries(theme.typography.fontSize)) set(`font-size-${k}`, value);
  for (const [k, value] of Object.entries(theme.borderRadius)) set(`radius-${k}`, value);
  for (const [k, value] of Object.entries(theme.shadows)) set(`shadow-${kebab(k)}`, value);
  for (const [k, value] of Object.entries(theme.zIndex)) set(`z-${k}`, value);
  set('motion-fast', theme.motion.fast);
  set('motion-normal', theme.motion.normal);
  set('motion-spark', `${theme.motion.spark}ms`);
  set('motion-easing', theme.motion.easing);
  return v;
}

/** The same variables as a CSS rule body, for a <style> tag or a stylesheet. */
export function themeToCss(theme: Theme, selector = ':root'): string {
  const body = Object.entries(themeToCssVars(theme))
    .map(([k, value]) => `  ${k}: ${value};`)
    .join('\n');
  return `${selector} {\n  color-scheme: ${theme.mode};\n${body}\n}\n`;
}
