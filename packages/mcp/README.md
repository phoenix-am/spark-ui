# @sparkwire/mcp

An MCP server for Sparkwire, so AI coding tools use real props and examples instead of guessing.

Add it to your MCP client (Claude Code, Cursor, VS Code, …):

```json
{ "mcpServers": { "sparkwire": { "command": "npx", "args": ["-y", "@sparkwire/mcp"] } } }
```

Tools: `list_components`, `search_components`, `get_component` (props and examples), `get_component_source` and `get_setup`.

**[Docs and live examples](https://phoenix-am.github.io/spark-ui/)** · [GitHub](https://github.com/phoenix-am/spark-ui) · [Changelog](https://github.com/phoenix-am/spark-ui/blob/master/packages/mcp/CHANGELOG.md)

Part of [Sparkwire](https://github.com/phoenix-am/spark-ui). MIT licensed.
