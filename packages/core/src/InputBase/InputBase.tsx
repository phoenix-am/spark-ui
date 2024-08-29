import React, { RefObject } from 'react';
import { InputBaseProps } from './InputBase.types';
import { InputBaseStyles } from './InputBase.styles';
import { useTheme } from '@spark-ui/system';
import { css } from '@emotion/react';

export const InputBase = React.forwardRef<HTMLInputElement, InputBaseProps>(({
  variant = 'outlined',
  error = false,
  disabled = false,
  startAdornment,
  endAdornment,
  ...props
}, ref) => {
  const {theme} = useTheme();
  const styles = InputBaseStyles({
    theme,
    variant,
    error,
    disabled,
    hasPrepend: !!startAdornment,
    hasAppend: !!endAdornment,
  });

  return (
    <div css={css`
      display: flex;
      align-items: center;
      position: relative;
      width: 100%;
    `}>
      {startAdornment && (
        <div css={css`
          position: absolute;
          left: 12px;
          display: flex;
          align-items: center;
        `}>
          {startAdornment}
        </div>
      )}
      <input
        ref={ref as RefObject<HTMLInputElement>}
        css={styles}
        disabled={disabled}
        {...props}
      />
      {endAdornment && (
        <div css={css`
          position: absolute;
          right: 12px;
          display: flex;
          align-items: center;
        `}>
          {endAdornment}
        </div>
      )}
    </div>
  );
});

InputBase.displayName = 'InputBase';

export default InputBase;
