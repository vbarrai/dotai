import { it, expect, vi } from 'vitest'
import { mocks, mockSpawnSync, getLogs, lockWith, skill } from './check-test-utils.ts'

vi.mock('../../src/lock.ts', () => ({
  readLock: async () =>
    lockWith({
      'outdated-skill': skill({ skillFolderHash: 'old-hash' }),
    }),
  getGitHubToken: () => null,
  fetchSkillFolderHash: async () => 'new-hash',
}))

it('should skip updates when user cancels', async () => {
  const cancelSymbol = Symbol('cancel')
  mocks.confirm.mockResolvedValueOnce(cancelSymbol as any)
  ;(mocks.isCancel as any).mockImplementation((v: unknown) => v === cancelSymbol)

  const { runCheck } = await import('../../src/check.ts')
  await runCheck()

  expect(getLogs()).toMatchInlineSnapshot(`
    "info: 1 update(s) available:
    message:   * outdated-skill (owner/repo)
    info: Skipped updates."
  `)
  expect(mockSpawnSync).not.toHaveBeenCalled()
})
