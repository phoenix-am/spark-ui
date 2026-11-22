# Accessibility

Sparkwire components work with a keyboard, a screen reader, browser zoom and reduced motion out of the box. This page covers what you get for free, the few things you need to provide, and the gaps to know about.

## What you get

- **Keyboard support everywhere.** Anything you can click, you can reach with Tab and use with the keyboard. Menus, lists, tabs and date pickers use the arrow keys inside and Tab to move on, the way people expect from native controls. Escape closes popovers, menus and dialogs.
- **Visible focus.** A clear focus ring appears for keyboard users and stays out of the way for mouse and touch.
- **Screen-reader friendly.** Components announce their name, role and state ("checked", "expanded", "3 selected"). The complex ones (menus, selects, comboboxes, tabs, dialogs, date and time pickers, the data table) are built on Adobe's [React Aria](https://react-spectrum.adobe.com/react-aria/), which follows the WAI-ARIA patterns.
- **Focus handled in overlays.** Modals and drawers keep focus inside while open and return it to the button that opened them.
- **Errors that make sense.** Field errors are linked to their field, so screen readers read the message along with the label. Errors never rely on colour alone.
- **Reduced motion.** When someone turns on "reduce motion" in their system settings, sparks, flowing current and glows switch off and transitions are kept to a minimum. You can also turn effects off for everyone with `<SparkProvider energy="off">`.
- **Charts you can read without seeing them.** Every chart has a "Data table" view, keyboard-readable tooltips, and a legend, so no series is identified by colour alone.
- **Translated built-in labels.** Text that screen readers announce, like "Next page" or "Remove file", comes in English, Hindi, Gujarati and Tamil, and you can override any of it. See [Languages](./guide.md#languages).

## What you need to provide

- **A label for every input.** Use the `label` prop, or `aria-label` when there's no visible label.
- **A name for icon-only buttons.** `<Button aria-label="Delete">` so screen readers have something to say.
- **Names for groups and tables.** Give a `DataTable`, `TabList` or `ToggleGroup` an `aria-label` that says what it's for, like "Invoices" or "Time range".
- **A label for spinners and sparklines.** They're visual, so tell screen readers what they mean: `<Spinner label="Loading invoices" />`.
- **Page structure.** Components can't know your page layout, so add landmarks (`<header>`, `<nav>`, `<main>`) and one `<h1>` per page yourself.
- **Contrast when you change colours.** The built-in themes are designed for readable contrast. If you override the `--spark-*` colour tokens, check the contrast of your new colours.

## Known gaps

We'd rather you hear these from us:

- **Windows High Contrast mode** isn't specifically styled yet, so some borders or effects may not show in that mode.
- **Right-to-left layouts** are supported in the styles, but haven't been tested as thoroughly as left-to-right.
- **Screen readers on real devices.** The patterns come from React Aria, which is tested across screen readers, but Sparkwire itself hasn't yet had a full pass with VoiceOver, NVDA, JAWS and TalkBack.
- **Hindi, Gujarati and Tamil labels** haven't been reviewed by native speakers yet. [Help us check them](./translations.md).

If any of these matter for your users, test those cases in your app, and please tell us what you find.

## Found a problem?

[Open an issue](https://github.com/phoenix-am/spark-ui/issues/new) with the component, the browser and assistive technology you used (with versions), what you did, and what you expected to hear or see.
