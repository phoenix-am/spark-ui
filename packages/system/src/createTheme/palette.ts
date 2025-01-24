import { ThemeColors } from "@spark-ui/styles";

export interface PaletteOptions {
  brand?: ThemeColors['primary']['brand'];
  error?: ThemeColors['primary']['error'];
  warning?: ThemeColors['primary']['warning'];
  success?: ThemeColors['primary']['success'];
}

export function createPalette(palette: PaletteOptions = {}) {
  return {
    brand: palette.brand ?? '#1976d2',
    error: palette.error ?? '#f44336',
    warning: palette.warning ?? '#ff9800',
    success: palette.success ?? '#4caf50',
  };
}
