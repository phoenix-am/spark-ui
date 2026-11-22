import React, { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { VisuallyHidden } from 'react-aria';
import { useSwitch, useSpark } from '../headless';

/**
 * Headless hooks give you Spark's behaviour with your own markup:
 * `useSwitch`, `useCheckbox`, `useSlider`, `useDatePicker` and `useSpark`,
 * from `@sparkwire/core/headless`. They return props to spread and
 * `dataProps` (`data-state`, `data-disabled`...) for styling.
 */
const meta: Meta = { title: 'Foundations/Headless hooks', parameters: { layout: 'padded' } };
export default meta;

function PillToggle({ label }: { label: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const { inputProps, dataProps, checked } = useSwitch({ 'aria-label': label }, ref);
  const { sparks, burst } = useSpark({ count: 8 });
  return (
    <label
      {...dataProps}
      onClick={(e) => !checked && burst(e as unknown as React.MouseEvent<HTMLElement>)}
      style={{
        position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 999, cursor: 'pointer',
        border: '2px solid', borderColor: checked ? 'var(--spark-energy-ink)' : 'var(--spark-surface-border-strong)',
        color: checked ? 'var(--spark-energy-ink)' : 'var(--spark-text-secondary)', fontFamily: 'var(--spark-font)',
        boxShadow: checked ? '0 0 14px var(--spark-energy-glow)' : 'none', transition: 'all 200ms',
      }}
    >
      <VisuallyHidden><input {...inputProps} ref={ref} /></VisuallyHidden>
      {checked ? '⚡ ' : '○ '}{label}
      {sparks}
    </label>
  );
}

/** A pill toggle with completely custom markup, using useSwitch for behaviour and useSpark for the burst. */
export const CustomSwitch: StoryObj = { name: 'useSwitch + useSpark', render: () => <PillToggle label="Turbo mode" /> };
