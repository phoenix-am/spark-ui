import { css } from '@emotion/react';
import { Sizes, Theme } from '@spark-ui/styles';

interface DropdownOptionStyleProps {
  theme: Theme;
  size: Sizes;
}

export const selectFieldOptionStyles = ({ theme, size }: DropdownOptionStyleProps) => {
  return {
    option: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: ${theme.spacing[size]};
      cursor: pointer;

      &:hover {
        background-color: ${theme.colors.primary.gray['100']};
      }

      &.selected {
        background-color: ${theme.colors.primary.gray['100']};
      }

      > .dropdown__label {
        font-family: ${theme.typography.fontFamily};
        font-size: ${theme.typography.fontSize[size as 'small' | 'medium' | 'large']};
        color: ${theme.colors.primary.gray['900']};
        display: flex;
        gap: 0.5rem;

        > .dropdown__prepend__icon {
          display: inline-flex;
          align-items: center;
        }
      },
      
      > .dropdown__option__selected {
        display: inline-flex;
        align-items: center;

        svg {
          > path {
            stroke: ${theme.colors.primary.brand['500']};
          }
        }
      },
    `,
  }
};