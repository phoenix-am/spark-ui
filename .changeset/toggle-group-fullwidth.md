---
'@sparkwire/core': patch
---

Fix: a `fullWidth` `ToggleGroup` in a narrow container no longer runs out of it. Items share the width and use less side padding, so three options like "text / outlined / contained" fit in a 250px panel.
