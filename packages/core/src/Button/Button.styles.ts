import { css } from '@emotion/react';
import { BaseTheme } from '@spark-ui/styles';
import { ButtonColor, ButtonSize, ButtonVariant } from './Button.types';
import { currentLine, getTone } from '../internal/tone';

interface ButtonStylesProps {
  variant: ButtonVariant;
  color: ButtonColor;
  size: ButtonSize;
  fullWidth?: boolean;
  disableElevation?: boolean;
  theme: BaseTheme;
}

const heights: Record<ButtonSize, string> = { small: '2.25rem', medium: '2.75rem', large: '3.25rem' };
const paddings: Record<ButtonSize, string> = { small: '0 0.875rem', medium: '0 1.25rem', large: '0 1.75rem' };

export const ButtonStyles = ({ variant, color, size, fullWidth, disableElevation, theme }: ButtonStylesProps) => {
  const tone = getTone(color, theme);

  return css`
    position: relative;
    overflow: visible;
    display: ${fullWidth ? 'flex' : 'inline-flex'};
    width: ${fullWidth ? '100%' : 'auto'};
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: ${heights[size]};
    padding: ${paddings[size]};
    box-sizing: border-box;
    font-family: ${theme.typography.fontFamily};
    font-size: ${theme.typography.fontSize[size]};
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.01em;
    text-decoration: none;
    border-radius: ${theme.borderRadius.medium};
    border: 2px solid transparent;
    cursor: pointer;
    user-select: none;
    transition:
      background-color ${theme.motion.normal} ${theme.motion.easing},
      box-shadow ${theme.motion.normal} ${theme.motion.easing},
      transform ${theme.motion.fast} ${theme.motion.easing},
      color ${theme.motion.normal};

    .slot-startIcon,
    .slot-endIcon {
      display: inline-flex;
      align-items: center;
    }

    /* The wire under text/outlined buttons. Current flows through it on hover. */
    &::after {
      content: '';
      position: absolute;
      left: 0.75rem;
      right: 0.75rem;
      bottom: 0.3rem;
      height: 2px;
      border-radius: 1px;
      opacity: 0;
      transition: opacity ${theme.motion.fast};
    }

    &:active:not(:disabled) {
      transform: translateY(1px);
    }

    &:focus-visible {
      outline: 2px solid ${tone.fill};
      outline-offset: 3px;
    }

    ${variant === 'contained' &&
    css`
      background-color: ${tone.fill};
      border-color: ${tone.fill};
      color: ${theme.text.onEnergy};
      box-shadow: ${disableElevation ? 'none' : `0 0 18px ${tone.glow}`};

      &:hover:not(:disabled) {
        background-color: ${tone.hover};
        box-shadow: ${disableElevation ? 'none' : `0 0 30px ${tone.glowStrong}`};
      }
    `}

    ${variant === 'outlined' &&
    css`
      background-color: transparent;
      border-color: ${tone.fill};
      color: ${tone.fill};

      &:hover:not(:disabled) {
        background-color: ${theme.surface.raised};
        box-shadow: inset 0 0 12px ${tone.glow};
      }
      &:hover:not(:disabled)::after {
        opacity: 1;
        ${currentLine(tone.fill)};
      }
    `}

    ${variant === 'text' &&
    css`
      background-color: transparent;
      color: ${tone.fill};

      &:hover:not(:disabled)::after {
        opacity: 1;
        ${currentLine(tone.fill)};
      }
    `}

    /* Disabled = no power in the circuit. */
    &:disabled,
    &[aria-disabled='true'] {
      cursor: not-allowed;
      color: ${theme.text.disabled};
      background-color: ${variant === 'contained' ? theme.surface.raised : 'transparent'};
      border-color: ${variant === 'text' ? 'transparent' : theme.surface.border};
      border-style: ${variant === 'text' ? 'solid' : 'dashed'};
      box-shadow: none;
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  `;
};
