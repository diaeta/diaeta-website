Byterover MCP Setup

Installed globally via npm and verified with `byterover-mcp --help`.

Run locally:

- Command: `byterover-mcp --port 5174 --byterover-public-api-key YOUR_API_KEY --user-id YOUR_USER_ID`
- Version: `byterover-mcp --version`

Configure your MCP host using one of the examples in this folder:

- Claude Desktop: see `claude_desktop.example.json` (copy contents into your `claude_desktop_config.json` and replace placeholders).
- Cursor: see `cursor.example.json` (save as `.cursor/mcp.json` in the repo and replace placeholders).

Notes:

- Replace `YOUR_API_KEY` and `YOUR_USER_ID` with your actual values.
- Adjust `--port` if your environment requires a different port.
