import { it, expect } from 'vitest'
import { describeConfai, skillFile } from '../test-utils.ts'

describeConfai(
  'install / single skill to single agent',
  ({ givenSkill, when, targetFile, targetFiles }) => {
    it('should install one skill to claude-code', async () => {
      await givenSkill('my-skill')

      await when({ skills: ['my-skill'], agents: ['claude-code'] })

      expect(await targetFiles()).toMatchInlineSnapshot(`
      [
        ".agents/skills/my-skill/SKILL.md",
        ".claude/skills/my-skill",
        "ai-lock.json",
      ]
    `)

      expect(await targetFile('.agents/skills/my-skill/SKILL.md')).toMatchInlineSnapshot(`
      "---
      name: my-skill
      description: my skill
      ---
      my skill"
    `)
    })
  },
)
