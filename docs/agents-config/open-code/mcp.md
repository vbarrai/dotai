> **maconfai support: Supported** — MCP server installation for Open Code is fully implemented with format translation.

# Open Code — MCP Servers Guide

> Official source: [opencode.ai/docs/mcp-servers](https://opencode.ai/docs/mcp-servers/)

## Configuration

MCP servers are configured in `opencode.json` under the `mcp` key:

### Local MCP Servers (stdio)

```json
{
  "mcp": {
    "github": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-github"],
      "environment": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

### Remote MCP Servers

```json
{
  "mcp": {
    "remote-api": {
      "type": "remote",
      "url": "https://my-server.com/mcp",
      "headers": {
        "Authorization": "Bearer ${MY_API_TOKEN}"
      }
    }
  }
}
```

## Configuration Locations

| Scope   | Path                                    | Priority |
| :------ | :-------------------------------------- | :------- |
| Remote  | `.well-known/opencode` (organizational) | Lowest   |
| Global  | `~/.config/opencode/opencode.json`      | Medium   |
| Project | `./opencode.json`                       | Highest  |

Configurations merge — later configs override earlier ones only for conflicting keys.

## Per-Server Options

| Option        | Type     | Description               |
| :------------ | :------- | :------------------------ |
| `type`        | string   | `local` or `remote`       |
| `command`     | string[] | Command + args as array   |
| `url`         | string   | Remote server URL         |
| `headers`     | object   | HTTP headers              |
| `environment` | object   | Environment variables     |
| `enabled`     | boolean  | Enable/disable the server |

## Format Differences from Other Agents

| Feature        | Open Code (`opencode.json`)     | Claude Code (`.mcp.json`)       |
| :------------- | :------------------------------ | :------------------------------ |
| Config key     | `mcp`                           | `mcpServers`                    |
| Command format | `command: ["npx", "-y", "pkg"]` | `command: "npx"`, `args: [...]` |
| Env vars key   | `environment`                   | `env`                           |
| Type field     | Required (`local` / `remote`)   | Implicit                        |
| Env var syntax | `${VAR}` (bare)                 | `${VAR}` (bare)                 |

maconfai handles format translation automatically — the source `mcp.json` uses the standard format and is converted to Open Code's format during installation.

## CLI

```bash
opencode mcp add     # Interactive add (local or remote)
opencode mcp auth    # Browser-based OAuth flow for a remote server
opencode mcp         # List configured servers and connection status
```

## OAuth Support

For most OAuth-enabled MCP servers, **no inline configuration is needed**. Run `opencode mcp auth` to complete an interactive browser-based authorization; tokens are stored in `~/.local/share/opencode/mcp-auth.json` and refreshed automatically.

To opt out (for example, API-key-only servers that would otherwise trigger OAuth), set:

```json
{
  "mcp": {
    "api-key-server": {
      "type": "remote",
      "url": "https://my-server.com/mcp",
      "oauth": false,
      "headers": {
        "Authorization": "Bearer ${MY_API_TOKEN}"
      }
    }
  }
}
```

## Sources

- [Open Code MCP Servers](https://opencode.ai/docs/mcp-servers/)
- [Model Context Protocol — Specification](https://modelcontextprotocol.io)
