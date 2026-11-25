## Features

- An on/off control that takes effect immediately.
- Controlled (`checked` + `onChange`) or uncontrolled (`defaultChecked`).
- Three sizes and four colours for the current.
- An optional bulb that lights when on (`showBulb`, on by default).
- Submits with forms: with `name`, a hidden input sends `value` (default `"on"`) while the switch is on.
- `classNames` styles each part (root, control, node, wire, lever, bulb, label).

## Accessibility

- A native checkbox with `role="switch"` underneath, so screen readers announce “switch, on/off”.
- Space toggles it; it's a single Tab stop.
- Give it a visible `label`, or an `aria-label` when the context already makes it clear.

## Best practices

- Use a switch for settings that apply straight away. For choices that wait for a Save button, use a `Checkbox`.
- Label the setting, not the state: “Email notifications”, not “On”.

## Limitations

- There's no indeterminate state; use `Checkbox` for “some selected”.
