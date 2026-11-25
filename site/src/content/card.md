## Features

- A surface for grouping content, with `padding` from `none` to `large`.
- `interactive` cards glow on hover for clickable cards; `live` cards carry current around the edge.
- `CardHeader` (title, subtitle, media, action) and `CardFooter` for actions.
- Render as `article`, `section` or `li` with `as`, or any element with `render`.

## Accessibility

- A plain container: pick the element that matches its meaning (`article` for a post, `li` in a list).
- For a clickable card, put a real link or button inside it rather than a click handler on the card.

## Best practices

- Use `live` for the one thing happening right now; several live cards compete for attention.
