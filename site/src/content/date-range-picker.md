## Features

- A start and an end date in one field, typed or picked, with two months side by side (`visibleMonths`).
- Range `presets` such as `thisWeek`, `thisMonth` or `-30d`, under the calendar.
- The same limits as DatePicker (`min`, `max`, `isDateDisabled`), plus `allowsNonContiguousRanges` to allow ranges across blocked days.
- Submits the two dates under `startName` and `endName`.

## Accessibility

- Each date part (day, month, year) is a spin button: arrow keys change it and typing fills it.
- The calendar supports arrow keys, Page Up/Down for months (Shift for years) and Home/End.
- Month changes and the selected date are announced; focus returns to the field when the calendar closes.
- Labels and the date format follow the locale; right-to-left layouts are mirrored.

## Best practices

- Offer presets for the common ranges in your product (reports often need “Last 30 days”).
