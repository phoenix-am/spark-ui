## Features

- Switch between panels with `Tabs`, `TabList`, `Tab` and `TabPanel`.
- Horizontal or vertical, four colours, and `activation`: `automatic` switches as focus moves, `manual` waits for Enter or Space.
- Controlled (`value` + `onChange`) or uncontrolled (`defaultValue`).
- Works in React Server Components: tabs register themselves rather than being read from `children`.

## Accessibility

- The tab list is one Tab stop; arrow keys move between tabs (mirrored in right-to-left), Home/End jump to the ends.
- Tabs and panels are linked, so screen readers announce which panel belongs to which tab.
- Give `TabList` an `aria-label` that says what the tabs are for.

## Best practices

- Use tabs for views of the same thing, not for steps in a process (use a `Stepper`).
- Use `manual` activation when switching tabs is slow, such as when a panel loads data.
