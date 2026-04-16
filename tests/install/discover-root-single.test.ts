import { it, expect } from 'vitest'
import { describeConfai, skillFile } from '../test-utils.ts'

describeConfai(
  'discover / root-single layout (SKILL.md at root)',
  ({ givenSource, whenInstall, targetFile, targetHasFiles }) => {
    it('should discover a single skill from root SKILL.md', async () => {
      await givenSource({
        skills: [{ name: 'my-skill' }],
        skillLayout: 'root-single',
      })

      await whenInstall({ skills: ['my-skill'], agents: ['claude-code'] })

      await targetHasFiles(
        '.agents/skills/my-skill/SKILL.md',
        '.claude/skills/my-skill',
        'ai-lock.json',
      )

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
