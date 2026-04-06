import { it, expect } from 'vitest'
import { describeConfai, mcpLinear } from '../../test-utils.ts'

describeConfai(
  'open-code / install MCP from mcps/ directory',
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

      await whenInstall({ mcps: ['linear'], agents: ['open-code'] })

      await targetHasFiles('opencode.json', 'ai-lock.json')

      expect(await targetFile('opencode.json')).toMatchInlineSnapshot(`
      "{
        "mcp": {
          "linear": {
            "type": "local",
            "command": [
              "npx",
              "-y",
              "mcp-remote",
              "https://mcp.linear.app/mcp"
            ]
          }
        }
      }
      "
    `)
    })
  },
)
