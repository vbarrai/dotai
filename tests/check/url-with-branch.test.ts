import { it, expect, vi } from 'vitest'
import { mocks, mockSpawnSync, lockWith, skill } from './check-test-utils.ts'

vi.mock('../../src/lock.ts', () => ({
  readLock: async () =>
    lockWith({
      branched: skill({
        skillFolderHash: 'old',
        ref: 'develop',
      }),
    }),
  getGitHubToken: () => null,
  fetchSkillFolderHash: async () => 'new',
}))

it('should include branch in URL and --branch flag', async () => {
  mocks.confirm.mockResolvedValueOnce(true)

  const { runCheck } = await import('../../src/check.ts')
  await runCheck()

  const installArgs = mockSpawnSync.mock.calls[0]![1] as string[]
  expect(installArgs).toContain('https://github.com/owner/repo/tree/develop/skills/my-skill')
  expect(installArgs).toContain('--branch=develop')
})
