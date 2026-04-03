import { it, expect, vi } from 'vitest'
import { mocks, mockCloneRepo, getLogs, lockWith, skill } from './check-test-utils.ts'

vi.mock('../../src/lock.ts', () => ({
  readLock: async () =>
    lockWith({
      'outdated-skill': skill({ skillFolderHash: 'old-hash' }),
    }),
  getGitHubToken: () => null,
  fetchSkillFolderHash: async () => 'new-hash',
}))

it('should skip updates when user declines', async () => {
  mocks.confirm.mockResolvedValueOnce(false)

  const { runCheck } = await import('../../src/check.ts')
  await runCheck()

  expect(getLogs()).toMatchInlineSnapshot(`
    "info: 1 update(s) available:
    message:   * outdated-skill (owner/repo)
    info: Skipped updates."
  `)
  expect(mockCloneRepo).not.toHaveBeenCalled()
})
