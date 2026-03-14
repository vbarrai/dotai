import { it, expect } from "vitest";
import { describeConfai } from "../../test-utils.ts";

describeConfai("claude-code / hooks alongside a skill", ({ givenSource, when, thenFile, thenFiles }) => {
  it("installs both skill files and hooks config", async () => {
    await givenSource({
      skills: [{ name: "dev-tools" }],
      hooks: {
        "block-rm": {
          "claude-code": {
            "PreToolUse": [
              { "matcher": "Bash", "hooks": [{ "type": "command", "command": ".claude/hooks/block-rm.sh" }] },
            ],
          },
        },
      },
    });

    await when({ hooks: ["block-rm"], skills: ["dev-tools"], agents: ["claude-code"] });

    expect(await thenFiles()).toMatchInlineSnapshot(`
      [
        ".agents/skills/dev-tools/SKILL.md",
        ".claude/settings.json",
        ".claude/skills/dev-tools",
      ]
    `);

    expect(await thenFile(".claude/settings.json")).toMatchInlineSnapshot(`
      "{
        "hooks": {
          "PreToolUse": [
            {
              "matcher": "Bash",
              "hooks": [
                {
                  "type": "command",
                  "command": ".claude/hooks/block-rm.sh"
                }
              ]
            }
          ]
        }
      }
      "
    `);
  });
});
