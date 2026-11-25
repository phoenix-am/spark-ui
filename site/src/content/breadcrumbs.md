## Features

- A trail of `items` (`{ label, href?, icon? }`); the last item is the current page.
- Long trails collapse with `maxItems`: the first item stays, then “…”, then the last `maxItems − 1` items.
- Works with any router through `renderLink`, and a custom `separator`.

## Accessibility

- A `<nav>` landmark with an ordered list; the current page has `aria-current="page"`.
- Separators are decorative and hidden from screen readers.

## Responsive behavior

Items wrap onto a new line when space runs out. Set `maxItems` to keep long trails on one line on small screens.

## Best practices

- Show the hierarchy, not the browsing history.
- Leave `href` off the last item; it's the page you're on.
