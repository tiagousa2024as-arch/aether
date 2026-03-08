import { describe, it, expect } from "vitest";
import { getAgent, executeStep, executePlan } from "./runner";
import type { TaskStep, ExecutionContext } from "./types";

const mockStep = (overrides: Partial<TaskStep> = {}): TaskStep => ({
  id: "step-1",
  type: "research",
  title: "Research",
  description: "Test",
  order: 0,
  ...overrides,
});

const mockContext: ExecutionContext = {
  planId: "plan-1",
  command: "test command",
  previousResults: [],
};

describe("server/agents/runner", () => {
  describe("getAgent", () => {
    it("returns agent for research, code, automation, memory", () => {
      expect(getAgent("research")).toBeDefined();
      expect(getAgent("code")).toBeDefined();
      expect(getAgent("automation")).toBeDefined();
      expect(getAgent("memory")).toBeDefined();
    });

    it("throws for unknown agent type", () => {
      expect(() => getAgent("unknown" as "research")).toThrow(/Unknown agent type/);
    });
  });

  describe("executeStep", () => {
    it("returns failed result for planner step", async () => {
      const step = mockStep({ type: "planner" });
      const result = await executeStep(step, mockContext);
      expect(result.status).toBe("failed");
      expect(result.error).toContain("Planner cannot be run");
      expect(result.stepId).toBe(step.id);
    });

    it("returns success result for research step", async () => {
      const step = mockStep({ type: "research" });
      const result = await executeStep(step, mockContext);
      expect(result.status).toBe("completed");
      expect(result.output).toBeDefined();
      expect(result.durationMs).toBeGreaterThanOrEqual(0);
      expect(result.stepId).toBe(step.id);
    });

    it("returns success result for code step", async () => {
      const step = mockStep({ type: "code", title: "Implement" });
      const result = await executeStep(step, mockContext);
      expect(result.status).toBe("completed");
      expect(result.output).toBeDefined();
    });

    it("returns success result for memory step", async () => {
      const step = mockStep({ type: "memory" });
      const result = await executeStep(step, mockContext);
      expect(result.status).toBe("completed");
      expect(result.output).toBeDefined();
    });

    it("returns success result for automation step", async () => {
      const step = mockStep({ type: "automation" });
      const result = await executeStep(step, mockContext);
      expect(result.status).toBe("completed");
      expect(result.output).toBeDefined();
    });
  });

  describe("executePlan", () => {
    it("executes all steps in order and returns results", async () => {
      const plan = {
        id: "plan-1",
        command: "test",
        steps: [
          mockStep({ id: "s1", type: "research", order: 0 }),
          mockStep({ id: "s2", type: "memory", order: 1 }),
        ],
      };
      const results = await executePlan(plan);
      expect(results).toHaveLength(2);
      expect(results[0].stepId).toBe("s1");
      expect(results[1].stepId).toBe("s2");
      expect(results.every((r) => r.status === "completed")).toBe(true);
    });

    it("calls onStepComplete for each step", async () => {
      const plan = {
        id: "p1",
        command: "c",
        steps: [mockStep({ id: "s1", type: "research", order: 0 })],
      };
      const collected: unknown[] = [];
      await executePlan(plan, (result) => collected.push(result));
      expect(collected).toHaveLength(1);
      expect((collected[0] as { stepId: string }).stepId).toBe("s1");
    });
  });
});
