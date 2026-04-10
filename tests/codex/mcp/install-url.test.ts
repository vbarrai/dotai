import { it, expect } from 'vitest'
import { describeConfai, mcpLinearUrl } from '../../test-utils.ts'

describeConfai('codex / install URL-based MCP', ({ givenSource, whenInstall, targetFile }) => {
  it('should install a URL-based MCP server in config.toml', async () => {
    await givenSource({
      mcps: {
        linear: mcpLinearUrl,
      },
    })

    await whenInstall({ mcps: ['linear'], agents: ['codex'] })

    expect(await targetFile('.codex/config.toml')).toMatchInlineSnapshot(`
      "[mcp_servers.linear]
      url = "https://mcp.linear.app/sse"
      "
    `)
  })
})
