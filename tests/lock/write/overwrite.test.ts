import { it, expect } from 'vitest'
import { writeLock } from '../../../src/lock.ts'
import { setupLockTest } from '../lock-test-utils.ts'

const { thenLockFile, getCwd } = setupLockTest()

it('overwrites the lock file completely on second write', async () => {
  await writeLock({ version: 1, skills: { old: { source: 'a' } } } as any, getCwd())
  await writeLock({ version: 1, skills: { new: { source: 'b' } } } as any, getCwd())

  expect(await thenLockFile()).toMatchInlineSnapshot(`
    "{
      "version": 1,
      "skills": {
        "new": {
          "source": "b"
        }
      }
    }"
  `)
})
