import { describe, it, expect } from "vitest";
import { CodeAgent } from "./code-agent";
import type { TaskStep, ExecutionContext } from "./types";

describe("server/agents/code-agent", () => {
  const agent = new CodeAgent();
  const ctx: ExecutionContext = { planId: "p1", command: "build a script", previousResults: [] };

  it("has type code", () => {
    expect(agent.type).toBe("code");
  });

  it("returns completed result", async () => {
    const step: TaskStep = {
      id: "step-1",
      type: "code",
      title: "Implement solution",
      order: 0,
    };
    const result = await agent.execute(step, ctx);
    expect(result.status).toBe("completed");
    expect(result.stepId).toBe("step-1");
    expect(result.output).toBeDefined();
    expect(typeof result.durationMs).toBe("number");
  });

  it("returns content-style output for slide/content title", async () => {
    const step: TaskStep = {
      id: "s1",
      type: "code",
      title: "Create slides",
      order: 0,
    };
    const result = await agent.execute(step, ctx);
    expect(result.output).toContain("Generated content");
  });
});
