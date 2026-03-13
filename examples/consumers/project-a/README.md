# project-a

Consumer project to test skill and MCP installations.

## Quick test

```bash
cd examples/consumers/project-a

# Install from multi-skills-repo (3 skills + postgres MCP)
node --experimental-strip-types ../../../src/cli.ts install ../../providers/multi-skills-repo -y

# Check what was created
ls .claude/skills/                   # code-review  db-assistant  test-helper
ls .cursor/skills/                   # code-review  db-assistant  test-helper
ls -la .claude/skills/               # all symlinks → ../../.agents/skills/*
cat .mcp.json                        # postgres MCP (bare env vars)
cat .cursor/mcp.json                 # postgres MCP (env-prefix env vars)

# Then install from mcp-only-repo (adds github + brave-search MCP)
node --experimental-strip-types ../../../src/cli.ts install ../../providers/mcp-only-repo -y --agents=claude-code

# MCP configs are merged, not overwritten
cat .mcp.json                        # postgres + github + brave-search

# Cleanup
rm -rf .agents .claude .cursor .codex .mcp.json
```

## What gets created

```
project-a/
  .agents/skills/<name>/         # Canonical dir (source of truth)
  .claude/skills/<name>/         # Claude Code symlink → canonical
  .cursor/skills/<name>/         # Cursor symlink → canonical
  .codex/skills/<name>/          # Codex symlink → canonical
  .mcp.json                      # Claude Code MCP config
  .cursor/mcp.json               # Cursor MCP config
```
