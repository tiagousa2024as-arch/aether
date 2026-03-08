import { describe, it, expect } from "vitest";
import { MemoryAgent } from "./memory-agent";
import type { TaskStep, ExecutionContext } from "./types";

describe("server/agents/memory-agent", () => {
  const agent = new MemoryAgent();
  const ctx: ExecutionContext = { planId: "p1", command: "store context", previousResults: [] };

  it("has type memory", () => {
    expect(agent.type).toBe("memory");
  });

  it("returns completed result with output", async () => {
    const step: TaskStep = {
      id: "step-1",
      type: "memory",
      title: "Store",
      order: 0,
    };
    const result = await agent.execute(step, ctx);
    expect(result.status).toBe("completed");
    expect(result.stepId).toBe("step-1");
    expect(result.output).toBeDefined();
  });

  it("returns outline-style output for outline/structure title", async () => {
    const step: TaskStep = {
      id: "s1",
      type: "memory",
      title: "Outline structure",
      order: 0,
    };
    const result = await agent.execute(step, ctx);
    expect(result.output).toContain("Outline");
  });
});
