## Features

- Placeholder shapes while content loads: `text` lines (with `lines`), `rect` and `circle`.
- Set `width` and `height` to match the content that's coming.
- A shimmer that follows the energy dial and reduced motion.

## Accessibility

- Each skeleton is a `status` announced as “Loading” (translated); the shapes themselves are hidden from screen readers. Wrap a whole loading area in one skeleton group rather than many, so it isn't announced repeatedly.

## Best practices

- Match the layout of the real content, so nothing jumps when it arrives.
- For waits with no layout to preview, use a `Spinner`.
