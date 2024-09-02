import { css } from '@emotion/react';
import { BaseTheme, ThemeColors } from '@spark-ui/styles';

interface ButtonStylesProps {
  variant: 'text' | 'outlined' | 'contained';
  color: 'brand' | 'error' | 'success' | 'warning';
  size: 'small' | 'medium' | 'large' | '2xlarge' | '3xlarge';
  theme: BaseTheme;
}

const getColor = (color: 'brand' | 'error' | 'success' | 'warning', theme: ThemeColors): string => {
  const colorMap: { [key in 'brand' | 'error' | 'success' | 'warning']: string } = {
    brand: theme.primary.brand['600'],
    error: theme.primary.error['600'],
    success: theme.primary.success['600'],
    warning: theme.primary.warning['600'],
  };
  return colorMap[color];
};

export const ButtonStyles = ({ variant, color, size, theme }: ButtonStylesProps) => {
  const buttonColor = getColor(color, theme.colors);

  return css`
    position: relative;
    overflow: hidden;
    font-family: ${theme.typography.fontFamily};
    border: none;
    cursor: pointer;
    border-radius: ${theme.borderRadius[size]};
    display: flex;
    padding: ${theme.padding[size]};
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
    text-transform: uppercase;
    font-weight: 600;

    .slot-startIcon {
      margin-right: ${theme.spacing[size]};
      display: inline-flex;
      align-items: center;
    }

    .slot-endIcon {
      margin-left: ${theme.spacing[size]};
      display: inline-flex;
      align-items: center;
    }

    &:disabled {
      background-color: ${theme.colors.primary.gray['200']};
      color: ${theme.colors.primary.gray['400']};
      cursor: not-allowed;
    }

    &:focus {
      outline: 4px solid ${theme.colors.primary.brand['100']}; // Adjust outline color for focus
      outline-offset: 2px;
    }

    ${variant === 'contained' && css`
      background-color: ${buttonColor};
      color: #fff;

      &:hover {
        background-color: ${theme.colors.primary.brand['700']}; // Darker shade for hover effect
      }
      
      &:active {
        background-color: ${theme.colors.primary.brand['700']}; // Darker shade for active effect
      }

      &:disabled {
        background-color: ${theme.colors.primary.gray['300']};
        color: ${theme.colors.primary.gray['500']};
        cursor: not-allowed;
      }
    `}

    ${variant === 'outlined' && css`
      border: 2px solid ${buttonColor};
      background-color: transparent;
      color: ${buttonColor};

      &:hover {
        background-color: ${theme.colors.primary.brand['100']};
      }
      
      &:disabled {
        border-color: ${theme.colors.primary.gray['300']};
        color: ${theme.colors.primary.gray['500']};
        cursor: not-allowed;
      }
    `}

    ${variant === 'text' && css`
      background-color: transparent;
      color: ${buttonColor};

      &:hover {
        background-color: ${theme.colors.primary.brand['100']};
      }

      &:disabled {
        background-color: transparent;
        color: ${theme.colors.primary[color]['200']};
        cursor: not-allowed;
      }
    `}

    ${variant !== 'text' && size === 'large' && css`
      box-shadow: ${theme.shadows.lg};
    `}
    ${variant !== 'text' && size === 'medium' && css`
      box-shadow: ${theme.shadows.md};
    `}
    ${variant !== 'text' && size === 'small' && css`
      box-shadow: ${theme.shadows.sm};
    `}
  `;
};

// Helper function to adjust color brightness
const adjustColor = (color: string, amount: number) => {
  let r = parseInt(color.slice(1, 3), 16);
  let g = parseInt(color.slice(3, 5), 16);
  let b = parseInt(color.slice(5, 7), 16);

  r = Math.min(255, Math.max(0, Math.floor(r + (amount * 255))));
  g = Math.min(255, Math.max(0, Math.floor(g + (amount * 255))));
  b = Math.min(255, Math.max(0, Math.floor(b + (amount * 255))));

  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
};