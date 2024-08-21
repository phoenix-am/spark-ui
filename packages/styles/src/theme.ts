import { Theme as EmotionTheme } from '@emotion/react';

export interface Theme {
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
    secondaryDark: string;
    background: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    border: string;
    error: string;
    errorLight: string;
    errorDark: string;
    success: string;
    successLight: string;
    successDark: string;
    warning: string;
    warningLight: string;
    warningDark: string;
    info: string;
    infoLight: string;
    infoDark: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      small: string;
      medium: string;
      large: string;
    };
    fontWeight: {
      regular: number;
      medium: number;
      bold: number;
    };
    lineHeight: {
      small: string;
      medium: string;
      large: string;
    };
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
  zIndex: {
    modal: number;
    dropdown: number;
    tooltip: number;
  };
}

// Actual theme object that follows the structure
export const defaultTheme: Theme = {
  colors: {
    primary: '#007bff',
    primaryLight: '#66b2ff',
    primaryDark: '#0056b3',
    secondary: '#6c757d',
    secondaryLight: '#adb5bd',
    secondaryDark: '#343a40',
    background: '#ffffff',
    text: {
      primary: '#212529',
      secondary: '#6c757d',
      disabled: '#ced4da',
    },
    border: '#dee2e6',
    error: '#dc3545',
    errorLight: '#e57373',
    errorDark: '#d32f2f',
    success: '#28a745',
    successLight: '#81c784',
    successDark: '#388e3c',
    warning: '#ffc107',
    warningLight: '#ffb74d',
    warningDark: '#f57c00',
    info: '#17a2b8',
    infoLight: '#4fc3f7',
    infoDark: '#0288d1',
  },
  typography: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: {
      small: '0.875rem',  // 14px
      medium: '1rem',      // 16px
      large: '1.25rem',    // 20px
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
    lineHeight: {
      small: '1.4',
      medium: '1.6',
      large: '1.8',
    },
  },
  spacing: {
    small: '0.5rem',  // 8px
    medium: '1rem',    // 16px
    large: '1.5rem',   // 24px
    xlarge: '2rem',    // 32px
  },
  borderRadius: {
    small: '0.25rem', // 4px
    medium: '0.5rem', // 8px
    large: '0.75rem', // 12px
  },
  zIndex: {
    modal: 1300,
    dropdown: 1200,
    tooltip: 1100,
  },
};

// Define Emotion's Theme type for compatibility
export type BaseTheme = EmotionTheme & Theme;
