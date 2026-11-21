import { css } from '@emotion/react';
import { Theme, Sizes } from '@spark-ui/styles';
import { alpha } from '@spark-ui/utils';

export interface DropdownStylesProps {
  theme: Theme;
  size: Sizes;
  disabled?: boolean;
  focused?: boolean;
  showBorder?: boolean;
  error?: boolean;
  open?: boolean;
}

type TextSize = 'small' | 'medium' | 'large';

export const dropdownFieldStyles = ({ theme, size, disabled, focused, showBorder, error, open }: DropdownStylesProps) => {
  const textSize = (['small', 'medium', 'large'].includes(size) ? size : 'medium') as TextSize;
  const err = theme.colors.primary.error['400'];
  const active = (focused || open) && !disabled;
  const borderColor = error ? err : active ? theme.energy.current : theme.surface.border;

  return {
    container: css({
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      fontFamily: theme.typography.fontFamily,
    }),
    label: css({
      marginBottom: '0.375rem',
      fontSize: theme.typography.fontSize.small,
      fontWeight: 600,
      color: disabled ? theme.text.disabled : theme.text.primary,
    }),
    control: css({
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      minHeight: textSize === 'small' ? '2.25rem' : textSize === 'medium' ? '2.875rem' : '3.375rem',
      padding: '0 0.875rem',
      boxSizing: 'border-box',
      border: showBorder ? `2px solid ${borderColor}` : '2px solid transparent',
      borderRadius: theme.borderRadius.medium,
      backgroundColor: disabled ? theme.surface.raised : theme.surface.base,
      cursor: disabled ? 'not-allowed' : 'pointer',
      boxShadow: active && showBorder ? `0 0 0 3px ${alpha(error ? err : theme.energy.current, 0.18)}` : 'none',
      transition: `border-color ${theme.motion.normal}, box-shadow ${theme.motion.normal}`,
      ...(disabled && { borderStyle: 'dashed' }),

      '&:hover': {
        borderColor: showBorder && !active && !error ? theme.surface.borderStrong : undefined,
      },
    }),
    input: css({
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      flex: 1,
      minWidth: 0,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize[textSize],
      color: disabled ? theme.text.disabled : theme.text.primary,
      cursor: 'inherit',
      width: '100%',
      '&::placeholder': { color: theme.colors.primary.gray['300'] },
    }),
    icon: css({
      display: 'flex',
      alignItems: 'center',
      color: theme.text.secondary,
      'svg > path': { stroke: 'currentColor' },
    }),
    dropdownIcon: css({
      display: 'inline-flex',
      alignItems: 'center',
      marginLeft: 'auto',
      color: active ? theme.energy.current : theme.text.secondary,
      transition: `color ${theme.motion.normal}`,
      'svg > path': { stroke: 'currentColor' },
    }),
    dropdown: css({
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: theme.surface.raised,
      border: `1px solid ${theme.surface.borderStrong}`,
      borderRadius: theme.borderRadius.medium,
      boxShadow: `${theme.shadows.large}, 0 0 0 1px ${alpha(theme.energy.current, 0.08)}`,
      zIndex: theme.zIndex.dropdown,
      maxHeight: '240px',
      overflowY: 'auto',
      marginTop: '0.375rem',
      listStyle: 'none',
      padding: '0.25rem',
    }),
    helperText: css({
      marginTop: '0.375rem',
      fontSize: theme.typography.fontSize.small,
      color: error ? err : theme.text.secondary,
    }),
  };
};
