import React, { useId, useState } from 'react';
import { Tone } from '../internal/tone';
import { cx } from '../internal/cx';
import { useDefaults } from '../internal/defaults';

export interface RadioOption {
  /** Value submitted and passed to `onChange`. */
  value: string;
  /** Visible label. */
  label: React.ReactNode;
  /** Secondary line under the label. */
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** The group's legend. Required for accessibility. */
  label: React.ReactNode;
  /** The choices, each `{ value, label, description?, disabled? }`. */
  options: RadioOption[];
  /** Controlled value. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Called with the newly selected option's `value`. */
  onChange?: (value: string) => void;
  /** Form field name. Generated when omitted. */
  name?: string;
  /** Colour of the chosen contact. Default `brand`. */
  color?: Tone;
  /** `list` stacks options; `cards` lays them out as selectable cards. */
  variant?: 'list' | 'cards';
  /** Help or error text under the group. */
  helperText?: React.ReactNode;
  /** Marks the group invalid. */
  error?: boolean;
  /** Extra class names for the outermost element. */
  className?: string;
}

/**
 * Pick exactly one option from a short list where it helps to see every choice
 * at once. Show options as a simple list, or as cards with room for a
 * description, which works well for plans and regions.
 *
 * A selector switch. Every option is a contact; only the chosen one
 * carries current, so its core lights up. Native radios underneath, so arrow
 * keys and forms work as expected.
 *
 * Style hooks: `.sp-radio-group`, `__option[data-checked]`, `__dot`, `__text`.
 */
export function RadioGroup(inProps: RadioGroupProps) {
  const {
  label,
  options,
  value,
  defaultValue,
  onChange,
  name,
  color = 'brand',
  variant = 'list',
  helperText,
  error,
  className,
} = useDefaults('RadioGroup', inProps);
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const autoName = useId();
  const groupName = name ?? autoName;
  const helperId = `${groupName}-helper`;

  return (
    <fieldset
      className={cx('sp-radio-group', className)}
      data-tone={error ? 'error' : color}
      data-variant={variant}
      data-invalid={error || undefined}
      aria-describedby={helperText ? helperId : undefined}
    >
      <legend className="sp-radio-group__legend">{label}</legend>
      <div className="sp-radio-group__options">
        {options.map((o) => {
          const checked = current === o.value;
          return (
            <label
              key={o.value}
              className="sp-radio-group__option"
              data-checked={checked || undefined}
              data-disabled={o.disabled || undefined}
            >
              <input
                type="radio"
                name={groupName}
                value={o.value}
                checked={checked}
                disabled={o.disabled}
                className="sp-radio-group__input"
                onChange={() => {
                  if (value === undefined) setInner(o.value);
                  onChange?.(o.value);
                }}
              />
              <span className="sp-radio-group__dot" aria-hidden="true" />
              <span className="sp-radio-group__text">
                <span className="sp-radio-group__label">{o.label}</span>
                {o.description && <span className="sp-radio-group__description">{o.description}</span>}
              </span>
            </label>
          );
        })}
      </div>
      {helperText && (
        <p id={helperId} className="sp-radio-group__helper">
          {helperText}
        </p>
      )}
    </fieldset>
  );
}

export default RadioGroup;
