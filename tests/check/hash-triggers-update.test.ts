import { it, expect, vi } from 'vitest'
import { mocks, getLogs, lockWith, skill } from './check-test-utils.ts'

vi.mock('../../src/lock.ts', () => ({
  readLock: async () =>
    lockWith({
      'changed-skill': skill({ skillFolderHash: 'aaa111' }),
      'unchanged-skill': skill({ skillFolderHash: 'bbb222' }),
      'no-hash-skill': skill({ skillFolderHash: '', skillPath: 'skills/no-hash-skill' }),
    }),
  getGitHubToken: () => null,
  fetchSkillFolderHash: async (_source: string, path: string) => {
    if (path.includes('changed-skill')) return 'new-hash-999'
    return 'bbb222'
  },
}))

it('should only flag skills with changed hash as needing update', async () => {
  mocks.confirm.mockResolvedValueOnce(false)
  const { runCheck } = await import('../../src/check.ts')
  await runCheck()

  expect(getLogs()).toMatchInlineSnapshot(`
    "info: 1 update(s) available:
    message:   * changed-skill (owner/repo)
    info: Skipped updates."
  `)
})
