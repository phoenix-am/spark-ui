---
"@sparkwire/core": patch
---

Fields built on InputBase (NumberField, Combobox, and your own) now shrink to fit narrow containers; before, the input kept the browser's default width of about 20 characters, so a NumberField couldn't get narrower than about 340px. Every field of the exported types (column definitions, option shapes, UploadFile, DayRenderInfo and more) now has a description in editor tooltips.
