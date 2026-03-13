# multi-skills-repo

Provider repository distributing **3 skills** and **1 MCP server**.

## Structure

```
skills/
  code-review/
    SKILL.md              # Code review skill
  test-helper/
    SKILL.md              # Test generation skill
  db-assistant/
    SKILL.md              # Database assistant skill
    mcp.json              # Declares a PostgreSQL MCP server
```

## What it demonstrates

- Multiple skills in a single repo
- A skill with an MCP server (`db-assistant` → `postgres`)
- Skills without MCP (`code-review`, `test-helper`)

## Quick test

```bash
# Install all skills to project-a for Claude Code only
cd examples/consumers/project-a
node --experimental-strip-types ../../../src/cli.ts install ../../providers/multi-skills-repo -y --agents=claude-code

# Check results
ls .claude/skills/                   # code-review  db-assistant  test-helper
cat .mcp.json                        # postgres MCP with ${DATABASE_URL}

# Cleanup
rm -rf .agents .claude .cursor .codex .mcp.json

# Install only code-review to project-b for all agents
cd ../project-b
node --experimental-strip-types ../../../src/cli.ts install ../../providers/multi-skills-repo -y --skills=code-review

# Check results
ls .claude/skills/                   # code-review
ls .cursor/skills/                   # code-review
test -f .mcp.json && echo "FAIL" || echo "OK: no MCP (code-review has none)"

# Cleanup
rm -rf .agents .claude .cursor .codex .mcp.json
```
