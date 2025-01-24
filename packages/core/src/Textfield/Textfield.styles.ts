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
      background-color: ${theme.colors.primary.gray['25']};
      border: 1px solid ${theme.colors.primary.gray['300']};
      border-radius: ${theme.borderRadius[size]};
      padding: ${theme.spacing[size]};
      transition: border-color 0.3s ease;
      position: relative;

      &:hover {
        border-color: ${theme.colors.primary.gray['400']};
      }

      ${disabled &&
      css`
        background-color: ${theme.colors.primary.gray['50']};
        border-color: ${theme.colors.primary.gray['300']};
        color: ${theme.colors.primary.gray['400']};
        cursor: not-allowed;
      `}

      ${hasError &&
      css`
        border-color: ${theme.colors.primary.error['400']};
      `}

      ${focused &&
      css`
        border-color: ${theme.colors.primary.brand['300']};
        outline: 3px solid ${theme.colors.primary.brand['200']};
      `}
    `,
    inputStyles: css`
      flex-grow: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: ${theme.spacing[size]};
      font-family: ${theme.typography.fontFamily};
      color: ${theme.colors.primary.gray['900']};
      padding: 0;

      &::placeholder {
        color: ${theme.colors.primary.gray['500']};
      }

      ${disabled &&
      css`
        color: ${theme.colors.primary.gray['500']};
      `}
    `,
    labelStyles: css`
      display: block;
      margin-bottom: 4px;
      color: ${hasError ? theme.colors.primary.error['500'] : theme.colors.primary.gray['700']};
      font-size: ${theme.typography.fontSize};
      font-family: ${theme.typography.fontFamily};
    `,
    helperTextStyles: css`
      margin-top: 4px;
      color: ${hasError ? theme.colors.primary.error['500'] : theme.colors.primary.gray['600']};
      font-size: ${theme.typography.fontSize.small};
      font-family: ${theme.typography.fontFamily};
    `,
    prependStyles: css`
      margin-right: ${theme.spacing[size]};
      color: ${theme.colors.primary.gray['700']};
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        > path {
          stroke: ${theme.colors.primary.gray['700']};
        }
      }

      ${disabled &&
      css`
        color: ${theme.colors.primary.gray['500']};
      `}
    `,
    appendStyles: css`
      margin-left: ${theme.spacing[size]};
      color: ${theme.colors.primary.gray['700']};
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        > path {
          stroke: ${!hasError ? theme.colors.primary.gray['400'] : theme.colors.primary.error['400']};
        }
      }

      ${disabled &&
      css`
        color: ${theme.colors.primary.gray['500']};
      `}

      ${hasError &&
      css`
        color: ${theme.colors.primary.error['400']};
      `}
    `,
  };
};
