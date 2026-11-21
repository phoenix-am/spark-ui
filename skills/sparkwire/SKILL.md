---
name: sparkwire
description: Build React UIs with Spark UI (@sparkwire): Live Wire components (Button, Switch, Dropdown, Combobox, Menu, DatePicker, Modal, Tabs...). Use when the project depends on @sparkwire/core or has components/spark-ui/, or when asked to use Spark UI.
---

# Spark UI (@sparkwire)

Spark UI is a React component library with a "Live Wire" look (sparks, flowing current, a lever switch with a bulb). Behaviour comes from React Aria; styles are static CSS with `--spark-*` variables.

## Before writing code

1. Check how the project uses it:
   - `@sparkwire/core` in package.json → import from `@sparkwire/core` (or a subpath like `@sparkwire/core/menu`).
   - A `components/spark-ui/` folder → components were copied with `npx sparkwire add`; import from that folder and feel free to edit the files.
2. Look up real props instead of guessing: use the `sparkwire` MCP server (`get_component`, `search_components`, `get_setup`) if it's connected, or read https://phoenix-am.github.io/spark-ui/registry/llms-full.txt.

## Rules

- Import the stylesheet once (root layout): `import '@sparkwire/core/styles.css'` or the copied `components/spark-ui/styles.css`.
- Mode: `data-spark-theme="dark" | "light" | "system"` on `<html>` or a wrapper. No provider needed; works in Server Components.
- App-wide defaults, slot classes and locale go in one `<SparkProvider components={{ ... }} locale="...">`, not repeated props.
- Restyle with `className`, `classNames={{ part: '...' }}` and `data-*` selectors (`[data-state=on]`, `[data-open]`, `[data-invalid]`). Change tokens with CSS variables. Don't fight the styles with `!important`.
- Choose the right list component: **Dropdown** (alias `Select`) to pick a value, **Combobox** to search then pick, **Menu** to run actions. Options can be grouped: `{ label, options: [...] }`.
- Forms: give inputs a `name`; they work with `FormData`, server actions and React Hook Form (`register` works on Textfield, Slider, Switch).
- Dates are JS `Date`s. DatePicker accepts typed input, submits ISO `YYYY-MM-DD`, and supports `locale` and `calendar` (`indian`, `islamic-umalqura`, `buddhist`...).
- Accessibility: give icon-only buttons and menus an `aria-label`; give fields a visible `label` (or `aria-label`).
- Don't install or import `@spark-ui/*`: that scope is a different library (Leboncoin's Spark).

## Adding components

- `npx sparkwire add <name>` copies a component and its dependencies; `npx sparkwire list` shows names.
- With shadcn: add `"@sparkwire": "https://raw.githubusercontent.com/phoenix-am/spark-ui/main/registry/r/{name}.json"` under `registries` in components.json, then `npx shadcn add @sparkwire/<name>`.
- Need something Spark UI doesn't ship? Build it from the base components (`ButtonBase`, `InputBase`, `Popover`, `ListBox`, `Overlay` in `@sparkwire/core/base`) so it matches.
