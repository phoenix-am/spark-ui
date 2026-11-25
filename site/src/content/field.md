## Features

- Gives any control a label, a description and an error message: a plain `<input>`, a `<textarea>`, or a third-party editor.
- Shows a required marker with `required`.
- Passes the generated ids to the control inside, so labelling works without wiring ids yourself.

## Accessibility

- The label is linked to the control, and the description and error are linked with `aria-describedby`.
- The error sets the control's invalid state, so screen readers announce it as invalid.

## Best practices

- Use `Field` for controls Sparkwire doesn't ship; the built-in inputs already have labels and errors.
- Keep the description short and helpful (“Shown on your public profile”), and put validation messages in `error`.

## Limitations

- `Field` connects to one control. For a group of controls, use a `<fieldset>` with a `<legend>`.
