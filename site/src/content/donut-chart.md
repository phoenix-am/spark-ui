## Features

- Parts of a whole from `data` (`{ label, value }`), starting at 12 o'clock in data order.
- A headline in the middle (`centerLabel`, `centerCaption`), adjustable `size` and ring `thickness`.
- A legend with each slice's value and percentage; Intl formatting with `valueFormat`.

## Accessibility

- Tab to the chart and use the arrow keys to move between slices; each shows its tooltip.
- The legend lists every slice with its value, so nothing depends on colour.

## Best practices

- Use it for a handful of parts (up to about six). For more, or to compare sizes precisely, use a bar chart.
- Sort slices from largest to smallest unless the order means something.

## Limitations

- Negative values can't be shown in a donut.
