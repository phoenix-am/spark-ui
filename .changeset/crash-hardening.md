---
'@sparkwire/core': patch
---

Bad input no longer crashes the app.

- `SparkProvider` accepts locales like `en_US`, `hi_IN` or `en_US.UTF-8` and falls back to `en-US` (with a dev warning) for values Intl can't use, instead of throwing.
- `DatePicker`, `DateRangePicker` and `Calendar` treat an Invalid Date as empty.
- `Calendar` and `RangeCalendar` clamp `visibleMonths` to at least 1; `0` or a negative number used to loop until React gave up.
- `CommandPalette` only navigates to `http(s)`, `mailto`, `tel` and relative `href`s; `javascript:` and `data:` links are ignored.
- `DataTable` row keys are always unique: rows without an `id` no longer collide with `id: 0`, and repeated ids get `#2`, `#3` with a dev warning, so selecting one row never selects another.
