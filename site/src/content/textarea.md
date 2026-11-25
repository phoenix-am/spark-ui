## Features

- Multi-line text with a label, helper text and error state.
- Grows with its content (`autoResize`, with `minRows` and `maxRows`).
- A live character count (`showCount`) that respects `maxLength`.
- `onChange` gives you the new text directly, plus the event.

## Accessibility

- The label, helper text and error are linked to the textarea.
- The character count is announced politely as the limit gets close.

## Best practices

- Use `autoResize` so people can see what they wrote, with `maxRows` to keep long text from taking over the page.
- Show the count only when there's a real limit.
