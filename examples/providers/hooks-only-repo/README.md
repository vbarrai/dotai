# hooks-only-repo

Provider repository focused on **distributing hooks only** (no skills or MCP servers).

## Structure

```
hooks.json              # 2 hook groups: block-dangerous-commands, auto-format
```

## What it demonstrates

- A provider with only hook configurations (no SKILL.md or mcp.json)
- Multiple hook groups in a single `hooks.json`
- Agent-specific hook definitions (claude-code vs cursor have different events)
- The `--hooks` flag to selectively install hook groups

## Quick test

```bash
# Interactive — choose which hooks and agents
cd examples/consumers/project-a
node --experimental-strip-types ../../../src/cli.ts install ../../providers/hooks-only-repo

# Non-interactive — all hooks, Claude Code only
node --experimental-strip-types ../../../src/cli.ts install ../../providers/hooks-only-repo -y --agents=claude-code
cat .claude/settings.json             # PreToolUse + PostToolUse hooks

# Non-interactive — only block-dangerous-commands hook
rm -rf .claude .cursor
node --experimental-strip-types ../../../src/cli.ts install ../../providers/hooks-only-repo -y --agents=claude-code --hooks=block-dangerous-commands
cat .claude/settings.json             # Only PreToolUse hook

# Cleanup
rm -rf .agents .claude .cursor .codex .mcp.json
```
