import { it, expect, vi } from 'vitest'
import { mocks, mockSpawnSync, lockWith, skill } from './check-test-utils.ts'

vi.mock('../../src/lock.ts', () => ({
  readLock: async () =>
    lockWith({
      'no-ref': skill({
        skillFolderHash: 'old',
        ref: undefined,
      }),
    }),
  getGitHubToken: () => null,
  fetchSkillFolderHash: async () => 'new',
}))

it('should use main as default branch when no ref', async () => {
  mocks.confirm.mockResolvedValueOnce(true)

  const { runCheck } = await import('../../src/check.ts')
  await runCheck()

  const installArgs = mockSpawnSync.mock.calls[0]![1] as string[]
  expect(installArgs).toContain('https://github.com/owner/repo/tree/main/skills/my-skill')
  expect(installArgs).not.toContain(expect.stringContaining('--branch'))
})
