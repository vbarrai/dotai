---
name: make-a-skill
version: 1.0.0
description: >-
  TRIGGER when the user is creating, editing, or asking about files matching
  `.claude/skills/**/SKILL.md` or `.claude/commands/*.md`.
  Guide for creating and editing Claude Code skills with proper frontmatter, structure, and best practices.
  DO NOT TRIGGER for other file edits or general code changes.
user-invocable: true
---

# Skill Development Guide

You are helping the user create or modify a Claude Code custom skill. Follow this reference strictly to produce well-structured, effective skills.

## File Structure

Every skill lives in its own directory with a required `SKILL.md` and optional supporting files:

```
.claude/skills/<skill-name>/
├── SKILL.md              # Required: skill definition
├── references/           # Optional: detailed documentation
│   └── guide.md
├── examples/             # Optional: working code examples
│   └── example-usage.md
├── scripts/              # Optional: executable utilities
│   └── helper.sh
└── assets/               # Optional: templates, non-context resources
    └── template.html
```

## SKILL.md Format

A SKILL.md has two parts: YAML frontmatter + markdown content.

```yaml
---
name: my-skill
description: What this skill does and when to trigger it.
---
# Instructions

Markdown content that Claude follows when the skill is invoked...
```

## Frontmatter Fields

All fields are optional but `name` and `description` are strongly recommended.

| Field                      | Type                                           | Description                                                                                                                                                            |
| -------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                     | String (64 chars, lowercase, hyphens)          | Skill identifier. Becomes the `/slash-command`. Falls back to directory name.                                                                                          |
| `description`              | String (max 250 chars — truncated beyond that) | **Most important field.** Claude uses it to decide when to auto-trigger. Write in third person: "This skill should be used when..." Include specific trigger keywords. |
| `disable-model-invocation` | Boolean                                        | `true` = only the user can invoke via `/name`. Claude cannot auto-trigger. Use for side-effect actions (deploy, send messages). Default: `false`.                      |
| `user-invocable`           | Boolean                                        | `false` = hidden from `/` menu. Only Claude can invoke. Use for background knowledge. Default: `true`.                                                                 |
| `allowed-tools`            | String (space-separated) or Array              | Tools Claude can use without permission. Supports patterns: `Bash(npm *)`.                                                                                             |
| `model`                    | String                                         | Override session model. Example: `claude-opus-4-6`.                                                                                                                    |
| `effort`                   | String                                         | Override effort level: `low`, `medium`, `high`, `max`.                                                                                                                 |
| `context`                  | String                                         | `fork` = run in an isolated subagent context.                                                                                                                          |
| `agent`                    | String                                         | Subagent type when `context: fork`. Options: `Explore`, `Plan`, `general-purpose`.                                                                                     |
| `paths`                    | String or Array                                | Glob patterns limiting when this skill activates. Example: `["src/**/*.ts"]`.                                                                                          |
| `shell`                    | String                                         | Shell for `` !`command` `` blocks: `bash` (default) or `powershell`.                                                                                                   |
| `hooks`                    | Object (YAML)                                  | Hooks scoped to the skill's lifecycle.                                                                                                                                 |
| `argument-hint`            | String                                         | Hint shown in autocomplete. Example: `[issue-number]`.                                                                                                                 |
| `version`                  | String                                         | Semantic version. Not read by agents, but allows users to track which version is installed. Always bump on content changes.                                            |
| `license`                  | String                                         | License (informational).                                                                                                                                               |

## Invocation Control

| Config                           | User invokes | Claude invokes |
| -------------------------------- | ------------ | -------------- |
| (default)                        | Yes          | Yes            |
| `disable-model-invocation: true` | Yes          | No             |
| `user-invocable: false`          | No           | Yes            |

## Template Variables

Use these in the markdown content of SKILL.md:

