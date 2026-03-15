import { it, expect } from 'vitest'
import { addToLock } from '../../../src/lock.ts'
import { setupLockTest } from '../lock-test-utils.ts'

const { thenLockFile, getCwd } = setupLockTest()

it('stores multiple skills independently', async () => {
  await addToLock(
    'skill-a',
    {
      source: 'alice/repo',
      sourceUrl: 'https://github.com/alice/repo',
      skillPath: 'skills/skill-a/SKILL.md',
      skillFolderHash: 'aaa111',
    },
    getCwd(),
  )

  await addToLock(
    'skill-b',
    {
      source: 'bob/repo',
      sourceUrl: 'https://github.com/bob/repo',
      skillPath: 'skills/skill-b/SKILL.md',
      skillFolderHash: 'bbb222',
    },
    getCwd(),
  )

  const lock = JSON.parse(await thenLockFile())

  expect(Object.keys(lock.skills)).toMatchInlineSnapshot(`
    [
      "skill-a",
      "skill-b",
    ]
  `)
})
