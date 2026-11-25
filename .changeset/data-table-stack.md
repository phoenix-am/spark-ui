---
'@sparkwire/core': patch
---

DataTable:

- `stackBelow` works. The table measures its own width and turns rows into cards below the value you set. Before, the prop was ignored and cards always started at 640px. On the server, and until the first measurement, the 640px container query still applies.
- When rows are shown as cards, a "Sort by" picker appears in the toolbar. Before, the headers were hidden and there was no way to sort with a mouse or finger. It is translated in all four built-in languages.
