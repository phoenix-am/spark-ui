import React, { forwardRef, useEffect, useId, useRef } from 'react';
import { Tone } from '../internal/tone';
import { cx } from '../internal/cx';
import { useForkRef } from '../Textfield/useForkRef';
import { useDefaults, slot, ClassNames } from '../internal/defaults';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Text next to the box. */
  label?: React.ReactNode;
  /** Shows a dash: some, but not all, of a group is selected. */
  indeterminate?: boolean;
  /** Colour when checked. Default `brand`. */
  color?: Tone;
  /** Default `medium`. */
  size?: 'small' | 'medium' | 'large';
  /** Help or error text under the label. */
  helperText?: React.ReactNode;
  /** Marks the checkbox invalid and colours it with the error tone. */
  error?: boolean;
  /** Extra classes for each part: root, box, label, helper. */
  classNames?: ClassNames<'root' | 'box' | 'label' | 'helper'>;
}

/**
 * Checkbox: a terminal. Checking it powers the terminal: it fills with current
 * and the tick is drawn in. Built on a native checkbox, so forms and keyboards work.
 *
 * Style hooks: `.sp-checkbox`, `__box`, `__label`, `__helper`; the native input
 * drives `:checked`, `:indeterminate` and `:disabled`.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(inProps, ref) {
  const { label, indeterminate = false, color = 'brand', size = 'medium', helperText, error, disabled, id, className, classNames, ...rest } = useDefaults('Checkbox', inProps);
  const innerRef = useRef<HTMLInputElement>(null);
  const handleRef = useForkRef(ref, innerRef);
  const autoId = useId();
  const inputId = id ?? autoId;
  const helperId = `${inputId}-helper`;

  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <div
      className={slot('sp-checkbox', classNames, 'root', className)}
      data-tone={error ? 'error' : color}
      data-size={size}
      data-invalid={error || undefined}
      data-disabled={disabled || undefined}
    >
      <label htmlFor={inputId} className="sp-checkbox__row">
        <input
          ref={handleRef}
          id={inputId}
          type="checkbox"
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={helperText ? helperId : undefined}
          className="sp-checkbox__input"
          {...rest}
        />
        <span className={slot('sp-checkbox__box', classNames, 'box')} aria-hidden="true">
          <svg className="sp-checkbox__tick" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7.5l3 3 6-7" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="18" />
          </svg>
          <svg className="sp-checkbox__dash" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </span>
        {label && <span className={slot('sp-checkbox__label', classNames, 'label')}>{label}</span>}
      </label>
      {helperText && (
        <span id={helperId} className={slot('sp-checkbox__helper', classNames, 'helper')}>
          {helperText}
        </span>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
export default Checkbox;
