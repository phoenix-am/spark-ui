---
'@sparkwire/core': patch
'@sparkwire/system': patch
---

Fixes found by building a real app on Sparkwire:

- `ThemeProvider` takes `global`. It puts the mode and any theme overrides on `<html>`, so the page background and scrollbars follow light/dark. Before, `<body>` stayed on dark tokens in light mode, which failed contrast checks.
- Screen-reader labels that React Aria only had in English now follow Hindi, Gujarati and Tamil: DataTable's select-all and row checkboxes, Combobox's "Show suggestions", NumberField's increase/decrease and role description, the date picker's "Calendar" button, the calendar's Previous/Next and "Today"/"selected" in day names, and the hidden "Dismiss" button in popovers.
- DataTable's row checkboxes are named after their row ("Select payments"), not all "Select".
- `Sidebar` fills the height of a flex app shell. Before, `height: 100%` against a parent sized by its content left it only as tall as its items.
- `Progress` rounds its percentage down, so 99.5% shows as 99%, not 100%.
