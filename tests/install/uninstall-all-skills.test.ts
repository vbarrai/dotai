import { it, expect } from 'vitest'
import { describeConfai } from '../test-utils.ts'

describeConfai(
  'install / deselecting all skills removes everything',
  ({ givenSkill, when, targetFiles }) => {
    it('should remove all skills when none are selected', async () => {
      await givenSkill('old-a', 'old-b', 'new-c')

      await when({ skills: ['old-a', 'old-b'], agents: ['claude-code'] })

      expect(await targetFiles()).toMatchInlineSnapshot(`
        [
          ".agents/skills/old-a/SKILL.md",
          ".agents/skills/old-b/SKILL.md",
          ".claude/skills/old-a",
          ".claude/skills/old-b",
          "ai-lock.json",
        ]
      `)

      await when({ skills: ['new-c'], agents: ['claude-code'] })

      expect(await targetFiles()).toMatchInlineSnapshot(`
        [
          ".agents/skills/new-c/SKILL.md",
          ".claude/skills/new-c",
          "ai-lock.json",
        ]
      `)
    })
  },
)
