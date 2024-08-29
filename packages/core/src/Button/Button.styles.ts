import { css } from '@emotion/react';
import { BaseTheme } from '@spark-ui/styles';

interface ButtonStylesProps {
  variant: 'text' | 'outlined' | 'contained';
  color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  size: 'small' | 'medium' | 'large';
  theme: BaseTheme;
}

export const ButtonStyles = ({ variant, color, size, theme }: ButtonStylesProps) => {
  return css`
    position: relative;
    overflow: hidden;  /* Ensure the ripple effect is contained within the button */
    font-family: ${theme.typography.fontFamily};
    border: none;
    cursor: pointer;
    padding: ${size === 'small' ? theme.spacing.small : size === 'large' ? theme.spacing.large : theme.spacing.medium};
    border-radius: ${theme.borderRadius};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, color 0.3s ease;
    text-transform: uppercase;
    font-weight: 600;

    .icon {
      display: flex;
      align-items: center;
    }

    .icon.start {
      margin-right: ${theme.spacing.small};
    }

    .icon.end {
      margin-left: ${theme.spacing.small};
    }

    &:disabled {
      background-color: #e0e0e0;
      color: #a0a0a0;
      cursor: not-allowed;
    }

    &:focus {
      outline: 2px solid ${theme.colors.primary};
    }

    ${variant === 'contained' && css`
      background-color: ${theme.colors[color]};
      color: #fff;

      &:hover {
        background-color: ${theme.colors[color] + 'd9'};
      }
    `}

    ${variant === 'outlined' && css`
      border: 2px solid ${theme.colors[color]};
      background-color: transparent;
      color: ${theme.colors[color]};

      &:hover {
        background-color: ${theme.colors[color] + '1a'};
      }
    `}

    ${variant === 'text' && css`
      background-color: transparent;
      color: ${theme.colors[color]};

      &:hover {
        background-color: ${theme.colors[color] + '1a'};
      }
    `}
  `;
};
