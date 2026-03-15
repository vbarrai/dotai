import { it, expect } from 'vitest'
import { addToLock, removeFromLock } from '../../../src/lock.ts'
import { setupLockTest } from '../lock-test-utils.ts'

const { thenLockFile, getCwd } = setupLockTest()

it('removeFromLock / persists removal to disk', async () => {
  await addToLock(
    'ephemeral',
    {
      source: 'test/repo',
      sourceUrl: 'https://github.com/test/repo',
      skillFolderHash: 'hash-ephemeral',
    },
    getCwd(),
  )

  await removeFromLock('ephemeral', getCwd())

  expect(await thenLockFile()).toMatchInlineSnapshot(`
    "{
      "version": 1,
      "skills": {},
      "mcpServers": {},
      "hooks": {}
    }"
  `)
})
