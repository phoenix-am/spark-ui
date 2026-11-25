---
'sparkwire': patch
'@sparkwire/mcp': patch
---

Security: treat registry data as untrusted.

- `sparkwire add` refuses file targets that point outside your project (`../`, absolute or drive paths) and checks every file before writing any.
- Dependencies from a registry must be plain npm package specs, so a registry can no longer pass options such as `--registry=` to your package manager. On Windows each spec is quoted for `cmd.exe`.
- Component names, including `registryDependencies`, must be lowercase words joined by hyphens.
- The MCP server's `get_component_source` only reads known components and no longer builds a file path from tool input.
