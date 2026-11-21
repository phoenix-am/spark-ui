import { css } from '@emotion/react';
import { BaseTheme } from '@spark-ui/styles';
import { alpha } from '@spark-ui/utils';
import { currentLine } from '../internal/tone';

interface TextFieldStylesProps {
  theme: BaseTheme;
  hasError?: boolean;
  disabled?: boolean;
  focused?: boolean;
  charged?: boolean;
  size: 'small' | 'medium' | 'large';
}

const heights = { small: '2.25rem', medium: '2.875rem', large: '3.375rem' };

export const TextfieldStyles = ({ theme, hasError, disabled, focused, charged, size }: TextFieldStylesProps) => {
  const err = theme.colors.primary.error['400'];
  const accent = hasError ? err : theme.energy.current;

  return {
    baseStyles: css`
      width: 100%;
      box-sizing: border-box;
      margin-bottom: 1rem;
      font-family: ${theme.typography.fontFamily};
    `,
    inputContainer: css`
      display: flex;
      align-items: center;
      gap: 0.625rem;
      min-height: ${heights[size]};
      padding: 0 0.875rem;
      box-sizing: border-box;
      background-color: ${theme.surface.base};
      border: 2px solid ${hasError ? err : theme.surface.border};
      border-radius: ${theme.borderRadius.medium};
      transition: border-color ${theme.motion.normal}, box-shadow ${theme.motion.normal};
      position: relative;
      cursor: text;

      &:hover {
        border-color: ${hasError ? err : theme.surface.borderStrong};
      }

      ${(focused || charged) &&
      !disabled &&
      css`
        border-color: ${accent};
        &:hover {
          border-color: ${accent};
        }
        box-shadow: 0 0 0 3px ${alpha(accent, 0.18)}${charged ? `, 0 0 18px ${alpha(accent, 0.3)}` : ''};
      `}

      ${disabled &&
      css`
        background-color: ${theme.surface.raised};
        border-style: dashed;
        border-color: ${theme.surface.border};
        cursor: not-allowed;
        &:hover {
          border-color: ${theme.surface.border};
        }
      `}
    `,
    inputStyles: css`
      flex-grow: 1;
      min-width: 0;
      border: none;
      outline: none;
      background: transparent;
      padding: 0;
      font-size: ${theme.typography.fontSize[size]};
      font-family: ${theme.typography.fontFamily};
      color: ${disabled ? theme.text.disabled : theme.text.primary};
      caret-color: ${theme.energy.current};

      &::placeholder {
        color: ${theme.colors.primary.gray['300']};
      }
      &:disabled {
        cursor: not-allowed;
      }
    `,
    labelStyles: css`
      display: block;
      margin-bottom: 0.375rem;
      color: ${disabled ? theme.text.disabled : theme.text.primary};
      font-size: ${theme.typography.fontSize.small};
      font-weight: 600;
    `,
    helperTextStyles: css`
      margin: 0.375rem 0 0;
      color: ${hasError ? err : theme.text.secondary};
      font-size: ${theme.typography.fontSize.small};
    `,
    adornment: css`
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${hasError ? err : focused ? theme.energy.current : theme.text.secondary};
      transition: color ${theme.motion.normal};

      svg > path {
        stroke: currentColor;
      }
    `,
    meterTrack: css`
      margin-top: 0.5rem;
      height: 6px;
      border-radius: 3px;
      background: ${theme.surface.border};
      overflow: hidden;
    `,
    meterFill: (percent: number) => css`
      width: ${percent}%;
      height: 100%;
      border-radius: 3px;
      transition: width ${theme.motion.normal} ${theme.motion.easing};
      ${percent >= 100
        ? css`
            background-color: ${alpha(theme.energy.current, 0.25)};
            ${currentLine(theme.energy.current)};
          `
        : css`
            background-color: ${hasError ? err : theme.energy.current};
          `}
    `,
    meterLabel: css`
      display: block;
      margin-top: 0.375rem;
      font-size: ${theme.typography.fontSize.small};
      color: ${charged ? theme.energy.current : theme.text.secondary};
    `,
  };
};
