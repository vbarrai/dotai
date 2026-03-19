# full-featured-repo

Provider repository demonstrating **all maconfai features**: multiple skills, multiple MCP servers, and skills without MCP.

## Structure

```
skills/
  api-helper/
    SKILL.md              # API development skill
  doc-writer/
    SKILL.md              # Documentation skill (no MCP)
  deploy-assistant/
    SKILL.md              # DevOps/deployment skill
mcps/
  github/
    mcp.json              # GitHub MCP server
  linear/
    mcp.json              # Linear MCP server
  filesystem/
    mcp.json              # Filesystem MCP server
  brave-search/
    mcp.json              # Brave Search MCP server
```

## What it demonstrates

- 3 skills, 4 MCP servers in dedicated `mcps/` directories
- Env var default syntax: `${PROJECT_ROOT:-/tmp}`
- Interactive prompts for skill, MCP, and agent selection

## Quick test

```bash
# Interactive install — choose skills, MCP servers, and agents manually
cd examples/consumers/project-a
node --experimental-strip-types ../../../src/cli.ts install ../../providers/full-featured-repo

# Non-interactive install — everything, all agents
node --experimental-strip-types ../../../src/cli.ts install ../../providers/full-featured-repo -y

# Check results
ls .claude/skills/                   # api-helper  deploy-assistant  doc-writer
cat .mcp.json                        # github + linear + filesystem + brave-search
cat .cursor/mcp.json                 # same, with ${env:...} syntax

# Filter: only api-helper skill + only github MCP
rm -rf .agents .claude .cursor .codex .mcp.json
node --experimental-strip-types ../../../src/cli.ts install ../../providers/full-featured-repo -y --skills=api-helper --mcps=github --agents=claude-code
cat .mcp.json                        # github only

# Cleanup
rm -rf .agents .claude .cursor .codex .mcp.json
```
