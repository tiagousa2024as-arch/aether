import { describe, it, expect } from "vitest";
import { AutomationAgent } from "./automation-agent";
import type { TaskStep, ExecutionContext } from "./types";

describe("server/agents/automation-agent", () => {
  const agent = new AutomationAgent();
  const ctx: ExecutionContext = { planId: "p1", command: "export file", previousResults: [] };

  it("has type automation", () => {
    expect(agent.type).toBe("automation");
  });

  it("returns completed result", async () => {
    const step: TaskStep = {
      id: "step-1",
      type: "automation",
      title: "Finalize",
      order: 0,
    };
    const result = await agent.execute(step, ctx);
    expect(result.status).toBe("completed");
    expect(result.stepId).toBe("step-1");
    expect(result.output).toBeDefined();
  });

  it("returns Exported message for export title", async () => {
    const step: TaskStep = {
      id: "s1",
      type: "automation",
      title: "Export file",
      order: 0,
    };
    const result = await agent.execute(step, ctx);
    expect(result.output).toContain("Exported");
  });
});
