import { Theme } from './types/theme';

/**
 * Live Wire: Spark UI's default theme. Components carry current: actions throw
 * sparks, toggles close a circuit, inputs charge up as they become valid.
 */
export const defaultTheme: Theme = {
  mode: 'dark',
  tones: {
    brand: { fill: '#FFD60A', ink: '#FFD60A', hover: '#FFE24D', glow: 'rgba(255, 214, 10, 0.35)' },
    success: { fill: '#1FE58A', ink: '#1FE58A', hover: '#47F5A0', glow: 'rgba(31, 229, 138, 0.35)' },
    warning: { fill: '#FF9F1C', ink: '#FF9F1C', hover: '#FFB347', glow: 'rgba(255, 159, 28, 0.35)' },
    error: { fill: '#FF5C5C', ink: '#FF5C5C', hover: '#FF7A7A', glow: 'rgba(255, 92, 92, 0.35)' },
  },
  colors: {
    primary: {
      gray: {
        '25': '#F2F4F8',
        '50': '#E3E7EF',
        '100': '#C9CFDB',
        '200': '#A9B0BF',
        '300': '#7D8596',
        '400': '#5A6272',
        '500': '#3A4150',
        '600': '#262C3A',
        '700': '#1B2030',
        '800': '#141822',
        '900': '#0B0D12',
      },
      brand: {
        '25': '#FFFDF0',
        '50': '#FFF9D6',
        '100': '#FFF3B0',
        '200': '#FFEB80',
        '300': '#FFE24D',
        '400': '#FFDB26',
        '500': '#FFD60A',
        '600': '#F5C400',
        '700': '#D1A300',
        '800': '#A37E00',
        '900': '#6E5500',
      },
      error: {
        '25': '#FFF5F5',
        '50': '#FFE5E5',
        '100': '#FFC7C7',
        '200': '#FF9E9E',
        '300': '#FF7A7A',
        '400': '#FF5C5C',
        '500': '#F23D3D',
        '600': '#D92626',
        '700': '#B31B1B',
        '800': '#8C1515',
        '900': '#5C0E0E',
      },
      warning: {
        '25': '#FFF8EF',
        '50': '#FFEFD9',
        '100': '#FFDCAD',
        '200': '#FFC67A',
        '300': '#FFB347',
        '400': '#FF9F1C',
        '500': '#F28B00',
        '600': '#CC7400',
        '700': '#A35D00',
        '800': '#7A4600',
        '900': '#522F00',
      },
      success: {
        '25': '#F0FFF7',
        '50': '#D9FFEC',
        '100': '#ADFFD6',
        '200': '#7AFFBD',
        '300': '#47F5A0',
        '400': '#1FE58A',
        '500': '#00CC74',
        '600': '#00A65E',
        '700': '#008049',
        '800': '#005C35',
        '900': '#003D23',
      },
    },
    secondary: {
      blueGray: {
        '25': '#FCFCFD',
        '50': '#F8F9FC',
        '100': '#EAECF5',
        '200': '#D5D9EB',
        '300': '#AFB5D9',
        '400': '#717BBC',
        '500': '#4E5BA6',
        '600': '#3E4784',
        '700': '#363F72',
        '800': '#293056',
        '900': '#101323',
      },
      blueLight: {
        '25': '#F5FBFF',
        '50': '#F0F9FF',
        '100': '#E0F2FE',
        '200': '#B9E6FE',
        '300': '#7CD4FD',
        '400': '#36BFFA',
        '500': '#0BA5EC',
        '600': '#0086C9',
        '700': '#026AA2',
        '800': '#065986',
        '900': '#0B4A6F',
      },
      blue: {
        '25': '#F5FAFF',
        '50': '#EFF8FF',
        '100': '#D1E9FF',
        '200': '#B2DDFF',
        '300': '#84CAFF',
        '400': '#53B1FD',
        '500': '#2E90FA',
        '600': '#1570EF',
        '700': '#175CD3',
        '800': '#1849A9',
        '900': '#194185',
      },
      indigo: {
        '25': '#F5F8FF',
        '50': '#EEF4FF',
        '100': '#E0EAFF',
        '200': '#C7D7FE',
        '300': '#A4BCFD',
        '400': '#8098F9',
        '500': '#6172F3',
        '600': '#444CE7',
        '700': '#3538CD',
        '800': '#2D31A6',
        '900': '#2D3282',
      },
      purple: {
        '25': '#FAFAFF',
        '50': '#F4F3FF',
        '100': '#EBE9FE',
        '200': '#D9D6FE',
        '300': '#BDB4FE',
        '400': '#9B8AFB',
        '500': '#7A5AF8',
        '600': '#6938EF',
        '700': '#5925DC',
        '800': '#4A1FB8',
        '900': '#3E1C96',
      },
      pink: {
        '25': '#FEF6FB',
        '50': '#FDF2FA',
        '100': '#FCE7F6',
        '200': '#FCCEEE',
        '300': '#FAA7E0',
        '400': '#F670C7',
        '500': '#EE46BC',
        '600': '#DD2590',
        '700': '#C11574',
        '800': '#9E165F',
        '900': '#851651',
      },
      rose: {
        '25': '#FFF5F6',
        '50': '#FFF1F3',
        '100': '#FFE4E8',
        '200': '#FECDD6',
        '300': '#FEA3B4',
        '400': '#FD6F8E',
        '500': '#F63D68',
        '600': '#E31B54',
        '700': '#C01048',
        '800': '#A11043',
        '900': '#89123E',
      },
      orange: {
        '25': '#FFFAF5',
        '50': '#FFF6ED',
        '100': '#FFEAD5',
        '200': '#FDDCAB',
        '300': '#FEB273',
        '400': '#FD853A',
        '500': '#FB6514',
        '600': '#EC4A0A',
        '700': '#C4320A',
        '800': '#9C2A10',
        '900': '#7E2410',
      },
    },
  },
  typography: {
    fontFamily: "'Sora', 'Segoe UI', system-ui, sans-serif",
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
    extraSmall: '0.25rem',  // 4px
    small: '0.5rem',   // 8px
    medium: '1rem',     // 16px
    large: '2rem',     // 32px
    xlarge: '4rem',     // 64px
    '2xlarge': '8rem',  // 128px
    '3xlarge': '16rem', // 256px
  },
  padding: {
    small: '0.25rem 1rem',
    medium: '0.45rem 1rem',
    large: '0.625rem 1rem',
    '2xlarge': '2rem 2.5rem',
    '3xlarge': '2.5rem 3rem',
  },
  borderRadius: {
    small: '0.25rem',
    medium: '0.375rem',
    large: '0.5rem',
    xlarge: '0.75rem',
    '2xlarge': '1rem',
    '3xlarge': '1.25rem',
  },
  zIndex: {
    modal: 1300,
    dropdown: 1200,
    tooltip: 1100,
  },
  surface: {
    base: '#0B0D12',
    raised: '#141822',
    sunken: '#07080C',
    border: '#262C3A',
    borderStrong: '#3A4150',
  },
  text: {
    primary: '#F2F4F8',
    secondary: '#A9B0BF',
    disabled: '#5A6272',
    onEnergy: '#0B0D12',
  },
  energy: {
    current: '#FFD60A',
    ink: '#FFD60A',
    hot: '#FFF3B0',
    glow: 'rgba(255, 214, 10, 0.35)',
    off: '#3A4150',
    sparks: ['#FFD60A', '#FFF3B0', '#FF9F1C'],
  },
  motion: {
    fast: '120ms',
    normal: '240ms',
    spark: 700,
    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  },
  shadows: {
    extraSmall: '0 1px 2px rgba(0, 0, 0, 0.4)',
    small: '0 1px 3px rgba(0, 0, 0, 0.5)',
    medium: '0 4px 10px rgba(0, 0, 0, 0.5)',
    large: '0 12px 24px rgba(0, 0, 0, 0.55)',
    xlarge: '0 20px 32px rgba(0, 0, 0, 0.6)',
    '2xlarge': '0 24px 48px rgba(0, 0, 0, 0.65)',
    '3xlarge': '0 32px 64px rgba(0, 0, 0, 0.7)',
  }
};

