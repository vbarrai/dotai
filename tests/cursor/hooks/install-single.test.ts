import { it, expect } from 'vitest'
import { describeConfai, hookBlockRmCursor } from '../../test-utils.ts'

describeConfai(
  'cursor / install single hook',
  ({ givenSource, sourceFiles, whenInstall, targetFile, targetHasFiles }) => {
    it('should install a simple hook into hooks.json', async () => {
      await givenSource({ hooks: hookBlockRmCursor })

      expect(await sourceFiles()).toMatchInlineSnapshot(`
      [
        "hooks.json",
      ]
    `)

      await whenInstall({ hooks: ['block-rm'], agents: ['cursor'] })

      await targetHasFiles('.cursor/hooks.json', 'ai-lock.json')

      expect(await targetFile('.cursor/hooks.json')).toMatchInlineSnapshot(`
      "{
        "version": 1,
        "hooks": {
          "beforeShellExecution": [
            {
              "command": ".cursor/hooks/block-rm.sh",
              "matcher": "^rm "
            }
          ]
        }
      }
      "
    `)
    })
  },
)
