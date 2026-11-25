## Features

- One value, or a range when `value`/`defaultValue` is a `[start, end]` pair.
- `min`, `max` and `step`, with values formatted through Intl (`formatOptions`) for currency, percentages and units.
- Controlled or uncontrolled; `onChange` fires while dragging, `onChangeEnd` when the drag ends.
- Each thumb holds a native range input, so forms and React Hook Form's `register` work.

## Accessibility

- Arrow keys step, Page Up/Down take bigger steps, and Home/End jump to the ends.
- Each thumb announces its value in the locale's format; name range thumbs with `thumbLabels`.
- Clicking the track moves the nearest thumb; right-to-left layouts are mirrored.

## Best practices

- Use a slider when an approximate value is fine and seeing the range helps. For exact values, use a `NumberField`.
- Show the current value (it's displayed by default) so people don't have to guess.
- Keep the number of steps reasonable; a slider with thousands of steps is hard to control precisely.
