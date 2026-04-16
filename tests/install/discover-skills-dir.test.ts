import { it, expect } from 'vitest'
import { describeConfai } from '../test-utils.ts'

describeConfai(
  'discover / skills-dir layout (skills/<name>/SKILL.md)',
  ({ givenSource, whenInstall, targetHasFiles }) => {
    it('should discover skills inside skills/ directory', async () => {
      await givenSource({
        skills: [{ name: 'lint' }, { name: 'format' }],
        skillLayout: 'skills-dir',
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
