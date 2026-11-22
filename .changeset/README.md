# Changesets

Every pull request that changes a published package adds a changeset: a short note on what changed and whether it's a patch, minor or major change.

```bash
npx changeset          # pick the bump, write one line for the changelog
```

All Sparkwire packages share one version (`fixed` in `config.json`), so one release means one version number everywhere.

On `master`, the **Publish to npm** workflow collects pending changesets into a **Version packages** pull request (versions bumped, CHANGELOG.md written). Merging that pull request publishes to npm and creates the GitHub release.
