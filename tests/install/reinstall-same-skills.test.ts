import { it, expect } from 'vitest'
import { describeConfai, skillFile } from '../test-utils.ts'

describeConfai(
  'install / reinstall same skills',
  ({ givenSkill, when, targetFile, targetFiles }) => {
    it('should produce identical file tree on second install', async () => {
      await givenSkill('my-skill')

      await when({ skills: ['my-skill'], agents: ['claude-code'] })
      const firstRun = await targetFiles()

      await when({ skills: ['my-skill'], agents: ['claude-code'] })
      const secondRun = await targetFiles()

      expect(firstRun).toEqual(secondRun)

      expect(await targetFile('.claude/skills/my-skill/SKILL.md')).toMatchInlineSnapshot(`
      "---
      name: my-skill
      description: my skill
      ---
      my skill"
    `)
    })
  },
)
