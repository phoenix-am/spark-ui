import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useTheme } from '@spark-ui/system';

const meta: Meta = {
  title: 'Foundations/Tokens',
  parameters: { docs: { description: { component: 'The Live Wire theme tokens from `@spark-ui/styles`.' } } },
};
export default meta;

const Swatch = ({ name, value, dark }: { name: string; value: string; dark?: boolean }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
    <div style={{ height: 56, borderRadius: 6, background: value, border: '1px solid var(--spark-surface-border)' }} />
    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--spark-text-primary)' }}>{name}</span>
    <code style={{ fontSize: 11, color: 'var(--spark-text-secondary)' }}>{value}</code>
  </div>
);

const Row = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 32 }}>
    <h3 style={{ margin: '0 0 12px', fontSize: 13, letterSpacing: 2, color: 'var(--spark-text-secondary)' }}>{title.toUpperCase()}</h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 12 }}>{children}</div>
  </section>
);

export const Colors: StoryObj = {
  render: function Render() {
    const { theme: t } = useTheme();
    return (
    <div>
      <Row title="Energy">
        <Swatch name="current" value={t.energy.current} />
        <Swatch name="hot" value={t.energy.hot} />
        <Swatch name="off" value={t.energy.off} />
        {t.energy.sparks.map((c, i) => (
          <Swatch key={c + i} name={`spark ${i + 1}`} value={c} />
        ))}
      </Row>
      <Row title="Surface">
        {Object.entries(t.surface).map(([k, v]) => (
          <Swatch key={k} name={k} value={v} />
        ))}
      </Row>
      <Row title="Text">
        {Object.entries(t.text).map(([k, v]) => (
          <Swatch key={k} name={k} value={v} />
        ))}
      </Row>
      {(['brand', 'success', 'warning', 'error', 'gray'] as const).map((scale) => (
        <Row key={scale} title={scale}>
          {Object.entries(t.colors.primary[scale]).map(([k, v]) => (
            <Swatch key={k} name={k} value={v} />
          ))}
        </Row>
      ))}
    </div>
  );
  },
};

export const Typography: StoryObj = {
  render: function Render() {
    const { theme: t } = useTheme();
    return (
    <div style={{ display: 'grid', gap: 16 }}>
      <code style={{ color: 'var(--spark-text-secondary)' }}>{t.typography.fontFamily}</code>
      {(['large', 'medium', 'small'] as const).map((s) => (
        <div key={s} style={{ fontSize: t.typography.fontSize[s] }}>
          <strong>{s}</strong> · {t.typography.fontSize[s]} · Components that carry current.
        </div>
      ))}
    </div>
  );
  },
};

export const RadiusAndMotion: StoryObj = {
  render: function Render() {
    const { theme: t } = useTheme();
    return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {Object.entries(t.borderRadius).map(([k, v]) => (
          <div key={k} style={{ textAlign: 'center', fontSize: 12 }}>
            <div style={{ width: 64, height: 64, borderRadius: v, border: `2px solid ${t.energy.current}`, marginBottom: 6 }} />
            {k} · {v}
          </div>
        ))}
      </div>
      <table style={{ borderCollapse: 'collapse', fontSize: 13 }}>
        <tbody>
          {Object.entries(t.motion).map(([k, v]) => (
            <tr key={k}>
              <td style={{ padding: '6px 16px 6px 0', color: 'var(--spark-text-secondary)' }}>motion.{k}</td>
              <td><code>{String(v)}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  },
};
