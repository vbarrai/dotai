import { it, expect, vi } from 'vitest'
import { mocks, mockSpawnSync, lockWith, skill } from './check-test-utils.ts'

vi.mock('../../src/lock.ts', () => ({
  readLock: async () =>
    lockWith({
      'trailing-slash': skill({
        skillFolderHash: 'old',
        sourceUrl: 'https://github.com/owner/repo/',
      }),
    }),
  getGitHubToken: () => null,
  fetchSkillFolderHash: async () => 'new',
}))

it('should strip trailing slash from install URL', async () => {
  mocks.confirm.mockResolvedValueOnce(true)

  const { runCheck } = await import('../../src/check.ts')
  await runCheck()

  const installArgs = mockSpawnSync.mock.calls[0]![1] as string[]
  expect(installArgs).toContain('https://github.com/owner/repo/tree/main/skills/my-skill')
})
