# project-b

Second consumer project to test installations in isolation from project-a.

## Quick test

```bash
cd examples/consumers/project-b
CLI="node --experimental-strip-types ../../../src/cli.ts"
```

### Single skill

```bash
# Auto-selects the only skill, prompt for agents only
$CLI install ../../providers/single-skill-repo
cat .claude/skills/git-wizard/SKILL.md

# Non-interactive
$CLI install ../../providers/single-skill-repo -y --agents=claude-code
cat .claude/skills/git-wizard/SKILL.md   # "git expert assistant"

# Cleanup
rm -rf .agents .claude .cursor .codex .confai-lock.json
```

### Hooks only

```bash
# Install hooks to claude-code and cursor
$CLI install ../../providers/hooks-only-repo -y --agents=claude-code,cursor
cat .claude/settings.json             # Claude Code hooks
cat .cursor/hooks.json                # Cursor hooks

# Cleanup
rm -rf .agents .claude .cursor .codex
```

### Combined (all features)

```bash
# Full install
$CLI install ../../providers/combined-repo -y --agents=claude-code,cursor
ls .claude/skills/                    # lint-guard  test-runner
ls .cursor/skills/                    # lint-guard  test-runner
cat .mcp.json                         # eslint + github + sentry (bare)
cat .cursor/mcp.json                  # eslint + github + sentry (env-prefix)
cat .claude/settings.json             # hooks

# Cleanup
rm -rf .agents .claude .cursor .codex .mcp.json .confai-lock.json
```

### MCP merge from multiple providers

```bash
# Step 1: install github MCP from mcp-only-repo
$CLI install ../../providers/mcp-only-repo -y --agents=claude-code --mcps=github
cat .mcp.json                         # github only

# Step 2: install sentry MCP from combined-repo (github preserved, sentry added)
$CLI install ../../providers/combined-repo -y --agents=claude-code --skills=test-runner --mcps=sentry
cat .mcp.json                         # github + sentry

# Cleanup
rm -rf .agents .claude .cursor .codex .mcp.json .confai-lock.json
```

### Hook merge from multiple providers

```bash
# Step 1: install hooks from hooks-only-repo
$CLI install ../../providers/hooks-only-repo -y --agents=claude-code --hooks=block-dangerous-commands
cat .claude/settings.json             # PreToolUse (Bash matcher)

# Step 2: install hooks from combined-repo (existing hooks preserved)
$CLI install ../../providers/combined-repo -y --agents=claude-code --skills=test-runner --hooks=test-on-edit
cat .claude/settings.json             # PreToolUse (Bash) + PostToolUse (Edit)

# Cleanup
rm -rf .agents .claude .cursor .codex .mcp.json .confai-lock.json
```

## Full cleanup

```bash
rm -rf .agents .claude .cursor .codex .mcp.json .confai-lock.json
```
