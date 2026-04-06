import { it, expect } from 'vitest'
import { describeConfai, mcpLinear } from '../../test-utils.ts'

describeConfai(
  'codex / skip existing MCP',
  ({ givenSource, whenInstall, targetFile, targetHasFiles }) => {
    it('should preserve existing MCP server in config.toml', async () => {
      await givenSource({
        mcps: {
          linear: mcpLinear,
        },
      })

      // First install
      await whenInstall({ mcps: ['linear'], agents: ['codex'] })
      await targetHasFiles('.codex/config.toml')

      // Second install with same name — should skip
      await whenInstall({ mcps: ['linear'], agents: ['codex'] })

      expect(await targetFile('.codex/config.toml')).toMatchInlineSnapshot(`
      "[mcp_servers.linear]
      command = "npx"
      args = ["-y", "mcp-remote", "https://mcp.linear.app/mcp"]
      "
    `)
    })
  },
)
