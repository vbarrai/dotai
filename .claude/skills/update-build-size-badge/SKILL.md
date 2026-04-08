---
name: update-build-size-badge
version: 1.0.0
description: >-
  TRIGGER when the user asks about the build size, bundle size, output size, or package weight.
  Builds the project and updates the build size badge in README.md.
  DO NOT TRIGGER for general build commands or test runs.
disable-model-invocation: true
---

# Update Build Size Badge

Build the project and update the build size badge in `README.md` to reflect the current minified+gzipped output size.

## Steps

### 1. Build the Project

Run the build command and capture the full output:

```
pnpm build
```

### 2. Extract the Build Size

Parse the build output for a line matching the pattern `X kB min+gzipped`. Look for a number (integer or decimal) followed by `kB` and `min+gzipped`. This value represents the total minified and gzipped bundle size.

If the pattern is not found, report an error to the user and stop.

### 3. Report to the User

Display the extracted build size to the user before making any changes.

### 4. Update the Badge in README.md

In `README.md`, locate the line containing `![Build Size]` and replace the entire badge image URL with:

```
![Build Size](https://img.shields.io/badge/build%20size-{size}%20kB%20min%2Bgzip-blue)
```

Where `{size}` is the extracted value (e.g., `90.8`). Ensure proper URL encoding:
- Spaces → `%20`
- `+` → `%2B`
- `%` → `%25`

### 5. Commit If Changed

- If the badge value changed from the previous value, commit the change directly to the current branch with the message: `chore: update build size badge to {size} kB`
- If the badge value did not change, report the current build size and do not create a commit

## Edge Cases

- If `README.md` does not contain a `![Build Size]` badge, inform the user and do not modify the file
- If the build fails, report the error output and do not modify the badge
- Do not modify any file other than `README.md`
