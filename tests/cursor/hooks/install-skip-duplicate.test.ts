import { it, expect } from 'vitest'
import { describeConfai, hookBlockRmCursor } from '../../test-utils.ts'

describeConfai(
  'cursor / skip duplicate hook handlers',
  ({ givenSource, whenInstall, targetFile }) => {
    it('does not duplicate identical handlers on reinstall', async () => {
      await givenSource({ hooks: hookBlockRmCursor })

      await whenInstall({ hooks: ['block-rm'], agents: ['cursor'] })
      await whenInstall({ hooks: ['block-rm'], agents: ['cursor'] })

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
