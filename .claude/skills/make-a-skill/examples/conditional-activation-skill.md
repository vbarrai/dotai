# Example: Conditional Activation with `paths`

A skill that only activates when Claude works on files matching specific glob patterns.

## SKILL.md

```yaml
---
name: react-conventions
description: >
  React component conventions and patterns for this project.
  Use when creating, editing, or reviewing React components.
  DO NOT TRIGGER when: editing tests, stories, or non-React files.
user-invocable: false
paths:
  - "src/components/**/*.tsx"
  - "src/hooks/**/*.ts"
  - "src/pages/**/*.tsx"
---

# React Conventions

## Component Structure

- Use functional components with named exports
- Props interface above the component: `interface MyComponentProps { ... }`
- Keep components under 150 lines — extract sub-components if needed

## Hooks

- Custom hooks go in `src/hooks/` with `use` prefix
- Always specify dependency arrays for `useEffect` and `useMemo`
- Prefer `useCallback` for functions passed as props

## Styling

- Use CSS Modules: `import styles from './MyComponent.module.css'`
- No inline styles except for dynamic values
- Follow BEM naming in CSS Modules: `styles.container`, `styles.containerActive`

## File Naming

- Components: PascalCase (`UserProfile.tsx`)
- Hooks: camelCase with `use` prefix (`useAuth.ts`)
- One component per file
```

## Behavior

Claude will only load this skill when the user works on files matching the `paths` patterns (e.g., `src/components/Button.tsx`). It will NOT activate for files outside those directories, even if they contain React code.

Without `paths`, Claude would load this skill anytime it detects React-related work — including test files and stories where these conventions may not apply.
