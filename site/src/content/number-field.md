## Features

- Formats numbers the way your users write them, through `formatOptions`: currency, percent, units and grouping (₹1,00,000).
- `min`, `max` and `step`; values are clamped and snapped to `step` when the field loses focus.
- −/+ buttons, arrow keys and the scroll wheel to step.
- Controlled (`value` + `onChange`) or uncontrolled (`defaultValue`), with `null` for empty.
- Submits a plain number under `name`.

## Accessibility

- Up/Down step; Page Up/Down step by ten steps; Home/End jump to `min`/`max`.
- The value is announced in the locale's format, and the −/+ buttons have translated labels.

## Best practices

- Use it for exact values (quantities, amounts). For a rough value in a range, use a `Slider`.
- Set `min` and `max` whenever there are real limits, so people can't enter impossible values.
- Use `formatOptions` rather than adding currency symbols yourself.

## Limitations

- Values are numbers; very large integers beyond JavaScript's safe range lose precision.
