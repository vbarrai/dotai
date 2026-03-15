import { it, expect } from 'vitest'
import { readLock } from '../../../src/lock.ts'
import { setupLockTest } from '../lock-test-utils.ts'

const { givenLockFile, getCwd } = setupLockTest()

it('readLock / returns empty lock when skills field is missing', async () => {
  await givenLockFile(JSON.stringify({ version: 1 }))

  expect(await readLock(getCwd())).toMatchInlineSnapshot(`
    {
      "hooks": {},
      "mcpServers": {},
      "skills": {},
      "version": 1,
    }
  `)
})
