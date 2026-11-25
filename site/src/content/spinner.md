## Features

- An indicator for waits of unknown length, in three sizes and four tones.

## Accessibility

- A `status` with a label; give it a specific `label` like “Loading invoices”.

## Best practices

- Show it only after a short delay (around 300ms) so quick loads don't flash.
- When you can show the layout that's coming, use a `Skeleton` instead.
