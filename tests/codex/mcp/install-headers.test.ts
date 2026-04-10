import { it, expect } from 'vitest'
import { describeConfai, mcpCustomApi } from '../../test-utils.ts'

describeConfai('codex / url with headers', ({ givenSource, whenInstall, targetFile }) => {
  it('translates headers to http_headers and env_http_headers', async () => {
    await givenSource({
      mcps: {
        'custom-api': mcpCustomApi,
      },
    })

    await whenInstall({ mcps: ['custom-api'], agents: ['codex'] })

    expect(await targetFile('.codex/config.toml')).toMatchInlineSnapshot(`
      "[mcp_servers.custom-api]
      url = "https://api.example.com/mcp"
      env_http_headers = { Authorization = "API_TOKEN", X-Team-Id = "TEAM_ID" }
      "
    `)
  })
})
