---
'@sparkwire/core': minor
---

`CommandPalette` gains two optional props:

- `preview={(command) => …}` shows a pane beside the results for the highlighted command, such as a live example, details or actions. The panel widens for it, and the pane hides on narrow screens.
- `toolbar` puts a row under the search box, such as tabs that narrow what the search covers.

Both are off by default, so existing palettes look and behave as before.

Fix: development-only warnings are now dropped from production builds. The check is written as `process.env.NODE_ENV` so bundlers can replace it.
