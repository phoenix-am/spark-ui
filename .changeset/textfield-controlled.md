---
'@sparkwire/core': patch
---

Fix: a controlled `Textfield` now shows changes its parent makes to `value`, such as a reset, a value loaded from the server, or a value picked somewhere else. Before, it kept showing the first value it was given. Typing and masking work as before.
