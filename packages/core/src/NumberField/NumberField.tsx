import React, { useRef } from 'react';
import { useButton, useLocale, useNumberField } from 'react-aria';
import { useNumberFieldState } from 'react-stately';
import type { AriaButtonProps } from 'react-aria';
import { InputBase } from '../base/InputBase';
import { useDefaults, slot, ClassNames } from '../internal/defaults';

export interface NumberFieldProps {
  /** Visible label. Use `aria-label` instead if there is no visible label. */
  label?: string;
  'aria-label'?: string;
  /** Controlled value; `null` when empty. */
  value?: number | null;
  defaultValue?: number | null;
  /** Called with the parsed number (or NaN when cleared) as the value commits. */
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  /** Step for the buttons and arrow keys. Default 1. */
  step?: number;
  /**
   * How the number looks, in the user's locale: `{ style: 'currency', currency: 'INR' }`,
   * `{ style: 'percent' }`, `{ style: 'unit', unit: 'kilogram' }`, `{ maximumFractionDigits: 2 }`…
   */
  formatOptions?: Intl.NumberFormatOptions;
  placeholder?: string;
  /** Help text under the field (shown in the error colour when `error` is `true`). */
  helperText?: React.ReactNode;
  /** An error message, or `true` to mark the field invalid and show `helperText` as the error. */
  error?: React.ReactNode | boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  /** Form field name; submits the plain number (e.g. 100000, not "₹1,00,000"). */
  name?: string;
  /** Hide the − / + buttons. */
  hideSteppers?: boolean;
  /** Default `medium`. */
  size?: 'small' | 'medium' | 'large';
  startIcon?: React.ReactNode;
  className?: string;
  /** Extra classes for each part: root, label, field, input, stepper, helper. */
  classNames?: ClassNames<'root' | 'label' | 'field' | 'input' | 'stepper' | 'helper'>;
}

/**
 * NumberField: a number input that formats as you'd write it in your
 * language (₹1,00,000 in India, $100,000 in the US, 15 %, 2.5 kg). Up/Down
 * and the − / + buttons step; Page Up/Down step by tens; Home/End jump to
 * min/max; values are clamped and snapped to `step` on blur. Built on React
 * Aria's number field and the InputBase base component.
 *
 * Style hooks: `.sp-number-field[data-invalid][data-disabled]`, `__label`,
 * `__stepper`, `__helper`; the field is `.sp-input-base`.
 */
export function NumberField(inProps: NumberFieldProps) {
  const {
    label,
    'aria-label': ariaLabel,
    value,
    defaultValue,
    onChange,
    min,
    max,
    step,
    formatOptions,
    placeholder,
    helperText,
    error,
    disabled,
    readOnly,
    required,
    name,
    hideSteppers,
    size = 'medium',
    startIcon,
    className,
    classNames,
  } = useDefaults('NumberField', inProps);
  const { locale } = useLocale();
  const invalid = Boolean(error);
  const message = typeof error === 'boolean' ? (error ? helperText : undefined) : error;
  const help = typeof error === 'boolean' || !error ? helperText : undefined;

  const ariaProps = {
    label,
    'aria-label': ariaLabel,
    value: value === null ? NaN : value,
    defaultValue: defaultValue === null ? NaN : defaultValue,
    onChange,
    minValue: min,
    maxValue: max,
    step,
    formatOptions,
    placeholder,
    isDisabled: disabled,
    isReadOnly: readOnly,
    isRequired: required,
    isInvalid: invalid,
    validationBehavior: 'aria' as const,
    description: help ? 'description' : undefined,
    errorMessage: invalid && message ? 'error' : undefined,
  };
  const state = useNumberFieldState({ ...ariaProps, locale });
  const inputRef = useRef<HTMLInputElement>(null);
  const { labelProps, groupProps, inputProps, incrementButtonProps, decrementButtonProps, descriptionProps, errorMessageProps } = useNumberField(
    ariaProps,
    state,
    inputRef,
  );

  return (
    <div
      className={slot('sp-number-field', classNames, 'root', className)}
      data-tone={invalid ? 'error' : 'brand'}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
    >
      {label && (
        <label {...labelProps} className={slot('sp-number-field__label', classNames, 'label')}>
          {label}
          {required && (
            <span className="sp-field__required" aria-hidden="true">
              {' '}*
            </span>
          )}
        </label>
      )}
      <div {...groupProps}>
        <InputBase
          {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
          ref={inputRef}
          size={size}
          error={invalid}
          disabled={disabled}
          classNames={{ root: slot('sp-number-field__field', classNames, 'field'), input: slot('sp-number-field__input', classNames, 'input') }}
          startAdornment={startIcon}
          endAdornment={
            hideSteppers ? undefined : (
              <span className="sp-number-field__steppers">
                <Stepper {...decrementButtonProps} kind="decrement" className={classNames?.stepper} />
                <Stepper {...incrementButtonProps} kind="increment" className={classNames?.stepper} />
              </span>
            )
          }
        />
      </div>
      {name && <input type="hidden" name={name} value={Number.isNaN(state.numberValue) ? '' : String(state.numberValue)} />}
      {invalid && message ? (
        <p {...errorMessageProps} className={slot('sp-number-field__helper', classNames, 'helper')}>
          {message}
        </p>
      ) : (
        help && (
          <p {...descriptionProps} className={slot('sp-number-field__helper', classNames, 'helper')}>
            {help}
          </p>
        )
      )}
    </div>
  );
}

function Stepper({ kind, className, ...props }: AriaButtonProps & { kind: 'increment' | 'decrement'; className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);
  return (
    <button {...buttonProps} ref={ref} className={slot('sp-field-button sp-number-field__stepper', { stepper: className }, 'stepper')} data-kind={kind}>
      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
        <path d={kind === 'increment' ? 'M8 3v10M3 8h10' : 'M3 8h10'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
}

export default NumberField;
