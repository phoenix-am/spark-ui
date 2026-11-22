import React, { useRef, useState } from 'react';
import { useIsoLayoutEffect } from './useIsoLayoutEffect';

/**
 * Portals render into document.body, outside any `[data-spark-theme]` wrapper.
 * Put `anchorRef` on an element in the normal tree (or pass `sourceRef`, e.g.
 * the trigger); spread `themeProps` on the portal's root so it gets the same
 * mode and token overrides.
 */
export function usePortalTheme(active: boolean, sourceRef?: React.RefObject<Element | null>) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [themeProps, setThemeProps] = useState<{ 'data-spark-theme'?: string; 'data-spark-energy'?: string; 'data-spark-haptics'?: string; style?: React.CSSProperties }>({});

  useIsoLayoutEffect(() => {
    if (!active) return;
    const host = (sourceRef?.current ?? anchorRef.current)?.closest<HTMLElement>('[data-spark-theme]');
    if (!host) return;
    const style: Record<string, string> = {};
    for (let i = 0; i < host.style.length; i++) {
      const name = host.style[i];
      if (name.startsWith('--')) style[name] = host.style.getPropertyValue(name);
    }
    // The energy dial and haptics travel with the theme into the portal.
    const from = sourceRef?.current ?? anchorRef.current;
    const energy = from?.closest('[data-spark-energy]')?.getAttribute('data-spark-energy') ?? undefined;
    const haptics = from?.closest('[data-spark-haptics]')?.getAttribute('data-spark-haptics') ?? undefined;
    setThemeProps({ 'data-spark-theme': host.getAttribute('data-spark-theme') ?? undefined, 'data-spark-energy': energy, 'data-spark-haptics': haptics, style: style as React.CSSProperties });
  }, [active]);

  return { anchorRef, themeProps };
}
