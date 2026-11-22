import React, { forwardRef, useRef } from 'react';
import { mergeRefs } from 'react-aria';
import { slot, ClassNames } from '../internal/defaults';

export interface InputBaseProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** `outlined` (default), `filled` or `standard` (underline only). */
  variant?: 'outlined' | 'filled' | 'standard';
  /** Marks the field invalid. */
  error?: boolean;
  /** Turns the control off: it can't be focused or changed, and it's announced as disabled. */
  disabled?: boolean;
  /** Height 36, 46 or 54px. Default `medium`. */
  size?: 'small' | 'medium' | 'large';
  /** Shown before the input, e.g. an icon or a currency sign. */
  startAdornment?: React.ReactNode;
  /** Shown after the input, e.g. a clear button or a chevron. */
  endAdornment?: React.ReactNode;
  /** Props for the outer shell (data attributes, handlers, style). */
  rootProps?: React.HTMLAttributes<HTMLDivElement> & { [key: `data-${string}`]: unknown };
  /** Ref for the outer shell, e.g. to anchor a popover. */
  rootRef?: React.Ref<HTMLDivElement>;
  /** Extra classes for each part: root, input, adornment. */
  classNames?: ClassNames<'root' | 'input' | 'adornment'>;
}

/**
 * The bare text input under Textfield and friends, with adornment slots. Use
 * it when you want Sparkwire's input behaviour in your own field.
 *
 * The field shell under Textfield and Combobox. One bordered box
 * holds the input and its adornments, lights up on focus, dashes when
 * disabled, and focuses the input when you click anywhere in it. Build your
 * own fields on it; label and help text are up to you (see Field).
 *
 * Style hooks: `.sp-input-base[data-variant][data-size][data-invalid][data-disabled]`,
 * `__input`, `__adornment`. Focus uses `:focus-within`.
 */
export const InputBase = forwardRef<HTMLInputElement, InputBaseProps>(function InputBase(
  { variant = 'outlined', error = false, disabled = false, size = 'medium', startAdornment, endAdornment, rootProps, rootRef, className, classNames, ...props },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      {...rootProps}
      ref={rootRef}
      className={slot('sp-input-base', classNames, 'root', rootProps?.className)}
      data-variant={variant}
      data-size={size}
      data-tone={error ? 'error' : (rootProps?.['data-tone'] as string | undefined) ?? 'brand'}
      data-invalid={error || undefined}
      data-disabled={disabled || undefined}
      onMouseDown={(e) => {
        rootProps?.onMouseDown?.(e);
        // Clicking the shell's padding focuses the input, like a native field.
        if (e.target === e.currentTarget && !disabled) {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }}
    >
      {startAdornment && <div className={slot('sp-input-base__adornment', classNames, 'adornment')}>{startAdornment}</div>}
      <input
        ref={mergeRefs(inputRef, ref) as React.Ref<HTMLInputElement>}
        className={slot('sp-input-base__input', classNames, 'input', className)}
        disabled={disabled}
        aria-invalid={error || undefined}
        {...props}
      />
      {endAdornment && <div className={slot('sp-input-base__adornment', classNames, 'adornment')}>{endAdornment}</div>}
    </div>
  );
});

export default InputBase;
