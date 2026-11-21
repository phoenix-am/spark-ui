import React, { forwardRef, useId, useState } from 'react';
import { Tone } from '../internal/tone';
import { cx } from '../internal/cx';

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'color'> {
  /** Controlled state. */
  checked?: boolean;
  /** Initial state when uncontrolled. */
  defaultChecked?: boolean;
  /** Called with the new state when the user flips the switch. */
  onChange?: (checked: boolean, event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Visible label. Use `aria-label` instead when there is none. */
  label?: React.ReactNode;
  /** Colour of the current when on. Default `brand`. */
  color?: Tone;
  /** Default `medium`. */
  size?: 'small' | 'medium' | 'large';
  /** Show the bulb that lights when the circuit is closed. Default `true`. */
  showBulb?: boolean;
  /** Class for the outer wrapper (the button gets `className`). */
  wrapperClassName?: string;
}

/**
 * Switch: a lever that closes a circuit. When on, current lights the wire and
 * the bulb; when off, the lever lifts and the circuit goes dark.
 *
 * Style hooks: `.sp-switch`, `[data-state="on"|"off"]`, and the parts
 * `.sp-switch__node`, `__wire`, `__lever`, `__bulb`, `__label`.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked,
    defaultChecked = false,
    onChange,
    label,
    color = 'brand',
    size = 'medium',
    showBulb = true,
    disabled,
    id,
    onClick,
    className,
    wrapperClassName,
    ...rest
  },
  ref,
) {
  const [inner, setInner] = useState(defaultChecked);
  const on = checked ?? inner;
  const autoId = useId();
  const labelId = `${id ?? autoId}-label`;
  const state = on ? 'on' : 'off';

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled) return;
    if (checked === undefined) setInner(!on);
    onChange?.(!on, event);
  };

  return (
    <span
      className={cx('sp-switch', wrapperClassName)}
      data-tone={color}
      data-size={size}
      data-state={state}
      data-disabled={disabled || undefined}
    >
      <button
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={on}
        aria-labelledby={label ? labelId : undefined}
        disabled={disabled}
        onClick={handleClick}
        className={cx('sp-switch__control', className)}
        data-state={state}
        {...rest}
      >
        <span className="sp-switch__node" />
        <span className="sp-switch__wire" />
        <span className="sp-switch__pivot">
          <span className="sp-switch__lever" />
        </span>
        <span className="sp-switch__wire" />
        {showBulb && <span className="sp-switch__bulb" />}
      </button>
      {label && (
        <span id={labelId} className="sp-switch__label">
          {label}
        </span>
      )}
    </span>
  );
});

Switch.displayName = 'Switch';

export default Switch;
