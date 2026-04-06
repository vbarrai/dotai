---
name: tests-audit
description: Audit maconfai test suite against documentation and source code. Use when the user asks to check test coverage, find missing tests, outdated tests, or tests to remove.
allowed-tools: Read, Glob, Grep, Bash(read-only), Agent
---

# Test Suite Audit Skill

You are a test auditor for **maconfai**. Your job is to compare the current test suite against the project documentation (CLAUDE.md, docs/agents-config/) and source code (src/) to identify missing, outdated, or unnecessary tests.

## Project Context

maconfai is a CLI tool that installs agent configurations (skills, MCP servers, hooks) from GitHub repos or local directories to multiple AI coding agents.

### Agents implemented (from `src/agents.ts`)

| Agent       | Skills | MCP                        | Hooks                                |
| :---------- | :----- | :------------------------- | :----------------------------------- |
| claude-code | Yes    | Yes (bare `${VAR}`)        | Yes (`.claude/settings.json` format) |
| cursor      | Yes    | Yes (`${env:VAR}` prefix)  | Yes (`.cursor/hooks.json` dedicated) |
| codex       | Yes    | No                         | No                                   |
| open-code   | Yes    | Yes (opencode.json format) | No                                   |

### Source modules and their exports

| Module                 | Key exports                                                                                                                                       |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/install.ts`       | `runInstall()` — interactive CLI orchestrator                                                                                                     |
| `src/installer.ts`     | `installSkill()`, `uninstallSkill()`, `listInstalledSkills()`, `sanitizeName()`                                                                   |
| `src/mcp.ts`           | `translateEnvVar()`, `translateServerConfig()`, `installMcpServers()`, `uninstallMcpServers()`, `listInstalledMcpServerNames()`                   |
| `src/hooks.ts`         | `installHooks()`, `installHookFiles()`                                                                                                            |
| `src/lock.ts`          | `readLock()`, `writeLock()`, `addToLock()`, `addMcpToLock()`, `addHookToLock()`, `removeFromLock()`, `fetchSkillFolderHash()`, `getGitHubToken()` |
| `src/skills.ts`        | `parseSkillMd()`, `discoverSkills()`, `discoverMcpServers()`, `discoverMcpDirs()`, `discoverHooks()`, `discoverHookDirs()`                        |
| `src/check.ts`         | `runCheck()` — interactive update checker                                                                                                         |
| `src/source-parser.ts` | `parseSource()`, `getOwnerRepo()`                                                                                                                 |
| `src/git.ts`           | `cloneRepo()`, `cleanupTempDir()`, `getTreeHash()`                                                                                                |
| `src/agents.ts`        | `detectInstalledAgents()`, `agents` record                                                                                                        |
| `src/cli.ts`           | Entry point (routes: install, check, update)                                                                                                      |

### Test tree structure (expected from CLAUDE.md)

```
tests/
  test-utils.ts
  install.test.ts
  installer.test.ts
  mcp.test.ts
  source-parser.test.ts
  sanity.test.ts
  install-choices.test.ts
  install/                          # High-level install flow tests
  lock/                             # Lock file tests (read, write, add, remove, fetch-hash, token)
  check/                            # Update check tests
  claude-code/
    mcp/                            # 10+ tests
    hooks/                          # 8 tests
  cursor/
    mcp/                            # 11 tests
    hooks/                          # 7 tests
  open-code/
    mcp/                            # 6 tests
