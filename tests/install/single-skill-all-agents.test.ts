import { it, expect } from 'vitest'
import { describeConfai } from '../test-utils.ts'

describeConfai('install / single skill to all agents', ({ givenSkill, when, targetFiles }) => {
  it('should install one skill to claude-code, cursor, and codex', async () => {
    await givenSkill('shared')

    await when({ skills: ['shared'], agents: ['claude-code', 'cursor', 'codex'] })

    expect(await targetFiles()).toMatchInlineSnapshot(`
      [
        ".agents/skills/shared/SKILL.md",
        ".claude/skills/shared",
        ".codex/skills/shared",
        ".cursor/skills/shared",
        "ai-lock.json",
      ]
    `)
  })
})
