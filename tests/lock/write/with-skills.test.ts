import { it, expect } from 'vitest'
import { writeLock } from '../../../src/lock.ts'
import { setupLockTest } from '../lock-test-utils.ts'

const { thenLockFile, getCwd } = setupLockTest()

it('writes a lock file with one skill entry', async () => {
  await writeLock(
    {
      version: 1,
      skills: {
        'test-skill': {
          source: 'owner/repo',
          sourceUrl: 'https://github.com/owner/repo',
          skillFolderHash: 'abc123',
          installedAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
        },
      },
    } as any,
    getCwd(),
  )

  expect(await thenLockFile()).toMatchInlineSnapshot(`
    "{
      "version": 1,
      "skills": {
        "test-skill": {
          "source": "owner/repo",
          "sourceUrl": "https://github.com/owner/repo",
          "skillFolderHash": "abc123",
          "installedAt": "2025-01-01T00:00:00.000Z",
          "updatedAt": "2025-01-01T00:00:00.000Z"
        }
      }
    }"
  `)
})
