import { css } from '@emotion/react';
import { Sizes, Theme } from '@spark-ui/styles';
import { alpha } from '@spark-ui/utils';

interface DropdownOptionStyleProps {
  theme: Theme;
  size: Sizes;
}

export const selectFieldOptionStyles = ({ theme, size }: DropdownOptionStyleProps) => {
  const textSize = (['small', 'medium', 'large'].includes(size) ? size : 'medium') as 'small' | 'medium' | 'large';
  return {
    option: css`
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem 0.625rem 1.5rem;
      border-radius: ${theme.borderRadius.small};
      cursor: pointer;
      transition: background-color ${theme.motion.fast};

      /* The node: dark when idle, lit when this option carries the current. */
      &::before {
        content: '';
        position: absolute;
        left: 0.625rem;
        top: 50%;
        width: 6px;
        height: 6px;
        margin-top: -3px;
        border-radius: 50%;
        background: ${theme.energy.off};
        transition: background ${theme.motion.fast}, box-shadow ${theme.motion.fast};
      }

      &:hover {
        background-color: ${theme.surface.border};
      }
      &:hover::before {
        background: ${theme.text.secondary};
      }

      &.selected {
        background-color: ${alpha(theme.energy.current, 0.1)};
      }
      &.selected::before {
        background: ${theme.energy.current};
        box-shadow: 0 0 8px ${theme.energy.glow};
      }

      > .dropdown__label {
        font-family: ${theme.typography.fontFamily};
        font-size: ${theme.typography.fontSize[textSize]};
        color: ${theme.text.primary};
        display: flex;
        gap: 0.5rem;

        > .dropdown__prepend__icon {
          display: inline-flex;
          align-items: center;
          color: ${theme.text.secondary};
          svg > path {
            stroke: currentColor;
          }
        }
      }

      > .dropdown__option__selected {
        display: inline-flex;
        align-items: center;

        svg > path {
          stroke: ${theme.energy.current};
        }
      }
    `,
  };
};
