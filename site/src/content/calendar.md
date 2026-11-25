## Features

- A month grid on the page, for a single day (`Calendar`) or a range (`RangeCalendar`).
- Today is marked; `presets` add shortcut buttons under the grid.
- The same limits, calendar systems and `renderDay` as the date pickers; several months with `visibleMonths`.

## Accessibility

- Each date part (day, month, year) is a spin button: arrow keys change it and typing fills it.
- The calendar supports arrow keys, Page Up/Down for months (Shift for years) and Home/End.
- Month changes and the selected date are announced; focus returns to the field when the calendar closes.
- Labels and the date format follow the locale; right-to-left layouts are mirrored.

## Best practices

- Use the calendar on its own when picking a date is the main task of the page, like booking. In forms, use `DatePicker`.
