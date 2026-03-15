import { it, expect } from 'vitest'
import { describeConfai } from '../test-utils.ts'

describeConfai('install / multiple skills to single agent', ({ givenSkill, when, targetFiles }) => {
  it('should install two skills to cursor', async () => {
    await givenSkill('lint', 'format')

    await when({ skills: ['lint', 'format'], agents: ['cursor'] })

    expect(await targetFiles()).toMatchInlineSnapshot(`
      [
        ".agents/skills/format/SKILL.md",
        ".agents/skills/lint/SKILL.md",
        ".cursor/skills/format",
        ".cursor/skills/lint",
        "ai-lock.json",
      ]
    `)
  })
})
