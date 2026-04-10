import { it, expect } from 'vitest'
import { describeConfai, mcpGithubWithEnv } from '../../test-utils.ts'

describeConfai('codex / env var kept bare', ({ givenSource, whenInstall, targetFile }) => {
  it('keeps ${VAR} bare in config.toml (no translation)', async () => {
    await givenSource({
      mcps: {
        github: mcpGithubWithEnv,
      },
    })

    await whenInstall({ mcps: ['github'], agents: ['codex'] })

    expect(await targetFile('.codex/config.toml')).toMatchInlineSnapshot(`
      "[mcp_servers.github]
      command = "npx"
      args = ["-y", "@modelcontextprotocol/server-github"]
      env = { GITHUB_TOKEN = "\${GITHUB_TOKEN}", GITHUB_ORG = "\${GITHUB_ORG}" }
      "
    `)
  })
})
