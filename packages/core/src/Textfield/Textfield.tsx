import { forwardRef, useId, useRef } from 'react';
import { InputBase } from '../base/InputBase';
import { TextfieldPropsBase } from './Textfield.types';
import { useTextField } from './useTextfield';
import { useForkRef } from './useForkRef';
import { cx } from '../internal/cx';
import { useDefaults, slot, ClassNames } from '../internal/defaults';

const clamp = (n: number) => Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0));

const defaultChargeLabel = (percent: number) =>
  percent >= 100 ? 'Fully charged' : percent === 0 ? 'No charge' : `${percent}% charged`;

/**
 * A text input with a label, helper text and error state built in. It also has
 * a party trick: a charge meter that fills up as the value gets more complete,
 * handy for password strength or profile progress.
 *
 * In Live Wire, a field can "charge up" as its value becomes valid.
 * Pass `charge` (0..1, or a function of the value) to show the meter.
 *
 * Style hooks: `.sp-textfield` with `[data-focused]`, `[data-invalid]`,
 * `[data-charged]`, `[data-disabled]`; parts `__label`, `__control`, `__input`,
 * `__adornment`, `__meter`, `__helper`. Built on InputBase (`.sp-input-base`).
 */
const Textfield = forwardRef<HTMLInputElement, TextfieldPropsBase>((props, ref) => {
  const {
    label,
    placeholder,
    disabled,
    error,
    prepend,
    append,
    value,
    defaultValue,
    onChange,
    onValueChange,
    onFocus,
    onBlur,
    size: inputSize = 'medium',
    helperText,
    containerStyle,
    isCurrency,
    cardDetection,
    formatPhoneNumber,
    variant,
    charge,
    chargeLabel = defaultChargeLabel,
    type,
    id,
    className,
    classNames,
    ...rest
  } = useDefaults('Textfield', props);

  const {
    value: fieldValue,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    focused,
    disabled: isDisabled,
    error: hasError,
  } = useTextField({
    value: value ?? defaultValue,
    onChange:
      onChange || onValueChange
        ? (event) => {
            onChange?.(event);
            onValueChange?.(event.target.value, event);
          }
        : undefined,
    onFocus,
    onBlur,
    disabled,
    error,
    type,
  });
  const controlled = value !== undefined;
  // Controlled: the parent's value is the truth, so changes made outside the field
  // (a reset, data from the server) show up. Uncontrolled: the field keeps its own.
  const current = controlled ? String(value) : fieldValue;

  const level = charge === undefined ? undefined : clamp(typeof charge === 'function' ? charge(current) : charge);
  const percent = level === undefined ? 0 : Math.round(level * 100);
  const charged = level !== undefined && percent >= 100 && !hasError;

  const autoId = useId();
  const inputId = id ?? autoId;
  const helperId = `${inputId}-helper`;
  const meterId = `${inputId}-meter`;
  const describedBy = [helperText && helperId, level !== undefined && meterId].filter(Boolean).join(' ') || undefined;

  const inputRef = useRef<HTMLInputElement>(null);
  const handleRef = useForkRef(ref, inputRef);

  // Native input types only: the masking types are handled by useTextField.
  const masked = type === 'card' || type === 'currency' || type === 'phone';

  return (
    <div
      className={slot('sp-textfield', classNames, 'root', className)}
      data-tone={hasError ? 'error' : 'brand'}
      data-size={inputSize}
      data-focused={focused || undefined}
      data-invalid={hasError || undefined}
      data-charged={charged || undefined}
      data-disabled={isDisabled || undefined}
    >
      {label && (
        <label htmlFor={inputId} className={slot('sp-textfield__label', classNames, 'label')}>
          {label}
        </label>
      )}
      <InputBase
        ref={handleRef}
        id={inputId}
        size={inputSize}
        error={hasError}
        disabled={isDisabled}
        startAdornment={prepend}
        endAdornment={append}
        rootProps={{ style: containerStyle }}
        classNames={{
          root: slot('sp-textfield__control', classNames, 'control'),
          input: slot('sp-textfield__input', classNames, 'input'),
          adornment: slot('sp-textfield__adornment', classNames, 'adornment'),
        }}
        type={masked ? 'text' : type}
        inputMode={masked ? 'numeric' : undefined}
        placeholder={placeholder}
        {...(controlled ? { value: current } : { defaultValue })}
        aria-describedby={describedBy}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />
      {level !== undefined && (
        <div id={meterId} className={slot('sp-textfield__meter', classNames, 'meter')}>
          <div
            role="meter"
            aria-label={typeof label === 'string' ? `${label} charge` : 'Charge'}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            className="sp-textfield__meter-track"
          >
            <div className={cx('sp-textfield__meter-fill', percent >= 100 && 'sp-current')} style={{ width: `${percent}%` }} />
          </div>
          <span className="sp-textfield__meter-label" aria-live="polite">
            {chargeLabel(percent)}
          </span>
        </div>
      )}
      {helperText && (
        <p id={helperId} className={slot('sp-textfield__helper', classNames, 'helper')}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Textfield.displayName = 'Textfield';

export default Textfield;
