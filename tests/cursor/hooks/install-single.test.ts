import { it, expect } from "vitest";
import { describeConfai } from "../../test-utils.ts";

describeConfai("cursor / install single hook", ({ givenSource, sourceFiles, when, thenFile, thenFiles }) => {
  it("should install a simple hook into hooks.json", async () => {
    await givenSource({
      hooks: {
        "block-rm": {
          "cursor": {
            "beforeShellExecution": [
              { "command": ".cursor/hooks/block-rm.sh", "matcher": "^rm " },
            ],
          },
        },
      },
    });

    expect(await sourceFiles()).toMatchInlineSnapshot(`
      [
        "hooks.json",
      ]
    `);

    await when({ hooks: ["block-rm"], agents: ["cursor"] });

    expect(await thenFiles()).toMatchInlineSnapshot(`
      [
        ".cursor/hooks.json",
      ]
    `);

    expect(await thenFile(".cursor/hooks.json")).toMatchInlineSnapshot(`
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
    `);
  });
});
