---
'@sparkwire/core': patch
'@sparkwire/styles': patch
---

Edge cases from the red-team review.

- Charts: `niceTicks` counts ticks by index, so very large values with a tiny range (around 1e16) no longer loop forever. `zeroBaseline={false}` now works on unstacked line charts instead of always starting at 0.
- `Sparkline` skips `NaN` and `Infinity` points instead of drawing nothing.
- `themeToCss` drops any theme value that could close the CSS rule (`;`, `{`, `}`, `url(`…), with a warning. `createTheme` ignores `__proto__`, `constructor` and `prototype` keys.
- `FileUpload`: `accept="*/*"` or `"*"` accepts any file. `formatBytes` shows `–` for invalid sizes and says `1.0 MB` instead of `1024 KB`.
- `paginationRange` and `Pagination` round and clamp `siblings`, `boundaries` and `page`, so the current page is always shown.
- `Progress` with a non-finite value is indeterminate. `Slider` and `TimePicker` treat a `step` of 0 or less as the default.
- `Avatar` keeps an emoji initial whole.
