import type { Meta, StoryObj } from '@storybook/react';
import React, { useRef, useState } from 'react';
import { SparkProvider } from '../Provider';
import { Button } from '../Button';
import { Switch } from '../Switch';
import { Stepper } from '../Stepper';
import { Progress } from '../Indicators';
import { useSpark } from '../headless';

/**
 * **The energy dial.** One setting, `<SparkProvider energy="calm" | "default" | "electric" | "off">`,
 * scales every spark, glow and current at once. `calm` suits dashboards and admin panels,
 * `electric` suits launches and marketing pages, and `off` keeps only functional motion
 * (menus opening, drawers sliding). People who ask their system for reduced motion
 * always get `off`.
 *
 * You can also set `data-spark-energy` on `<html>` yourself (works with server rendering),
 * and switch it from the **Energy** menu in the toolbar for any story.
 * `haptics` adds short vibrations on Switch, Checkbox and spark bursts on phones that support it.
 */
const meta: Meta = { title: 'Foundations/Energy' };
export default meta;

function Panel({ label }: { label: string }) {
  const spark = useSpark();
  const [on, setOn] = useState(true);
  return (
    <div style={{ display: 'grid', gap: 16, padding: 16, borderRadius: 12, border: '1px solid var(--spark-surface-border)', background: 'var(--spark-surface-raised)' }}>
      <strong style={{ fontSize: 13, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--spark-text-secondary)' }}>{label}</strong>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ position: 'relative', display: 'inline-flex' }}>
          {spark.sparks}
          <Button onClick={spark.burst}>Burst</Button>
        </span>
        <Switch checked={on} onChange={setOn} label="Power" />
      </div>
      <Stepper aria-label={`${label} progress`} steps={[{ label: "Plan" }, { label: "Build" }, { label: "Ship" }]} active={1} responsive={false} />
      <div {...spark.current()} style={{ height: 3, borderRadius: 2 }} aria-hidden="true" />
      <Progress value={64} label="Charge" />
    </div>
  );
}

/** The same panel at each level. Click Burst to compare spark counts. */
export const AllLevels: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
      {(['off', 'calm', 'default', 'electric'] as const).map((e) => (
        <SparkProvider key={e} energy={e}>
          <Panel label={e} />
        </SparkProvider>
      ))}
    </div>
  ),
};

/** `useSpark()` puts the library's motion on your own elements. */
export const UseSparkHook: StoryObj = {
  render: () => {
    const spark = useSpark({ count: 14 });
    const card = useRef<HTMLDivElement>(null);
    return (
      <div style={{ display: 'grid', gap: 16, maxWidth: 420 }}>
        <div ref={card} {...spark.glow()} style={{ position: 'relative', padding: 20, borderRadius: 12, background: 'var(--spark-surface-raised)' }}>
          {spark.sparks}
          <p style={{ margin: '0 0 12px' }}>A custom card with the system's glow, sparks and power cut.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button size="small" onClick={(e: React.MouseEvent<HTMLElement>) => { spark.burst(e); spark.haptic('burst'); }}>Spark it</Button>
            <Button size="small" variant="outlined" onClick={() => spark.powerCut(card.current)}>Power cut</Button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span>Source</span>
          <div {...spark.current()} style={{ flex: 1, height: 2 }} aria-hidden="true" />
          <span>Load</span>
        </div>
      </div>
    );
  },
};
