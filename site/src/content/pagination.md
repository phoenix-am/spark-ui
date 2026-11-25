## Features

- Page numbers with ellipses for skipped ranges (1 … 4 5 6 … 20); tune how many show with `siblings` and `boundaries`.
- Previous and next buttons, and a `compact` variant that shows “Page 3 of 12”.
- Controlled (`page` + `onChange`) or uncontrolled (`defaultPage`).
- Real links when you pass `getHref`, for server-rendered or shareable pages.
- `labels` overrides the button text; built-in text is translated.

## Accessibility

- A `<nav>` landmark; the current page has `aria-current="page"`.
- Previous/next buttons have labels, and disabled ones are skipped.

## Responsive behavior

Use `variant="compact"` (and `size="small"`) where width is tight, such as table footers on phones.

## Best practices

- Use `getHref` so each page has its own URL that people can bookmark and share.
- Keep `siblings` at 1 on mobile so the control fits on one line.
