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
  background: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  border: string;
  info: {
    primary: string;
    light: string;
    dark: string;
  };
}

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
    background: ThemeColors['background'];
    text: ThemeColors['text'];
    border: ThemeColors['border'];
    info: ThemeColors['info'];
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
    '2xlarge': string;
    '3xlarge': string;
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
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  }
}