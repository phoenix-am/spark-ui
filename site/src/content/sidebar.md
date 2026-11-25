## Features

- App navigation from `items`: sections with headings, nested groups that open and close, badges and links.
- The active item is lit; controlled (`value` + `onChange`) or uncontrolled (`defaultValue`).
- Collapses to an icon rail (`collapsible`, `collapsed`), with tooltips on the icons.
- `header` and `footer` slots for a logo, account menu or upgrade prompt.

## Accessibility

- A `<nav>` landmark with real lists, so Tab order and screen-reader navigation work.
- The current page's link has `aria-current="page"`; nested groups announce whether they're expanded.

## Responsive behavior

Below `mobileBreakpoint` (768px by default), the sidebar becomes a drawer that slides in. Open it from your own menu button with `mobileOpen` and `onMobileOpenChange`.

## Best practices

- Keep top-level items to about seven, and use sections to group the rest.
- Give every item an icon if you allow collapsing; the icon is all people see in the rail.
