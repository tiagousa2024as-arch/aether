import { describe, it, expect } from "vitest";
import { ResearchAgent } from "./research-agent";
import type { TaskStep, ExecutionContext } from "./types";

describe("server/agents/research-agent", () => {
  const agent = new ResearchAgent();
  const ctx: ExecutionContext = { planId: "p1", command: "test command", previousResults: [] };

  it("has type research", () => {
    expect(agent.type).toBe("research");
  });

  it("returns completed result with output and duration", async () => {
    const step: TaskStep = {
      id: "step-1",
      type: "research",
      title: "Research",
      order: 0,
      payload: { command: "test command" },
    };
    const result = await agent.execute(step, ctx);
    expect(result.status).toBe("completed");
    expect(result.stepId).toBe("step-1");
    expect(result.output).toBeDefined();
    expect(typeof result.durationMs).toBe("number");
    expect(result.output).toContain("Research completed");
  });
});
