import { it, expect, vi } from 'vitest'
import { mocks, mockSpawnSync, getLogs, lockWith, skill } from './check-test-utils.ts'

vi.mock('../../src/lock.ts', () => ({
  readLock: async () =>
    lockWith({
      'skill-a': skill({
        skillFolderHash: 'old-a',
        source: 'alice/repo-a',
        sourceUrl: 'https://github.com/alice/repo-a',
      }),
      'skill-b': skill({
        skillFolderHash: 'old-b',
        source: 'bob/repo-b',
        sourceUrl: 'https://github.com/bob/repo-b',
      }),
    }),
  getGitHubToken: () => null,
  fetchSkillFolderHash: async () => 'new-hash',
}))

it('should update multiple outdated skills', async () => {
  mocks.confirm.mockResolvedValueOnce(true)

  const { runCheck } = await import('../../src/check.ts')
  await runCheck()

  expect(getLogs()).toMatchInlineSnapshot(`
    "info: 2 update(s) available:
    message:   * skill-a (alice/repo-a)
    message:   * skill-b (bob/repo-b)
    success: Updated skill-a
    success: Updated skill-b
    success: Updated 2 skill(s)"
  `)

  const callArgs = mockSpawnSync.mock.calls.map((c: any) => c[1] as string[])
  expect(callArgs[0]).toContain('https://github.com/alice/repo-a/tree/main/skills/my-skill')
  expect(callArgs[0]).toContain('--skills=skill-a')
  expect(callArgs[1]).toContain('https://github.com/bob/repo-b/tree/main/skills/my-skill')
  expect(callArgs[1]).toContain('--skills=skill-b')
})
