import { it, expect } from 'vitest'
import { describeConfai } from '../test-utils.ts'

describeConfai(
  'discover / root-dirs layout (<name>/SKILL.md)',
  ({ givenSource, whenInstall, targetHasFiles }) => {
    it('should discover skills from subdirectories at root level', async () => {
      await givenSource({
        skills: [{ name: 'lint' }, { name: 'format' }],
        skillLayout: 'root-dirs',
      })

      await whenInstall({ skills: ['lint', 'format'], agents: ['claude-code'] })

      await targetHasFiles(
        '.agents/skills/lint/SKILL.md',
        '.agents/skills/format/SKILL.md',
        '.claude/skills/lint',
        '.claude/skills/format',
      )
    })
  },
)
