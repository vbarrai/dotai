import { it, expect } from 'vitest'
import { addToLock, removeFromLock, readLock } from '../../../src/lock.ts'
import { setupLockTest } from '../lock-test-utils.ts'

const { getCwd } = setupLockTest()

it('removeFromLock / keeps other skills intact', async () => {
  await addToLock(
    'keep-me',
    {
      source: 'test/repo',
      sourceUrl: 'https://github.com/test/repo',
      skillFolderHash: 'hash-keep',
    },
    getCwd(),
  )

  await addToLock(
    'remove-me',
    {
      source: 'test/repo',
      sourceUrl: 'https://github.com/test/repo',
      skillFolderHash: 'hash-remove',
    },
    getCwd(),
  )

  await removeFromLock('remove-me', getCwd())

  const lock = await readLock(getCwd())
  const sanitized = JSON.parse(
    JSON.stringify(lock).replace(/"\d{4}-\d{2}-\d{2}T[^"]+"/g, '"<timestamp>"'),
  )

  expect(sanitized).toMatchInlineSnapshot(`
    {
      "hooks": {},
      "mcpServers": {},
      "skills": {
        "keep-me": {
          "installedAt": "<timestamp>",
          "skillFolderHash": "hash-keep",
          "source": "test/repo",
          "sourceUrl": "https://github.com/test/repo",
          "updatedAt": "<timestamp>",
        },
      },
      "version": 1,
    }
  `)
})
