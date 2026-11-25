---
'@sparkwire/core': patch
---

- Range presets in `RangeCalendar` and `DateRangePicker` no longer check every day of a long range on every render. Block and allow lists are checked directly, and an `isDateDisabled` rule's answer is remembered while the same function is passed. A "last 10 years" preset re-renders about 20 times faster.
- Chart ticks always cover the data, including tiny values like `5e-324` and huge ones near `1e300`. Found by new property tests.
