import { it, expect } from 'vitest'
import { describeConfai } from '../test-utils.ts'

describeConfai(
  'install / switch from one agent to another',
  ({ givenSkill, when, targetFiles }) => {
    it('should add codex while keeping claude-code files', async () => {
      await givenSkill('portable')

      await when({ agents: ['claude-code'] })

      expect(await targetFiles()).toMatchInlineSnapshot(`
      [
        ".agents/skills/portable/SKILL.md",
        ".claude/skills/portable",
        "ai-lock.json",
      ]
    `)

      await when({ agents: ['codex'] })

      expect(await targetFiles()).toMatchInlineSnapshot(`
      [
        ".agents/skills/portable/SKILL.md",
        ".claude/skills/portable",
        ".codex/skills/portable",
        "ai-lock.json",
      ]
    `)
    })
  },
)
