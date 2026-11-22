import { createContext, useContext } from 'react';
import { cx } from './cx';

/** Per-slot class names, e.g. `{ root: 'my-switch', bulb: 'my-bulb' }`. */
export type ClassNames<Slot extends string> = Partial<Record<Slot, string>>;

export interface ComponentConfig<P = Record<string, unknown>> {
  /** Props applied when the component doesn't set them itself. */
  defaultProps?: Partial<P>;
  /** Extra class names for named parts. `root` is the outer element. */
  classNames?: Record<string, string>;
  /**
   * Named looks defined once for the whole app. A variant applies when every
   * prop in `match` equals the component's prop; it can set props (which win
   * over the matched ones), a root class, and classes for parts.
   *
   * ```ts
   * Button: { variants: [
   *   { match: { variant: 'danger' }, props: { variant: 'contained', color: 'error' }, className: 'btn-danger' },
   *   { match: { size: 'large', variant: 'outlined' }, classNames: { icon: 'big-icon' } },
   * ] }
   * ```
   */
  variants?: Array<ComponentVariant<P>>;
}

export interface ComponentVariant<P = Record<string, unknown>> {
  /** Props to match, e.g. `{ variant: 'danger' }`. All must be equal. */
  match: Partial<Record<Extract<keyof P, string>, unknown>> & Record<string, unknown>;
  /** Props this variant sets. They win over the matched props, so a custom value can map to a built-in one. */
  props?: Partial<P> & Record<string, unknown>;
  /** Extra class on the root element. */
  className?: string;
  /** Extra classes for named parts. */
  classNames?: Record<string, string>;
}

export type DefaultsMap = Record<string, ComponentConfig | undefined>;

export const DefaultsContext = createContext<DefaultsMap>({});

/**
 * Merge app-wide defaults (from SparkProvider) under a component's own props.
 * Props passed directly always win; class names from both sources are joined.
 */
export function useDefaults<P extends object>(name: string, props: P): P {
  const config = useContext(DefaultsContext)[name];
  if (!config) return props;
  const merged: Record<string, unknown> = { ...config.defaultProps };
  for (const [k, v] of Object.entries(props)) if (v !== undefined) merged[k] = v;

  // Variants are matched against the props as given (defaults included), before any variant applies.
  const hits = (config.variants ?? []).filter((v) => Object.entries(v.match).every(([k, want]) => merged[k] === want));

  const own = (props as { classNames?: Record<string, string> }).classNames;
  const layers = [config.classNames, ...hits.map((h) => h.classNames), own].filter(Boolean) as Array<Record<string, string>>;
  if (layers.length) {
    const keys = new Set(layers.flatMap((l) => Object.keys(l)));
    const joined: Record<string, string> = {};
    keys.forEach((k) => (joined[k] = cx(...layers.map((l) => l[k]))));
    merged.classNames = joined;
  }
  for (const h of hits) {
    if (h.props) Object.assign(merged, h.props);
    if (h.className) merged.className = cx(merged.className as string | undefined, h.className);
  }
  return merged as P;
}

/** Class for one part: the base class, then app-wide and per-instance additions. */
export const slot = <S extends string>(base: string, classNames: ClassNames<S> | undefined, name: S, ...extra: Array<string | false | null | undefined>) =>
  cx(base, classNames?.[name], ...extra);
