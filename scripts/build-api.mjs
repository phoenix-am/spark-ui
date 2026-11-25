/**
 * The API reference, read straight from the source: real default values,
 * events with their signatures, CSS classes, state attributes and variables
 * (from the stylesheets), ref methods, slots, and the exported types people
 * pass in (column definitions, option shapes…). Writes registry/api.json,
 * which the docs site renders next to docs.json's props.
 *
 * Run: node scripts/build-api.mjs  (part of `npm run build` via build-docs)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import postcss from 'postcss';
import { ENTRIES } from './entries.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'packages/core/src');
const docs = JSON.parse(fs.readFileSync(path.join(root, 'registry/docs.json'), 'utf8'));

/* --------------------------------------------------------------- sources */
const FILE_OVERRIDES = { '__docgen__/shims.tsx': ['Button/Button.tsx', 'Button/Button.types.ts', 'Toast/Toast.tsx'] };
const filesFor = (files) => [...new Set(files.flatMap((f) => FILE_OVERRIDES[f] ?? [f]))].map((f) => path.join(src, f)).filter((f) => fs.existsSync(f));
const parse = (file) => ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const sources = new Map();
const sourceOf = (file) => sources.get(file) ?? (sources.set(file, parse(file)), sources.get(file));

const LITERAL = /^(['"`][^'"`]*['"`]|-?\d+(\.\d+)?|true|false|null|\[\]|\{\})$/;
const short = (text) => text.replace(/\s+/g, ' ').trim();

/** The function body that implements a component: `function X`, `const X = forwardRef(...)`, or Button's inner function. */
function implementationOf(name, files) {
  const target = name === 'Button' ? 'ButtonInner' : name.replace('.', '');
  for (const file of files) {
    const sf = sourceOf(file);
    let found;
    const visit = (node) => {
      if (found) return;
      if (ts.isFunctionDeclaration(node) && node.name?.text === target) found = node;
      else if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === target && node.initializer) found = node.initializer;
      else ts.forEachChild(node, visit);
    };
    visit(sf);
    if (found) return { node: found, sf, file };
  }
}

/** Defaults: `const { size = 'medium' } = props` (or useDefaults(...)), parameter destructuring, and `props.x ?? literal`. */
function defaultsOf(impl, extraFiles) {
  const out = {};
  if (impl) {
    const visit = (node) => {
      if (ts.isObjectBindingPattern(node)) {
        const init = node.parent && (ts.isVariableDeclaration(node.parent) ? node.parent.initializer : ts.isParameter(node.parent) ? undefined : undefined);
        const fromProps = !init || /^(props|inProps|rest)$|useDefaults\(/.test(init.getText());
        if (fromProps)
          for (const el of node.elements) {
            if (!el.initializer) continue;
            const key = (el.propertyName ?? el.name).getText();
            const value = short(el.initializer.getText());
            if (value.length <= 60) out[key] ??= value;
          }
      }
      ts.forEachChild(node, visit);
    };
    visit(impl.node);
  }
  // `props.x ?? 'value'` / `options.x ?? 10`, anywhere in the component's files (hooks included).
  for (const file of extraFiles) {
    const text = fs.readFileSync(file, 'utf8');
    // `showValue !== false` means the prop is on unless turned off.
    for (const m of text.matchAll(/\b(?:props\.|inProps\.)?([a-zA-Z]+) !== false/g)) out[m[1]] ??= 'true';
    for (const m of text.matchAll(/\b(?:props|inProps|options)\.([a-zA-Z]+)\s*\?\?\s*([^;,)\n]+)/g)) {
      const value = short(m[2]);
      if (LITERAL.test(value)) out[m[1]] ??= value;
    }
  }
  return out;
}

/** Literal destructuring defaults anywhere in the folder: shared frames (charts' `tableView = true`). Lowest priority. */
function folderDefaults(files) {
  const out = {};
  for (const file of files) {
    const visit = (node) => {
      if (ts.isBindingElement(node) && node.initializer && ts.isObjectBindingPattern(node.parent)) {
        const value = short(node.initializer.getText());
        if (LITERAL.test(value)) out[(node.propertyName ?? node.name).getText()] ??= value;
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceOf(file));
  }
  return out;
}

/** Exported interfaces and type aliases a developer passes in or gets back (not the Props interfaces themselves). */
function typesOf(files) {
  const out = [];
  for (const file of files) {
    const sf = sourceOf(file);
    for (const st of sf.statements) {
      const exported = st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      if (!exported) continue;
      if (ts.isInterfaceDeclaration(st) || ts.isTypeAliasDeclaration(st)) {
        const name = st.name.text;
        if (/Props(Base)?$|^Use\w+Options$|TypeMap$|Overrides$|^Internal/.test(name) && !/Column|Option|Item|Series/.test(name)) continue;
        const doc = ts.getJSDocCommentsAndTags(st).map((d) => (typeof d.comment === 'string' ? d.comment : '')).join(' ').trim();
        if (ts.isInterfaceDeclaration(st)) {
          const fields = st.members
            .filter((m) => m.name)
            .map((m) => ({
              name: m.name.getText().replace(/^['"]|['"]$/g, ''),
              type: short(m.type ? m.type.getText() : ts.isMethodSignature(m) ? `(${m.parameters.map((p) => p.getText()).join(', ')}) => ${m.type?.getText() ?? 'void'}` : 'unknown'),
              required: !m.questionToken,
              description: ts.getJSDocCommentsAndTags(m).map((d) => (typeof d.comment === 'string' ? d.comment : '')).join(' ').trim(),
            }));
          // SparkComponentsConfig has one entry per component, all meaning the same thing.
          if (name === 'SparkComponentsConfig') for (const f of fields) f.description ||= `Default props, class names and variants for \`${f.name}\`.`;
          if (fields.length) out.push({ name, kind: 'interface', description: doc, fields });
        } else {
          const text = short(st.type.getText());
          if (text.length <= 220) out.push({ name, kind: 'type', description: doc, type: text });
        }
      }
    }
  }
  return out;
}

