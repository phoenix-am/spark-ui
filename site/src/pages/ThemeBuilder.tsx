import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Alert, Badge, Button, Card, Checkbox, Progress, Slider, Switch, Tab, TabList, TabPanel, Tabs, Textfield, ToggleGroup, ToggleGroupItem } from '@sparkwire/core';
import { ThemeProvider } from '@sparkwire/system';
import { createTheme, themeToCssVars, type DeepPartial } from '@sparkwire/styles';
import type { Theme } from '@sparkwire/styles';
import { CodeBlock } from '../components/CodeBlock';
import { Footer } from '../App';
import { usePageTitle } from '../lib/usePageTitle';
import { contrast, isHex, mix, readable, rgba } from '../lib/color';

type Mode = 'dark' | 'light';
type Corners = 'sharp' | 'default' | 'round';

const SWATCHES = ['#FFD60A', '#3AF2FF', '#1FE58A', '#FF9F1C', '#FF5C8A', '#A78BFA', '#60A5FA', '#F2F4F8'];
const RADII: Record<Exclude<Corners, 'default'>, Theme['borderRadius']> = {
  sharp: { small: '0.125rem', medium: '0.1875rem', large: '0.25rem', xlarge: '0.375rem', '2xlarge': '0.5rem', '3xlarge': '0.625rem' },
  round: { small: '0.375rem', medium: '0.625rem', large: '0.875rem', xlarge: '1.25rem', '2xlarge': '1.5rem', '3xlarge': '2rem' },
};

/** Everything a single "current" colour has to drive, made readable for the chosen mode. */
function overridesFor(color: string, mode: Mode, corners: Corners): DeepPartial<Theme> {
  const base = createTheme(undefined, mode);
  const surface = base.surface.base;
  // Thin lines and text in the current colour must stay readable on the page.
  const ink = readable(color, surface, mode === 'dark' ? '#FFFFFF' : '#000000');
  // Text sitting on a filled button: whichever of near-black and white reads better.
  const onEnergy = contrast('#0B0D12', color) >= contrast('#FFFFFF', color) ? '#0B0D12' : '#FFFFFF';
  const glow = rgba(color, mode === 'dark' ? 0.35 : 0.3);
  const o: DeepPartial<Theme> = {
    energy: { current: color, ink, hot: mix(color, '#FFFFFF', 0.65), glow, sparks: [color, mix(color, '#FFFFFF', 0.65), mix(color, '#FF9F1C', 0.5)] },
    tones: { brand: { fill: color, ink, hover: mix(color, '#FFFFFF', 0.2), glow } },
    text: { onEnergy },
  };
  if (corners !== 'default') o.borderRadius = RADII[corners];
  return o;
}

const json = (v: unknown, indent = 0): string => {
  const pad = '  '.repeat(indent + 1);
  if (Array.isArray(v)) return `[${v.map((x) => json(x, indent)).join(', ')}]`;
  if (v && typeof v === 'object')
    return `{\n${Object.entries(v)
      .map(([k, x]) => `${pad}${/^[a-z]\w*$/i.test(k) ? k : `'${k}'`}: ${json(x, indent + 1)}`)
      .join(',\n')},\n${'  '.repeat(indent)}}`;
  return `'${v}'`;
};

