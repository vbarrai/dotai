import { it, expect } from 'vitest'
import { readLock } from '../../../src/lock.ts'
import { setupLockTest } from '../lock-test-utils.ts'

const { getCwd } = setupLockTest()

it('readLock / returns empty lock when file does not exist', async () => {
  expect(await readLock(getCwd())).toMatchInlineSnapshot(`
    {
      "hooks": {},
      "mcpServers": {},
      "skills": {},
      "version": 1,
    }
  `)
})