/** Ref handles: exported interfaces named *Handle become "methods". */
const methodsOf = (types) =>
  types
    .filter((t) => t.kind === 'interface' && /Handle$/.test(t.name))
    .flatMap((t) => t.fields.map((f) => ({ handle: t.name, name: f.name, signature: f.type, description: f.description })));

/* ---------------------------------------------------------------- styles */
const css = new Map();
for (const f of fs.readdirSync(path.join(src, 'styles')).filter((f) => f.endsWith('.css') && f !== 'tokens.css'))
  css.set(f, postcss.parse(fs.readFileSync(path.join(src, 'styles', f), 'utf8')));

const STATE_PSEUDO = ['hover', 'focus-visible', 'focus-within', 'active', 'disabled', 'checked', 'placeholder-shown', 'invalid'];

/** Everything the stylesheets offer for a block class: parts, state attributes with values, pseudo states, variables and tokens. */
function stylesFor(blocks) {
  const parts = new Map();
  const attrs = new Map();
  const localVars = new Map();
  const tokens = new Set();
  for (const [file, sheet] of css)
    sheet.walkRules((rule) => {
      if (rule.parent?.type === 'atrule' && /keyframes/.test(rule.parent.name)) return;
      for (const selector of rule.selectors ?? []) {
        // Only compounds that start with one of our blocks' classes.
        const compounds = selector.split(/\s*[>+~]\s*|\s+/);
        for (const compound of compounds) {
          const cls = compound.match(/\.(sp-[a-z0-9-]+(?:__[a-z0-9-]+)?)/g)?.map((c) => c.slice(1)) ?? [];
          const mine = cls.find((c) => blocks.some((b) => c === b || c.startsWith(b + '__')));
          if (!mine) continue;
          const part = parts.get(mine) ?? { class: mine, states: new Set(), files: new Set() };
          part.files.add(file);
          for (const p of STATE_PSEUDO) if (compound.includes(':' + p)) part.states.add(':' + p);
          parts.set(mine, part);
          for (const m of compound.matchAll(/\[(data-[a-z-]+)(?:=['"]?([^'"\]]+)['"]?)?\]/g)) {
            const a = attrs.get(m[1]) ?? { name: m[1], values: new Set(), on: new Set() };
            if (m[2]) a.values.add(m[2]);
            a.on.add(mine);
            attrs.set(m[1], a);
          }
          rule.walkDecls((d) => {
            if (d.prop.startsWith('--sp-')) {
              const v = localVars.get(d.prop) ?? { name: d.prop, on: new Set(), value: d.value };
              v.on.add(mine);
              localVars.set(d.prop, v);
            }
            for (const t of d.value.matchAll(/var\((--spark-[a-z0-9-]+)/g)) tokens.add(t[1]);
            for (const t of d.value.matchAll(/var\((--sp-[a-z0-9-]+)(?:,\s*([^)]+))?/g)) {
              const v = localVars.get(t[1]) ?? { name: t[1], on: new Set(), value: t[2] ?? '' };
              v.on.add(mine);
              localVars.set(t[1], v);
            }
          });
        }
      }
    });
  // Root-level attributes set by SparkProvider/ThemeProvider apply everywhere; drop them here.
  for (const a of ['data-spark-energy', 'data-spark-theme']) attrs.delete(a);
  return {
    classes: [...parts.values()]
      .sort((a, b) => (a.class.includes('__') ? 1 : 0) - (b.class.includes('__') ? 1 : 0) || a.class.localeCompare(b.class))
      .map((p) => ({ class: p.class, states: [...p.states] })),
    attributes: [...attrs.values()].map((a) => ({ name: a.name, values: [...a.values], on: [...a.on] })).sort((a, b) => a.name.localeCompare(b.name)),
    variables: [...localVars.values()].map((v) => ({ name: v.name, value: v.value, on: [...v.on] })).sort((a, b) => a.name.localeCompare(b.name)),
    tokens: [...tokens].sort(),
  };
}

/** Block classes a component renders: class names used in its implementation (and its file, for small files). */
function blocksOf(impl, name) {
  const text = impl ? impl.node.getText() : '';
  const found = new Set([...text.matchAll(/['"`\s(]sp-([a-z0-9-]+?)(?=['"`\s_)]|$)/g)].map((m) => 'sp-' + m[1]));
  // Prefer the component's own block (Breadcrumbs → sp-breadcrumbs) when it's there.
  const own = 'sp-' + name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  const shared = new Set(['sp-field-button', 'sp-visually-hidden', 'sp-spark-host', 'sp-current', 'sp-input', 'sp-label', 'sp-helper']);
  return [...found].filter((b) => !shared.has(b) || b === own).sort((a, b) => (a === own ? -1 : b === own ? 1 : 0));
}

/** `classNames` slot keys, read from ClassNames<'root' | 'label' …> in the props type. */
function slotKeysOf(files, name) {
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const iface = text.match(new RegExp(`interface ${name}(?:Props|PropsBase)\\b[\\s\\S]*?\\n}`));
    const m = (iface?.[0] ?? '').match(/classNames\?:\s*ClassNames<([^>]+)>/);
    if (m) return [...m[1].matchAll(/'([a-zA-Z]+)'/g)].map((x) => x[1]);
  }
  return [];
}

/** Values a component sets on its data attributes in JSX ('data-state': on ? 'on' : 'off'), merged into what the CSS styles. */
function withSetValues(styles, impls, docText = '') {
  const text = impls.filter(Boolean).map((i) => i.node.getText()).join('\n');
  for (const a of styles.attributes) {
    const re = new RegExp(`['"]?${a.name}['"]?\\s*[:=]\\s*\\{?([^,}\\n]+)`, 'g');
    for (const m of text.matchAll(re)) {
      let expr = m[1].trim();
      // data-state={state} → const state = on ? 'on' : 'off'
      const id = expr.match(/^([a-zA-Z_]\w*)$/)?.[1];
      if (id) expr = text.match(new RegExp(`(?:const|let)\\s+${id}\\s*=\\s*([^;\\n]+)`))?.[1] ?? expr;
      for (const lit of expr.matchAll(/'([a-z][a-z0-9-]*)'/g)) if (!a.values.includes(lit[1])) a.values.push(lit[1]);
    }
    // The doc comment's style hooks list values too: [data-state="on"|"off"]
    for (const m of docText.matchAll(new RegExp(`\\[${a.name}=((?:"[^"]+"\\|?)+)\\]`, 'g')))
      for (const lit of m[1].matchAll(/"([^"]+)"/g)) if (!a.values.includes(lit[1])) a.values.push(lit[1]);
  }
  return styles;
}

/* --------------------------------------------------------------- compile */
// Each component's own block (Field → sp-field). A component's styles include its own block and any
// secondary blocks it renders that don't belong to another component (DatePicker → sp-date-field).
const ownBlock = (name) => 'sp-' + name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const OWNED = new Set(docs.components.flatMap((e) => e.components.map((c) => ownBlock(c.name.replace('.', '')))));
const SHARES = { RangeCalendar: 'sp-calendar' };

const out = {};
for (const [entry, files, , only] of ENTRIES) {
  const entryFiles = filesFor(files);
  const folderFiles = [...new Set(entryFiles.flatMap((f) => fs.readdirSync(path.dirname(f)).filter((n) => /\.tsx?$/.test(n) && !/stories|test/.test(n)).map((n) => path.join(path.dirname(f), n))))];
  const docEntry = docs.components.find((e) => e.name === entry);
  if (!docEntry) continue;
  const types = typesOf(folderFiles);
  out[entry] = {
    types: types.filter((t) => !/Handle$/.test(t.name)),
    methods: methodsOf(types),
    components: Object.fromEntries(
      docEntry.components.map((c) => {
        const impl = implementationOf(c.name, folderFiles);
        // Many components hand rendering to an inner function (DatePicker → DatePickerInner).
        const inner = implementationOf(c.name + 'Inner', folderFiles) ?? implementationOf(c.name + 'Impl', folderFiles);
        const defaults = { ...folderDefaults(folderFiles), ...defaultsOf(inner, []), ...defaultsOf(impl, folderFiles) };
        let blocks = [...new Set([...(impl ? blocksOf(impl, c.name) : []), ...(inner ? blocksOf(inner, c.name) : [])])];
        const own = 'sp-' + c.name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        if (!blocks.length && [...css.values()].some((sheet) => sheet.toString().includes('.' + own))) blocks = [own];
        if (!blocks.length && SHARES[c.name]) blocks = [SHARES[c.name]];
        blocks.sort((a, b) => (a === own ? -1 : b === own ? 1 : 0));
        blocks = blocks.filter((b, i) => i === 0 || !OWNED.has(b));
        return [
          c.name,
          {
            defaults: Object.fromEntries(
              Object.entries(defaults)
                .filter(([k, v]) => {
                  const prop = c.props.find((p) => p.name === k);
                  // true/false only makes sense as the default of a boolean prop.
                  return prop && (!/^(true|false)$/.test(v) || prop.type === 'boolean');
                })
                // m.dismiss → the translated built-in label
                .map(([k, v]) => [k, /\bm\.\w+/.test(v) ? 'translated label' : v]),
            ),
            events: c.props
              .filter((p) => /^on[A-Z]/.test(p.name))
              .map((p) => ({ name: p.name, signature: p.type, description: p.description })),
            slots: slotKeysOf(folderFiles, c.name.replace('.', '')),
            blocks,
            styles: blocks.length ? withSetValues(stylesFor(blocks), [impl, inner], c.description) : null,
          },
        ];
      }),
    ),
  };
}
fs.writeFileSync(path.join(root, 'registry/api.json'), JSON.stringify(out, null, 2) + '\n');
const comps = Object.values(out).flatMap((e) => Object.values(e.components));
console.log(
  `api: ${comps.length} components, ${comps.reduce((n, c) => n + Object.keys(c.defaults).length, 0)} defaults, ${comps.reduce((n, c) => n + c.events.length, 0)} events, ` +
    `${comps.reduce((n, c) => n + (c.styles?.classes.length ?? 0), 0)} classes, ${comps.reduce((n, c) => n + (c.styles?.attributes.length ?? 0), 0)} state attributes, ` +
    `${Object.values(out).reduce((n, e) => n + e.types.length, 0)} types, ${Object.values(out).reduce((n, e) => n + e.methods.length, 0)} methods`,
);

/* ---------------------------------------------------------- descriptions */
// Second pass: plain-language descriptions for classes and state attributes.
const ATTR = {
  'data-disabled': 'Present when the component (or this part) is disabled.',
  'data-flat': 'Present when the button has no elevation (`disableElevation`).',
  'data-full-width': 'Present when it stretches to the container width (`fullWidth`).',
  'data-size': 'The current `size`.',
  'data-variant': 'The current `variant`.',
  'data-state': 'The current state, e.g. `on` for a switch that is on, `open` for an open panel, `charged` for a full meter.',
  'data-invalid': 'Present when the value is invalid (`error`, or failed validation).',
  'data-checked': 'Present when checked or selected.',
  'data-dragging': 'Present while a thumb or file is being dragged.',
  'data-focus-visible': 'Present while focused from the keyboard. Use it for focus styles instead of `:focus`.',
  'data-charged': 'Present when the charge meter is full.',
  'data-icon-only': 'Present when the item shows only an icon.',
  'data-orientation': 'Layout direction: `horizontal` or `vertical`.',
  'data-selected': 'Present on the selected item.',
  'data-done': 'Present when the item or upload has finished.',
  'data-responsive': 'How the table adapts in narrow containers (`responsive`).',
  'data-status': 'The item status, e.g. a step that is `current`, `complete`, `error` or `upcoming`, or an avatar that is `online`, `busy` or `away`.',
  'data-drop-target': 'Present while files are dragged over the drop zone.',
  'data-indeterminate': 'Present in the indeterminate (“some selected”) state.',
  'data-literal': 'Present on separator segments of a date or time, like “/” or “:”.',
  'data-placeholder': 'Present while a segment is still empty.',
  'data-over': 'Present while dragging over the target.',
  'data-kind': 'Which chart part this is: `info` text or an `area` fill.',
  'data-active': 'Present on the active (current) item.',
  'data-borderless': 'Present when the section has no border.',
  'data-focused': 'Present on the item with keyboard focus.',
  'data-open': 'Present while the popover, menu or panel is open.',
  'data-custom': 'Present when the cell is drawn by your `renderDay`.',
  'data-in-range': 'Present on days inside a selected range.',
  'data-months': 'How many months are shown side by side.',
  'data-outside': 'Present on days from the previous or next month.',
  'data-range': 'Present when the calendar selects a range.',
  'data-range-end': 'Present on the last day of a selected range.',
  'data-range-start': 'Present on the first day of a selected range.',
  'data-today': 'Present on today’s date.',
  'data-unavailable': 'Present on days that can’t be picked (`isDateDisabled`, `min`, `max`).',
  'data-align': 'Cell alignment: `start`, `center` or `end` (from the column’s `align`).',
  'data-density': 'Row spacing: `compact`, `normal` or `comfortable` (`density`).',
  'data-editable': 'Present on cells that can be edited.',
  'data-editing': 'Present on the cell being edited.',
  'data-expanded': 'Present on an expanded row or section.',
  'data-interactive': 'Present when rows respond to clicks (selection or `onRowAction`).',
  'data-label': 'The column header, shown as a label when rows stack into cards.',
  'data-pinned': 'Which edge a pinned column sticks to: `start` or `end`.',
  'data-scroll': 'Present when the table has a fixed height and scrolls (`maxHeight`).',
  'data-sortable': 'Present on columns that can be sorted.',
  'data-sorted': 'The sort direction of a sorted column: `ascending` or `descending`.',
  'data-striped': 'Present when alternate rows are shaded (`striped`).',
  'data-virtual': 'Present when only visible rows are rendered (`virtualize`).',
  'data-live': 'Present when current runs around the edge (`live`).',
  'data-collapsed': 'Present while collapsed to icons.',
  'data-current-branch': 'Present on a section that contains the active item.',
  'data-mobile': 'Present when shown as a mobile drawer.',
  'data-placement': 'Where it opens relative to its trigger or the screen edge.',
  'data-padding': 'Inner spacing (`padding`).',
  'data-shape': 'The placeholder shape (`shape`).',
  'data-pulse': 'Present when the LED pulses (`pulse`).',
  'data-tone': 'The colour tone (`tone`).',
  'data-danger': 'Present on destructive items.',
  'data-color': 'The current `color`.',
  'data-pressed': 'Present while pressed.',
  'data-hovered': 'Present while the pointer is over it.',
  'data-required': 'Present when the field is required.',
  'data-readonly': 'Present when the field is read-only.',
  'data-energy': 'The energy level in effect.',
};
const PART = {
  icon: 'An icon.', bulb: 'The bulb that lights up when on (`showBulb`).', control: 'The interactive control.', lever: 'The moving lever.',
  node: 'A contact point of the circuit.', pivot: 'The lever’s pivot.', wire: 'The wire the current flows along.', box: 'The square box.',
  dash: 'The dash shown when indeterminate, or between range dates.', helper: 'Helper or error text under the field.', input: 'The native input.',
  tick: 'The check mark.', thumb: 'A draggable thumb, or a file preview.', track: 'The track behind the fill.', fill: 'The filled part of the track.',
  'meter-fill': 'The charge meter’s fill.', 'meter-track': 'The charge meter’s track.', 'meter-label': 'The charge meter’s text.',
  steppers: 'The −/+ buttons.', stepper: 'One −/+ button.', connector: 'The line between steps.', indicator: 'The step’s circle.',
  zone: 'The drop zone.', prompt: 'The “drop files” text.', particle: 'One spark particle.', band: 'A highlighted band (hover).',
  key: 'A legend key.', swatch: 'A colour swatch.', led: 'The status light.', face: 'The picture or initials.', arc: 'The spinning arc.',
  head: 'The bright head of the arc.', sweep: 'The moving sweep of an indeterminate bar.', shimmer: 'The loading shimmer.',
  esc: 'The Esc key hint.', ellipsis: 'The “…” for skipped items.', crosshair: 'The vertical guide line on hover.', plot: 'The plotting area.',
  'donut-ring': 'The ring behind the slices.', 'table-scroll': 'The scrolling wrapper of the data table view.', resizer: 'The column resize handle.',
  expander: 'The expand/collapse button of a row.', bulk: 'The bulk-actions bar shown when rows are selected.', 'nav-spacer': 'Spacing between month navigation buttons.',
  backdrop: 'The dimmed backdrop.', bubble: 'The tooltip bubble.', adornment: 'Content at the start or end of the input.', end: 'Content at the end.',
  check: 'The selected check mark.', more: 'The “+3” overflow avatar.', literal: 'A separator like “/”.',
};
const human = (s) => s.replace(/--/g, ' ').replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());
for (const entry of Object.values(out))
  for (const [name, c] of Object.entries(entry.components)) {
    if (!c.styles) continue;
    const doc = docs.components.flatMap((e) => e.components).find((x) => x.name === name);
    c.styles.classes = c.styles.classes.map((cl) => {
      const [block, part] = cl.class.split('__');
      const description = part ? PART[part] ?? `The ${human(part).toLowerCase()}.` : block === c.blocks[0] ? 'The root element.' : `The ${human(block.replace(/^sp-/, '')).toLowerCase()} element.`;
      return { ...cl, description };
    });
    c.styles.attributes = c.styles.attributes.map((a) => {
      const prop = doc?.props.find((p) => p.name === a.name.replace(/^data-/, '').replace(/-([a-z])/g, (_, l) => l.toUpperCase()));
      const values = [...new Set([...(prop?.values?.filter((v) => !/^(true|false)$/.test(v)) ?? []), ...a.values])];
      return { ...a, values, description: ATTR[a.name] ?? (prop ? `The current \`${prop.name}\`.` : 'Set by the component.') };
    });
  }
fs.writeFileSync(path.join(root, 'registry/api.json'), JSON.stringify(out, null, 2) + '\n');
const unknownAttrs = new Set(Object.values(out).flatMap((e) => Object.values(e.components)).flatMap((c) => c.styles?.attributes ?? []).filter((a) => a.description === 'Set by the component.').map((a) => a.name));
if (unknownAttrs.size) console.log('api: attributes without a description:', [...unknownAttrs].join(' '));
