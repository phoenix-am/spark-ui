import React, { useLayoutEffect, useRef, useState } from 'react';

/**
 * Portals render into document.body, outside any `[data-spark-theme]` wrapper.
 * Put `anchorRef` on an element in the normal tree; spread `themeProps` on the
 * portal's root so it gets the same mode and token overrides.
 */
export function usePortalTheme(active: boolean) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [themeProps, setThemeProps] = useState<{ 'data-spark-theme'?: string; style?: React.CSSProperties }>({});

  useLayoutEffect(() => {
    if (!active) return;
    const host = anchorRef.current?.closest<HTMLElement>('[data-spark-theme]');
    if (!host) return;
    const style: Record<string, string> = {};
    for (let i = 0; i < host.style.length; i++) {
      const name = host.style[i];
      if (name.startsWith('--')) style[name] = host.style.getPropertyValue(name);
    }
    setThemeProps({ 'data-spark-theme': host.getAttribute('data-spark-theme') ?? undefined, style: style as React.CSSProperties });
  }, [active]);

  return { anchorRef, themeProps };
}
