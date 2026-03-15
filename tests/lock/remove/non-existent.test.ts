import { it, expect } from 'vitest'
import { removeFromLock, readLock } from '../../../src/lock.ts'
import { setupLockTest } from '../lock-test-utils.ts'

const { getCwd } = setupLockTest()

it('removeFromLock / does not crash on non-existent skill', async () => {
  await removeFromLock('does-not-exist', getCwd())

  expect(await readLock(getCwd())).toMatchInlineSnapshot(`
    {
      "hooks": {},
      "mcpServers": {},
      "skills": {},
      "version": 1,
    }
  `)
})
