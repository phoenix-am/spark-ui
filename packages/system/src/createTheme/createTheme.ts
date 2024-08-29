import {
  PaletteOptions,
  TypographyOptions,
  SpacingOptions,
  BreakpointsOptions,
  ShadowsOptions,
  createPalette,
  createTypography,
  createSpacing,
  createBreakpoints,
  createShadows,
} from '.';

export interface ThemeOptions {
  palette?: PaletteOptions;
  typography?: TypographyOptions;
  spacing?: SpacingOptions;
  breakpoints?: BreakpointsOptions;
  shadows?: ShadowsOptions;
}

export interface Theme {
  palette: ReturnType<typeof createPalette>;
  typography: ReturnType<typeof createTypography>;
  spacing: ReturnType<typeof createSpacing>;
  breakpoints: ReturnType<typeof createBreakpoints>;
  shadows: ReturnType<typeof createShadows>;
}

export default function (options: ThemeOptions = {}): Theme {
  const palette = createPalette(options.palette);
  const typography = createTypography(options.typography);
  const spacing = createSpacing(options.spacing);
  const breakpoints = createBreakpoints(options.breakpoints);
  const shadows = createShadows(options.shadows);

  return {
    palette,
    typography,
    spacing,
    breakpoints,
    shadows,
  };
}