| Variable                | Description                                                                                              |
| ----------------------- | -------------------------------------------------------------------------------------------------------- |
| `$ARGUMENTS`            | All arguments passed after `/skill-name`                                                                 |
| `$ARGUMENTS[N]` or `$N` | Argument by 0-based index                                                                                |
| `${CLAUDE_SESSION_ID}`  | Current session UUID                                                                                     |
| `${CLAUDE_SKILL_DIR}`   | Absolute path to the skill's directory                                                                   |
| `` !`command` ``        | Inline shell injection — command runs **before** Claude sees the prompt, output replaces the placeholder |
| ` ```! `                | Multi-line shell injection — same behavior, for commands spanning multiple lines (see below)             |

If `$ARGUMENTS` is not referenced in the content, Claude Code appends `ARGUMENTS: input` automatically.

### Multi-line shell injection

Use fenced code blocks with `!` as the language for multi-line commands:

````markdown
```!
node --version
npm --version
git status --short
```
````

The output of all commands replaces the block before Claude sees the skill content.

## Skill Locations (by priority)

1. Enterprise (server-managed)
2. `~/.claude/skills/<name>/SKILL.md` — personal, all projects
3. `.claude/skills/<name>/SKILL.md` — project, committed to git
4. `<plugin>/skills/<name>/SKILL.md` — plugin-distributed
5. `.claude/commands/<name>.md` — legacy format

Higher priority wins when names collide. Plugin skills use `plugin-name:skill-name` namespace.

## Writing Guidelines

### Description (the most critical field)

- Write in **third person**: "Use this skill when..." or "TRIGGER when the user..."
- Include **specific keywords** that match what users naturally say
- Clearly state when NOT to trigger to avoid false positives
- Keep under 250 chars — descriptions are truncated beyond that limit

### Content (markdown body)

- Keep SKILL.md between **1,500–2,000 words**
- Move detailed docs to `references/` directory
- Use **imperative style**: "Create the file", "Run the command"
- Reference supporting files: `[see patterns](references/patterns.md)`
- Include "ultrathink" in the content to enable extended thinking

### Structure

- One clear purpose per skill
- Step-by-step instructions Claude can follow autonomously
- Explicit constraints and edge cases
- Reference examples from the `examples/` directory when useful

## Hooks in Skills

Skills can define lifecycle hooks in frontmatter:

```yaml
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "${CLAUDE_SKILL_DIR}/scripts/validate.sh"
          timeout: 30
  PostToolUse:
    - matcher: "Write"
      hooks:
        - type: prompt
          prompt: "Validate the output file"
```

Hook types: `command`, `http`, `prompt`, `agent`.

**Claude Code events:** `SessionStart`, `InstructionsLoaded`, `UserPromptSubmit`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, `PostToolUseFailure`, `PermissionDenied`, `Notification`, `SubagentStart`, `SubagentStop`, `TaskCreated`, `TaskCompleted`, `Stop`, `StopFailure`, `PreCompact`, `PostCompact`, `SessionEnd`, `Elicitation`, `ElicitationResult`, `CwdChanged`, `FileChanged`, `WorktreeCreate`, `WorktreeRemove`, `ConfigChange`, `TeammateIdle`.

**Cursor events:** `beforeSubmitPrompt`, `beforeShellExecution`, `afterShellExecution`, `beforeMCPExecution`, `afterMCPExecution`, `beforeReadFile`, `afterFileEdit`, `beforeTabFileRead`, `afterTabFileEdit`, `afterAgentResponse`, `afterAgentThought`, `stop`.

Note: for skills with `context: fork`, `Stop` hooks are automatically converted to `SubagentStop`.

## Checklist Before Finishing

When creating or editing a skill, verify:

- [ ] `name` is lowercase with hyphens only
- [ ] `description` includes trigger keywords and exclusions
- [ ] `disable-model-invocation: true` is set for side-effect actions
- [ ] `allowed-tools` lists only what is needed
- [ ] Template variables (`$ARGUMENTS`, `$0`, etc.) are used correctly
- [ ] Supporting files in `references/` or `examples/` are referenced in the content
- [ ] Content is between 1,500–2,000 words (or uses `references/` for overflow)
- [ ] `version` is set (semver) — bump patch for typos, minor for new features, major for breaking changes
- [ ] No vague descriptions like "Helps with coding"

For detailed examples, see [examples/](examples/) in this skill's directory.
For the full frontmatter reference, see [references/frontmatter.md](references/frontmatter.md).
