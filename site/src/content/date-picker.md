## Features

- Type a date part by part in the locale's order (DD/MM/YYYY in India, MM/DD/YYYY in the US), or pick it from a calendar.
- Values are plain JavaScript `Date`s (or `null`).
- Limit what can be picked with `min`, `max`, `isDateDisabled`, `disabledDates` and `enabledDates`.
- One-click `presets` like `today`, `tomorrow` or `+1w`, shown under the calendar.
- Other calendar systems (`calendar`), first day of the week, several months side by side, and `renderDay` to customise day cells.
- Submits under `name` as an ISO date string.

## Accessibility

- Each date part (day, month, year) is a spin button: arrow keys change it and typing fills it.
- The calendar supports arrow keys, Page Up/Down for months (Shift for years) and Home/End.
- Month changes and the selected date are announced; focus returns to the field when the calendar closes.
- Labels and the date format follow the locale; right-to-left layouts are mirrored.

## Best practices

- Prefer typing for dates people know (a birthday); the calendar helps for dates near today.
- Explain blocked dates in `helperText` (“Weekdays only”).

## Limitations

- No time of day: combine with `TimePicker` when you need one.
