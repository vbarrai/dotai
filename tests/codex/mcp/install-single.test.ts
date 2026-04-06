import { it, expect } from 'vitest'
import { describeConfai, mcpLinear } from '../../test-utils.ts'

describeConfai(
  'codex / install single MCP',
  ({ givenSource, whenInstall, targetFile, targetHasFiles }) => {
    it('should install a simple mcp server in .codex/config.toml', async () => {
      await givenSource({
        mcps: {
          linear: mcpLinear,
        },
      })

      await whenInstall({ mcps: ['linear'], agents: ['codex'] })

      await targetHasFiles('.codex/config.toml', 'ai-lock.json')

      expect(await targetFile('.codex/config.toml')).toMatchInlineSnapshot(`
      "[mcp_servers.linear]
      command = "npx"
      args = ["-y", "mcp-remote", "https://mcp.linear.app/mcp"]
      "
    `)
    })
  },
)
