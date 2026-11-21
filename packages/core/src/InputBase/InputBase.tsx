import React from 'react';
import { InputBaseProps } from './InputBase.types';
import { cx } from '../internal/cx';

/**
 * InputBase: a bare Live Wire input for building your own fields.
 * Style hooks: `.sp-input-base[data-variant]`, `__input`, `__start`, `__end`.
 */
export const InputBase = React.forwardRef<HTMLInputElement, InputBaseProps>(function InputBase(
  { variant = 'outlined', error = false, disabled = false, startAdornment, endAdornment, className, ...props },
  ref,
) {
  return (
    <div
      className="sp-input-base"
      data-variant={variant}
      data-tone={error ? 'error' : 'brand'}
      data-invalid={error || undefined}
      data-has-start={startAdornment ? true : undefined}
      data-has-end={endAdornment ? true : undefined}
    >
      {startAdornment && <div className="sp-input-base__start">{startAdornment}</div>}
      <input
        ref={ref}
        className={cx('sp-input-base__input', className)}
        disabled={disabled}
        aria-invalid={error || undefined}
        {...props}
      />
      {endAdornment && <div className="sp-input-base__end">{endAdornment}</div>}
    </div>
  );
});

export default InputBase;
