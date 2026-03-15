import { it, expect } from 'vitest'
import { addToLock } from '../../../src/lock.ts'
import { setupLockTest } from '../lock-test-utils.ts'

const { thenLockFile, getCwd } = setupLockTest()

it('preserves installedAt when updating an existing skill', async () => {
  await addToLock(
    'my-skill',
    {
      source: 'owner/repo',
      sourceUrl: 'https://github.com/owner/repo',
      skillPath: 'skills/my-skill/SKILL.md',
      skillFolderHash: 'hash-v1',
    },
    getCwd(),
  )

  const firstLock = JSON.parse(await thenLockFile())
  const originalInstalledAt = firstLock.skills['my-skill'].installedAt

  await addToLock(
    'my-skill',
    {
      source: 'owner/repo',
      sourceUrl: 'https://github.com/owner/repo',
      skillPath: 'skills/my-skill/SKILL.md',
      skillFolderHash: 'hash-v2',
    },
    getCwd(),
  )

  const lock = JSON.parse(await thenLockFile())
  expect(lock.skills['my-skill'].installedAt).toBe(originalInstalledAt)
  lock.skills['my-skill'].installedAt = '<timestamp>'
  lock.skills['my-skill'].updatedAt = '<timestamp>'

  expect(lock.skills['my-skill']).toMatchInlineSnapshot(`
    {
      "installedAt": "<timestamp>",
      "skillFolderHash": "hash-v2",
      "skillPath": "skills/my-skill/SKILL.md",
      "source": "owner/repo",
      "sourceUrl": "https://github.com/owner/repo",
      "updatedAt": "<timestamp>",
    }
  `)
})
