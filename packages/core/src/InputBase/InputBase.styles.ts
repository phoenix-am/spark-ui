import { css } from '@emotion/react';
import { BaseTheme } from '@spark-ui/styles';
import { alpha } from '@spark-ui/utils';

interface InputBaseStylesProps {
  theme: BaseTheme;
  variant?: 'filled' | 'outlined' | 'standard';
  error?: boolean;
  disabled?: boolean;
  hasPrepend?: boolean;
  hasAppend?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const InputBaseStyles = ({ theme, variant = 'outlined', error, hasAppend, hasPrepend }: InputBaseStylesProps) => {
  const accent = error ? theme.colors.primary.error['400'] : theme.energy.current;
  const idle = error ? theme.colors.primary.error['400'] : theme.surface.border;

  return css`
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: ${variant === 'standard' ? '0.5rem 0' : '0.75rem'};
    padding-left: ${hasPrepend ? '2.5rem' : variant === 'standard' ? '0' : '0.75rem'};
    padding-right: ${hasAppend ? '2.5rem' : variant === 'standard' ? '0' : '0.75rem'};
    font-family: ${theme.typography.fontFamily};
    font-size: ${theme.typography.fontSize.medium};
    color: ${theme.text.primary};
    caret-color: ${theme.energy.current};
    background-color: ${variant === 'filled' ? theme.surface.raised : variant === 'standard' ? 'transparent' : theme.surface.base};
    border: ${variant === 'standard' ? 'none' : `2px solid ${variant === 'filled' ? 'transparent' : idle}`};
    border-bottom: 2px solid ${idle};
    border-radius: ${variant === 'standard' ? '0' : theme.borderRadius.medium};
    outline: none;
    transition: border-color ${theme.motion.normal}, box-shadow ${theme.motion.normal};

    &::placeholder {
      color: ${theme.colors.primary.gray['300']};
    }

    &:focus {
      border-color: ${accent};
      box-shadow: ${variant === 'standard' ? 'none' : `0 0 0 3px ${alpha(accent, 0.18)}`};
    }

    &:disabled {
      background-color: ${theme.surface.raised};
      border-style: dashed;
      border-color: ${theme.surface.border};
      color: ${theme.text.disabled};
      cursor: not-allowed;
    }
  `;
};
