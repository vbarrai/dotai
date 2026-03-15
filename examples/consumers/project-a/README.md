# project-a

Consumer project to test skill, MCP, and hook installations.

## Quick test

```bash
cd examples/consumers/project-a
CLI="node --experimental-strip-types ../../../src/cli.ts"
```

### Skills only

```bash
# Install all skills from multi-skills-repo
$CLI install ../../providers/multi-skills-repo -y --agents=claude-code
ls .claude/skills/                   # code-review  db-assistant  test-helper
cat .mcp.json                        # postgres MCP (from db-assistant)

# Verify skill content
cat .claude/skills/code-review/SKILL.md
cat .agents/skills/code-review/SKILL.md

# Cleanup
rm -rf .agents .claude .cursor .codex .mcp.json .confai-lock.json
```

### MCP only

```bash
# Install MCP servers without skills
$CLI install ../../providers/mcp-only-repo -y --agents=claude-code,cursor
cat .mcp.json                        # github + brave-search + linear (bare)
cat .cursor/mcp.json                 # github + brave-search + linear (env-prefix)

# Filter to only github
rm -rf .agents .claude .cursor .codex .mcp.json
$CLI install ../../providers/mcp-only-repo -y --agents=claude-code --mcps=github
cat .mcp.json                        # github only

# Cleanup
rm -rf .agents .claude .cursor .codex .mcp.json
```

### Hooks only

```bash
# Install all hooks
$CLI install ../../providers/hooks-only-repo -y --agents=claude-code
cat .claude/settings.json             # PreToolUse + PostToolUse hooks

# Filter to only one hook
rm -rf .claude
$CLI install ../../providers/hooks-only-repo -y --agents=claude-code --hooks=block-dangerous-commands
cat .claude/settings.json             # PreToolUse only

# Cleanup
rm -rf .agents .claude .cursor .codex .mcp.json
```

### Combined (skills + MCPs + hooks)

```bash
# Install everything from combined-repo
$CLI install ../../providers/combined-repo -y --agents=claude-code
ls .claude/skills/                    # lint-guard  test-runner
cat .mcp.json                         # eslint + github + sentry
cat .claude/settings.json             # PreToolUse + PostToolUse hooks

# Selective install
rm -rf .agents .claude .cursor .codex .mcp.json .confai-lock.json
$CLI install ../../providers/combined-repo -y \
  --skills=lint-guard --mcps=eslint,github --hooks=pre-commit-lint --agents=claude-code
ls .claude/skills/                    # lint-guard only
cat .mcp.json                         # eslint + github (no sentry)
cat .claude/settings.json             # PreToolUse only (no PostToolUse)

# Cleanup
rm -rf .agents .claude .cursor .codex .mcp.json .confai-lock.json
```

### Interactive mode

```bash
# Full interactive form (skills → MCPs → hooks → agents → confirm)
$CLI install ../../providers/combined-repo

# Uninstall mode (no source argument)
$CLI install
```

### Re-install scenarios

```bash
# Step 1: install all skills
$CLI install ../../providers/full-featured-repo -y --agents=claude-code
ls .claude/skills/                   # api-helper  deploy-assistant  doc-writer

# Step 2: re-install with only api-helper → others removed
$CLI install ../../providers/full-featured-repo -y --agents=claude-code --skills=api-helper
ls .claude/skills/                   # api-helper only

# Step 3: install from a different provider (skills merge)
$CLI install ../../providers/multi-skills-repo -y --agents=claude-code --skills=code-review
ls .claude/skills/                   # api-helper + code-review

# Cleanup
rm -rf .agents .claude .cursor .codex .mcp.json .confai-lock.json
```

### Multi-agent

```bash
# Install to all agents
$CLI install ../../providers/full-featured-repo -y
ls .claude/skills/                   # api-helper  deploy-assistant  doc-writer
ls .cursor/skills/                   # same
ls .codex/skills/                    # same
cat .mcp.json                        # Claude Code MCPs (bare env vars)
cat .cursor/mcp.json                 # Cursor MCPs (${env:...} syntax)

# Cleanup
rm -rf .agents .claude .cursor .codex .mcp.json .confai-lock.json
```

## Full cleanup

```bash
rm -rf .agents .claude .cursor .codex .mcp.json .confai-lock.json
```
