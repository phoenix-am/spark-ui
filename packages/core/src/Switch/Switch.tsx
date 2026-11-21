import React, { forwardRef, useId, useState } from 'react';
import { Tone } from '../internal/tone';
import { cx } from '../internal/cx';
import { useDefaults, slot, ClassNames } from '../internal/defaults';

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
  /** Form field name. When set, a hidden input submits `value` while the switch is on. */
  name?: string;
  /** Value submitted with `name` while on. Default `"on"`. */
  value?: string;
  /** Class for the outer wrapper (the button gets `className`). */
  wrapperClassName?: string;
  /** Extra classes for each part: root, control, node, wire, lever, bulb, label. */
  classNames?: ClassNames<'root' | 'control' | 'node' | 'wire' | 'lever' | 'bulb' | 'label'>;
}

/**
 * Switch: a lever that closes a circuit. When on, current lights the wire and
 * the bulb; when off, the lever lifts and the circuit goes dark.
 *
 * Style hooks: `.sp-switch`, `[data-state="on"|"off"]`, and the parts
 * `.sp-switch__node`, `__wire`, `__lever`, `__bulb`, `__label`.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(inProps, ref) {
  const {
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
    classNames,
    name,
    value = 'on',
    ...rest
  } = useDefaults('Switch', inProps);
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
      className={slot('sp-switch', classNames, 'root', wrapperClassName)}
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
        className={slot('sp-switch__control', classNames, 'control', className)}
        data-state={state}
        {...rest}
      >
        <span className={slot('sp-switch__node', classNames, 'node')} />
        <span className={slot('sp-switch__wire', classNames, 'wire')} />
        <span className="sp-switch__pivot">
          <span className={slot('sp-switch__lever', classNames, 'lever')} />
        </span>
        <span className={slot('sp-switch__wire', classNames, 'wire')} />
        {showBulb && <span className={slot('sp-switch__bulb', classNames, 'bulb')} />}
      </button>
      {name && on && <input type="hidden" name={name} value={value} />}
      {label && (
        <span id={labelId} className={slot('sp-switch__label', classNames, 'label')}>
          {label}
        </span>
      )}
    </span>
  );
});

Switch.displayName = 'Switch';

export default Switch;
