# combined-repo

Provider repository demonstrating **all three resource types**: skills, MCP servers, and hooks.

## Structure

```
skills/
  lint-guard/
    SKILL.md              # Lint enforcement skill
  test-runner/
    SKILL.md              # Test automation skill
mcps/
  github/
    mcp.json              # GitHub MCP server
  sentry/
    mcp.json              # Sentry MCP server
hooks.json                # 2 hook groups: pre-commit-lint, test-on-edit
```

## What it demonstrates

- Multiple skills
- MCP servers in dedicated `mcps/` directories
- Hook groups with agent-specific event handlers
- The complete interactive form: skills → MCPs → hooks → agents → confirm

## Quick test

```bash
cd examples/consumers/project-a

# Interactive — full form with all 4 selection steps
node --experimental-strip-types ../../../src/cli.ts install ../../providers/combined-repo

# Non-interactive — everything
node --experimental-strip-types ../../../src/cli.ts install ../../providers/combined-repo -y --agents=claude-code
ls .claude/skills/                    # lint-guard  test-runner
cat .mcp.json                         # github + sentry
cat .claude/settings.json             # PreToolUse + PostToolUse hooks

# Selective — only lint-guard skill, only github MCP, only pre-commit-lint hook
rm -rf .agents .claude .cursor .codex .mcp.json ai-lock.json
node --experimental-strip-types ../../../src/cli.ts install ../../providers/combined-repo -y \
  --skills=lint-guard --mcps=github --hooks=pre-commit-lint --agents=claude-code
ls .claude/skills/                    # lint-guard only
cat .mcp.json                         # github only (no sentry)
cat .claude/settings.json             # PreToolUse only (no PostToolUse)

# Cleanup
rm -rf .agents .claude .cursor .codex .mcp.json ai-lock.json
```
