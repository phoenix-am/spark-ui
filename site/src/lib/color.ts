/** Small colour helpers for the theme builder: parsing, mixing and WCAG contrast. */
type RGB = [number, number, number];

export const isHex = (s: string) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s.trim());

export function parseHex(hex: string): RGB {
  let h = hex.trim().replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
}

export const toHex = ([r, g, b]: RGB) => `#${[r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('')}`.toUpperCase();

/** `amount` of `b` mixed into `a`, 0..1. */
export const mix = (a: string, b: string, amount: number) => {
  const x = parseHex(a);
  const y = parseHex(b);
  return toHex(x.map((v, i) => v + (y[i] - v) * amount) as RGB);
};

export const rgba = (hex: string, alpha: number) => `rgba(${parseHex(hex).join(', ')}, ${alpha})`;

const channel = (v: number) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex: string) => {
  const [r, g, b] = parseHex(hex).map(channel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** WCAG contrast ratio, 1..21. */
export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Walk `color` toward `toward` until it reaches `target` contrast against `background`. */
export function readable(color: string, background: string, toward: string, target = 4.5) {
  for (let i = 0; i <= 20; i++) {
    const c = mix(color, toward, i / 20);
    if (contrast(c, background) >= target) return c;
  }
  return toward;
}
