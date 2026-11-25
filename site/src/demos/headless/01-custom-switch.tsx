/** Your markup, Sparkwire's behaviour. `useSwitch` handles the keyboard, focus and screen-reader parts; you draw the switch however you like. */
import { useRef } from 'react';
import { useSwitch } from '@sparkwire/core/headless';

export default function CustomSwitch() {
  const ref = useRef<HTMLInputElement>(null);
  const { inputProps, checked, focusVisible } = useSwitch({ 'aria-label': 'Airplane mode', defaultChecked: true }, ref);
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
      <input {...inputProps} ref={ref} style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }} />
      <span
        aria-hidden="true"
        style={{
          width: 56,
          height: 32,
          borderRadius: 999,
          padding: 4,
          background: checked ? 'linear-gradient(90deg, #7c3aed, #db2777)' : 'var(--spark-surface-border-strong)',
          outline: focusVisible ? '2px solid var(--spark-energy-ink)' : 'none',
          outlineOffset: 2,
          transition: 'background 200ms',
        }}
      >
        <span
          style={{
            display: 'block',
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: '#fff',
            transform: checked ? 'translateX(24px)' : 'none',
            transition: 'transform 200ms',
          }}
        />
      </span>
      Airplane mode {checked ? 'on' : 'off'}
    </label>
  );
}
