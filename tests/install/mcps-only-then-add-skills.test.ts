import { it, expect } from 'vitest'
import { describeConfai } from '../test-utils.ts'

describeConfai(
  'install / MCPs first, then add skills on second install',
  ({ givenSource, when, targetFiles }) => {
    it('should keep MCPs when adding skills', async () => {
      await givenSource({
        skills: [{ name: 'lint' }],
        mcps: {
          github: { command: 'npx', args: ['-y', '@mcp/github'] },
        },
      })

      // First install — MCPs only, no skills
      await when({ skills: [], mcps: ['github'], agents: ['claude-code'] })

      expect(await targetFiles()).toMatchInlineSnapshot(`
        [
          ".agents/skills/lint/SKILL.md",
          ".claude/skills/lint",
          ".mcp.json",
          "ai-lock.json",
        ]
      `)

      // Second install — add skills + keep MCPs
      await when({ skills: ['lint'], mcps: ['github'], agents: ['claude-code'] })

      expect(await targetFiles()).toMatchInlineSnapshot(`
        [
          ".agents/skills/lint/SKILL.md",
          ".claude/skills/lint",
          ".mcp.json",
          "ai-lock.json",
        ]
      `)
    })
  },
)