/** @deprecated Same as `Theme`; kept for older imports. */
export type BaseTheme = Theme;


export const liveWireTheme = defaultTheme;

/**
 * Live Wire, light mode. Fills keep their voltage; anything drawn as text or a
 * thin line uses a darker "ink" so it stays readable on white (4.5:1 or more).
 */
export const lightTheme: Theme = {
  ...defaultTheme,
  mode: 'light',
  tones: {
    brand: { fill: '#FFD60A', ink: '#7A5E00', hover: '#FFE24D', glow: 'rgba(209, 163, 0, 0.35)' },
    success: { fill: '#1FE58A', ink: '#00704A', hover: '#47F5A0', glow: 'rgba(0, 166, 94, 0.3)' },
    warning: { fill: '#FF9F1C', ink: '#9A4A00', hover: '#FFB347', glow: 'rgba(204, 116, 0, 0.3)' },
    error: { fill: '#FF5C5C', ink: '#B3161C', hover: '#FF7A7A', glow: 'rgba(217, 38, 38, 0.28)' },
  },
  surface: {
    base: '#FFFFFF',
    raised: '#F6F7F9',
    sunken: '#ECEEF2',
    border: '#DCE0E7',
    borderStrong: '#B4BBC8',
  },
  text: {
    primary: '#0B0D12',
    secondary: '#4A5263',
    disabled: '#9AA1AE',
    onEnergy: '#0B0D12',
  },
  energy: {
    ...defaultTheme.energy,
    ink: '#7A5E00',
    glow: 'rgba(209, 163, 0, 0.35)',
    off: '#C9CFDB',
    sparks: ['#F5C400', '#FF9F1C', '#FFD60A'],
  },
  shadows: {
    extraSmall: '0 1px 2px rgba(16, 24, 40, 0.06)',
    small: '0 1px 3px rgba(16, 24, 40, 0.1)',
    medium: '0 4px 10px rgba(16, 24, 40, 0.1)',
    large: '0 12px 24px rgba(16, 24, 40, 0.12)',
    xlarge: '0 20px 32px rgba(16, 24, 40, 0.14)',
    '2xlarge': '0 24px 48px rgba(16, 24, 40, 0.18)',
    '3xlarge': '0 32px 64px rgba(16, 24, 40, 0.2)',
  },
};

export const darkTheme = defaultTheme;
