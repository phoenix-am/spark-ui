import { css } from '@emotion/react';
import { Theme, Sizes } from '@spark-ui/styles';

export interface DropdownStylesProps {
  theme: Theme;
  size: Sizes;
  disabled?: boolean;
  focused?: boolean;
  showBorder?: boolean;
}

export const dropdownFieldStyles = ({ theme, size, disabled, focused, showBorder }: DropdownStylesProps) => ({
  container: css({
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  }),
  label: css({
    marginBottom: theme.spacing[size],
    fontSize: `${theme.typography.fontSize[size as 'small' | 'medium' | 'large']}`,
    color: theme.colors.primary.gray['700'],
  }),
  control: css({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing[size],
    ...(showBorder && {border: `1px solid ${theme.colors.primary.gray['300']}`}),
    borderRadius: theme.borderRadius[size as 'small' | 'medium' | 'large' | 'xlarge'],
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',

    '&:hover': {
      borderColor: theme.colors.primary.gray['300'],
    },

    '&.error': {
      borderColor: theme.colors.primary.error['500'],
    },

    ...(disabled &&
      {
        backgroundColor: theme.colors.primary.gray['50'],
        borderColor: theme.colors.primary.gray['300'],
        color: theme.colors.primary.gray['400'],
        cursor: 'not-allowed',
      }),
  
      ...(focused &&
      {
        borderColor: theme.colors.primary.brand['300'],
        outline: `3px solid ${theme.colors.primary.brand['200']}`,
      })
  }),
  input: css({
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    flex: 1,
    fontSize: `${theme.typography.fontSize[size as 'small' | 'medium' | 'large']}`,
    color: theme.colors.primary.gray['700'],
    cursor: 'pointer',
    width: '100%'
  }),
  icon: css({
    display: 'flex',
    alignItems: 'center',
    marginRight: `${theme.spacing[size]}`,
  }),
  dropdownIcon: css({
    display: 'inline-flex',
    alignItems: 'center',
    marginLeft: 'auto',
    color: theme.colors.primary.gray['500'],
  }),
  dropdown: css({
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: theme.colors.primary.gray['50'],
    border: `1px solid ${theme.colors.primary.gray['100']}`,
    borderRadius: theme.borderRadius[size as 'small' | 'medium' | 'large' | 'xlarge'],
    boxShadow: theme.shadows[size],
    zIndex: theme.zIndex.dropdown,
    maxHeight: '200px',
    overflowY: 'auto',
    marginTop: theme.spacing[size],
    listStyle: 'none',
    padding: 0,
  }),
  helperText: css({
    marginTop: theme.spacing[size],
    fontSize: `${theme.typography.fontSize[size as 'small' | 'medium' | 'large']}`,
    color: theme.colors.primary.gray['400'],
  }),
});
