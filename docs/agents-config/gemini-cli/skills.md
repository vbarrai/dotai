> **maconfai support: Not supported** — Gemini CLI agent is not yet implemented in maconfai. Reference only.

# Gemini CLI — Skills Guide

> Official source: [geminicli.com/docs/cli/skills](https://geminicli.com/docs/cli/skills/)

## Overview

Gemini CLI supports the open Agent Skills standard with progressive disclosure:

| Level         | When Loaded                                                                    | Content                       |
| :------------ | :----------------------------------------------------------------------------- | :---------------------------- |
| **Discovery** | At startup                                                                     | `name` and `description` only |
| **Injection** | When relevant — `SKILL.md` body and folder structure are injected into history | Full SKILL.md body            |
| **Execution** | On demand                                                                      | Scripts, resources, assets    |

## Locations

| Scope     | Path                                  | Alias                              |
| :-------- | :------------------------------------ | :--------------------------------- |
| Workspace | `.gemini/skills/<name>/SKILL.md`      | `.agents/skills/<name>/SKILL.md`   |
| User      | `~/.gemini/skills/<name>/SKILL.md`    | `~/.agents/skills/<name>/SKILL.md` |
| Extension | Bundled inside an installed extension | —                                  |

**Priority**: Workspace > User > Extension. The `.agents/skills/` alias takes priority over `.gemini/skills/` within the same tier.

**Compatibility**: the `.agents/skills/` directory is shared with Claude Code without modification.

## SKILL.md Format

```yaml
---
name: my-skill
description: What the skill does and when to use it.
---
Instructions for the agent...
```

> **Important**: Gemini CLI only recognizes `name` and `description` in the frontmatter. No additional fields like `version`, `mode`, or `disable-model-invocation` (those are specific to Claude Code).

## Activation Lifecycle

1. **Discovery**: Only `name` and `description` are loaded at startup
2. **Identification**: Gemini autonomously decides to use a skill based on the prompt and description
3. **Consent**: A confirmation prompt appears (name, purpose, directory path)
4. **Injection**: `SKILL.md` body and folder structure are added to conversation history
5. **Execution**: Scripts and resources are loaded on demand

> **Security**: All skill and extension activations require explicit user consent via the policy engine.

## Invocation Control

Gemini CLI does **not** support frontmatter-based invocation control (no `disable-model-invocation`, `user-invocable`, or `allowed-tools` fields). The only recognized frontmatter fields are `name` and `description`.

However, Gemini CLI provides **runtime skill management** via slash commands:

| Command                  | Description                                        |
| :----------------------- | :------------------------------------------------- |
| `/skills`                | List all available skills and their current status |
| `/skills list`           | List skills (explicit form)                        |
| `/skills disable <name>` | Disable a skill for the current session            |
| `/skills enable <name>`  | Re-enable a previously disabled skill              |
| `/skills link <path>`    | Symlink a skill from a local directory             |
| `/skills reload`         | Refresh skill discovery                            |

And via terminal commands:

| Command                              | Description                                  |
| :----------------------------------- | :------------------------------------------- |
| `gemini skills list`                 | List all installed skills                    |
| `gemini skills link <path> --scope ` | Symlink a local skill (`workspace` / `user`) |
| `gemini skills install <src>`        | Install from URL, path, or `.skill` bundle   |
| `gemini skills uninstall <name>`     | Uninstall a skill                            |
| `gemini skills enable <name>`        | Enable a skill                               |
| `gemini skills disable <name>`       | Disable a skill                              |

All skill activations require **explicit user consent** via the policy engine — Gemini always prompts for confirmation before injecting a skill.

## Built-in Skills

- **skill-creator**: helps create new skills (v0.25.0+, built-in since v0.26.0+)

## No `agents/google.yaml`

Unlike Codex which has an `agents/openai.yaml` file for UI metadata and invocation policy, Gemini CLI **does not have** an equivalent. All skill configuration goes through the `SKILL.md` frontmatter.

## Sources

- [Agent Skills](https://geminicli.com/docs/cli/skills/)
- [Creating Agent Skills](https://geminicli.com/docs/cli/creating-skills/)
- [Agent Skills Standard](https://agentskills.io)
