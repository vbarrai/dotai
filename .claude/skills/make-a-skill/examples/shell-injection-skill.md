# Example: Skill with Shell Injection

A skill that injects dynamic context from shell commands before Claude sees the prompt.

## SKILL.md

```yaml
---
name: changelog-generator
description: >
  Generate a changelog from recent commits and PR merges.
  TRIGGER when: the user asks to generate a changelog or release notes.
allowed-tools: Read Grep Glob Bash(gh *) Bash(git *)
argument-hint: [since-tag]
---

# Changelog Generator

Generate a changelog since tag $0.

## Context

**Merged PRs since tag:**
!`gh pr list --state merged --search "merged:>=$(git log -1 --format=%ai $0 2>/dev/null | cut -d' ' -f1)" --json number,title,author --jq '.[] | "- #\(.number) \(.title) (@\(.author.login))"'`

**Commits since tag:**
!`git log $0..HEAD --oneline --no-merges`

## Instructions

1. Group changes by category (Features, Bug Fixes, Improvements, Breaking Changes)
2. Write user-facing descriptions, not commit messages
3. Include PR numbers for reference
4. Highlight breaking changes prominently
```

## How Shell Injection Works

The `` !`command` `` blocks execute **before** Claude receives the skill content. The output replaces the placeholder inline. Claude sees the actual data, not the commands.
