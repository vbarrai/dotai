# mcp-only-repo

Provider repository focused on **distributing MCP servers** alongside a skill.

## Structure

```
skills/
  mcp-tools/
    SKILL.md              # Lightweight skill description
    mcp.json              # Declares 2 MCP servers: github + brave-search
```

## What it demonstrates

- A skill whose main purpose is to install MCP server configurations
- Multiple MCP servers in a single `mcp.json`
- Environment variables using `${VAR}` syntax (auto-translated per agent)
- The `--mcps` flag to selectively install MCP servers

## Quick test

```bash
# Install all MCP servers to project-b for Claude Code + Cursor
cd examples/consumers/project-b
node --experimental-strip-types ../../../src/cli.ts install ../../providers/mcp-only-repo -y --agents=claude-code,cursor

# Check env var translation
cat .mcp.json
# → "GITHUB_TOKEN": "${GITHUB_TOKEN}"              (Claude Code: bare)
cat .cursor/mcp.json
# → "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"           (Cursor: env-prefix)

# Cleanup and test --mcps filter
rm -rf .agents .claude .cursor .codex .mcp.json
node --experimental-strip-types ../../../src/cli.ts install ../../providers/mcp-only-repo -y --agents=claude-code --mcps=github

# Only github installed, no brave-search
cat .mcp.json
grep "brave" .mcp.json && echo "FAIL" || echo "OK: no brave-search"

# Cleanup
rm -rf .agents .claude .cursor .codex .mcp.json
```
