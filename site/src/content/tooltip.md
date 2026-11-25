## Features

- A short label on hover or keyboard focus, with `placement` and an opening `delay`.
- Nearby tooltips open instantly once one has opened.

## Accessibility

- Opens on keyboard focus straight away; Escape closes it.
- The tooltip text describes the trigger for screen readers.

## Best practices

- Keep it to a few words, and never put essential information only in a tooltip: touch users may never see it.
- Wrap a focusable element (a button or link) so keyboard users can reach it.
- `placement` is the side tried first. If there's no room there, like a button in a top header, the tooltip flips to the other side, and it slides along the edge so it's never cut off.
