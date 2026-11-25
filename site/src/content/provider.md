## Features

- Wrap your app (or part of it) once to set the energy level (`energy`), the language (`locale`, `messages`) and haptics.
- Default props and class names for any component through `components`, the way MUI's `theme.components` works.
- Named variants that set several props at once (see Render prop and variants).
- Nested providers merge with their parent.

## Best practices

- Put one provider at the root for app-wide settings, and nest another only where a section really differs.
- Props set on a component always win over provider defaults.
- `locale` accepts what servers often send: `en_US`, `hi_IN` and `en_US.UTF-8` become `en-US`, `hi-IN`. A value no browser understands falls back to `en-US` with a development warning, instead of crashing every date and number formatter.
