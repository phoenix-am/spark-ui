## Features

- Checked, unchecked and indeterminate (`indeterminate`) states.
- Controlled (`checked` + `onChange`) or uncontrolled (`defaultChecked`).
- `error` with `helperText` for validation messages.
- Submits with forms under `name` and `value`, and works with React Hook Form's `register`.

## Accessibility

- A native `<input type="checkbox">`, so Space toggles it, forms and autofill work, and screen readers announce “checkbox, checked”.
- The indeterminate state is announced as “mixed”.
- Clicking the label toggles it; the helper and error text are linked to the input.

## Best practices

- Use checkboxes for independent choices and for picking several items; use a `RadioGroup` for one choice out of several.
- Use the indeterminate state on a “select all” box when only some items are selected.
- Phrase labels positively: “Send me updates”, not “Don't send me updates”.
