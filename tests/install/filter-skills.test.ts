import { it, expect } from 'vitest'
import { describeConfai } from '../test-utils.ts'

describeConfai('install / --skills filter', ({ givenSkill, when, targetFiles }) => {
  it('should only install the selected skill', async () => {
    await givenSkill('wanted', 'unwanted')

    await when({ skills: ['wanted'], agents: ['claude-code'] })

    expect(await targetFiles()).toMatchInlineSnapshot(`
      [
        ".agents/skills/wanted/SKILL.md",
        ".claude/skills/wanted",
        "ai-lock.json",
      ]
    `)
  })
})
