## Features

- Three variants: `contained` for the main action, `outlined` for the alternative, `text` for low-emphasis actions.
- Four colours (`brand`, `success`, `warning`, `error`) and three sizes (`small`, `medium`, `large`).
- Icons before or after the label with `startIcon` and `endIcon`; they inherit the text colour.
- Renders as any element or component with `as` (typed: `as="a"` accepts `href`, `as={Link}` accepts `to`) or with the `render` prop.
- A spark burst from the press point, and flowing current along the underline on hover for outlined and text buttons. Both follow the energy dial and stop for reduced motion.
- `fullWidth` stretches it to its container; `disableElevation` removes the shadow.
- Forwards `ref` to the rendered element.

## Accessibility

- Renders a native `<button type="button">` by default, so Enter and Space activate it and it joins the Tab order.
- Disabled buttons use `disabled`, are skipped by Tab, and show a dashed outline so the state doesn't rely on colour.
- Give icon-only buttons an `aria-label`.
- When rendered as a link (`as="a"`), it keeps link semantics: Enter follows it, and screen readers announce a link.

## Responsive behavior

Buttons size to their label. Use `fullWidth` on narrow screens, for example in a mobile form footer, so the touch target spans the width.

## Best practices

- Use one contained button per view for the primary action; make the rest outlined or text.
- Write labels as verbs that say what happens: “Save changes”, “Delete project”.
- Keep the `error` colour for destructive actions, and confirm anything that can't be undone.
- Use a link (`as="a"` or your router's `Link`) for navigation, and a button for actions.

## Limitations

- There's no built-in loading state. Pass `disabled` and change the label (“Saving…”), or put a `Spinner` in `startIcon`.
