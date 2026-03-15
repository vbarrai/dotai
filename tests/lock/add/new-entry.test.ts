import { it, expect } from 'vitest'
import { addToLock } from '../../../src/lock.ts'
import { setupLockTest } from '../lock-test-utils.ts'

const { thenLockFile, getCwd } = setupLockTest()

it('adds a new skill entry to the lock file', async () => {
  await addToLock(
    'my-skill',
    {
      source: 'owner/repo',
      sourceUrl: 'https://github.com/owner/repo',
      skillPath: 'skills/my-skill/SKILL.md',
      skillFolderHash: 'abc123',
    },
    getCwd(),
  )

  const lock = JSON.parse(await thenLockFile())
  lock.skills['my-skill'].installedAt = '<timestamp>'
  lock.skills['my-skill'].updatedAt = '<timestamp>'

  expect(lock).toMatchInlineSnapshot(`
    {
      "hooks": {},
      "mcpServers": {},
      "skills": {
        "my-skill": {
          "installedAt": "<timestamp>",
          "skillFolderHash": "abc123",
          "skillPath": "skills/my-skill/SKILL.md",
          "source": "owner/repo",
          "sourceUrl": "https://github.com/owner/repo",
          "updatedAt": "<timestamp>",
        },
      },
      "version": 1,
    }
  `)
})
