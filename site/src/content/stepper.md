## Features

- Shows progress through ordered `steps` (`{ label, description?, error?, icon? }`) with `active` marking the current one.
- Horizontal or vertical layout; vertical leaves room for descriptions.
- Steps can be clickable (`onStepClick`, `clickable`) so people can jump back to finished steps.
- Each step shows its status: complete, current, error or upcoming.

## Accessibility

- An ordered list; the current step is marked with `aria-current="step"`.
- Clickable steps are real buttons, reachable with Tab.
- Status (complete, error) is conveyed with text and icons, not colour alone.

## Responsive behavior

In a horizontal stepper narrower than 480px, the list collapses into a compact “Step 2 of 4” summary, while the full list stays available to screen readers.

## Best practices

- Keep it to three to seven steps with short labels.
- Let people go back to completed steps, but don't let them skip ahead past required ones.
- Mark a step as `error` when it has something to fix, and say what in its description.
