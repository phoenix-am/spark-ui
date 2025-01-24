import { css } from '@emotion/react';
import { BaseTheme } from '@spark-ui/styles';
import { createSpacing } from '@spark-ui/system';

interface InputBaseStylesProps {
  theme: BaseTheme;
  variant?: 'filled' | 'outlined' | 'standard';
  error?: boolean;
  disabled?: boolean;
  hasPrepend?: boolean;
  hasAppend?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const InputBaseStyles = ({ theme, variant, error, disabled, hasAppend, hasPrepend }: InputBaseStylesProps) => {
  const spacing = createSpacing();
  const baseStyles = css`
    padding: ${variant === 'standard' ? '8px 0' : '12px'};
    padding-left: ${hasPrepend ? spacing(4) : '12px'};
    padding-right: ${hasAppend ? spacing(4) : '12px'};
    border-radius: 4px;
    color: ${theme.colors.primary.gray['900']};
    background-color: ${variant === 'filled' ? theme.colors.primary.gray['50'] : theme.colors.primary.gray['300']};
    border: ${variant === 'standard' ? 'none' : `1px solid ${theme.colors.primary.gray['300']}`};
    border-bottom: ${variant === 'standard' ? `2px solid ${theme.colors.primary.gray['300']}` : ''};
    width: 100%;
    box-sizing: border-box;
    display: block

    &:focus {
      border-color: ${theme.colors.primary.brand['300']};
      box-shadow: 0 0 0 3px ${theme.colors.primary.brand['100']};
    }

    &:disabled {
      background-color: ${theme.colors.primary.gray['100']};
      color: ${theme.colors.primary.gray['500']};
      cursor: not-allowed;
    }

    ${error &&
    css`
      border-color: ${theme.colors.primary.error['400']};
      box-shadow: 0 0 0 3px ${theme.colors.primary.error['100']};
    `}
  `;

  const variantStyles = {
    filled: css`
      background-color: ${theme.colors.primary.gray['50']};
      border: none;
    `,
    outlined: css`
      border: 2px solid ${theme.colors.primary.gray['300']};
    `,
    standard: css`
      border-bottom: 2px solid ${theme.colors.primary.gray['300']};
      border-radius: 0;
    `,
  };

  return css`
    ${baseStyles};
    ${variant && variantStyles[variant]};
    ${disabled &&
    css`
      background-color: ${theme.colors.primary.gray['200']};
      border-color: ${theme.colors.primary.gray['300']};
    `}
  `;
};
