import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SparkProvider } from '../Provider';
import { Button } from '../Button';
import { Switch } from '../Switch';
import { Textfield } from '../Textfield';
import { Badge } from '../Indicators';

/**
 * Three ways to customize, from lightest to strongest:
 * 1. **App-wide defaults** with `SparkProvider` (props and slot classes).
 * 2. **Per-instance slots** with `classNames`.
 * 3. **Plain CSS** on the stable class names and `data-*` state attributes.
 */
const meta: Meta = { title: 'Foundations/Customization' };
export default meta;

const css = `
.my-bulb { border-radius: 4px !important; }
.sp-switch[data-state='on'] .my-bulb { box-shadow: 0 0 24px 6px #3af2ff !important; background: #c8fbff !important; border-color: #3af2ff !important; }
.my-pill { border-radius: 999px !important; }
.my-label { text-transform: uppercase; letter-spacing: 0.08em; font-size: 12px !important; }
`;

/** Every Button outlined and pill-shaped, every Switch with a square cyan bulb: set once. */
export const AppWideDefaults: StoryObj = {
  render: () => (
    <>
      <style>{css}</style>
      <SparkProvider
        components={{
          Button: { defaultProps: { variant: 'outlined', size: 'small' }, classNames: { root: 'my-pill' } },
          Switch: { classNames: { bulb: 'my-bulb' } },
          Textfield: { classNames: { label: 'my-label' } },
        }}
      >
        <div style={{ display: 'grid', gap: 18, maxWidth: 420 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button>Outlined by default</Button>
            <Button variant="contained">Instance prop wins</Button>
          </div>
          <Switch label="Square cyan bulb" defaultChecked />
          <Textfield label="Uppercase label" placeholder="From SparkProvider" />
        </div>
      </SparkProvider>
    </>
  ),
};

/** Style one part of one instance with `classNames`. */
export const PerInstanceSlots: StoryObj = {
  render: () => (
    <>
      <style>{css}</style>
      <div style={{ display: 'grid', gap: 18 }}>
        <Switch label="Only this bulb is custom" defaultChecked classNames={{ bulb: 'my-bulb' }} />
        <Badge classNames={{ root: 'my-label' }}>Custom badge</Badge>
      </div>
    </>
  ),
};

/** Override tokens as CSS variables on any element: everything inside follows. */
export const TokenOverrides: StoryObj = {
  render: () => (
    <div
      style={
        {
          '--spark-energy-current': '#3AF2FF',
          '--spark-energy-ink': '#3AF2FF',
          '--spark-energy-glow': 'rgba(58, 242, 255, 0.35)',
          '--spark-energy-hot': '#C8FBFF',
          '--spark-brand-fill': '#3AF2FF',
          '--spark-brand-ink': '#3AF2FF',
          '--spark-brand-hover': '#8AF7FF',
          '--spark-brand-glow': 'rgba(58, 242, 255, 0.35)',
          '--spark-radius-medium': '999px',
          display: 'grid',
          gap: 18,
          maxWidth: 420,
        } as React.CSSProperties
      }
    >
      <div style={{ display: 'flex', gap: 12 }}>
        <Button>Cyan current</Button>
        <Button variant="outlined">Outlined</Button>
      </div>
      <Switch label="Same variables, new colour" defaultChecked />
      <Textfield label="Rounded field" placeholder="--spark-radius-medium: 999px" />
    </div>
  ),
};
