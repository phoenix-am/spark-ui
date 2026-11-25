# @sparkwire/core

## 0.4.1

### Patch Changes

- 5958090: Fix: a controlled `Textfield` now shows changes its parent makes to `value`, such as a reset, a value loaded from the server, or a value picked somewhere else. Before, it kept showing the first value it was given. Typing and masking work as before.
- @sparkwire/icons@0.4.1
  - @sparkwire/utils@0.4.1

## 0.4.0

### Minor Changes

- 4cdbbe7: `CommandPalette` gains two optional props:

  - `preview={(command) => …}` shows a pane beside the results for the highlighted command, such as a live example, details or actions. The panel widens for it, and the pane hides on narrow screens.
  - `toolbar` puts a row under the search box, such as tabs that narrow what the search covers.

  Both are off by default, so existing palettes look and behave as before.

  Fix: development-only warnings are now dropped from production builds. The check is written as `process.env.NODE_ENV` so bundlers can replace it.

### Patch Changes

- @sparkwire/icons@0.4.0
  - @sparkwire/utils@0.4.0

## 0.3.4

### Patch Changes

- 36215f2: Edge cases from the red-team review.

  - Charts: `niceTicks` counts ticks by index, so very large values with a tiny range (around 1e16) no longer loop forever. `zeroBaseline={false}` now works on unstacked line charts instead of always starting at 0.
  - `Sparkline` skips `NaN` and `Infinity` points instead of drawing nothing.
  - `themeToCss` drops any theme value that could close the CSS rule (`;`, `{`, `}`, `url(`…), with a warning. `createTheme` ignores `__proto__`, `constructor` and `prototype` keys.
  - `FileUpload`: `accept="*/*"` or `"*"` accepts any file. `formatBytes` shows `–` for invalid sizes and says `1.0 MB` instead of `1024 KB`.
  - `paginationRange` and `Pagination` round and clamp `siblings`, `boundaries` and `page`, so the current page is always shown.
  - `Progress` with a non-finite value is indeterminate. `Slider` and `TimePicker` treat a `step` of 0 or less as the default.
  - `Avatar` keeps an emoji initial whole.

- @sparkwire/icons@0.3.4
  - @sparkwire/utils@0.3.4

## 0.3.3

### Patch Changes

- 08308b5: Bad input no longer crashes the app.

  - `SparkProvider` accepts locales like `en_US`, `hi_IN` or `en_US.UTF-8` and falls back to `en-US` (with a dev warning) for values Intl can't use, instead of throwing.
  - `DatePicker`, `DateRangePicker` and `Calendar` treat an Invalid Date as empty.
  - `Calendar` and `RangeCalendar` clamp `visibleMonths` to at least 1; `0` or a negative number used to loop until React gave up.
  - `CommandPalette` only navigates to `http(s)`, `mailto`, `tel` and relative `href`s; `javascript:` and `data:` links are ignored.
  - `DataTable` row keys are always unique: rows without an `id` no longer collide with `id: 0`, and repeated ids get `#2`, `#3` with a dev warning, so selecting one row never selects another.

- @sparkwire/icons@0.3.3
  - @sparkwire/utils@0.3.3

## 0.3.2

### Patch Changes

- a8bd993: With the energy dial off, or when someone has "reduce motion" turned on, the flowing underline on outlined and text buttons and the line through a selected date range now stay still. Before, their hover styles won out and kept them moving.
- bfce42b: Fields built on InputBase (NumberField, Combobox, and your own) now shrink to fit narrow containers; before, the input kept the browser's default width of about 20 characters, so a NumberField couldn't get narrower than about 340px. Every field of the exported types (column definitions, option shapes, UploadFile, DayRenderInfo and more) now has a description in editor tooltips.
- @sparkwire/icons@0.3.2
  - @sparkwire/utils@0.3.2

## 0.3.1

### Patch Changes

- b32e65d: Button: `as` now types the props of the element you render as, so `<Button as="a" href="…" target="_blank">` and `<Button as={Link} to="/">` type-check. Component descriptions rewritten in plain language, and the toast docs now show the real API (`const { toast } = useToast()`).
- db1342c: Every prop now has a description, so editor tooltips and the docs explain all 709 props, including the ones that used to be blank (className, disabled, controlled/uncontrolled pairs, DataTable's callbacks and more).
- @sparkwire/icons@0.3.1
  - @sparkwire/utils@0.3.1

## 0.3.0

### Minor Changes

- a81499f: DataTable: virtual scrolling (`virtualize`, `rowHeight`) for thousands of rows; resizable columns (`resizableColumns`, `columnWidths`, `onColumnResize`) with mouse and keyboard; pinned columns (`pin: 'start' | 'end'`); expandable rows (`renderExpanded`, `expandedKeys`); and inline cell editing (`editable`, `validate`, `editor`, `onCellEdit`). Table labels ("selected", page range, page size) are now translated.

### Patch Changes

- @sparkwire/icons@0.3.0
  - @sparkwire/utils@0.3.0

## 0.2.2

### Patch Changes

- d5695c1: Sparkwire descriptions and search keywords for every package on npm.
- Updated dependencies [d5695c1]
  - @sparkwire/icons@0.2.2
  - @sparkwire/utils@0.2.2

## 0.2.1

### Patch Changes

- 4adc17d: Every package now has a README on npm, with install steps and links to the docs and changelog.
- Updated dependencies [4adc17d]
  - @sparkwire/icons@0.2.1
  - @sparkwire/utils@0.2.1

## 0.2.0

### Minor Changes

- bde1a78: Customise without forking: a `render` prop on Button, Card, Badge and Alert (render a router link or motion component with the component's look and behaviour); theme variants in `SparkProvider` (`components.Button.variants`, with `ButtonVariantOverrides` for types); and a Tailwind preset generated from the design tokens (`@sparkwire/core/tailwind.css` for v4, `@sparkwire/core/tailwind-preset` for v3).

### Patch Changes

- @sparkwire/icons@0.2.0
  - @sparkwire/utils@0.2.0
