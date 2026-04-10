# Example: Skill with Hooks

A skill that validates actions through lifecycle hooks.

## SKILL.md

```yaml
---
name: safe-migration
description: >
  Run database migrations with safety validation.
  TRIGGER when: the user asks to run, create, or apply database migrations.
  DO NOT TRIGGER when: just discussing migration strategy.
disable-model-invocation: true
allowed-tools: Bash(pnpm *) Read Edit Write
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "${CLAUDE_SKILL_DIR}/scripts/validate-migration.sh"
          timeout: 30
  PostToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "${CLAUDE_SKILL_DIR}/scripts/log-migration.sh"
---

# Safe Database Migration

Run database migrations with automatic safety checks.

## Process

1. Read the pending migration files
2. Validate they are reversible
3. Run migrations against the development database
4. Verify the schema is consistent
5. Log the migration result

The PreToolUse hook automatically validates every bash command before execution.
The PostToolUse hook logs every command result for audit.
```

## scripts/validate-migration.sh

```bash
#!/bin/bash
COMMAND=$(echo "$1" | jq -r '.tool_input.command')

# Block destructive commands
if echo "$COMMAND" | grep -qE 'DROP TABLE|TRUNCATE|DELETE FROM.*WHERE 1'; then
  echo '{"hookSpecificOutput":{"permissionDecision":"deny","reason":"Destructive SQL blocked"}}'
  exit 1
fi
exit 0
```
