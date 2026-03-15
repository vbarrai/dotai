import { it, expect } from 'vitest'
import { addToLock } from '../../../src/lock.ts'
import { setupLockTest } from '../lock-test-utils.ts'

const { thenLockFile, getCwd } = setupLockTest()

it('persists the lock entry to disk as formatted JSON', async () => {
  await addToLock(
    'disk-skill',
    {
      source: 'owner/repo',
      sourceUrl: 'https://github.com/owner/repo',
      skillPath: 'skills/disk-skill/SKILL.md',
      skillFolderHash: 'xyz789',
    },
    getCwd(),
  )

  const lock = JSON.parse(await thenLockFile())
  lock.skills['disk-skill'].installedAt = '<timestamp>'
  lock.skills['disk-skill'].updatedAt = '<timestamp>'

  expect(lock).toMatchInlineSnapshot(`
    {
      "hooks": {},
      "mcpServers": {},
      "skills": {
        "disk-skill": {
          "installedAt": "<timestamp>",
          "skillFolderHash": "xyz789",
          "skillPath": "skills/disk-skill/SKILL.md",
          "source": "owner/repo",
          "sourceUrl": "https://github.com/owner/repo",
          "updatedAt": "<timestamp>",
        },
      },
      "version": 1,
    }
  `)
})
