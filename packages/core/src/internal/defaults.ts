import { createContext, useContext } from 'react';
import { cx } from './cx';

/** Per-slot class names, e.g. `{ root: 'my-switch', bulb: 'my-bulb' }`. */
export type ClassNames<Slot extends string> = Partial<Record<Slot, string>>;

export interface ComponentConfig<P = Record<string, unknown>> {
  /** Props applied when the component doesn't set them itself. */
  defaultProps?: Partial<P>;
  /** Extra class names for named parts. `root` is the outer element. */
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

  const own = (props as { classNames?: Record<string, string> }).classNames;
  if (config.classNames || own) {
    const keys = new Set([...Object.keys(config.classNames ?? {}), ...Object.keys(own ?? {})]);
    const joined: Record<string, string> = {};
    keys.forEach((k) => (joined[k] = cx(config.classNames?.[k], own?.[k])));
    merged.classNames = joined;
  }
  return merged as P;
}

/** Class for one part: the base class, then app-wide and per-instance additions. */
export const slot = <S extends string>(base: string, classNames: ClassNames<S> | undefined, name: S, ...extra: Array<string | false | null | undefined>) =>
  cx(base, classNames?.[name], ...extra);
