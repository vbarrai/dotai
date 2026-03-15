import { it, expect } from 'vitest'
import { readLock } from '../../../src/lock.ts'
import { setupLockTest } from '../lock-test-utils.ts'

const { givenLockFile, getCwd } = setupLockTest()

it('readLock / parses a valid lock file', async () => {
  await givenLockFile(
    JSON.stringify({
      version: 1,
      skills: {
        'my-skill': {
          source: 'owner/repo',
          sourceUrl: 'https://github.com/owner/repo',
          skillPath: 'skills/my-skill/SKILL.md',
          skillFolderHash: 'abc123',
          installedAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
        },
      },
    }),
  )

  expect(await readLock(getCwd())).toMatchInlineSnapshot(`
    {
      "hooks": {},
      "mcpServers": {},
      "skills": {
        "my-skill": {
          "installedAt": "2025-01-01T00:00:00.000Z",
          "skillFolderHash": "abc123",
          "skillPath": "skills/my-skill/SKILL.md",
          "source": "owner/repo",
          "sourceUrl": "https://github.com/owner/repo",
          "updatedAt": "2025-01-01T00:00:00.000Z",
        },
      },
      "version": 1,
    }
  `)
})
