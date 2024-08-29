import { css } from '@emotion/react';
import { BaseTheme } from '@spark-ui/styles';

interface TextFieldStylesProps {
  theme: BaseTheme;
  hasError?: boolean;
  disabled?: boolean;
  focused?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
  size: 'small' | 'medium' | 'large';
}

export const TextfieldStyles = ({ theme, hasError, disabled, focused, size }: TextFieldStylesProps) => {
  return {
    baseStyles: css`
      width: 100%;
      box-sizing: border-box;
      margin-bottom: 16px;
    `,
    inputContainer: css`
      display: flex;
      align-items: center;
      background-color: ${theme.colors.gray[25]};
      border: 1px solid ${theme.colors.gray[300]};
      border-radius: ${theme.borderRadius[size]};
      padding: ${theme.spacing[size]};
      transition: border-color 0.3s ease;
      position: relative;

      &:hover {
        border-color: ${theme.colors.primary};
      }

      ${disabled &&
      css`
        background-color: ${theme.colors.gray[50]};
        border-color: ${theme.colors.gray[300]};
        color: ${theme.colors.gray[400]};
        cursor: not-allowed;
      `}

      ${hasError &&
      css`
        border-color: ${theme.colors.error};
      `}

      ${focused &&
      css`
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 2px ${theme.colors.primaryLight};
      `}
    `,
    inputStyles: css`
      flex-grow: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: ${theme.spacing[size]};
      font-family: ${theme.typography.fontFamily};
      color: ${theme.colors.text.primary};
      padding: 0;

      &::placeholder {
        color: ${theme.colors.text.secondary};
      }

      ${disabled &&
      css`
        color: ${theme.colors.text.disabled};
      `}
    `,
    labelStyles: css`
      display: block;
      margin-bottom: 4px;
      color: ${hasError ? theme.colors.error : theme.colors.text.secondary};
      font-size: ${theme.typography.fontSize};
      font-family: ${theme.typography.fontFamily};
    `,
    helperTextStyles: css`
      margin-top: 4px;
      color: ${hasError ? theme.colors.error : theme.colors.text.secondary};
      font-size: ${theme.typography.fontSize.small};
    `,
    prependStyles: css`
      margin-right: ${theme.spacing[size]};
      color: ${theme.colors.text.secondary};

      ${disabled &&
      css`
        color: ${theme.colors.text.disabled};
      `}
    `,
    appendStyles: css`
      margin-left: ${theme.spacing[size]};
      color: ${theme.colors.text.secondary};

      ${disabled &&
      css`
        color: ${theme.colors.text.disabled};
      `}
    `,
  };
};
