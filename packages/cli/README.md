# sparkwire

Copy Sparkwire components into your app, with everything they depend on.

```bash
npx sparkwire init                 # creates sparkwire.json (where components go)
npx sparkwire add date-picker      # copies the component and its dependencies
npx sparkwire add dashboard        # whole pages too: dashboard, sign-in, settings
npx sparkwire list                 # everything available
```

Flags: `--dir`, `--overwrite`, `--dry-run`, `--no-install`, `--registry`. The same registry also works with the shadcn CLI: `npx shadcn add @sparkwire/<name>`.

**[Docs and live examples](https://phoenix-am.github.io/spark-ui/)** · [GitHub](https://github.com/phoenix-am/spark-ui) · [Changelog](https://github.com/phoenix-am/spark-ui/blob/master/packages/cli/CHANGELOG.md)

Part of [Sparkwire](https://github.com/phoenix-am/spark-ui). MIT licensed.
