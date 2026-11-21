import { forwardRef, useId, useRef } from 'react';
import { TextfieldPropsBase } from './Textfield.types';
import { useTheme } from '@spark-ui/system';
import { TextfieldStyles } from './Textfield.styles';
import { useTextField } from './useTextfield';
import { useForkRef } from './useForkRef';

const clamp = (n: number) => Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0));

const defaultChargeLabel = (percent: number) =>
  percent >= 100 ? 'Fully charged' : percent === 0 ? 'No charge' : `${percent}% charged`;

/**
 * Textfield: in Live Wire, a field can "charge up" as its value becomes valid.
 * Pass `charge` (0..1, or a function of the value) to show the meter.
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
    ...rest
  } = props;

  const { theme } = useTheme();
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

  const styles = TextfieldStyles({
    theme,
    focused,
    disabled: isDisabled,
    hasError,
    charged,
    size: inputSize,
  });

  const autoId = useId();
  const inputId = id ?? autoId;
  const helperId = `${inputId}-helper`;
  const meterId = `${inputId}-meter`;
  const describedBy = [helperText && helperId, level !== undefined && meterId].filter(Boolean).join(' ') || undefined;

  const inputRef = useRef<HTMLInputElement>(null);
  const handleRef = useForkRef(ref, inputRef);

  // Native input types only: the masking types are handled by useTextField.
  const nativeType = type === 'card' || type === 'currency' || type === 'phone' ? 'text' : type;

  return (
    <div css={styles.baseStyles}>
      {label && (
        <label htmlFor={inputId} css={styles.labelStyles}>
          {label}
        </label>
      )}
      <div css={styles.inputContainer} style={{ ...containerStyle }} onClick={() => inputRef.current?.focus()}>
        {prepend && <div css={styles.adornment}>{prepend}</div>}
        <input
          ref={handleRef}
          id={inputId}
          css={styles.inputStyles}
          type={nativeType}
          inputMode={type === 'currency' || type === 'card' || type === 'phone' ? 'numeric' : undefined}
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
        {append && <div css={styles.adornment}>{append}</div>}
      </div>
      {level !== undefined && (
        <div id={meterId}>
          <div
            role="meter"
            aria-label={typeof label === 'string' ? `${label} charge` : 'Charge'}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            css={styles.meterTrack}
          >
            <div css={styles.meterFill(percent)} />
          </div>
          <span css={styles.meterLabel} aria-live="polite">
            {chargeLabel(percent)}
          </span>
        </div>
      )}
      {helperText && (
        <p id={helperId} css={styles.helperTextStyles}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Textfield.displayName = 'Textfield';

export default Textfield;
