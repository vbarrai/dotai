---
name: update-coverage-badge
version: 1.0.0
description: >-
  TRIGGER when the user asks about coverage, test coverage, coverage percentage, or coverage report.
  Runs tests with coverage and updates the coverage badge in README.md.
  DO NOT TRIGGER for regular test runs without coverage.
disable-model-invocation: true
---

# Update Coverage Badge

Run the test suite with coverage instrumentation and update the coverage badge in `README.md` to reflect the current line coverage percentage.

## Steps

### 1. Generate Coverage Data

Run the coverage command:

```
pnpm coverage
```

This executes the full test suite with coverage collection enabled.

### 2. Read Coverage Results

Read the file `coverage/coverage-summary.json` and extract the value at `total.lines.pct`. This is the overall line coverage percentage.

If the file does not exist or cannot be parsed, report an error and stop.

### 3. Report to the User

Display the coverage percentage to the user before making any changes.

### 4. Determine Badge Color

Select the badge color based on the coverage threshold:

| Coverage      | Color         |
| :------------ | :------------ |
| >= 80%        | `brightgreen` |
| >= 60%        | `green`       |
| >= 40%        | `yellow`      |
| < 40%         | `red`         |

### 5. Update the Badge in README.md

In `README.md`, locate the line containing `![Coverage]` and replace the entire badge image URL with:

```
![Coverage](https://img.shields.io/badge/coverage-{pct}%25-{color})
```

Where `{pct}` is the rounded coverage percentage (e.g., `87`) and `{color}` is the color from the table above.

### 6. Commit If Changed

- If the badge value changed from the previous value, commit the change directly to the current branch with the message: `chore: update coverage badge to {pct}%`
- If the badge value did not change, report the current coverage and do not create a commit

## Edge Cases

- If `README.md` does not contain a `![Coverage]` badge, inform the user and do not modify the file
- If the test suite fails, report the failing tests and do not update the badge
- If `coverage/coverage-summary.json` is missing, suggest running `pnpm coverage` manually to diagnose
- Do not modify any file other than `README.md`
