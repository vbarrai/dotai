import { it, expect, vi } from 'vitest'
import { mocks, mockSpawnSync, lockWith, skill } from './check-test-utils.ts'

vi.mock('../../src/lock.ts', () => ({
  readLock: async () =>
    lockWith({
      'deep-skill': skill({
        skillFolderHash: 'old',
        skillPath: 'skills/my-skill/SKILL.md',
        ref: 'main',
      }),
    }),
  getGitHubToken: () => null,
  fetchSkillFolderHash: async () => 'new',
}))

it('should reconstruct full URL with skill path', async () => {
  mocks.confirm.mockResolvedValueOnce(true)

  const { runCheck } = await import('../../src/check.ts')
  await runCheck()

  const installArgs = mockSpawnSync.mock.calls[0]![1] as string[]
  expect(installArgs).toContain('https://github.com/owner/repo/tree/main/skills/my-skill')
  expect(installArgs).toContain('--skills=deep-skill')
  expect(installArgs).toContain('--branch=main')
})
