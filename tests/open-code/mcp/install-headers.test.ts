import { it, expect } from 'vitest'
import { describeConfai, mcpCustomApi } from '../../test-utils.ts'

describeConfai('open-code / url with headers', ({ givenSource, whenInstall, targetFile }) => {
  it('keeps env vars bare in headers for opencode.json', async () => {
    await givenSource({
      mcps: {
        'custom-api': mcpCustomApi,
      },
    })

    await whenInstall({ mcps: ['custom-api'], agents: ['open-code'] })

    expect(await targetFile('opencode.json')).toMatchInlineSnapshot(`
      "{
        "mcp": {
          "custom-api": {
            "type": "remote",
            "url": "https://api.example.com/mcp",
            "headers": {
              "Authorization": "Bearer \${API_TOKEN}",
              "X-Team-Id": "\${TEAM_ID}"
            }
          }
        }
      }
      "
    `)
  })
})
