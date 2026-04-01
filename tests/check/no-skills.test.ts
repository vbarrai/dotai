import { it, expect, vi } from 'vitest'
import { getLogs, lockWith } from './check-test-utils.ts'

vi.mock('../../src/lock.ts', () => ({
  readLock: async () => lockWith({}),
  getGitHubToken: () => null,
  fetchSkillFolderHash: async () => null,
}))

it('should show no-skills message for empty lock', async () => {
  const { runCheck } = await import('../../src/check.ts')
  await runCheck()

  expect(getLogs()).toMatchInlineSnapshot(`
    "info: No globally installed skills to check.
    info: Install skills with: maconfai install <source> -g"
  `)
})
