import React, { forwardRef, useId, useState } from 'react';
import { css } from '@emotion/react';
import { useTheme } from '@spark-ui/system';
import { getTone, Tone } from '../internal/tone';

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'color'> {
  /** Controlled state. */
  checked?: boolean;
  /** Initial state when uncontrolled. */
  defaultChecked?: boolean;
  onChange?: (checked: boolean, event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Visible label. Use `aria-label` instead when there is none. */
  label?: React.ReactNode;
  color?: Tone;
  size?: 'small' | 'medium' | 'large';
  /** Show the bulb that lights when the circuit is closed. Default `true`. */
  showBulb?: boolean;
}

const dims = {
  small: { wire: 14, lever: 34, h: 28, node: 8, bulb: 18 },
  medium: { wire: 18, lever: 44, h: 36, node: 10, bulb: 24 },
  large: { wire: 22, lever: 54, h: 44, node: 12, bulb: 30 },
};

/**
 * Switch: a lever that closes a circuit. When on, current lights the wire and
 * the bulb; when off, the lever lifts and the circuit goes dark.
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
    ...rest
  },
  ref,
) {
  const { theme } = useTheme();
  const tone = getTone(color, theme);
  const [inner, setInner] = useState(defaultChecked);
  const on = checked ?? inner;
  const d = dims[size];
  const autoId = useId();
  const labelId = `${id ?? autoId}-label`;

  const live = disabled ? theme.surface.borderStrong : on ? tone.fill : theme.energy.off;
  const ease = `${theme.motion.normal} ${theme.motion.easing}`;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled) return;
    if (checked === undefined) setInner(!on);
    onChange?.(!on, event);
  };

  const wire = css`
    width: ${d.wire}px;
    height: 3px;
    background: ${live};
    transition: background ${ease};
  `;

  return (
    <span
      css={css`
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        font-family: ${theme.typography.fontFamily};
        color: ${disabled ? theme.text.disabled : theme.text.primary};
        font-size: ${theme.typography.fontSize[size]};
      `}
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
        css={css`
          display: inline-flex;
          align-items: center;
          height: ${d.h}px;
          padding: 0 4px;
          border: none;
          border-radius: ${theme.borderRadius.medium};
          background: transparent;
          cursor: ${disabled ? 'not-allowed' : 'pointer'};

          &:focus-visible {
            outline: 2px solid ${tone.fill};
            outline-offset: 2px;
          }
          @media (prefers-reduced-motion: reduce) {
            * {
              transition: none !important;
            }
          }
        `}
        {...rest}
      >
        <span
          css={css`
            width: ${d.node}px;
            height: ${d.node}px;
            border-radius: 50%;
            background: ${disabled ? theme.surface.borderStrong : theme.text.primary};
          `}
        />
        <span css={wire} />
        <span
          css={css`
            position: relative;
            width: ${d.lever}px;
            height: ${d.h}px;
          `}
        >
          <span
            css={css`
              position: absolute;
              left: 0;
              top: 50%;
              width: ${d.lever}px;
              height: 4px;
              margin-top: -2px;
              border-radius: 2px;
              background: ${live};
              transform-origin: 2px 50%;
              transform: rotate(${on ? 0 : -32}deg);
              box-shadow: ${on && !disabled ? `0 0 10px ${tone.glow}` : 'none'};
              transition: transform ${ease}, background ${ease}, box-shadow ${ease};
            `}
          />
        </span>
        <span css={wire} />
        {showBulb && (
          <span
            css={css`
              width: ${d.bulb}px;
              height: ${d.bulb}px;
              box-sizing: border-box;
              border-radius: 50%;
              border: 2px solid ${live};
              background: ${on && !disabled ? theme.energy.hot : theme.surface.raised};
              box-shadow: ${on && !disabled ? `0 0 ${d.bulb}px ${d.bulb / 4}px ${tone.glowStrong}` : 'none'};
              transition: all ${ease};
            `}
          />
        )}
      </button>
      {label && <span id={labelId}>{label}</span>}
    </span>
  );
});

Switch.displayName = 'Switch';

export default Switch;
