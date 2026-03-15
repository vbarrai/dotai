import { it, expect } from 'vitest'
import { readLock } from '../../../src/lock.ts'
import { setupLockTest } from '../lock-test-utils.ts'

const { givenLockFile, getCwd } = setupLockTest()

it('readLock / returns empty lock for corrupted JSON', async () => {
  await givenLockFile('{not valid json')

  expect(await readLock(getCwd())).toMatchInlineSnapshot(`
    {
      "hooks": {},
      "mcpServers": {},
      "skills": {},
      "version": 1,
    }
  `)
})
