## Features

- A bar for tasks with a known total: `value` from 0 to 100 (clamped), with an optional `label` and the percentage (shown unless `showValue={false}`).
- Leave out `value` for an indeterminate bar that sweeps while the total is unknown.
- Three sizes and four tones; at 100% current flows along the full bar.

## Accessibility

- A `progressbar` with its value announced; the `label` names it.

## Best practices

- Use a value when you know how far along the task is; use the indeterminate bar or a `Spinner` when you don't.
- Switch the tone to `warning` or `error` when the value means trouble, like a nearly full disk.
