/**
 * The energy dial. One attribute, `data-spark-energy`, sets how lively the
 * whole UI is; CSS reads it for flow speed and glow, and these helpers read
 * it for spark bursts and haptics. It is read from the DOM at the moment of
 * use, so it works from SparkProvider, from a plain `<html data-spark-energy>`
 * (server-rendered, no JS), and inside portals that copy the attribute.
 */
export type Energy = 'off' | 'calm' | 'default' | 'electric';

/** How much of each effect a level keeps: particle count, spread, haptic strength. */
export const ENERGY_SCALE: Record<Energy, number> = { off: 0, calm: 0.4, default: 1, electric: 1.8 };

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Energy in effect at an element. Reduced motion always means `off`. */
export function readEnergy(el?: Element | null): Energy {
  if (prefersReducedMotion()) return 'off';
  const host = (el ?? (typeof document !== 'undefined' ? document.documentElement : null))?.closest?.('[data-spark-energy]');
  const v = host?.getAttribute('data-spark-energy');
  return v === 'off' || v === 'calm' || v === 'electric' ? v : 'default';
}

export type HapticKind = 'toggle' | 'burst' | 'error';

/**
 * A short vibration where the browser supports it (mostly Android), only
 * when haptics are switched on (`data-spark-haptics="on"`, set by
 * `SparkProvider haptics`) and energy isn't `off`. Silent everywhere else.
 */
export function haptic(kind: HapticKind = 'toggle', el?: Element | null) {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return false;
  const host = (el ?? document.documentElement)?.closest?.('[data-spark-haptics]');
  if (host?.getAttribute('data-spark-haptics') !== 'on') return false;
  const scale = ENERGY_SCALE[readEnergy(el)];
  if (!scale) return false;
  const ms = (n: number) => Math.max(4, Math.round(n * Math.min(scale, 1.5)));
  const pattern = kind === 'toggle' ? ms(10) : kind === 'burst' ? [ms(8), 28, ms(8)] : [ms(30), 40, ms(30)];
  try {
    return navigator.vibrate(pattern);
  } catch {
    return false;
  }
}

/**
 * Plays the power-cut flicker on any element (the effect Modal's backdrop
 * uses). Resolves when it ends; does nothing when energy is `off`.
 */
export function powerCut(el: HTMLElement | null): Promise<void> {
  if (!el || readEnergy(el) === 'off' || typeof el.animate !== 'function') return Promise.resolve();
  const calm = readEnergy(el) === 'calm';
  const frames: Keyframe[] = calm
    ? [{ opacity: 0.6 }, { opacity: 1 }]
    : [{ opacity: 1 }, { opacity: 0.2, offset: 0.12 }, { opacity: 0.9, offset: 0.24 }, { opacity: 0.1, offset: 0.36 }, { opacity: 1, offset: 0.6 }, { opacity: 1 }];
  const anim = el.animate(frames, { duration: calm ? 200 : 420, easing: 'linear' });
  return anim.finished.then(
    () => undefined,
    () => undefined,
  );
}
