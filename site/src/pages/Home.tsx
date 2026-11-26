import React, { useState } from 'react';
import { Link } from 'react-router';
import {
  Button,
  Badge,
  Card,
  Switch,
  Slider,
  Progress,
  Sparkline,
  LineChart,
  DataTable,
  Stepper,
  AvatarGroup,
  Textfield,
  Checkbox,
  ToggleGroup,
  ToggleGroupItem,
  SparkProvider,
  DatePicker,
  Alert,
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from '@sparkwire/core';
import core from '../../../packages/core/package.json';
import { useSite, Footer, GITHUB } from '../App';
import { Icon } from '../components/Icon';
import { CodeBlock } from '../components/CodeBlock';
import { entries } from '../lib/catalog';
import { usePageTitle } from '../lib/usePageTitle';

const traffic = [
  { day: 'Mon', requests: 1820, errors: 42 },
  { day: 'Tue', requests: 2140, errors: 38 },
  { day: 'Wed', requests: 1990, errors: 51 },
  { day: 'Thu', requests: 2620, errors: 29 },
  { day: 'Fri', requests: 3010, errors: 33 },
  { day: 'Sat', requests: 2380, errors: 21 },
  { day: 'Sun', requests: 2710, errors: 24 },
];
const services = [
  { id: 'api', service: 'api-gateway', region: 'Mumbai', status: 'Live', latency: 42 },
  { id: 'pay', service: 'payments', region: 'Singapore', status: 'Live', latency: 58 },
  { id: 'srch', service: 'search', region: 'Frankfurt', status: 'Building', latency: 0 },
  { id: 'auth', service: 'auth', region: 'Virginia', status: 'Live', latency: 37 },
];
const tone = { Live: 'success', Building: 'warning' } as const;

const LANGS = [
  { code: 'en', label: 'English', hello: 'Create your account', name: 'Full name', date: 'Date of birth', terms: 'I agree to the terms', cta: 'Get started' },
  { code: 'hi', label: 'हिन्दी', hello: 'अपना खाता बनाएँ', name: 'पूरा नाम', date: 'जन्म तिथि', terms: 'मैं शर्तों से सहमत हूँ', cta: 'शुरू करें' },
  { code: 'gu', label: 'ગુજરાતી', hello: 'તમારું ખાતું બનાવો', name: 'પૂરું નામ', date: 'જન્મ તારીખ', terms: 'હું શરતો સાથે સંમત છું', cta: 'શરૂ કરો' },
  { code: 'ta', label: 'தமிழ்', hello: 'உங்கள் கணக்கை உருவாக்கவும்', name: 'முழுப் பெயர்', date: 'பிறந்த தேதி', terms: 'விதிமுறைகளை ஏற்கிறேன்', cta: 'தொடங்கு' },
];

const FEATURES = [
  { icon: 'accessibility', title: 'Accessible by default', body: 'Built on React Aria for the hard parts. Every component is checked with axe, and keyboard behaviour is tested, not hoped for.' },
  { icon: 'terminal', title: 'Own the source', body: 'Install from npm, or run npx sparkwire add data-table and the code lands in your repo, ready to bend to your will.' },
  { icon: 'palette', title: 'Tokens all the way down', body: 'One set of CSS variables drives every colour, radius and motion. Works with Tailwind v3 and v4 out of the box.' },
  { icon: 'globe', title: 'Speaks your language', body: 'Built-in English, Hindi, Gujarati and Tamil labels, Intl-formatted numbers and dates, and right-to-left support.' },
  { icon: 'table', title: 'Charts and a real data grid', body: 'Virtualised tables, resizable and pinned columns, inline editing, and SVG charts. No chart or table library underneath.' },
  { icon: 'sparkle', title: 'Ready for AI agents', body: 'An MCP server and llms.txt mean your coding assistant knows every prop, instead of guessing at them.' },
];

const HERO_CODE = `import { DataTable } from '@sparkwire/core';

<DataTable
  aria-label="Services"
  data={services}
  columns={[
    { key: 'service', header: 'Service', sortable: true },
    { key: 'region', header: 'Region' },
    { key: 'latency', header: 'Latency (ms)', sortable: true },
  ]}
  searchable
/>`;

const WAYS = [
  { title: 'Install the package', body: 'Fixes and new features arrive with npm update. Best when you want to keep up without effort.', command: 'npm install @sparkwire/core', href: '/docs/getting-started', link: 'Getting started' },
  { title: 'Copy the source', body: 'The files land in your repo with everything they need. Best when you plan to change them.', command: 'npx sparkwire add button', href: '/docs/cli', link: 'The CLI' },
  { title: 'Let your AI agent do it', body: 'The MCP server gives coding assistants the real props, so they stop guessing.', command: 'npx @sparkwire/mcp', href: '/docs/ai', link: 'AI coding agents' },
];

type Comparison = { id: string; title: string; components: { name: string; slug: string }[]; rows: string[][] };
const COMPARISONS: Comparison[] = [
  {
    id: 'pick',
    title: 'Picking a value',
    components: [{ name: 'Dropdown', slug: 'dropdown' }, { name: 'Combobox', slug: 'combobox' }, { name: 'Menu', slug: 'menu' }],
    rows: [
      ['pick one value from a short list', 'Best fit', 'Works', 'No, it runs actions'],
      ['find one of hundreds by typing', 'Type-to-jump only', 'Best fit', 'No'],
      ['enter a value that isn\'t in the list', 'No', 'Best fit', 'No'],
      ['run an action like Rename or Delete', 'No', 'No', 'Best fit'],
    ],
  },
  {
    id: 'panel',
    title: 'Opening a panel',
    components: [{ name: 'Modal', slug: 'modal' }, { name: 'Drawer', slug: 'drawer' }, { name: 'Tooltip', slug: 'tooltip' }],
    rows: [
      ['confirm something that matters, like a delete', 'Best fit', 'Works', 'No'],
      ['use filters or details while the page stays visible', 'Covers the page', 'Best fit', 'No'],
      ['see a short hint on hover or focus', 'No', 'No', 'Best fit'],
    ],
  },
  {
    id: 'tell',
    title: 'Telling people something',
    components: [{ name: 'Toast', slug: 'toast' }, { name: 'Alert', slug: 'alert' }],
    rows: [
      ['know an action worked, then move on', 'Best fit', 'Works, but stays on the page'],
      ['read a problem and fix it', 'Can disappear too soon', 'Best fit'],
      ['undo what they just did', 'Best fit', 'Works'],
    ],
  },
];

function CopyLine({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="sw-install sw-way__cmd"
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      aria-label={`Copy ${text}`}
    >
      <span className="sw-install__prompt">$</span> {text}
      <span className="sw-install__copy">{copied ? <Icon name="check" size={16} /> : 'Copy'}</span>
    </button>
  );
}

export function Home() {
  usePageTitle();
  const { energy, setEnergy } = useSite();
  const [lang, setLang] = useState('hi');
  const [copied, setCopied] = useState(false);
  const [load, setLoad] = useState(64);
  const [step, setStep] = useState(1);
  const L = LANGS.find((l) => l.code === lang)!;
  const count = entries.reduce((n, e) => n + e.components.length, 0);

  return (
    <main className="sw-home" id="main">
      {/* ------------------------------------------------------------ hero */}
      <section className="sw-hero">
        <div className="sw-hero__glow" aria-hidden="true" />
        <div className="sw-hero__copy">
          <a href={`${GITHUB}/blob/master/packages/core/CHANGELOG.md`} className="sw-pill" target="_blank" rel="noreferrer">
            <Badge tone="success" variant="soft" led>
              v{core.version}
            </Badge>
            Stable API · see what's new
            <Icon name="arrow" size={14} />
          </a>
          <h1>
            React components
            <br />
            with a <span className="sw-wire">live wire</span>.
          </h1>
          <p className="sw-hero__lead">
            Sparkwire is an accessible component library where interfaces feel switched on. Sparks on press, current on hover, and an energy dial that turns it all up, down or off.
          </p>
          <div className="sw-hero__cta">
            <Button as={Link} to="/docs/getting-started" size="large" endIcon={<Icon name="arrow" />}>
              Get started
            </Button>
            <Button as={Link} to="/components/button" size="large" variant="outlined">
              Browse components
            </Button>
          </div>
          <button
            type="button"
            className="sw-install"
            onClick={() => {
              navigator.clipboard?.writeText('npm install @sparkwire/core');
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            aria-label="Copy install command"
          >
            <span className="sw-install__prompt">$</span> npm install @sparkwire/core
            <span className="sw-install__copy">{copied ? <Icon name="check" size={16} /> : 'Copy'}</span>
          </button>
        </div>

        <div className="sw-hero__demo" aria-label="Live demo">
          <Card padding="large" live className="sw-panel">
            <div className="sw-panel__head">
              <div>
                <p className="sw-panel__kicker">Cluster · ap-south-1</p>
                <p className="sw-panel__title">Production</p>
              </div>
              <Badge tone="success" variant="soft" led pulse>
                Healthy
              </Badge>
            </div>
            <div className="sw-panel__stats">
              <div>
                <span>Requests</span>
                <strong>16.7k</strong>
                <Sparkline aria-label="Requests this week, trending up" data={traffic.map((t) => t.requests)} area height={32} width={120} />
              </div>
              <div>
                <span>Error rate</span>
                <strong>1.4%</strong>
                <Sparkline aria-label="Errors this week, trending down" data={traffic.map((t) => t.errors)} height={32} width={120} />
              </div>
            </div>
            <Slider label="Capacity" value={load} onChange={(v) => setLoad(v as number)} formatOptions={{ style: 'unit', unit: 'percent' }} />
            <Progress label="Deploy" value={load} showValue tone={load > 85 ? 'warning' : 'brand'} />
            <div className="sw-panel__row">
              <Switch label="Autoscale" defaultChecked showBulb />
              <AvatarGroup size="small" max={3} people={[{ name: 'Anmol Mehta' }, { name: 'Asha Patel' }, { name: 'Rohan Shah' }, { name: 'Meera Joshi' }]} />
            </div>
            <div className="sw-panel__actions">
              <Button variant="outlined" size="small">
                Roll back
              </Button>
              <Button size="small">Ship it</Button>
            </div>
          </Card>
          <div className="sw-dial">
            <span id="dial-label">Turn the energy dial</span>
            <ToggleGroup aria-labelledby="dial-label" size="small" value={energy} onChange={(v) => v && setEnergy(v as typeof energy)}>
              <ToggleGroupItem value="off">Off</ToggleGroupItem>
              <ToggleGroupItem value="calm">Calm</ToggleGroupItem>
              <ToggleGroupItem value="default">Default</ToggleGroupItem>
              <ToggleGroupItem value="electric">Electric</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- stats */}
      <section className="sw-stats" aria-label="At a glance">
        <div>
          <strong>{count}</strong>
          <span>components</span>
        </div>
        <div>
          <strong>4</strong>
          <span>languages built in</span>
        </div>
        <div>
          <strong>100%</strong>
          <span>axe-checked</span>
        </div>
        <div>
          <strong>18 &amp; 19</strong>
          <span>React versions supported</span>
        </div>
      </section>

      {/* ---------------------------------------------------- ways in */}
      <section className="sw-section">
        <header className="sw-section__head">
          <p className="sw-eyebrow">Pick your way in</p>
          <h2>Install it, own it, or let your agent do it</h2>
        </header>
        <div className="sw-ways">
          {WAYS.map((w) => (
            <div key={w.title} className="sw-way">
              <h3>{w.title}</h3>
              <p>{w.body}</p>
              <CopyLine text={w.command} />
              <Link to={w.href} className="sw-way__link">
                {w.link} <Icon name="arrow" size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- showcase */}
      <section className="sw-section">
        <header className="sw-section__head">
          <p className="sw-eyebrow">Showcase</p>
          <h2>Real components, not screenshots</h2>
          <p>Everything on this page is Sparkwire. Sort the table, pick a date, click through the steps.</p>
        </header>
        <div className="sw-bento">
          <Card padding="medium" className="sw-bento__wide">
            <p className="sw-bento__label">LineChart</p>
            <LineChart
              title="Traffic this week"
              data={traffic}
              x="day"
              area
              height={220}
              series={[
                { key: 'requests', label: 'Requests' },
                { key: 'errors', label: 'Errors' },
              ]}
            />
          </Card>
          <Card padding="medium">
            <p className="sw-bento__label">DatePicker</p>
            <DatePicker label="Launch date" presets={['today', 'tomorrow', '+1w']} />
            <Alert tone="info" variant="soft" title="Typed or picked">
              Type a date, use the arrow keys, or choose a preset.
            </Alert>
          </Card>
          <Card padding="medium" className="sw-bento__wide">
            <p className="sw-bento__label">DataTable</p>
            <DataTable
              aria-label="Services"
              data={services}
              pageSize={0}
              density="compact"
              selectionMode="multiple"
              columns={[
                { key: 'service', header: 'Service', sortable: true },
                { key: 'region', header: 'Region', sortable: true },
                { key: 'status', header: 'Status', cell: (r: (typeof services)[number]) => <Badge tone={tone[r.status as keyof typeof tone]} variant="soft" led>{r.status}</Badge> },
                { key: 'latency', header: 'Latency', sortable: true, cell: (r: (typeof services)[number]) => (r.latency ? `${r.latency} ms` : '—') },
              ]}
            />
          </Card>
          <Card padding="medium">
            <p className="sw-bento__label">Stepper</p>
            <Stepper
              orientation="vertical"
              active={step}
              onStepClick={setStep}
              clickable="all"
              steps={[{ label: 'Connect repo', description: 'GitHub' }, { label: 'Configure', description: 'Env and region' }, { label: 'Deploy' }]}
            />
            <div className="sw-panel__actions">
              <Button size="small" variant="text" disabled={step === 0} onClick={() => setStep(step - 1)}>
                Back
              </Button>
              <Button size="small" disabled={step === 2} onClick={() => setStep(step + 1)}>
                Next
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* ------------------------------------------------------- languages */}
      <section className="sw-section sw-split">
        <header className="sw-section__head sw-section__head--left">
          <p className="sw-eyebrow">Built-in languages</p>
          <h2>Not just English</h2>
          <p>Screen-reader labels, placeholders and messages come translated. Numbers and dates follow the locale through Intl, so ₹1,00,000 looks the way your users expect.</p>
          <ToggleGroup aria-label="Language" value={lang} onChange={(v) => v && setLang(v as string)}>
            {LANGS.map((l) => (
              <ToggleGroupItem key={l.code} value={l.code}>
                {l.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </header>
        <SparkProvider locale={lang}>
          <Card padding="large" className="sw-lang-card" lang={lang}>
            <p className="sw-panel__title">{L.hello}</p>
            <Textfield label={L.name} defaultValue={lang === 'en' ? 'Anmol Mehta' : ''} />
            <DatePicker label={L.date} />
            <Checkbox label={L.terms} defaultChecked />
            <Button fullWidth>{L.cta}</Button>
          </Card>
        </SparkProvider>
      </section>

      {/* ---------------------------------------------------- which one */}
      <section className="sw-section">
        <header className="sw-section__head">
          <p className="sw-eyebrow">Not sure which one?</p>
          <h2>Pick by what people need to do</h2>
          <p>Some components look alike but do different jobs. Start from the task.</p>
        </header>
        <Tabs defaultValue={COMPARISONS[0].id} className="sw-compare">
          <TabList aria-label="Comparisons">
            {COMPARISONS.map((c) => (
              <Tab key={c.id} value={c.id}>
                {c.title}
              </Tab>
            ))}
          </TabList>
          {COMPARISONS.map((c) => (
            <TabPanel key={c.id} value={c.id}>
              <div className="sw-compare__scroll">
                <table className="sw-compare__table">
                  <caption className="sw-visually-hidden">{c.title}: which component fits each task</caption>
                  <thead>
                    <tr>
                      <th scope="col">I want people to…</th>
                      {c.components.map((x) => (
                        <th key={x.slug} scope="col">
                          <Link to={`/components/${x.slug}`}>{x.name}</Link>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {c.rows.map(([task, ...cells]) => (
                      <tr key={task}>
                        <th scope="row">{task}</th>
                        {cells.map((cell, i) => (
                          <td key={i} data-fit={cell.startsWith('Best') ? 'best' : cell.startsWith('No') ? 'no' : undefined}>
                            {cell.startsWith('Best') && <Icon name="check" size={14} />}
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabPanel>
          ))}
        </Tabs>
      </section>

      {/* -------------------------------------------------------- features */}
      <section className="sw-section">
        <header className="sw-section__head">
          <p className="sw-eyebrow">Why Sparkwire</p>
          <h2>Polished outside, solid inside</h2>
        </header>
        <div className="sw-features">
          {FEATURES.map((f) => (
            <div key={f.title} className="sw-feature">
              <span className="sw-feature__icon">
                <Icon name={f.icon} size={20} />
              </span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ code */}
      <section className="sw-section sw-split">
        <header className="sw-section__head sw-section__head--left">
          <p className="sw-eyebrow">Developer experience</p>
          <h2>A few lines, a finished feature</h2>
          <p>Sorting, search, selection, keyboard navigation and screen-reader support come with it. You bring the data.</p>
          <Button as={Link} to="/components/data-table" variant="outlined" endIcon={<Icon name="arrow" />}>
            See the DataTable
          </Button>
        </header>
        <CodeBlock code={HERO_CODE} />
      </section>

      {/* ------------------------------------------------------------- cta */}
      <section className="sw-cta">
        <h2>Flip the switch</h2>
        <p>Free and open source under the MIT licence.</p>
        <div className="sw-hero__cta">
          <Button as={Link} to="/docs/getting-started" size="large">
            Read the docs
          </Button>
          <Button as="a" href={GITHUB} target="_blank" rel="noreferrer" size="large" variant="outlined" startIcon={<Icon name="github" />}>
            Star on GitHub
          </Button>
        </div>
      </section>
      <Footer />
    </main>
  );
}
