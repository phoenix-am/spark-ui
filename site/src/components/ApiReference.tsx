import React from 'react';
import type { ComponentDoc, PropDoc } from '../lib/catalog';
import { apiOf, defaultFor, methodsFor, payloadOf, typesFor, type StyleAttr, type StyleClass, type StyleVar } from '../lib/api';
import { RefTable } from './RefTable';
import { eventAnchor, propAnchor, varAnchor } from '../lib/anchors';

const anchor = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const isDeprecated = (p: PropDoc) => /deprecated/i.test(p.description);
const typeText = (p: PropDoc) => (p.values?.length ? p.values.map((v) => (/^(true|false|\d+)$/.test(v) ? v : `'${v}'`)).join(' | ') : p.type);
/** Props whose type takes content: children, icons, actions, render functions. */
const isSlotProp = (p: PropDoc) => /ReactNode|ReactElement|JSX\.Element|=>\s*(React\.)?ReactNode/.test(p.type) && !/^on[A-Z]/.test(p.name);

function PropsTable({ c }: { c: ComponentDoc }) {
  const rows = [...c.props].sort((a, b) => Number(b.required) - Number(a.required) || Number(isDeprecated(a)) - Number(isDeprecated(b)) || a.name.localeCompare(b.name));
  return (
    <RefTable<PropDoc>
      caption={`${c.name} props`}
      rowKey={(p) => p.name}
      rowId={(p) => propAnchor(c.name, p.name)}
      rows={rows}
      columns={[
        { label: 'Prop', render: (p) => <><code className="sw-props__name">{p.name}</code>{isDeprecated(p) && <span className="sw-props__dep">deprecated</span>}</> },
        { label: 'Type', render: (p) => ({ code: typeText(p) }) },
        { label: 'Default', render: (p) => { const d = defaultFor(c.name, p); return d ? { code: d } : undefined; } },
        { label: 'Required', render: (p) => (p.required ? <span className="sw-props__req">Yes</span> : 'No') },
        { label: 'Description', render: (p) => ({ md: p.description.replace(/^@deprecated\s*/, '**Deprecated.** ') }) },
      ]}
    />
  );
}

function StylesTables({ c }: { c: ComponentDoc }) {
  const s = apiOf(c.name)?.styles;
  if (!s) return null;
  return (
    <>
      <RefTable<StyleClass>
        caption={`${c.name} CSS classes`}
        rowKey={(r) => r.class}
        rows={s.classes}
        columns={[
          { label: 'Class', render: (r) => ({ code: `.${r.class}` }) },
          { label: 'Target', render: (r) => ({ md: r.description }) },
          { label: 'Styled states', render: (r) => (r.states.length ? { code: r.states.join(' ') } : undefined) },
        ]}
      />
      <RefTable<StyleAttr>
        caption={`${c.name} state attributes`}
        rowKey={(r) => r.name}
        rows={s.attributes}
        columns={[
          { label: 'Attribute', render: (r) => ({ code: `[${r.name}]` }) },
          { label: 'Values', render: (r) => (r.values.length ? { code: r.values.map((v) => `'${v}'`).join(' | ') } : 'Present or absent') },
          { label: 'On', render: (r) => ({ code: r.on.map((x) => `.${x}`).join(' ') }) },
          { label: 'Description', render: (r) => ({ md: r.description }) },
        ]}
      />
      {s.variables.length > 0 && (
        <p className="sw-api__hint">
          Component variables size and colour the parts. Override one on the component's class, for example{' '}
          <code>{`.${apiOf(c.name)?.blocks[0]} { ${s.variables[0].name}: … }`}</code>, or through <code>style</code>.
        </p>
      )}
      <RefTable<StyleVar>
        caption={`${c.name} CSS variables`}
        rowKey={(r) => r.name}
        rowId={(r) => varAnchor(c.name, r.name)}
        rows={s.variables}
        columns={[
          { label: 'Variable', render: (r) => ({ code: r.name }) },
          { label: 'Default', render: (r) => (r.value ? { code: r.value } : undefined) },
          { label: 'Target', render: (r) => ({ code: r.on.map((x) => `.${x}`).join(' ') }) },
        ]}
      />
      {s.tokens.length > 0 && (
        <p className="sw-api__tokens">
          <strong>Theme tokens used:</strong> {s.tokens.map((t, i) => <React.Fragment key={t}>{i > 0 && ' '}<code>{t}</code></React.Fragment>)}. Change them on <code>:root</code> or through <code>ThemeProvider</code> to restyle this component with everything else.
        </p>
      )}
    </>
  );
}

function EventsTable({ c }: { c: ComponentDoc }) {
  const events = apiOf(c.name)?.events ?? c.props.filter((p) => /^on[A-Z]/.test(p.name)).map((p) => ({ name: p.name, signature: p.type, description: p.description }));
  return (
    <RefTable
      caption={`${c.name} events`}
      rowKey={(e) => e.name}
      rowId={(e) => eventAnchor(c.name, e.name)}
      rows={events}
      columns={[
        { label: 'Event', render: (e) => ({ code: e.name }) },
        { label: 'Signature', render: (e) => ({ code: e.signature }) },
        { label: 'Payload', render: (e) => ({ code: payloadOf(e.signature) }) },
        { label: 'When it fires', render: (e) => ({ md: e.description }) },
      ]}
    />
  );
}

