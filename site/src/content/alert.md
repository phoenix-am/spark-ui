## Features

- Four tones (`info`, `success`, `warning`, `error`), each with its own icon; replace it with `icon`, or hide it with `icon={false}`.
- Three looks: `soft` (default), `outlined`, and `banner` for a full-width strip.
- An optional `title`, an `action` (such as a button) and a dismiss button when you pass `onDismiss`.
- Announcement control with `live`: errors are announced immediately by default; other tones stay quiet unless you choose `polite` or `assertive`.
- `render` swaps the root element.

## Accessibility

- Error alerts get `role="alert"` and are read out straight away; `live="polite"` uses `role="status"` instead.
- The dismiss button has a translated label (“Dismiss”), which you can change with `dismissLabel`.
- Tone is shown with an icon and words, never colour alone.

## Responsive behavior

In containers narrower than 480px, the action moves onto its own line under the message.

## Best practices

- Keep the message to one or two sentences and say what to do next.
- Use `assertive` only for errors that block the task; announcing everything is noisy for screen-reader users.
- For brief confirmations that don't need to stay on screen, use a toast.
