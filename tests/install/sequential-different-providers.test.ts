import { it, expect } from 'vitest'
import { describeConfai } from '../test-utils.ts'

describeConfai(
  'install / sequential installs from different providers merge',
  ({ givenSource, when, targetFile, targetFiles }) => {
    it('should merge MCPs from two sequential installs', async () => {
      // First provider — github MCP
      await givenSource({
        mcps: { github: { command: 'npx', args: ['-y', '@mcp/github'] } },
      })

      await when({ mcps: ['github'], agents: ['claude-code'] })

      // Second provider — sentry MCP
      await givenSource({
        mcps: { sentry: { command: 'npx', args: ['-y', '@mcp/sentry'] } },
      })

      await when({ mcps: ['sentry'], agents: ['claude-code'] })

      const mcp = JSON.parse(await targetFile('.mcp.json'))
      expect(Object.keys(mcp.mcpServers).sort()).toMatchInlineSnapshot(`
        [
          "github",
          "sentry",
        ]
      `)
    })
  },
)
