# Example: Background Knowledge Skill

A skill that Claude auto-triggers when relevant context is needed. Not visible in the `/` menu.

## SKILL.md

````yaml
---
name: api-conventions
description: >
  API design patterns and conventions for this project.
  Use when designing API endpoints, writing API clients, or reviewing API code.
user-invocable: false
---

# API Conventions

## Endpoint Naming

- Use kebab-case: `/user-profiles` not `/userProfiles`
- Use plural nouns: `/users` not `/user`
- Nest resources: `/users/{id}/orders`

## Response Format

All API responses follow this structure:

```json
{
  "data": "<payload>",
  "meta": { "page": 1, "total": 100 },
  "errors": []
}
````

## Error Codes

- 400: Validation error (include field-level details)
- 401: Authentication required
- 403: Insufficient permissions
- 404: Resource not found
- 409: Conflict (duplicate, stale update)
- 422: Business rule violation
- 500: Internal error (log to Sentry)

```

## Behavior

Claude will automatically load this skill when the user works on API-related code, without it appearing in the `/` autocomplete menu.
```
