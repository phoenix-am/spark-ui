# Accessibility

Sparkwire aims to be usable with a keyboard, a screen reader, zoom and reduced motion, out of the box. This page says what is checked, how, and what hasn't been checked yet, so you can decide what to test in your own app.

## What's checked automatically

Every change runs these in CI:

- **axe on every story.** Each Storybook story (about 230) is rendered and checked with [axe-core](https://github.com/dequelabs/axe-core) through `jest-axe`. A violation fails the build. Three page-level rules are off because a story is a fragment, not a page: `region`, `page-has-heading-one` and `landmark-one-main`. Your pages should still have landmarks and one `h1`.
- **Behaviour tests.** Keyboard and screen-reader behaviour is tested with Testing Library, querying by role and accessible name the way assistive tech finds things: switches toggle with Space, dialogs trap and restore focus, menus and listboxes move with the arrow keys, the date and time pickers accept typed input, DataTable sorts, selects, resizes and edits from the keyboard, and so on.
- **Server rendering.** Components render on the server without errors, so content and labels are there before JavaScript loads.

axe catches roughly a third to a half of real accessibility problems. Passing it means no known machine-detectable issues, not that a component is fully accessible.

## Built in

- **Semantics from React Aria.** The complex widgets (Menu, Select, Combobox, Tabs, Modal, DatePicker, TimePicker, DataTable and others) use Adobe's [React Aria](https://react-spectrum.adobe.com/react-aria/) hooks, which follow the WAI-ARIA patterns and are tested by Adobe across screen readers.
- **Keyboard.** Everything that can be clicked can be reached and used from the keyboard. Focus rings show for keyboard users (`:focus-visible`) and not on mouse clicks. Composite widgets use arrow keys inside and Tab to move on, as the ARIA patterns describe.
- **Labels.** Inputs need a visible `label` or an `aria-label`; icon-only buttons need an `aria-label`. Built-in screen-reader text ("Next page", "Remove file", "Expand row") is translated: see [translations](./translations.md).
- **Reduced motion.** With the OS setting "reduce motion" on, the Live Wire effects (sparks, current, glow, power cut) are turned off and transitions are minimised. You can also turn them off yourself with `<SparkProvider energy="off">`.
- **Haptics** are off unless you turn them on (`<SparkProvider haptics>`), only fire on devices that support vibration, and stop when energy is off or motion is reduced.
- **Charts** have a "Data table" view, so the numbers are available to screen readers and in print, and series identity never depends on colour alone (legend and direct labels).
- **Colour.** The palettes were designed for readable contrast in light and dark, and the chart colours are checked for colour-blind separation. If you override the `--spark-*` tokens, check contrast again.

## Not yet checked

Be aware of these before relying on Sparkwire for an audience that depends on assistive tech:

- **Real screen readers.** No one has yet gone through the components with VoiceOver, NVDA, JAWS or TalkBack. React Aria's own testing covers the underlying patterns, but Sparkwire's markup, labels and announcements haven't been verified on devices. The checklist below is how to do it; results and fixes are very welcome.
- **Windows High Contrast (forced colours).** There are no `forced-colors` styles yet. Some borders, focus rings or Live Wire effects may disappear in that mode.
- **Right-to-left layouts.** Styles use logical properties (`inset-inline-start` and similar), and DataTable resizing and pinning handle RTL, but there are no RTL tests.
- **Colour contrast.** axe can't measure contrast in the test environment (it has no real rendering), so WCAG AA contrast hasn't been verified automatically for every token pairing.
- **Zoom and reflow at 400%.** Components are responsive and DataTable stacks in narrow containers, but there's no systematic check at 320 CSS px.
- **Translations** for Hindi, Gujarati and Tamil haven't been reviewed by native speakers.

## Manual checklist

For each component you use, ideally on two pairings: **VoiceOver + Safari** (macOS or iOS) and **NVDA + Firefox or Chrome** (Windows).

1. **Reach it.** Tab to it. Is the focus ring visible? Does Tab order follow the visual order?
2. **Hear it.** What does the screen reader say on focus? It should give the name, the role ("button", "combo box", "grid") and the state ("expanded", "selected", "checked").
3. **Use it.** Operate it with the keyboard only, using the keys its story's docs list. Do changes get announced (a selection count, a sort direction, an error)?
4. **Leave it.** Escape closes overlays and returns focus to what opened them. Tab moves on without getting stuck.
5. **Errors.** Invalid fields announce their error message, and the message is linked to the field.
6. **Zoom.** At 200% browser zoom, nothing overlaps or gets cut off.
7. **Motion.** With "reduce motion" on, nothing flashes or moves on its own.

Found a problem? Open an issue with the component, the screen reader and browser (with versions), what you did, and what you heard.
