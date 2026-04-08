---
name: pre-commit-checks
version: 1.0.0
description: >-
  TRIGGER when about to run git commit, git push, gh pr create, or any PR creation command.
  Enforces all quality checks (typecheck, lint, format, tests) before any commit, push, or PR.
  DO NOT TRIGGER for read-only git operations (status, log, diff, branch).
user-invocable: false
---

# Pre-commit Checks

This skill enforces quality gates before any code leaves the working tree. It applies to `git commit`, `git push`, `gh pr create`, and any variant that creates commits or publishes code.

## Required Checks

Before executing any commit or push command, run ALL of the following checks in order. Every check must pass before proceeding.

### 1. TypeScript Type Checking

```
pnpm typecheck
```

Runs `tsc --noEmit`. Fix all type errors before continuing.

### 2. Linting

```
pnpm lint
```

Runs oxlint. Fix all lint violations before continuing.

### 3. Formatting

```
pnpm prettier
```

Checks formatting with Prettier. If it fails, auto-fix with:

```
pnpm prettier:format
```

Then re-run `pnpm prettier` to confirm the fix. Stage any formatting changes.

### 4. Tests

```
npx vitest run
```

Runs the full test suite once (no watch mode). All tests must pass.

## Failure Handling

If any check fails:

1. Do NOT proceed with the commit or push
2. Fix the root cause of the failure
3. Re-run ALL checks from the beginning (not just the one that failed)
4. Only proceed when all four checks pass in sequence

## Branch Protection

You MUST NEVER push directly to the `main` or `master` branch. If the current branch is `main` or `master`:

1. Refuse the push
2. Ask the user to create a feature branch first
3. Only proceed after switching to a non-protected branch

## Scope

This skill applies to any operation that results in code being committed or published:

- `git commit` (including `--amend`)
- `git push` (including `--force`)
- `gh pr create`
- Any workflow that internally creates commits (e.g., merge, rebase with commits)

This skill does NOT apply to read-only git operations like `git status`, `git log`, `git diff`, or `git branch`.
