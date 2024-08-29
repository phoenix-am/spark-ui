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
    color: ${theme.colors.text.primary};
    background-color: ${variant === 'filled' ? theme.colors.gray[50] : theme.colors.background};
    border: ${variant === 'standard' ? 'none' : `1px solid ${theme.colors.border}`};
    border-bottom: ${variant === 'standard' ? `2px solid ${theme.colors.border}` : ''};
    width: 100%;
    box-sizing: border-box;
    display: block

    &:focus {
      border-color: ${theme.colors.primary};
      box-shadow: 0 0 0 3px ${theme.colors.primaryLight};
    }

    &:disabled {
      background-color: ${theme.colors.gray[100]};
      color: ${theme.colors.text.disabled};
      cursor: not-allowed;
    }

    ${error &&
    css`
      border-color: ${theme.colors.error};
      box-shadow: 0 0 0 3px ${theme.colors.errorLight};
    `}
  `;

  const variantStyles = {
    filled: css`
      background-color: ${theme.colors.gray[50]};
      border: none;
    `,
    outlined: css`
      border: 2px solid ${theme.colors.border};
    `,
    standard: css`
      border-bottom: 2px solid ${theme.colors.border};
      border-radius: 0;
    `,
  };

  return css`
    ${baseStyles};
    ${variant && variantStyles[variant]};
    ${disabled &&
    css`
      background-color: ${theme.colors.gray[200]};
      border-color: ${theme.colors.gray[300]};
    `}
  `;
};
