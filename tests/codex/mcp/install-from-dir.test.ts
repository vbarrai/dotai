import { it, expect } from 'vitest'
import { describeConfai, mcpLinear } from '../../test-utils.ts'

describeConfai(
  'codex / install MCP from mcps/ directory',
  ({ givenSource, sourceFiles, whenInstall, targetFile, targetHasFiles }) => {
    it('should install an MCP server from mcps/<name>/mcp.json', async () => {
      await givenSource({
        mcpDirs: {
          linear: mcpLinear,
        },
      })

      expect(await sourceFiles()).toMatchInlineSnapshot(`
      [
        "mcps/linear/mcp.json",
      ]
    `)

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
