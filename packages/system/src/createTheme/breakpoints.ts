export interface BreakpointsOptions {
  values?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export function createBreakpoints(breakpoints: BreakpointsOptions = {}) {
  const defaultValues = {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  };

  const values = { ...defaultValues, ...breakpoints.values };

  return {
    values,
    up: (key: keyof typeof values) => `@media (min-width:${values[key]}px)`,
    down: (key: keyof typeof values) => `@media (max-width:${values[key]}px)`,
  };
}
