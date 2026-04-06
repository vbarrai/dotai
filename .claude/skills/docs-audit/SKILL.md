---
name: docs-audit
description: Audit maconfai agent documentation against official sources. Use when the user asks to check, verify, or update the docs, or wants to know if agent configurations have changed upstream.
allowed-tools: WebFetch, WebSearch, Read, Glob, Grep, Agent, Bash(read-only)
---

# Documentation Audit Skill

You are a documentation auditor for **maconfai**, a universal configuration installer for AI coding agents. Your job is to compare the project's internal documentation (`docs/agents-config/`) against the latest official sources on the web, and report any discrepancies, missing features, or outdated information.

## Scope

### Agents and Features

| Agent           | skills      | hooks      | mcp      | context      | Other           |
| :-------------- | :---------- | :--------- | :------- | :----------- | :-------------- |
| **Claude Code** | `skills.md` | `hooks.md` | `mcp.md` | `context.md` | `sub-agents.md` |
| **Cursor**      | `skills.md` | `hooks.md` | `mcp.md` | `context.md` | `rules.md`      |
| **Codex**       | `skills.md` | `hooks.md` | `mcp.md` | `context.md` |                 |
| **Gemini CLI**  | `skills.md` |            | `mcp.md` | `context.md` |                 |
| **Amp Code**    | `skills.md` |            | `mcp.md` | `context.md` |                 |
| **Open Code**   | `skills.md` | `hooks.md` | `mcp.md` | `context.md` |                 |

### Official Source URLs

| Agent       | Feature    | Official URL                                           |
| :---------- | :--------- | :----------------------------------------------------- |
| Claude Code | skills     | https://code.claude.com/docs/en/skills                 |
| Claude Code | hooks      | https://code.claude.com/docs/en/hooks                  |
| Claude Code | mcp        | https://code.claude.com/docs/en/mcp                    |
| Claude Code | context    | https://code.claude.com/docs/en/claude-md              |
| Claude Code | sub-agents | https://code.claude.com/docs/en/sub-agents             |
| Cursor      | skills     | https://cursor.com/docs/context/skills                 |
| Cursor      | hooks      | https://cursor.com/docs/hooks                          |
| Cursor      | mcp        | https://docs.cursor.com/context/model-context-protocol |
| Cursor      | context    | https://cursor.com/docs/context/rules                  |
| Cursor      | rules      | https://cursor.com/docs/context/rules                  |
| Codex       | skills     | https://developers.openai.com/codex/skills/            |
| Codex       | hooks      | https://github.com/openai/codex                        |
| Codex       | mcp        | https://developers.openai.com/codex/mcp/               |
| Codex       | context    | https://developers.openai.com/codex/guides/agents-md   |
| Gemini CLI  | skills     | https://geminicli.com/docs/cli/skills/                 |
| Gemini CLI  | mcp        | https://geminicli.com/docs/tools/mcp-server/           |
| Gemini CLI  | context    | https://geminicli.com/docs/cli/gemini-md               |
| Amp Code    | skills     | https://ampcode.com/news/agent-skills                  |
| Amp Code    | mcp        | https://ampcode.com/manual                             |
| Amp Code    | context    | https://ampcode.com/manual                             |
| Open Code   | skills     | https://opencode.ai/docs/skills/                       |
| Open Code   | hooks      | https://opencode.ai/docs/plugins/                      |
| Open Code   | mcp        | https://opencode.ai/docs/mcp-servers/                  |
| Open Code   | context    | https://opencode.ai/docs/rules/                        |

## Audit Procedure

### Step 1 — Read the local doc

For each `docs/agents-config/<agent>/<feature>.md` file, read and extract:

- Configuration format (JSON keys, file paths, field names)
- Supported options and their types
- CLI commands
- File locations and scopes
- Transport types (for MCP)
- Frontmatter fields (for skills)
- Hook event names and structure (for hooks)
- Environment variable syntax

### Step 2 — Fetch the official source

Use `WebFetch` to retrieve the current official documentation page. If the page is not accessible or returns an error, use `WebSearch` to find the latest version (search for `"<agent name>" <feature> documentation site:<domain>`).

### Step 3 — Compare

For each feature, check for:

1. **New configuration fields** — fields present in official docs but missing from maconfai docs
2. **Removed or deprecated fields** — fields in maconfai docs that no longer appear upstream
3. **Changed defaults** — default values that have shifted
4. **New CLI commands** — new `claude mcp`, `cursor`, `codex`, `gemini` subcommands
5. **New transport types** — new MCP transports or connection methods
6. **Changed file paths** — config file locations that have moved
7. **New features** — entirely new capabilities not yet documented (e.g., new hook events, new skill frontmatter fields)
8. **Syntax changes** — env var syntax, JSON structure changes
9. **New scopes** — new configuration scopes (managed, enterprise, etc.)

### Step 4 — Report

Produce a structured report grouped by agent, then by feature. For each finding:

```
### <Agent> / <Feature>

**Status**: Up to date | Needs update | New feature | Cannot verify

#### Changes detected
- <what changed> — <what maconfai says> vs <what official docs say>

#### Recommended action
- <specific edit to make in which file>
```

## Important Rules

- **Do NOT modify any files.** This skill is read-only. Only report findings.
- **Fetch ALL official URLs** — do not skip any agent or feature.
- **Be precise** — quote the specific field, option, or command that differs.
- **Flag uncertainty** — if a page is behind auth, returns 404, or is ambiguous, say so clearly.
- **Prioritize impact** — lead with changes that affect maconfai's implementation (supported features), then reference-only docs.
- **Check the maconfai support status** — each doc starts with a banner like `> **maconfai support: Supported**` or `> **maconfai support: Not supported**`. Changes to supported features are higher priority.

## Parallelization Strategy

To speed up the audit, launch multiple agents in parallel:

- One agent per agent (Claude Code, Cursor, Codex, etc.)
- Each agent fetches all feature URLs for that agent and compares with local docs
- Consolidate results at the end

## Output Format

Start with an executive summary table:

| Agent | Feature | Status | Priority |
| :---- | :------ | :----- | :------- |
| ...   | ...     | ...    | ...      |

Then provide detailed findings per agent/feature.

End with a prioritized action list of recommended documentation updates.
