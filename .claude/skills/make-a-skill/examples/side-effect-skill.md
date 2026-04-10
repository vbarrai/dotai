# Example: Side-Effect Skill (Manual Only)

A skill that performs destructive or visible actions. Only the user can trigger it.

## SKILL.md

```yaml
---
name: deploy
description: Deploy the application to production
disable-model-invocation: true
allowed-tools: Bash(gh *) Bash(npm *) Bash(pnpm *)
---

# Deploy to Production

Deploy the current branch to production.

## Pre-flight Checks

1. Verify all CI checks pass: !`gh pr checks --json name,state`
2. Verify the branch is up to date with master
3. Verify no uncommitted changes exist

## Deploy Process

1. Run `pnpm build` to verify the build succeeds
2. Run `gh workflow run deploy.yml --ref $(git rev-parse --abbrev-ref HEAD)`
3. Monitor the deployment: `gh run list --workflow=deploy.yml --limit 1`

## Post-deploy

1. Verify the deployment health check
2. Notify the team in Slack if the deployment fails
```

## Behavior

Claude will NEVER trigger this skill on its own. The user must explicitly type `/deploy`.
