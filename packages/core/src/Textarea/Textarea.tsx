import React, { forwardRef, useId, useRef, useState } from 'react';
import { mergeRefs } from 'react-aria';
import { useDefaults, slot, ClassNames } from '../internal/defaults';
import { useIsoLayoutEffect } from '../internal/useIsoLayoutEffect';

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: React.ReactNode;
  /** Help text under the field. */
  helperText?: React.ReactNode;
  /** `true` marks it invalid; a string also replaces the helper text. */
  error?: boolean | string;
  /** `outlined` (default), `filled` or `standard`. */
  variant?: 'outlined' | 'filled' | 'standard';
  /** Grow with the content between `minRows` and `maxRows`. Default `true`. */
  autoResize?: boolean;
  /** Default 3. */
  minRows?: number;
  /** Default 10; beyond this it scrolls. */
  maxRows?: number;
  /** Show "12 / 280" under the field. Uses `maxLength` when set. */
  showCount?: boolean;
  onChange?: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  classNames?: ClassNames<'root' | 'label' | 'field' | 'input' | 'helper' | 'count'>;
}

/**
 * Multi-line text with the niceties built in: it can grow with its content,
 * show a live character count, and display errors next to the field.
 *
 * Multi-line text on the same shell as every other field
 * (`.sp-input-base`). Grows with its content (`autoResize`), can show a
 * character count, and links its label, help text and error for screen
 * readers.
 *
 * Style hooks: `.sp-textarea[data-invalid]`, `__label`, `__input`, `__helper`, `__count[data-over]`.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(inProps, ref) {
  const {
    label,
    helperText,
    error,
    variant = 'outlined',
    autoResize = true,
    minRows = 3,
    maxRows = 10,
    showCount,
    onChange,
    value,
    defaultValue,
    maxLength,
    disabled,
    required,
    id,
    className,
    classNames,
    ...rest
  } = useDefaults('Textarea', inProps) as TextareaProps;
  const autoId = useId();
  const inputId = id ?? autoId;
  const helperId = `${inputId}-helper`;
  const countId = `${inputId}-count`;
  const invalid = Boolean(error);
  const message = typeof error === 'string' ? error : helperText;
  const [inner, setInner] = useState(String(defaultValue ?? ''));
  const text = value !== undefined ? String(value) : inner;
  const el = useRef<HTMLTextAreaElement>(null);

  useIsoLayoutEffect(() => {
    const t = el.current;
    if (!t || !autoResize) return;
    const cs = getComputedStyle(t);
    const line = parseFloat(cs.lineHeight) || 20;
    const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    t.style.height = 'auto';
    const h = Math.min(Math.max(t.scrollHeight, line * minRows + pad), line * maxRows + pad);
    t.style.height = `${h}px`;
    t.style.overflowY = t.scrollHeight > h ? 'auto' : 'hidden';
  }, [text, autoResize, minRows, maxRows]);

  const describedBy = [message && helperId, showCount && countId].filter(Boolean).join(' ') || undefined;
  return (
    <div className={slot('sp-textarea', classNames, 'root', className)} data-tone={invalid ? 'error' : 'brand'} data-invalid={invalid || undefined} data-disabled={disabled || undefined}>
      {label && (
        <label htmlFor={inputId} className={slot('sp-textarea__label', classNames, 'label')}>
          {label}
          {required && <span className="sp-field__required" aria-hidden="true"> *</span>}
        </label>
      )}
      <div className={slot('sp-input-base sp-textarea__field', classNames, 'field')} data-variant={variant} data-invalid={invalid || undefined} data-disabled={disabled || undefined} data-tone={invalid ? 'error' : 'brand'}>
        <textarea
          {...rest}
          ref={mergeRefs(el, ref) as React.Ref<HTMLTextAreaElement>}
          id={inputId}
          className={slot('sp-textarea__input', classNames, 'input')}
          rows={minRows}
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          maxLength={maxLength}
          disabled={disabled}
          required={required}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onChange={(e) => {
            if (value === undefined) setInner(e.target.value);
            onChange?.(e.target.value, e);
          }}
        />
      </div>
      {(message || showCount) && (
        <div className="sp-textarea__footer">
          {message ? (
            <p id={helperId} className={slot('sp-textarea__helper', classNames, 'helper')}>
              {message}
            </p>
          ) : (
            <span />
          )}
          {showCount && (
            <span id={countId} className={slot('sp-textarea__count', classNames, 'count')} data-over={maxLength !== undefined && text.length >= maxLength ? '' : undefined} aria-live="polite">
              {maxLength !== undefined ? `${text.length} / ${maxLength}` : text.length}
            </span>
          )}
        </div>
      )}
    </div>
  );
});
