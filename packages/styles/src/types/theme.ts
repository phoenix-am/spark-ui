export interface ThemeColors {
  primary: {
    gray: {
      '25': string;
      '50': string;
      '100': string;
      '200': string;
      '300': string;
      '400': string;
      '500': string;
      '600': string;
      '700': string;
      '800': string;
      '900': string;
    };
    brand: {
      '25': string;
      '50': string;
      '100': string;
      '200': string;
      '300': string;
      '400': string;
      '500': string;
      '600': string;
      '700': string;
      '800': string;
      '900': string;
    };
    error: {
      '25': string;
      '50': string;
      '100': string;
      '200': string;
      '300': string;
      '400': string;
      '500': string;
      '600': string;
      '700': string;
      '800': string;
      '900': string;
    };
    warning: {
      '25': string;
      '50': string;
      '100': string;
      '200': string;
      '300': string;
      '400': string;
      '500': string;
      '600': string;
      '700': string;
      '800': string;
      '900': string;
    };
    success: {
      '25': string;
      '50': string;
      '100': string;
      '200': string;
      '300': string;
      '400': string;
      '500': string;
      '600': string;
      '700': string;
      '800': string;
      '900': string;
    };
  },
  secondary: {
    blueGray: {
      '25': string;
      '50': string;
      '100': string;
      '200': string;
      '300': string;
      '400': string;
      '500': string;
      '600': string;
      '700': string;
      '800': string;
      '900': string;
    };
    blueLight: {
      '25': string;
      '50': string;
      '100': string;
      '200': string;
      '300': string;
      '400': string;
      '500': string;
      '600': string;
      '700': string;
      '800': string;
      '900': string;
    };
    blue: {
      '25': string;
      '50': string;
      '100': string;
      '200': string;
      '300': string;
      '400': string;
      '500': string;
      '600': string;
      '700': string;
      '800': string;
      '900': string;
    };
    indigo: {
      '25': string;
      '50': string;
      '100': string;
      '200': string;
      '300': string;
      '400': string;
      '500': string;
      '600': string;
      '700': string;
      '800': string;
      '900': string;
    };
    purple: {
      '25': string;
      '50': string;
      '100': string;
      '200': string;
      '300': string;
      '400': string;
      '500': string;
      '600': string;
      '700': string;
      '800': string;
      '900': string;
    };
    pink: {
      '25': string;
      '50': string;
      '100': string;
      '200': string;
      '300': string;
      '400': string;
      '500': string;
      '600': string;
      '700': string;
      '800': string;
      '900': string;
    };
    rose: {
      '25': string;
      '50': string;
      '100': string;
      '200': string;
      '300': string;
      '400': string;
      '500': string;
      '600': string;
      '700': string;
      '800': string;
      '900': string;
    };
    orange: {
      '25': string;
      '50': string;
      '100': string;
      '200': string;
      '300': string;
      '400': string;
      '500': string;
      '600': string;
      '700': string;
      '800': string;
      '900': string;
    };
  }
}

export type Sizes = 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge' | '3xlarge';

export interface Theme {
  colors: {
    primary: {
      gray: ThemeColors['primary']['gray'];
      brand: ThemeColors['primary']['brand'];
      error: ThemeColors['primary']['error'];
      warning: ThemeColors['primary']['warning'];
      success: ThemeColors['primary']['success'];
    };
    secondary: {
      blueGray: ThemeColors['secondary']['blueGray'];
      blueLight: ThemeColors['secondary']['blueLight'];
      blue: ThemeColors['secondary']['blue'];
      indigo: ThemeColors['secondary']['indigo'];
      purple: ThemeColors['secondary']['purple'];
      pink: ThemeColors['secondary']['pink'];
      rose: ThemeColors['secondary']['rose'];
      orange: ThemeColors['secondary']['orange'];
    };
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
    extraSmall: string;
    small: string;
    medium: string;
    large: string;
    xlarge: string;
    '2xlarge': string;
    '3xlarge': string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
    '2xlarge': string;
    '3xlarge': string;
  };
  /** Live Wire: the surfaces components sit on (dark by default). */
  surface: {
    base: string;
    raised: string;
    sunken: string;
    border: string;
    borderStrong: string;
  };
  /** Live Wire: text colours for use on `surface`. */
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    /** Text drawn on top of an energised (filled) element. */
    onEnergy: string;
  };
  /** Live Wire: the "current" that flows through interactive components. */
  energy: {
    current: string;
    hot: string;
    glow: string;
    off: string;
    sparks: string[];
  };
  /** Live Wire: motion timings. Components respect prefers-reduced-motion. */
  motion: {
    fast: string;
    normal: string;
    spark: number;
    easing: string;
  };
  padding: {
    small: string;
    medium: string;
    large: string;
    '2xlarge': string;
    '3xlarge': string;
  };
  zIndex: {
    modal: number;
    dropdown: number;
    tooltip: number;
  };
  shadows: {
    extraSmall: string;
    small: string;
    medium: string;
    large: string;
    xlarge: string;
    '2xlarge': string;
    '3xlarge': string;
  };
}