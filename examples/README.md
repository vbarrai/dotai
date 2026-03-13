# Examples

Manual testing scenarios for maconfai using local example repositories.

## Layout

```
examples/
  providers/                         # Repos that distribute skills & MCP configs
    multi-skills-repo/               # 3 skills + 1 MCP server (postgres)
    single-skill-repo/               # 1 skill at the root (no skills/ dir)
    mcp-only-repo/                   # 1 skill + 2 MCP servers (github, brave-search)
  consumers/                         # Target projects that receive the configs
    project-a/
    project-b/
```

## Running commands

All commands use `node` directly to run the local build. From a consumer directory:

```bash
node --experimental-strip-types ../../../src/cli.ts install <path-to-provider> [flags]
#                                ^^^^^^^^^^^^^^^^^^^
#                                path from consumer dir to cli.ts
```

Alternatively, set up a shell alias from the project root:

```bash
alias maconfai="node --experimental-strip-types $(pwd)/src/cli.ts"
```

---

## Scenario 1 — Install all skills + MCP to all agents

```bash
cd examples/consumers/project-a

node --experimental-strip-types ../../../src/cli.ts install ../../providers/multi-skills-repo -y
```

Verify:

```bash
ls .claude/skills/                   # code-review  db-assistant  test-helper
ls -la .claude/skills/               # symlinks → ../../.agents/skills/*
cat .mcp.json                        # postgres MCP, ${DATABASE_URL} (bare)
cat .cursor/mcp.json                 # postgres MCP, ${env:DATABASE_URL} (env-prefix)
```

Cleanup: `rm -rf .agents .claude .cursor .codex .mcp.json`

---

## Scenario 2 — Filter skills with --skills

```bash
cd examples/consumers/project-a

node --experimental-strip-types ../../../src/cli.ts install ../../providers/multi-skills-repo -y --skills=code-review,test-helper
```

Verify:

```bash
ls .claude/skills/                   # code-review  test-helper  (no db-assistant)
test -f .mcp.json && echo "FAIL" || echo "OK: no .mcp.json"
```

Cleanup: `rm -rf .agents .claude .cursor .codex .mcp.json`

---

## Scenario 3 — Filter agents with --agents

```bash
cd examples/consumers/project-a

node --experimental-strip-types ../../../src/cli.ts install ../../providers/multi-skills-repo -y --agents=claude-code
```

Verify:

```bash
ls .claude/skills/                   # code-review  db-assistant  test-helper
cat .mcp.json                        # postgres MCP present
test -d .cursor/skills && echo "FAIL" || echo "OK: no .cursor/skills"
test -d .codex/skills && echo "FAIL" || echo "OK: no .codex/skills"
test -f .cursor/mcp.json && echo "FAIL" || echo "OK: no .cursor/mcp.json"
```

Cleanup: `rm -rf .agents .claude .cursor .codex .mcp.json`

---

## Scenario 4 — Filter MCP servers with --mcps

```bash
cd examples/consumers/project-b

node --experimental-strip-types ../../../src/cli.ts install ../../providers/mcp-only-repo -y --agents=claude-code,cursor --mcps=github
```

Verify:

```bash
cat .mcp.json                        # only github, "GITHUB_TOKEN": "${GITHUB_TOKEN}"
cat .cursor/mcp.json                 # only github, "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"
grep "brave" .mcp.json && echo "FAIL" || echo "OK: no brave-search"
```

Cleanup: `rm -rf .agents .claude .cursor .codex .mcp.json`

---

## Scenario 5 — Single skill repo (root SKILL.md, no skills/ dir)

```bash
cd examples/consumers/project-b

node --experimental-strip-types ../../../src/cli.ts install ../../providers/single-skill-repo -y --agents=claude-code
```

Verify:

```bash
cat .claude/skills/git-wizard/SKILL.md   # "git expert assistant"
```

Cleanup: `rm -rf .agents .claude .cursor .codex`

---

## Scenario 6 — Interactive mode (no -y flag)

```bash
cd examples/consumers/project-a

node --experimental-strip-types ../../../src/cli.ts install ../../providers/multi-skills-repo
```

Expected prompts:
1. Select skills (space to toggle, enter to confirm)
2. Select MCP servers (space to toggle)
3. Select agents (space to toggle)
4. Confirm (y/n)

---

## Scenario 7 — Re-install removes unchecked skills

```bash
cd examples/consumers/project-a

# Step 1: install all 3 skills
node --experimental-strip-types ../../../src/cli.ts install ../../providers/multi-skills-repo -y --agents=claude-code
ls .claude/skills/                   # code-review  db-assistant  test-helper

# Step 2: re-install with only code-review → the other 2 are removed
node --experimental-strip-types ../../../src/cli.ts install ../../providers/multi-skills-repo -y --agents=claude-code --skills=code-review
ls .claude/skills/                   # code-review  (only)
```

Cleanup: `rm -rf .agents .claude .cursor .codex .mcp.json`

---

## Scenario 8 — Uninstall mode (no source argument)

```bash
cd examples/consumers/project-a

# Install first
node --experimental-strip-types ../../../src/cli.ts install ../../providers/multi-skills-repo -y --agents=claude-code

# Uninstall interactively
node --experimental-strip-types ../../../src/cli.ts install
```

Expected prompts:
1. Lists installed skills with their agents
2. Select skills to remove
3. Confirm removal

Cleanup: `rm -rf .agents .claude .cursor .codex .mcp.json`

---

## Scenario 9 — Install from two different providers into the same project

```bash
cd examples/consumers/project-a

# Install skills from multi-skills-repo
node --experimental-strip-types ../../../src/cli.ts install ../../providers/multi-skills-repo -y --agents=claude-code --skills=code-review

# Install MCP tools from mcp-only-repo
node --experimental-strip-types ../../../src/cli.ts install ../../providers/mcp-only-repo -y --agents=claude-code
```

Verify:

```bash
ls .claude/skills/                   # code-review  mcp-tools
cat .mcp.json                        # github + brave-search MCP servers
```

Cleanup: `rm -rf .agents .claude .cursor .codex .mcp.json`

---

## Full cleanup

```bash
cd examples/consumers/project-a && rm -rf .agents .claude .cursor .codex .mcp.json
cd ../project-b && rm -rf .agents .claude .cursor .codex .mcp.json
```
