# Example: Simple Task Skill

A user-invoked skill with arguments.

## SKILL.md

```yaml
---
name: fix-issue
description: >
  Fix a GitHub issue by analyzing it and applying code changes.
  TRIGGER when: the user asks to fix a GitHub issue or references an issue number.
  DO NOT TRIGGER when: the user is just discussing issues without asking to fix them.
allowed-tools: Read Edit Write Grep Glob Bash(gh *)
argument-hint: [issue-number]
---

# Fix GitHub Issue

Fix GitHub issue #$0.

## Context

- Issue details: !`gh issue view $0 --json title,body,labels,comments`
- Related files: !`gh issue view $0 --json body --jq .body | grep -oE '[\w/]+\.\w+' | head -20`

## Process

1. Read the issue description and comments
2. Identify the root cause
3. Implement the fix following project conventions
4. Add or update tests if applicable
5. Verify the fix compiles and tests pass
```

## Usage

```
/fix-issue 123
```
