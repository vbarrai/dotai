# Frontmatter Reference

Complete reference for all YAML frontmatter fields in a SKILL.md file.

## name

- **Type:** String
- **Max length:** 64 characters
- **Format:** lowercase, hyphens only (`my-skill-name`)
- **Default:** directory name
- **Effect:** becomes the `/slash-command` name

```yaml
name: fix-pr-ci
```

## description

- **Type:** String
- **Max length:** 250 characters (truncated beyond that)
- **Default:** none
- **Effect:** Claude reads this to decide when to auto-trigger the skill

Write in third person with trigger keywords and exclusion clauses:

```yaml
# Good
description: >
  Create or update visual regression tests for a React component.
  TRIGGER when: the user is editing files matching `**/_meta/*.visual-test.tsx`,
  or asks to add/update visual tests.
  DO NOT TRIGGER when: editing source components, stories, or unit tests.

# Bad
description: Helps with tests
```

## disable-model-invocation

- **Type:** Boolean
- **Default:** `false`
- **Effect:** when `true`, only the user can invoke with `/name`. Claude will never auto-trigger.

Use for actions with side effects:

```yaml
disable-model-invocation: true # deploy, send messages, create PRs
```

## user-invocable

- **Type:** Boolean
- **Default:** `true`
- **Effect:** when `false`, hidden from `/` autocomplete menu. Only Claude can invoke.

Use for background knowledge that isn't a command:

```yaml
user-invocable: false # API conventions, legacy system context
```

## allowed-tools

- **Type:** String (space-separated) or Array
- **Default:** none (inherits session permissions)
- **Effect:** tools Claude can use without asking permission while the skill is active

```yaml
# String format (space-separated)
allowed-tools: Read Grep Glob

# Array format
allowed-tools:
  - Read
  - Grep
  - Glob
  - "Bash(npm *)"

# Bash with command patterns
allowed-tools: Bash(npm *) Bash(git *)

# All bash
allowed-tools: Bash

# Mixed
allowed-tools: Read Edit Write Grep Glob Bash(gh *) Bash(pnpm *)
```

## model

- **Type:** String
- **Default:** inherits from session
- **Effect:** overrides the model used when this skill is active

```yaml
model: claude-opus-4-6
model: claude-sonnet-4-6
model: claude-haiku-4-5-20251001
```

## effort

- **Type:** String (`low`, `medium`, `high`, `max`)
- **Default:** inherits from session
- **Effect:** overrides reasoning effort level

```yaml
effort: max  # for complex analysis skills
effort: low  # for simple formatting skills
```

## context

- **Type:** String
- **Values:** `fork`
- **Default:** none (runs in main conversation)
- **Effect:** `fork` runs the skill in an isolated subagent with no access to conversation history

```yaml
context: fork
```

## agent

- **Type:** String
- **Values:** `Explore`, `Plan`, `general-purpose`, or custom agent name
- **Default:** `general-purpose`
- **Effect:** which subagent type to use when `context: fork`

```yaml
context: fork
agent: Explore # for codebase research
```

## hooks

- **Type:** Object (YAML)
- **Default:** none
- **Effect:** lifecycle hooks scoped to this skill's execution

```yaml
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "${CLAUDE_SKILL_DIR}/scripts/check.sh"
          timeout: 30
  PostToolUse:
    - matcher: "Write"
      hooks:
        - type: prompt
          prompt: "Verify the output"
  Stop:
    - hooks:
        - type: command
          command: "echo 'Skill completed'"
```

### Claude Code hook events

| Event                | Fires                                                                                |
| -------------------- | ------------------------------------------------------------------------------------ |
| `SessionStart`       | When a session begins                                                                |
| `InstructionsLoaded` | After instructions (CLAUDE.md, skills) are loaded                                    |
| `UserPromptSubmit`   | When the user submits a prompt                                                       |
| `PreToolUse`         | Before tool execution                                                                |
| `PermissionRequest`  | When a tool requires permission                                                      |
| `PostToolUse`        | After tool success                                                                   |
| `PostToolUseFailure` | After tool error                                                                     |
| `PermissionDenied`   | When the user denies a tool                                                          |
| `Notification`       | On system notifications                                                              |
| `SubagentStart`      | When a subagent starts                                                               |
| `SubagentStop`       | When a subagent stops                                                                |
| `TaskCreated`        | When a task is created                                                               |
| `TaskCompleted`      | When a task completes                                                                |
| `Stop`               | When Claude considers stopping (auto-converted to `SubagentStop` in `context: fork`) |
| `StopFailure`        | When a stop hook fails                                                               |
| `PreCompact`         | Before context compaction                                                            |
| `PostCompact`        | After context compaction                                                             |
| `SessionEnd`         | When a session ends                                                                  |
| `Elicitation`        | When Claude asks the user a question                                                 |
| `ElicitationResult`  | When the user answers an elicitation                                                 |
| `CwdChanged`         | When working directory changes                                                       |
| `FileChanged`        | When a file changes                                                                  |
| `WorktreeCreate`     | When a git worktree is created                                                       |
| `WorktreeRemove`     | When a git worktree is removed                                                       |
| `ConfigChange`       | When configuration changes                                                           |
| `TeammateIdle`       | When a teammate agent becomes idle                                                   |

### Cursor hook events

| Event                  | Fires                                             |
| ---------------------- | ------------------------------------------------- |
| `beforeSubmitPrompt`   | Before a prompt is sent to the model              |
| `beforeShellExecution` | Before shell command execution (can approve/deny) |
| `afterShellExecution`  | After shell command completes                     |
| `beforeMCPExecution`   | Before MCP tool calls (can approve/deny)          |
| `afterMCPExecution`    | After MCP tool execution                          |
| `beforeReadFile`       | Before file contents are sent to the LLM          |
| `afterFileEdit`        | After a file is modified                          |
| `beforeTabFileRead`    | Before reading files in tab mode                  |
| `afterTabFileEdit`     | After file edits in tab mode                      |
| `afterAgentResponse`   | After the agent sends a response                  |
| `afterAgentThought`    | After the agent produces reasoning output         |
| `stop`                 | When a session ends                               |

### Hook types

| Type      | Description                   |
| --------- | ----------------------------- |
| `command` | Run a shell command           |
| `http`    | POST to an HTTP endpoint      |
| `prompt`  | Send to Claude for evaluation |
| `agent`   | Spawn a subagent              |

## paths

- **Type:** String (comma-separated) or Array
- **Default:** none (skill always eligible)
- **Effect:** skill activates only when Claude works with files matching the glob patterns

```yaml
# Array format
paths:
  - "src/**/*.ts"
  - "lib/**/*.py"

# String format
paths: "src/**/*.ts, lib/**/*.py"
```

Use this to scope a skill to specific parts of a codebase (e.g., frontend-only conventions, test helpers).

## shell

- **Type:** String (`bash`, `powershell`)
- **Default:** `bash`
- **Effect:** shell used for `` !`command` `` and ` ```! ` blocks in this skill

```yaml
shell: powershell # requires CLAUDE_CODE_USE_POWERSHELL_TOOL=1
```

## argument-hint

- **Type:** String
- **Default:** none
- **Effect:** shown in autocomplete next to skill name

```yaml
argument-hint: [issue-number]
argument-hint: [filename] [format]
argument-hint: [pr-number]
```

## version

- **Type:** String (semver)
- **Default:** none
- **Effect:** not read by agents, but allows users to track which version of a skill is installed

Always set a version and bump it on content changes:

- **Patch** (1.0.1): typo/wording fixes
- **Minor** (1.1.0): new features, new steps, new examples
- **Major** (2.0.0): breaking changes (renamed arguments, removed steps)

```yaml
version: 1.2.0
```

## license

- **Type:** String
- **Default:** none
- **Effect:** informational only, not used by Claude

```yaml
license: MIT
```
