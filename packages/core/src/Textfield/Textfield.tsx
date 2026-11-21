import { forwardRef, useId, useRef } from 'react';
import { TextfieldPropsBase } from './Textfield.types';
import { useTextField } from './useTextfield';
import { useForkRef } from './useForkRef';
import { cx } from '../internal/cx';

const clamp = (n: number) => Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0));

const defaultChargeLabel = (percent: number) =>
  percent >= 100 ? 'Fully charged' : percent === 0 ? 'No charge' : `${percent}% charged`;

/**
 * Textfield: in Live Wire, a field can "charge up" as its value becomes valid.
 * Pass `charge` (0..1, or a function of the value) to show the meter.
 *
 * Style hooks: `.sp-textfield` with `[data-focused]`, `[data-invalid]`,
 * `[data-charged]`, `[data-disabled]`; parts `__label`, `__control`, `__input`,
 * `__adornment`, `__meter`, `__helper`.
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
    onChange,
    onFocus,
    onBlur,
    inputSize = 'medium',
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
    ...rest
  } = props;

  const {
    value: fieldValue,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    focused,
    disabled: isDisabled,
    error: hasError,
  } = useTextField({ value, onChange, onFocus, onBlur, disabled, error, type });

  const level = charge === undefined ? undefined : clamp(typeof charge === 'function' ? charge(fieldValue) : charge);
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
      className={cx('sp-textfield', className)}
      data-tone={hasError ? 'error' : 'brand'}
      data-size={inputSize}
      data-focused={focused || undefined}
      data-invalid={hasError || undefined}
      data-charged={charged || undefined}
      data-disabled={isDisabled || undefined}
    >
      {label && (
        <label htmlFor={inputId} className="sp-textfield__label">
          {label}
        </label>
      )}
      <div className="sp-textfield__control" style={containerStyle} onClick={() => inputRef.current?.focus()}>
        {prepend && <div className="sp-textfield__adornment">{prepend}</div>}
        <input
          ref={handleRef}
          id={inputId}
          className="sp-textfield__input"
          type={masked ? 'text' : type}
          inputMode={masked ? 'numeric' : undefined}
          placeholder={placeholder}
          disabled={isDisabled}
          value={fieldValue}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        {append && <div className="sp-textfield__adornment">{append}</div>}
      </div>
      {level !== undefined && (
        <div id={meterId} className="sp-textfield__meter">
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
        <p id={helperId} className="sp-textfield__helper">
          {helperText}
        </p>
      )}
    </div>
  );
});

Textfield.displayName = 'Textfield';

export default Textfield;
