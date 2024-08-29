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
    gray: {
      [key: string]: string;
    }
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


export const defaultTheme: Theme = {
  colors: {
    primary: '#9E77ED',
    primaryLight: '#F4EBFF',
    primaryDark: '#6941C6',
    secondary: '#475467',
    secondaryLight: '#98A2B3',
    secondaryDark: '#344054',
    background: '#FCFCFD',
    text: {
      primary: '#101828',
      secondary: '#475467',
      disabled: '#98A2B3',
    },
    border: '#D0D5DD',
    error: '#F04438',
    errorLight: '#FEE4E2',
    errorDark: '#B42318',
    success: '#12B76A',
    successLight: '#D1FADF',
    successDark: '#027A48',
    warning: '#F79009',
    warningLight: '#FEF0C7',
    warningDark: '#B54708',
    info: '#7F56D9',
    infoLight: '#F9F5FF',
    infoDark: '#53389E',
    gray: {
      25: '#FCFCFD',
      50: '#F9FAFB',
      100: '#F2F4F7',
      200: '#E4E7EC',
      300: '#D0D5DD',
      400: '#98A2B3',
      500: '#667085',
      600: '#475467',
      700: '#344054',
      800: '#1D2939',
      900: '#101828',
    },
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
