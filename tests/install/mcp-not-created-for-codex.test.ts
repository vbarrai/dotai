import { it, expect } from 'vitest'
import { describeConfai } from '../test-utils.ts'

describeConfai(
  'install / MCP created for codex in TOML format',
  ({ givenSource, whenInstall, targetHasFiles, targetFile }) => {
    it('should install skill and MCP config for codex in .codex/config.toml', async () => {
      await givenSource({
        skills: [{ name: 'with-mcp' }],
        mcpDirs: {
          github: { command: 'npx', args: ['-y', '@mcp/github'] },
        },
      })

      await whenInstall({ skills: ['with-mcp'], mcps: ['github'], agents: ['codex'] })

      await targetHasFiles(
        '.agents/skills/with-mcp/SKILL.md',
        '.codex/skills/with-mcp',
        '.codex/config.toml',
      )

      expect(await targetFile('.codex/config.toml')).toMatchInlineSnapshot(`
      "[mcp_servers.github]
      command = "npx"
      args = ["-y", "@mcp/github"]
      "
    `)
    })
  },
)
