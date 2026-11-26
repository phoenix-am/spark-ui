# @sparkwire/system

## 0.4.5

### Patch Changes

- @sparkwire/styles@0.4.5

## 0.4.4

### Patch Changes

- 139603b: Fixes found by building a real app on Sparkwire:

  - `ThemeProvider` takes `global`. It puts the mode and any theme overrides on `<html>`, so the page background and scrollbars follow light/dark. Before, `<body>` stayed on dark tokens in light mode, which failed contrast checks.
  - Screen-reader labels that React Aria only had in English now follow Hindi, Gujarati and Tamil: DataTable's select-all and row checkboxes, Combobox's "Show suggestions", NumberField's increase/decrease and role description, the date picker's "Calendar" button, the calendar's Previous/Next and "Today"/"selected" in day names, and the hidden "Dismiss" button in popovers.
  - DataTable's row checkboxes are named after their row ("Select payments"), not all "Select".
  - `Sidebar` fills the height of a flex app shell. Before, `height: 100%` against a parent sized by its content left it only as tall as its items.
  - `Progress` rounds its percentage down, so 99.5% shows as 99%, not 100%.

- @sparkwire/styles@0.4.4

## 0.4.3

### Patch Changes

- @sparkwire/styles@0.4.3

## 0.4.2

### Patch Changes

- @sparkwire/styles@0.4.2

## 0.4.1

### Patch Changes

- @sparkwire/styles@0.4.1

## 0.4.0

### Patch Changes

- @sparkwire/styles@0.4.0

## 0.3.4

### Patch Changes

- Updated dependencies [36215f2]
  - @sparkwire/styles@0.3.4

## 0.3.3

### Patch Changes

- @sparkwire/styles@0.3.3

## 0.3.2

### Patch Changes

- @sparkwire/styles@0.3.2

## 0.3.1

### Patch Changes

- @sparkwire/styles@0.3.1

## 0.3.0

### Patch Changes

- @sparkwire/styles@0.3.0

## 0.2.2

### Patch Changes

- d5695c1: Sparkwire descriptions and search keywords for every package on npm.
- Updated dependencies [d5695c1]
  - @sparkwire/styles@0.2.2

## 0.2.1

### Patch Changes

- 4adc17d: Every package now has a README on npm, with install steps and links to the docs and changelog.
- Updated dependencies [4adc17d]
  - @sparkwire/styles@0.2.1

## 0.2.0

### Patch Changes

- @sparkwire/styles@0.2.0
