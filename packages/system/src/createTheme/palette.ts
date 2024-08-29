export interface PaletteOptions {
  primary?: string;
  secondary?: string;
  error?: string;
  warning?: string;
  info?: string;
  success?: string;
  background?: string;
  text?: string;
}

export function createPalette(palette: PaletteOptions = {}) {
  return {
    primary: palette.primary ?? '#1976d2',
    secondary: palette.secondary ?? '#dc004e',
    error: palette.error ?? '#f44336',
    warning: palette.warning ?? '#ff9800',
    info: palette.info ?? '#2196f3',
    success: palette.success ?? '#4caf50',
    background: palette.background ?? '#fff',
    text: palette.text ?? '#000',
  };
}
