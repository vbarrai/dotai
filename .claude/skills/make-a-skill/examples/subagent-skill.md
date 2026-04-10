# Example: Subagent Skill (Isolated Context)

A skill that runs in a forked subagent for heavy research without polluting the main conversation.

## SKILL.md

```yaml
---
name: analyze-dependencies
description: >
  Analyze project dependencies for security issues, outdated packages, and unused imports.
  Use when the user asks about dependency health, security audit, or package cleanup.
context: fork
agent: Explore
allowed-tools: Read Grep Glob Bash(npm *) Bash(pnpm *)
---

# Dependency Analysis

Perform a thorough dependency analysis of the project.

## Tasks

1. **Security audit**: Run `pnpm audit` and categorize vulnerabilities by severity
2. **Outdated packages**: Run `pnpm outdated` and identify critical updates
3. **Unused dependencies**: Cross-reference `package.json` deps with actual imports in `src/`
4. **Duplicate packages**: Check for multiple versions of the same package

## Output

Return a structured report with:
- Critical security issues (must fix)
- Recommended updates (should fix)
- Unused packages (can remove)
- Duplicate packages (can deduplicate)
```

## Behavior

Runs in an isolated subagent (`context: fork` + `agent: Explore`). The subagent has no access to the main conversation history. Results are summarized and returned to the main conversation.
