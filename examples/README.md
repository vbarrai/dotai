# Examples

Manual testing scenarios for maconfai using local example repositories.

## Layout

```
examples/
  providers/                         # Repos that distribute skills, MCPs, and hooks
    single-skill-repo/               # 1 skill at the root (no skills/ dir)
    multi-skills-repo/               # 3 skills + 1 MCP server (postgres)
    full-featured-repo/              # 3 skills + 4 MCP servers
    mcp-only-repo/                   # 0 skills + 3 MCP servers (standalone)
    hooks-only-repo/                 # 0 skills + 2 hook groups (standalone)
    combined-repo/                   # 2 skills + 3 MCPs + 2 hooks (all features)
  consumers/                         # Target projects that receive the configs
    project-a/                       # Primary test project
    project-b/                       # Secondary test project (isolated)
```

## Running commands

All commands use `node` directly to run the local build. From a consumer directory:

```bash
cd examples/consumers/project-a
CLI="node --experimental-strip-types ../../../src/cli.ts"

$CLI install <path-to-provider> [flags]
```

---

## Providers overview

| Provider             | Skills | MCPs | Hooks | Use case                           |
| :------------------- | :----: | :--: | :---: | :--------------------------------- |
| `single-skill-repo`  |   1    |  0   |   0   | Root SKILL.md fallback             |
| `multi-skills-repo`  |   3    |  1   |   0   | Multiple skills, one with MCP      |
| `full-featured-repo` |   3    |  4   |   0   | Skills + MCPs spread across skills |
| `mcp-only-repo`      |   0    |  3   |   0   | Standalone MCP distribution        |
| `hooks-only-repo`    |   0    |  0   |   2   | Standalone hooks distribution      |
| `combined-repo`      |   2    |  3   |   2   | All three resource types           |

---

## Quick start — test every feature

```bash
cd examples/consumers/project-a
CLI="node --experimental-strip-types ../../../src/cli.ts"
```

### 1. Skills only

```bash
$CLI install ../../providers/multi-skills-repo -y --agents=claude-code
ls .claude/skills/                   # code-review  db-assistant  test-helper
rm -rf .agents .claude .cursor .codex .mcp.json .confai-lock.json
```

### 2. MCP only

```bash
$CLI install ../../providers/mcp-only-repo -y --agents=claude-code
cat .mcp.json                        # github + brave-search + linear
rm -rf .agents .claude .cursor .codex .mcp.json
```

### 3. Hooks only

```bash
$CLI install ../../providers/hooks-only-repo -y --agents=claude-code
cat .claude/settings.json             # PreToolUse + PostToolUse
rm -rf .agents .claude .cursor .codex
```

### 4. Combined (skills + MCPs + hooks)

```bash
$CLI install ../../providers/combined-repo -y --agents=claude-code
ls .claude/skills/                    # lint-guard  test-runner
cat .mcp.json                         # eslint + github + sentry
cat .claude/settings.json             # hooks
rm -rf .agents .claude .cursor .codex .mcp.json .confai-lock.json
```

### 5. Interactive mode (full form)

```bash
$CLI install ../../providers/combined-repo
# Prompts: skills → MCPs → hooks → agents → confirm
```

### 6. Filtering

```bash
# Filter skills
$CLI install ../../providers/combined-repo -y --skills=lint-guard --agents=claude-code

# Filter MCPs
$CLI install ../../providers/combined-repo -y --mcps=github --agents=claude-code

# Filter hooks
$CLI install ../../providers/combined-repo -y --hooks=pre-commit-lint --agents=claude-code

# Filter agents
$CLI install ../../providers/combined-repo -y --agents=cursor

# Combine all filters
$CLI install ../../providers/combined-repo -y \
  --skills=lint-guard --mcps=eslint,github --hooks=pre-commit-lint --agents=claude-code

rm -rf .agents .claude .cursor .codex .mcp.json .confai-lock.json
```

### 7. Re-install & uninstall

```bash
# Install all
$CLI install ../../providers/full-featured-repo -y --agents=claude-code
ls .claude/skills/                   # api-helper  deploy-assistant  doc-writer

# Re-install with fewer skills → others removed
$CLI install ../../providers/full-featured-repo -y --agents=claude-code --skills=api-helper
ls .claude/skills/                   # api-helper only

# Uninstall mode (no source)
$CLI install

rm -rf .agents .claude .cursor .codex .mcp.json .confai-lock.json
```

### 8. Multi-agent env var translation

```bash
$CLI install ../../providers/mcp-only-repo -y --agents=claude-code,cursor --mcps=github
cat .mcp.json                        # "${GITHUB_TOKEN}" (bare)
cat .cursor/mcp.json                 # "${env:GITHUB_TOKEN}" (env-prefix)
rm -rf .agents .claude .cursor .codex .mcp.json
```

---

## Full cleanup

```bash
cd examples/consumers/project-a && rm -rf .agents .claude .cursor .codex .mcp.json .confai-lock.json
cd ../project-b && rm -rf .agents .claude .cursor .codex .mcp.json .confai-lock.json
```