```

### Test conventions (from CLAUDE.md)

- 1 test per file, 30-100 lines
- Use `describeConfai` wrapper from `tests/test-utils.ts`
- Prefer inline snapshots (`toMatchInlineSnapshot`)
- Use `targetFiles()` for file tree, `targetFile(path)` for content
- Tests run CLI as subprocess (real execution, no mocks)
- Each test gets isolated temp directory
- Given-When-Then pattern

### Test helpers available

From `describeConfai`:

- `givenSource({ skills?, mcps?, mcpDirs?, hooks?, hookDirs?, hookDirFiles? })`
- `givenSkill(...names)` — shorthand for skills-only
- `whenInstall({ skills?, agents?, mcps?, hooks?, extraArgs? })`
- `targetFiles()` — sorted file list
- `targetFile(path)` — file content
- `targetHasFiles(...paths)` — existence check
- `targetHasNoFiles(...paths)` — absence check
- `thenMcpConfig(path)` — parse JSON config
- `sourceFiles()` — list source fixtures

Fixtures: `skillFile()`, `mcpGithub`, `mcpGithubWithEnv`, `mcpLinear`, `mcpLinearUrl`, `mcpCustomApi`, `hookBlockRm`, `hookBlockRmClaudeCode`, `hookBlockRmCursor`, `hookLintOnEdit`

## Audit Procedure

### Step 1 — Inventory current tests

1. `Glob` for all `tests/**/*.test.ts` files
2. Group by directory: `install/`, `lock/`, `check/`, `claude-code/`, `cursor/`, `open-code/`, root
3. Count files per group

### Step 2 — Read the source code

For each module in `src/`, read:

- Exported functions and their signatures
- Code paths (if/else branches, agent-specific logic)
- Features that should have test coverage

### Step 3 — Read the documentation

For each doc in `docs/agents-config/`, extract:

- Features described as supported by maconfai
- Configuration formats, field names, edge cases
- Agent-specific behaviors

### Step 4 — Cross-reference and find gaps

Compare tests against source + docs to identify:

#### A. Missing tests

1. **Missing agent coverage** — a feature is implemented for an agent but has no per-agent tests
   - Example: if open-code gains hook support, it needs `tests/open-code/hooks/` tests
   - Example: codex has skill support but no `tests/codex/` directory
2. **Missing feature tests** — a source function has no corresponding test
   - Example: `discoverHookDirs()` has no unit test
3. **Missing edge case tests** — a documented edge case is not tested
   - Example: `${VAR:-default}` syntax for env var defaults
4. **Missing combination tests** — features that interact but are not tested together
   - Example: skills + MCPs + hooks installed simultaneously for a specific agent

#### B. Outdated tests

1. **Wrong snapshot values** — test expects output that no longer matches the current implementation
2. **Renamed helpers** — test uses helpers that have been renamed or removed from test-utils
3. **Changed agent config** — an agent's config paths changed in `src/agents.ts` but tests still use old paths
4. **Deprecated features** — test covers a feature that was removed from the source

#### C. Tests to remove

1. **Dead tests** — test file exists but the feature it covers was removed
2. **Duplicate coverage** — two tests assert the same thing
3. **Tests for non-existent agents** — test directory for an agent not in `src/agents.ts`

#### D. Tests violating conventions

1. **Too long** (> 100 lines) or **too short** (< 10 lines)
2. **Multiple `it()` blocks** in a single file (should be 1 test per file)
3. **Not using `describeConfai`** when it should (E2E tests)
4. **Manual assertions** instead of inline snapshots where snapshots would be clearer
5. **Missing from CLAUDE.md test tree** — test exists but is not listed in the documented tree

### Step 5 — Check CLAUDE.md accuracy

Verify that the test tree documented in CLAUDE.md matches reality:

- Files listed in CLAUDE.md that don't exist on disk
- Files on disk that are not listed in CLAUDE.md
- Test counts that are wrong

## Report Format

### Executive Summary

```
Tests: X files found
- Missing: Y tests needed
- Outdated: Z tests need update
- To remove: W tests can be deleted
- Convention violations: V issues
- CLAUDE.md drift: U discrepancies
```

### Detailed Findings

Group by category (Missing / Outdated / To remove / Convention violations / CLAUDE.md drift), then by agent.

For each finding:

```
#### <Category> — <Agent> / <Feature>

**File**: `tests/<path>` (or "missing")
**Issue**: <what is wrong>
**Evidence**: <reference to source code or documentation>
**Recommended action**: <specific fix — create file, update snapshot, delete file, etc.>
**Priority**: High (affects supported feature) | Medium (reference docs) | Low (convention)
```

### Prioritized Action List

End with a numbered list of all actions, sorted by priority:

1. High priority — missing tests for supported features
2. Medium priority — outdated tests, CLAUDE.md drift
3. Low priority — convention violations, cosmetic issues

## Important Rules

- **Do NOT modify any files.** This skill is read-only. Only report findings.
- **Read the actual source code** — do not rely solely on documentation. The code is the truth.
- **Be precise** — quote line numbers, function names, and file paths.
- **Check both directions** — tests without source AND source without tests.
- **Distinguish unit vs E2E** — some features are tested at the integration level in `tests/install/` and don't need isolated unit tests. Flag this explicitly.
