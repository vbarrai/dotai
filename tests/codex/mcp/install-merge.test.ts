import { it, expect } from 'vitest'
import { describeConfai, mcpGithub, mcpLinear } from '../../test-utils.ts'

describeConfai(
  'codex / sequential installs merge MCPs',
  ({ givenSource, whenInstall, targetFile }) => {
    it('merges MCP servers from two sequential installs', async () => {
      await givenSource({ mcps: { github: mcpGithub } })
      await whenInstall({ mcps: ['github'], agents: ['codex'] })

      await givenSource({ mcps: { linear: mcpLinear } })
      await whenInstall({ mcps: ['linear'], agents: ['codex'] })

      expect(await targetFile('.codex/config.toml')).toMatchInlineSnapshot(`
      "[mcp_servers.github]
      command = "npx"
      args = ["-y", "@modelcontextprotocol/server-github"]

      [mcp_servers.linear]
      command = "npx"
      args = ["-y", "mcp-remote", "https://mcp.linear.app/mcp"]
      "
    `)
    })
  },
)