export function ThemeBuilder() {
  usePageTitle('Theme builder');
  const [params, setParams] = useSearchParams();
  const fromUrl = params.get('c') ? `#${params.get('c')}` : '';
  const [color, setColorState] = useState(isHex(fromUrl) ? fromUrl.toUpperCase() : '#FFD60A');
  const [draft, setDraft] = useState(color);
  const [mode, setModeState] = useState<Mode>(params.get('m') === 'light' ? 'light' : 'dark');
  const [corners, setCornersState] = useState<Corners>((['sharp', 'round'] as const).find((c) => c === params.get('r')) ?? 'default');

  // The URL is the share link: it keeps the colour, mode and corners.
  const sync = (next: { c?: string; m?: Mode; r?: Corners }) => {
    const p = new URLSearchParams(params);
    const c = next.c ?? color;
    const m = next.m ?? mode;
    const r = next.r ?? corners;
    p.set('c', c.replace('#', ''));
    if (m === 'light') p.set('m', m); else p.delete('m');
    if (r !== 'default') p.set('r', r); else p.delete('r');
    setParams(p, { replace: true, preventScrollReset: true });
  };
  const setColor = (c: string) => {
    const hex = c.toUpperCase();
    setColorState(hex);
    setDraft(hex);
    sync({ c: hex });
  };
  const setMode = (m: Mode) => (setModeState(m), sync({ m }));
  const setCorners = (r: Corners) => (setCornersState(r), sync({ r }));

  const overrides = useMemo(() => overridesFor(color, mode, corners), [color, mode, corners]);
  const theme = useMemo(() => createTheme(overrides, mode), [overrides, mode]);
  const base = useMemo(() => createTheme(undefined, mode), [mode]);
  const changedVars = useMemo(() => {
    const before = themeToCssVars(base);
    return Object.entries(themeToCssVars(theme)).filter(([k, v]) => before[k] !== v);
  }, [theme, base]);

  const checks = [
    { label: `Text on a filled button (${theme.text.onEnergy})`, ratio: contrast(theme.text.onEnergy, color), need: 4.5 },
    { label: 'Current-coloured text on the page', ratio: contrast(theme.energy.ink, theme.surface.base), need: 4.5 },
    { label: 'Current against the page, for outlines', ratio: contrast(color, theme.surface.base), need: 3 },
  ];

  const tsCode = `import { ThemeProvider } from '@sparkwire/system';

const theme = ${json(overrides)};

export function Providers({ children }) {
  return (
    <ThemeProvider mode="${mode}" theme={theme}>
      {children}
    </ThemeProvider>
  );
}`;
  const cssCode = `/* After @sparkwire/core/styles.css */\n[data-spark-theme='${mode}'] {\n${changedVars.map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}`;

  return (
    <main className="sw-builder" id="main">
      <header className="sw-builder__head">
        <p className="sw-eyebrow">Theme builder</p>
        <h1>Make Sparkwire yours</h1>
        <p className="sw-lead">Pick the colour of the current and the shape of the corners. Every component below is real and uses the theme as you change it. Copy the result when it looks right; the link keeps your choices.</p>
      </header>

      <div className="sw-builder__grid">
        <aside className="sw-builder__controls" aria-label="Theme settings">
          <fieldset>
            <legend>Current</legend>
            <div className="sw-swatches" role="radiogroup" aria-label="Preset colours">
              {SWATCHES.map((s) => (
                <button key={s} type="button" role="radio" aria-checked={color === s} aria-label={s} className="sw-swatch" style={{ background: s }} onClick={() => setColor(s)} />
              ))}
            </div>
            <div className="sw-builder__hex">
              <input type="color" aria-label="Pick any colour" value={color.length === 7 ? color : '#FFD60A'} onChange={(e) => setColor(e.target.value)} />
              <Textfield
                size="small"
                label="Hex"
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  if (isHex(e.target.value)) setColor(e.target.value);
                }}
                error={!isHex(draft)}
                helperText={isHex(draft) ? undefined : 'Use a hex colour like #FFD60A'}
              />
            </div>
          </fieldset>
          <fieldset>
            <legend id="tb-mode">Mode</legend>
            <ToggleGroup aria-labelledby="tb-mode" size="small" fullWidth value={mode} onChange={(v) => v && setMode(v as Mode)}>
              <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
              <ToggleGroupItem value="light">Light</ToggleGroupItem>
            </ToggleGroup>
          </fieldset>
          <fieldset>
            <legend id="tb-corners">Corners</legend>
            <ToggleGroup aria-labelledby="tb-corners" size="small" fullWidth value={corners} onChange={(v) => v && setCorners(v as Corners)}>
              <ToggleGroupItem value="sharp">Sharp</ToggleGroupItem>
              <ToggleGroupItem value="default">Default</ToggleGroupItem>
              <ToggleGroupItem value="round">Round</ToggleGroupItem>
            </ToggleGroup>
          </fieldset>
          <div className="sw-builder__checks" aria-label="Contrast checks">
            <p>Contrast</p>
            {checks.map((c) => (
              <div key={c.label} className="sw-builder__check" data-pass={c.ratio >= c.need || undefined}>
                <span>{c.label}</span>
                <strong>
                  {c.ratio.toFixed(1)}:1 {c.ratio >= c.need ? 'pass' : `needs ${c.need}:1`}
                </strong>
              </div>
            ))}
            <p className="sw-muted">Lines and text in the current colour are darkened or lightened for you until they pass.</p>
          </div>
        </aside>

        <section className="sw-builder__preview" aria-label="Live preview">
          <ThemeProvider mode={mode} theme={overrides}>
            <div className="sw-builder__stage">
              <Card padding="large" live className="sw-builder__card">
                <div className="sw-panel__head">
                  <div>
                    <p className="sw-panel__kicker">Cluster · ap-south-1</p>
                    <p className="sw-panel__title">Production</p>
                  </div>
                  <Badge variant="soft" led>
                    Live
                  </Badge>
                </div>
                <Slider label="Capacity" defaultValue={64} />
                <Progress label="Deploy" value={72} showValue />
                <Textfield label="Service name" defaultValue="api-gateway" />
                <div className="sw-panel__row">
                  <Switch label="Autoscale" defaultChecked />
                  <Checkbox label="Notify the team" defaultChecked />
                </div>
                <Alert variant="soft" title="Heads up">
                  A deploy is already running in this region.
                </Alert>
                <div className="sw-panel__actions">
                  <Button variant="text">Cancel</Button>
                  <Button variant="outlined">Roll back</Button>
                  <Button>Ship it</Button>
                </div>
              </Card>
            </div>
          </ThemeProvider>
        </section>
      </div>

      <section className="sw-builder__export" aria-labelledby="tb-export">
        <h2 id="tb-export">Use it</h2>
        <Tabs defaultValue="ts">
          <TabList aria-label="Export format">
            <Tab value="ts">ThemeProvider</Tab>
            <Tab value="css">CSS variables</Tab>
          </TabList>
          <TabPanel value="ts">
            <CodeBlock code={tsCode} />
          </TabPanel>
          <TabPanel value="css">
            <CodeBlock lang="css" code={cssCode} />
          </TabPanel>
        </Tabs>
      </section>
      <Footer />
    </main>
  );
}
