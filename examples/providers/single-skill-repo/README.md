# single-skill-repo

Provider repository with a **single skill at the root** (no `skills/` subdirectory).

## Structure

```
SKILL.md                  # git-wizard skill (at the root, not in skills/)
```

## What it demonstrates

- Fallback discovery: when no `skills/` directory exists, maconfai looks for a `SKILL.md` at the root
- Useful for simple, single-purpose skill repositories

## Quick test

```bash
# Install to project-b for Claude Code
cd examples/consumers/project-b
node --experimental-strip-types ../../../src/cli.ts install ../../providers/single-skill-repo -y --agents=claude-code

# Check results
cat .claude/skills/git-wizard/SKILL.md   # "git expert assistant"
ls -la .claude/skills/git-wizard         # symlink → ../../.agents/skills/git-wizard

# Cleanup
rm -rf .agents .claude .cursor .codex
```
