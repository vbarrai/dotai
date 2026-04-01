import { it, expect, vi } from 'vitest'
import { mocks, mockSpawnSync, getLogs, lockWith, skill } from './check-test-utils.ts'

vi.mock('../../src/lock.ts', () => ({
  readLock: async () =>
    lockWith({
      'failing-skill': skill({ skillFolderHash: 'old-hash' }),
    }),
  getGitHubToken: () => null,
  fetchSkillFolderHash: async () => 'new-hash',
}))

it('should report failed subprocess update', async () => {
  mockSpawnSync.mockReturnValue({ status: 1 })
  mocks.confirm.mockResolvedValueOnce(true)

  const { runCheck } = await import('../../src/check.ts')
  await runCheck()

  expect(getLogs()).toMatchInlineSnapshot(`
    "info: 1 update(s) available:
    message:   * failing-skill (owner/repo)
    error: Failed to update failing-skill
    error: Failed: 1"
  `)
})
