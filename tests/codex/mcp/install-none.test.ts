import { it, expect } from 'vitest'
import { describeConfai, mcpGithub } from '../../test-utils.ts'

describeConfai('codex / install zero MCPs', ({ givenSource, whenInstall, targetFiles }) => {
  it('installs nothing when mcps is empty', async () => {
    await givenSource({
      mcps: {
        github: mcpGithub,
      },
    })

    await whenInstall({ mcps: [], agents: ['codex'] })

    expect(await targetFiles()).toHaveLength(0)
  })
})
