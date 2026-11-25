## Features

- Type the time part by part (hours, minutes, AM/PM) or pick from a list of times every `step` minutes.
- Values are 24-hour strings like `"14:30"`, while the field shows the locale's format (2:30 PM or 14:30).
- `min`, `max` and `isTimeDisabled` limit both typing and the list.
- `clearable` adds a clear button; `onChange` receives `null` when cleared.

## Accessibility

- Each segment is a spin button: arrow keys change it and typing fills it.
- The suggestion list is a listbox with arrow keys, Enter to pick and Escape to close.
- The label and helper text are linked to the field.

## Best practices

- Use a `step` that matches what can be booked (15 or 30 minutes), so the list stays short.
- Store the `"HH:mm"` value and let the field handle display formatting.

## Limitations

- Times have no time zone; combine with a date and a zone yourself when you need one.