function SlotsTable({ c }: { c: ComponentDoc }) {
  const a = apiOf(c.name);
  const classes = a?.styles?.classes ?? [];
  const block = a?.blocks[0];
  const classFor = (key: string) => (key === 'root' ? block : classes.find((x) => x.class.endsWith('__' + key))?.class ?? classes.find((x) => x.class.includes(key))?.class);
  const contentProps = c.props.filter(isSlotProp);
  return (
    <>
      <RefTable
        caption={`${c.name} content slots`}
        rowKey={(p: PropDoc) => p.name}
        rows={contentProps}
        columns={[
          { label: 'Slot prop', render: (p) => ({ code: p.name }) },
          { label: 'Accepts', render: (p) => ({ code: p.type }) },
          { label: 'Description', render: (p) => ({ md: p.description }) },
        ]}
      />
      {a?.slots.length ? (
        <RefTable
          caption={`${c.name} classNames parts`}
          rowKey={(k: string) => k}
          rows={a.slots}
          columns={[
            { label: 'classNames key', render: (k) => ({ code: k }) },
            { label: 'Adds classes to', render: (k) => { const cl = classFor(k); return cl ? { code: `.${cl}` } : undefined; } },
          ]}
        />
      ) : null}
    </>
  );
}

/** Full reference for each component on the page. */
export function ApiReference({ components }: { components: ComponentDoc[] }) {
  const types = typesFor(components);
  const methods = methodsFor(components);
  return (
    <>
      {components.map((c) => {
        const a = apiOf(c.name);
        const hasEvents = c.props.some((p) => /^on[A-Z]/.test(p.name));
        const hasSlots = c.props.some(isSlotProp) || (a?.slots.length ?? 0) > 0;
        const id = anchor(c.name);
        return (
          <div key={c.name} className="sw-api">
            {components.length > 1 && (
              <h3 id={`api-${id}`} className="sw-api__name">
                <code>{c.name}</code>
              </h3>
            )}
            <h4 id={`props-${id}`}>Props</h4>
            {c.props.length ? <PropsTable c={c} /> : <p className="sw-muted">No props of its own.</p>}
            {a?.styles && (
              <>
                <h4 id={`styles-${id}`}>Styles</h4>
                <p className="sw-api__hint">
                  Target these classes and attributes from your CSS, or pass extra classes with <code>className</code>
                  {a.slots.length ? <> and <code>classNames</code></> : null}. State attributes change as the component does, so you can style states without JavaScript.
                </p>
                <StylesTables c={c} />
              </>
            )}
            {hasEvents && (
              <>
                <h4 id={`events-${id}`}>Events</h4>
                <EventsTable c={c} />
              </>
            )}
            {hasSlots && (
              <>
                <h4 id={`slots-${id}`}>Slots and composition</h4>
                <SlotsTable c={c} />
              </>
            )}
          </div>
        );
      })}
      {methods.length > 0 && (
        <div className="sw-api">
          <h3 id="methods">Methods</h3>
          <RefTable
            caption="Methods"
            rowKey={(m) => m.handle + m.name}
            rows={methods}
            columns={[
              { label: 'Method', render: (m) => ({ code: `${m.handle}.${m.name}` }) },
              { label: 'Signature', render: (m) => ({ code: m.signature }) },
              { label: 'Description', render: (m) => ({ md: m.description }) },
            ]}
          />
        </div>
      )}
      {types.length > 0 && (
        <div className="sw-api">
          <h3 id="types">Types</h3>
          <p className="sw-api__hint">Shapes you pass in or get back, exported from <code>@sparkwire/core</code> for use in your own code.</p>
          {types.map((t) =>
            t.kind === 'interface' ? (
              <div key={t.name} className="sw-type">
                <h4 id={`type-${anchor(t.name)}`}>
                  <code>{t.name}</code>
                </h4>
                {t.description && <p>{t.description}</p>}
                <RefTable
                  caption={t.name}
                  rowKey={(f) => f.name}
                  rows={t.fields ?? []}
                  columns={[
                    { label: 'Field', render: (f) => ({ code: f.name }) },
                    { label: 'Type', render: (f) => ({ code: f.type }) },
                    { label: 'Required', render: (f) => (f.required ? <span className="sw-props__req">Yes</span> : 'No') },
                    { label: 'Description', render: (f) => ({ md: f.description }) },
                  ]}
                />
              </div>
            ) : (
              <div key={t.name} className="sw-type">
                <h4 id={`type-${anchor(t.name)}`}>
                  <code>{t.name}</code>
                </h4>
                {t.description && <p>{t.description}</p>}
                <pre className="sw-type__alias">
                  <code>
                    type {t.name} = {t.type};
                  </code>
                </pre>
              </div>
            ),
          )}
        </div>
      )}
    </>
  );
}
