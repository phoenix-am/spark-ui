export interface TypographyOptions {
  fontFamily?: string;
  fontSize?: string;
  fontWeightLight?: number;
  fontWeightRegular?: number;
  fontWeightMedium?: number;
  fontWeightBold?: number;
}

export function createTypography(typography: TypographyOptions = {}) {
  return {
    fontFamily: typography.fontFamily ?? '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: typography.fontSize ?? '14px',
    fontWeightLight: typography.fontWeightLight ?? 300,
    fontWeightRegular: typography.fontWeightRegular ?? 400,
    fontWeightMedium: typography.fontWeightMedium ?? 500,
    fontWeightBold: typography.fontWeightBold ?? 700,
  };
}
