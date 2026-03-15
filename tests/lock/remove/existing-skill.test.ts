import { it, expect } from 'vitest'
import { addToLock, removeFromLock, readLock } from '../../../src/lock.ts'
import { setupLockTest } from '../lock-test-utils.ts'

const { getCwd } = setupLockTest()

it('removeFromLock / removes an existing skill', async () => {
  await addToLock(
    'to-remove',
    {
      source: 'test/repo',
      sourceUrl: 'https://github.com/test/repo',
      skillFolderHash: 'abc123',
    },
    getCwd(),
  )

  await removeFromLock('to-remove', getCwd())

  expect(await readLock(getCwd())).toMatchInlineSnapshot(`
    {
      "hooks": {},
      "mcpServers": {},
      "skills": {},
      "version": 1,
    }
  `)
})
