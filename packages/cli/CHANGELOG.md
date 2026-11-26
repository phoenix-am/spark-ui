# sparkwire

## 0.4.5

No changes in this release.

## 0.4.4

No changes in this release.

## 0.4.3

No changes in this release.

## 0.4.2

No changes in this release.

## 0.4.1

No changes in this release.

## 0.4.0

No changes in this release.

## 0.3.4

No changes in this release.

## 0.3.3

No changes in this release.

## 0.3.2

### Patch Changes

- cf1c782: Security: treat registry data as untrusted.

  - `sparkwire add` refuses file targets that point outside your project (`../`, absolute or drive paths) and checks every file before writing any.
  - Dependencies from a registry must be plain npm package specs, so a registry can no longer pass options such as `--registry=` to your package manager. On Windows each spec is quoted for `cmd.exe`.
  - Component names, including `registryDependencies`, must be lowercase words joined by hyphens.
  - The MCP server's `get_component_source` only reads known components and no longer builds a file path from tool input.

## 0.3.1

No changes in this release.

## 0.3.0

No changes in this release.

## 0.2.2

### Patch Changes

- d5695c1: Sparkwire descriptions and search keywords for every package on npm.

## 0.2.1

### Patch Changes

- 4adc17d: Every package now has a README on npm, with install steps and links to the docs and changelog.

## 0.2.0

No changes in this release.
