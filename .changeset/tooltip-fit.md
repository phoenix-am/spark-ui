---
'@sparkwire/core': patch
---

`Tooltip` stays inside the window. If there's no room on the preferred side, as with a button in a top header, it flips to the other side. If it would run off a left or right edge, it slides along to stay visible. `placement` is still the side it tries first.
