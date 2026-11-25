# Sparkwire guide

Everything the README skims over, in one place. For live examples and every prop, see the [docs site](https://phoenix-am.github.io/spark-ui/).

## Contents

- **Foundations**
  - [Install](#install)
  - [Live Wire theme](#live-wire-theme)
  - [Energy dial, `useSpark()` and haptics](#energy-dial-usespark-and-haptics)
  - [Theming](#theming)
  - [App-wide defaults and slots](#app-wide-defaults-and-slots)
  - [`render` prop and theme variants](#render-prop-and-theme-variants)
  - [Tailwind](#tailwind)
  - [Languages](#languages)
  - [Languages, dates and right-to-left](#languages-dates-and-right-to-left)
  - [Forms](#forms)
  - [Accessibility](#accessibility)
- **Components**
  - [Dropdown, Combobox and Menu](#dropdown-combobox-and-menu)
  - [Dates: presets, rules and ranges](#dates-presets-rules-and-ranges)
  - [TimePicker](#timepicker)
  - [NumberField](#numberfield)
  - [Textarea, Alert, Breadcrumbs, Pagination](#textarea-alert-breadcrumbs-pagination)
  - [ToggleGroup, Stepper, FileUpload](#togglegroup-stepper-fileupload)
  - [DataTable](#datatable)
  - [Charts](#charts)
  - [Sidebar](#sidebar)
  - [Drawer](#drawer)
  - [CommandPalette](#commandpalette)
  - [Blocks](#blocks)
- **Ways to use it**
  - [Own the source: `npx sparkwire add`](#own-the-source-npx-sparkwire-add)
  - [Headless hooks](#headless-hooks)
  - [Base components](#base-components)
  - [For AI coding agents](#for-ai-coding-agents)
  - [Packages](#packages)

## Foundations

### Install

Install the package and import the stylesheet once:

```bash
npm install @sparkwire/core
```

```tsx
import '@sparkwire/core/styles.css';
import { Button } from '@sparkwire/core/button';
```

### Live Wire theme

Spark UI's default theme is **Live Wire**: components carry current.

- **Button** throws sparks from the press point; outlined and text buttons show current flowing on hover (`spark={false}` turns it off).
- **Switch** is a lever that closes a circuit and lights a bulb.
- **Textfield** charges up as its value becomes valid (`charge`, 0 to 1 or a function of the value).
- **Tabs, Accordion, Progress** show current flowing through the active part; **Modal** arrives like a power cut.

All motion respects `prefers-reduced-motion`.

### Energy dial, `useSpark()` and haptics

One setting scales all of Spark UI's motion:

```tsx
<SparkProvider energy="calm">      {/* dashboards: slow current, soft glow, small bursts */}
<SparkProvider energy="electric">  {/* launches: fast current with bloom, big bursts */}
<SparkProvider energy="off">       {/* only functional motion (menus, drawers) */}
```

It sets `data-spark-energy`, so you can also write `<html data-spark-energy="calm">` with no JavaScript. Reduced-motion users always get `off`. Add `haptics` for short vibrations on Switch, Checkbox and spark bursts on phones that support it.

`useSpark()` (from `@sparkwire/core/headless`) puts the same effects on your own elements, all following the dial: `sparks` + `burst()`, `current()` for a flowing line, `glow()`, `powerCut(el)`, `haptic()` and `energy()`.

### Theming

**Light, dark or system mode:** set an attribute on any element, usually `<html>`.

```html
<html data-spark-theme="light">   <!-- "dark" (default), "light" or "system" -->
```

**Change tokens with plain CSS:** every token is a CSS variable.

```css
:root {
  --spark-energy-current: #3af2ff;   /* the colour of the current */
  --spark-brand-fill: #3af2ff;
  --spark-brand-ink: #3af2ff;        /* the same colour as text and lines */
  --spark-radius-medium: 12px;
  --spark-font: 'Inter', sans-serif;
}
```

**Or in TypeScript**, changing only what you need:

```tsx
import { ThemeProvider } from '@sparkwire/system';

<ThemeProvider mode="system" theme={{ energy: { current: '#3AF2FF', ink: '#3AF2FF' } }}>
  <App />
</ThemeProvider>
```

`createTheme(partial, mode)` and `themeToCss(theme)` from `@sparkwire/styles` turn the same overrides into a stylesheet. `themeToCss` skips any value that could break out of the CSS rule (`;`, `{`, `}`, `url(`…) and warns, so a theme loaded from a tenant or a database can't inject styles. `createTheme` ignores `__proto__`, `constructor` and `prototype` keys in parsed JSON. To try colours interactively, use the [Theme builder](https://phoenix-am.github.io/spark-ui/theme-builder).

**Restyle any part:** components expose stable class names and state attributes, for example `.sp-switch[data-state="on"] .sp-switch__bulb` or `.sp-button[data-variant="outlined"]`. Each component's doc comment lists its style hooks.

### App-wide defaults and slots

Set defaults once for the whole app, the way MUI's `theme.components` works. Props set on an instance always win.

```tsx
import { SparkProvider } from '@sparkwire/core';

<SparkProvider
  components={{
    Button: { defaultProps: { variant: 'outlined' }, classNames: { root: 'rounded-full' } },
    Switch: { classNames: { bulb: 'my-bulb' } },
  }}
>
  <App />
</SparkProvider>
```

Style one part of one instance with `classNames`, for example `<Switch classNames={{ bulb: 'my-bulb' }} />`. Button, Switch, Checkbox, Textfield, Slider, Select, Modal, DatePicker, Badge and Field accept it.

### `render` prop and theme variants

`render` swaps the element a component renders, keeping its behaviour and styling. Class names are joined, handlers chained, refs merged:

```tsx
<Button render={<Link href="/pricing" />}>Pricing</Button>
<Card render={<motion.article layout />}>…</Card>
<Badge render={(props) => <a href="/inbox" {...props} />}>3</Badge>
```

Available on Button (and ButtonBase), Card, Badge and Alert. Menu and Sidebar have their own render props, and complex widgets (Select, DatePicker…) keep their own markup on purpose so their accessibility stays intact.

Theme variants define named looks once, for the whole app:

```tsx
<SparkProvider components={{ Button: { variants: [
  { match: { variant: 'danger' }, props: { variant: 'contained', color: 'error' }, className: 'btn-danger' },
] } }}>

// types for the new value
declare module '@sparkwire/core' { interface ButtonVariantOverrides { danger: true } }
```

A variant applies when every prop in `match` is equal; it can set props, a root class and per-part `classNames`. Nested providers stack.

### Tailwind

Every design token is available as a Tailwind utility, prefixed `spark-`, live with light/dark mode and your theme: `bg-spark-raised`, `text-spark-brand-ink`, `border-spark-border`, `rounded-spark-md`, `shadow-spark-lg`, `font-spark`, `text-spark-sm`, plus the full palettes (`bg-spark-gray-100`) and chart colours.

```css
/* Tailwind v4 */
@import "tailwindcss";
@import "@sparkwire/core/styles.css";
@import "@sparkwire/core/tailwind.css";
```

```js
// Tailwind v3: tailwind.config.js
module.exports = { presets: [require('@sparkwire/core/tailwind-preset')] };
```

### Languages

Every piece of text Spark UI writes itself (button labels, screen-reader names, empty states, upload errors, date presets) follows `SparkProvider locale`. English, Hindi, Gujarati and Tamil are built in; relative presets like "Tomorrow" or "Last 30 days" use the browser's `Intl` data, so they read naturally in any language. Add `-u-nu-deva` / `-u-nu-gujr` to the locale for native digits.

```tsx
<SparkProvider locale="gu-IN">…</SparkProvider>
<SparkProvider locale="fr-FR" messages={{ close: 'Fermer', nextPage: 'Page suivante' }}>…</SparkProvider>
```

`useMessages()` gives your own components the same table.

### Languages, dates and right-to-left

Set the locale once and every date, weekday name, digit and arrow key follows it:

```tsx
<SparkProvider locale="hi-IN">   {/* or ar-EG for right-to-left, en-US, ja-JP... */}
  <App />
</SparkProvider>
```

- **DatePicker** takes typed dates, one segment per part, in the locale's order (DD/MM/YYYY for `en-IN`, MM/DD/YYYY for `en-US`). Up and Down change a segment. `onChange` gives a plain JS `Date`, and `name` adds a hidden ISO `YYYY-MM-DD` input for forms.
- **Other calendars:** `<DatePicker calendar="indian" />` shows the Saka calendar; `islamic-umalqura`, `buddhist`, `persian`, `japanese` and more also work. Values stay Gregorian JS Dates.
- **Tabs** support `orientation="vertical"` and `activation="manual"`, and mirror arrow keys in right-to-left locales.
- **Slider** takes a `[start, end]` value for a range with two knobs. `onChangeEnd` fires once on release (for saving or fetching), and `formatOptions` formats numbers in the locale, e.g. `{ style: 'currency', currency: 'INR' }`.
- Tabs, DatePicker, Slider and the rest work when rendered from a React Server Component.

`DatePicker`'s `format` and `placeholder` props are deprecated (the segments replace them), as is `weekStartsOn` (use `firstDayOfWeek: 'sun' | 'mon' | ...`). They are still accepted and will be removed in 1.0. The old Dropdown props (`prependIcon`, `forTeams`, `containerStyle`...) also still work but are deprecated; Dropdown's `value` is now controlled (use `defaultValue` for a starting value), and its CSS classes are `sp-dropdown__*` (Select's were `sp-select__*`). Slider's `onChange` now receives only the value (no event), which is what React Hook Form's `register` expects too.

### Forms

- Every input submits with a plain `<form>`: Select and DatePicker include hidden inputs, Switch submits `value` while on.
- Works with React Hook Form: `register` for Textfield and Checkbox, `Controller` for Dropdown and DatePicker.
- `Field` gives any control (a textarea, a rich-text editor) a linked label, help text and error: `<Field label="Notes" error={err}><textarea /></Field>`.

### Accessibility

Every component works with a keyboard and a screen reader, and respects reduced motion. The complex ones (menus, selects, tabs, dialogs, date pickers and more) are built on React Aria, so typeahead, focus handling and screen-reader announcements behave the way they do in Adobe's products. [Accessibility](./accessibility.md) covers what you get, what you need to provide, and the known gaps.

## Components

### Dropdown, Combobox and Menu

| | Use it to | Built on |
|---|---|---|
| `Dropdown` (alias `Select`) | pick one value from a list | Popover + ListBox |
| `Combobox` | type to search, then pick (or enter free text) | InputBase + Popover + ListBox |
| `Menu` | run an action (Edit, Delete), with submenus | Popover + shared list items |

Options can be grouped: `options={[{ label: 'Asia', options: [...] }]}`. Dropdown's value type follows its options, so numbers come back as numbers.

### Dates: presets, rules and ranges

```tsx
<DatePicker label="Due" presets={['today', 'tomorrow', '+7d', '+1m']} disabledDates={holidays} isDateDisabled={isWeekend} />
<DateRangePicker label="Stay" presets={['+7d', '+1m', 'thisMonth']} startName="checkIn" endName="checkOut" />
<Calendar enabledDates={openSlots} renderDay={(d, info) => <>{info.formatted}<small>₹4k</small></>} />
```

- **Presets** are buttons under the calendar. Short names: `'today'`, `'tomorrow'`, `'yesterday'`, `'+7d'`, `'+2w'`, `'+1m'`, `'+1y'` (forward), `'-30d'` (back); for ranges also `'thisWeek'`, `'thisMonth'`, `'thisYear'`. Or pass `{ label, value }` with your own label (any language) and a Date, range or function. The active preset lights up; one that lands on an unavailable day is disabled.
- **Which days can be picked:** `min`/`max`, `disabledDates` (block-list), `enabledDates` (allow-list: only these), and `isDateDisabled` (a rule, e.g. weekends). They combine.
- **Customization:** `classNames` for every calendar part, `renderDay` for custom day content, `visibleMonths`, `showToday`.
- **DateRangePicker / RangeCalendar:** typed start and end, hover preview, two months by default, ranges can't cross unavailable days (unless `allowsNonContiguousRanges`). Submit as `name` (ISO interval `2026-12-01/2026-12-05`) or `startName` + `endName`.

### TimePicker

Type a time segment by segment, or pick from suggestions every `step` minutes. Values are plain 24-hour strings (`"14:30"`), shown in the locale's format. `min`, `max` and `isTimeDisabled` (e.g. booked slots) limit both typing and the list; `name` submits the value with forms.

```tsx
<TimePicker label="Meeting" min="09:00" max="18:00" step={15} isTimeDisabled={(t) => booked.includes(t)} />
```

### NumberField

Numbers formatted for the user's locale: `formatOptions={{ style: 'currency', currency: 'INR' }}` shows ₹1,00,000 in India; also percent and units. Steppers, arrow/Page/Home/End keys, min/max/step with clamping; `name` submits the plain number.

### Textarea, Alert, Breadcrumbs, Pagination

- **Textarea**: multi-line text on the same field shell; grows between `minRows` and `maxRows`, `showCount` with `maxLength` shows "12 / 280".
- **Alert**: `tone` info/success/warning/error, each with its own icon; `title`, `action`, `onDismiss`; `variant="banner"` for a site-wide strip. Errors are announced immediately.
- **Breadcrumbs**: the last item is the current page; `maxItems` collapses the middle; `renderLink` for your router.
- **Pagination**: 1 … 4 5 6 … 20 with previous/next, `getHref` for real links, `variant="compact"` for "Page 3 of 12". `paginationRange()` is exported for custom pagers.

### ToggleGroup, Stepper, FileUpload

- **ToggleGroup**: a segmented control (`selectionMode="single"`) or a row of independent toggles (`"multiple"`, e.g. bold/italic). One Tab stop, arrow keys between items; icon-only items take `aria-label`.
- **Stepper**: progress through a multi-step flow. Finished steps show a check, current flows along the connector, `error` marks a failed step; `onStepClick` lets people go back. Vertical layout, and "Step 2 of 4" on small screens.
- **FileUpload**: drop zone (also a real button) plus a file list. Checks `accept`, `maxSize` and `maxFiles` before accepting, shows thumbnails, progress and errors. Uploading is yours: start it in `onAdd`, feed `progress`/`status` back via `files`.

### DataTable

Sorting (Shift+click for several columns), search, per-column filters, paging, row selection with bulk actions, loading and empty states, and server-side mode (`manual`). No table library: the logic is our own `useDataTable` hook (also usable headless), the markup is a div grid like MUI's Data Grid, and React Aria adds grid keyboard navigation and screen-reader semantics. In narrow containers rows become labelled cards (`responsive="stack"`, default) or scroll sideways (`responsive="scroll"`).

```tsx
<DataTable aria-label="Deployments" data={rows} searchable selectionMode="multiple"
  columns={[{ key: 'service', header: 'Service', sortable: true }, { key: 'cost', header: 'Cost', sortable: true, cell: (r) => `₹${r.cost}` }]} />
```

For bigger grids:

- **Virtual scrolling:** `virtualize` with a `maxHeight` renders only the rows in view, so scrolling stays smooth with 10,000 rows. The first render still indexes every row for keyboard navigation and screen readers (about a second per 10,000 rows on a laptop); for much larger sets, page on the server with `manual`. Rows have a fixed height (`rowHeight`, default from `density`), paging is off unless you set a page size, and rows don't stack or expand.
- **Resizing:** `resizableColumns` (or `resizable` on a column). Drag a column's edge, or Tab from its header to the handle and use the arrow keys (Shift for bigger steps). Widths are controlled with `columnWidths` or start from `defaultColumnWidths`; `onColumnResize(key, width)` fires when a resize ends. `minWidth` defaults to 64.
- **Pinning:** `pin: 'start'` or `pin: 'end'` keeps a column in place while the grid scrolls sideways. Pinned columns use a fixed width (default 160px).
- **Expandable rows:** `renderExpanded={(row) => …}` adds an expand button to each row and shows the content underneath. Control it with `expandedKeys` and `onExpandedChange`.
- **Inline editing:** mark columns `editable` and handle `onCellEdit(row, key, value)` by updating your data. Double-click, Enter or F2 starts editing; Enter saves, Escape cancels, leaving the field saves. `validate(value, row)` returns an error message to block a save; `editor` swaps in your own input.

```tsx
<DataTable aria-label="Deployments" data={rows} virtualize maxHeight={480} resizableColumns
  columns={[{ key: 'service', header: 'Service', pin: 'start' }, { key: 'owner', header: 'Owner', editable: true }]}
  onCellEdit={(row, key, value) => save(row.id, key, value)} />
```

### Charts

Our own SVG charts, no chart library (`@sparkwire/core/charts`): `LineChart` (add `area` or `stacked`), `BarChart` (grouped, `stacked`, `horizontal`), `DonutChart` and `Sparkline`. The palette (`--spark-chart-1…8`) is checked with a colour-blindness validator, with separate light and dark steps, and is assigned in a fixed order so a series keeps its colour when others are hidden. Marks are thin (2px lines, bars rounded only at the data end, 2px gaps), there is one y axis, a tooltip on hover or keyboard (focus the chart, then arrow keys), legend toggles, and a "Data table" view for screen readers and print. Width follows the container; values format with `Intl` (`valueFormat={{ style: 'currency', currency: 'INR', notation: 'compact' }}`).

```tsx
<LineChart title="Revenue by channel" data={rows} x="month"
  series={[{ key: 'web', label: 'Web' }, { key: 'mobile', label: 'Mobile' }]} />
<DonutChart title="Traffic sources" data={[{ label: 'Search', value: 48200 }, { label: 'Direct', value: 26100 }]} />
```

### Sidebar

App navigation: sections with headings, nested groups, badges, links (`aria-current="page"`), a collapsed icon-only rail with tooltips, and a Drawer below `mobileBreakpoint` (open it with `mobileOpen` from your own menu button). `header` and `footer` can be functions of the collapsed state.

```tsx
<Sidebar items={[{ id: 'home', label: 'Home', icon: <Home />, href: '/' }, { heading: 'Work', items: [...] }]} value={page} onChange={setPage} />
```

### Drawer

A panel that slides in from an edge (`placement="start" | "end" | "top" | "bottom"`; start/end follow reading direction), sized `small`/`medium`/`large`/`full` or any CSS length. Title, description, scrolling body and an `actions` footer; focus trapped and returned, Escape and backdrop click close it.

```tsx
<Drawer open={open} onClose={close} title="Filters" actions={<Button onClick={close}>Apply</Button>}>…</Drawer>
```

### CommandPalette

A ⌘K launcher (Ctrl+K on Windows/Linux). Groups, keywords, icons, shortcut hints, links, disabled commands, async results (`filter={false}` + `onSearchChange` + `loading`). Matching ignores case and accents and ranks best matches first.

```tsx
<CommandPalette items={[{ heading: 'Pages', items: [{ id: 'settings', label: 'Settings', keywords: ['preferences'], onSelect: openSettings }] }]} />
```

### Blocks

Whole pages built from the components, to copy and adapt: **dashboard** (sidebar, KPI tiles, charts, orders table), **sign-in** (validated form with progress and error states) and **settings** (tabs, save bar). They aren't in the npm package; copy one:

```bash
npx sparkwire add dashboard          # also copies every component it uses
npx shadcn add @sparkwire/sign-in
```

## Ways to use it

### Own the source: `npx sparkwire add`

Copy components into your project instead of installing the package. You own every line and can change anything:

```bash
npx sparkwire add switch menu date-picker   # copies them and what they need
npx sparkwire list                          # what's available
```

Components land in `src/components/spark-ui/` (or `components/spark-ui/`); import `styles.css` from there once. Re-running `add` never overwrites files you've changed unless you pass `--overwrite`.

Already using shadcn/ui? Add the registry to `components.json` and use the CLI you know:

```json
"registries": { "@sparkwire": "https://raw.githubusercontent.com/phoenix-am/spark-ui/master/registry/r/{name}.json" }
```

```bash
npx shadcn add @sparkwire/switch
```

Copied components depend only on React, React Aria and each other. The registry (`registry/`) is generated by `npm run build`.

### Headless hooks

Want Spark's behaviour with your own markup? `@sparkwire/core/headless` has `useSwitch`, `useCheckbox`, `useSlider`, `useDatePicker` and `useSpark`. They use the same prop names as the components and plain JS Dates, and return `dataProps` (`data-state`, `data-disabled`...) so Spark's CSS, or yours, can style them.

```tsx
const { inputProps, dataProps } = useSwitch({ 'aria-label': 'Turbo' }, ref);
const { sparks, burst } = useSpark();
```

### Base components

Spark UI is built in two layers, like MUI:

- **Base components** (`@sparkwire/core/base`): `ButtonBase`, `InputBase`, `Popover`, `ListBox` (with `ListItemContent`) and `Overlay`. Generic building blocks that already carry the Live Wire look.
- **Components** built from them: Button on ButtonBase; Textfield and Combobox on InputBase; Dropdown, Combobox, Menu and DatePicker on Popover (+ ListBox); Modal on Overlay.

Use the base layer to build components we don't ship, and they will match the rest. The base layer is unstable until 1.0: names and props may still change in minor versions.

### For AI coding agents

- **MCP server:** add `{ "sparkwire": { "command": "npx", "args": ["-y", "@sparkwire/mcp"] } }` to your MCP client (Claude Code, Cursor, VS Code). Agents get real props, install commands and source through `get_component`, `search_components`, `get_component_source` and `get_setup`.
- **llms.txt:** `registry/llms.txt` (index) and `registry/llms-full.txt` (every component and prop in one file).
- **Agent skill:** `skills/sparkwire/SKILL.md` teaches agents the conventions (imports, theming, which list component to use).

All of these are generated from the component source by `npm run build`, so they never drift from the code.


### Packages

| Package | What it holds |
| --- | --- |
| `@sparkwire/core` | The components, `SparkProvider` and `styles.css` |
| `@sparkwire/styles` | Theme tokens, `createTheme`, `themeToCss` |
| `@sparkwire/system` | Optional `ThemeProvider` and `useTheme` |
| `@sparkwire/icons` | About 860 SVG icons as React components |
| `@sparkwire/utils` | Small helpers |
