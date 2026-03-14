import { it, expect } from "vitest";
import { describeConfai } from "../../test-utils.ts";

describeConfai("cursor / hooks alongside a skill", ({ givenSource, when, thenFile, thenFiles }) => {
  it("installs both skill files and hooks config", async () => {
    await givenSource({
      skills: [{ name: "dev-tools" }],
      hooks: {
        "format-on-edit": {
          "cursor": {
            "afterFileEdit": [
              { "command": ".cursor/hooks/format.sh", "matcher": "Write" },
            ],
          },
        },
      },
    });

    await when({ hooks: ["format-on-edit"], skills: ["dev-tools"], agents: ["cursor"] });

    expect(await thenFiles()).toMatchInlineSnapshot(`
      [
        ".agents/skills/dev-tools/SKILL.md",
        ".cursor/hooks.json",
        ".cursor/skills/dev-tools",
      ]
    `);

    expect(await thenFile(".cursor/hooks.json")).toMatchInlineSnapshot(`
      "{
        "version": 1,
        "hooks": {
          "afterFileEdit": [
            {
              "command": ".cursor/hooks/format.sh",
              "matcher": "Write"
            }
          ]
        }
      }
      "
    `);
  });
});
