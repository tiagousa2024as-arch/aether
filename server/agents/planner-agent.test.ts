import { describe, it, expect } from "vitest";
import { generatePlan } from "./planner-agent";
import type { ExecutionPlan, TaskStep } from "./types";

describe("server/agents/planner-agent", () => {
  describe("generatePlan", () => {
    it("returns an execution plan with id, command, steps, createdAt", () => {
      const plan = generatePlan("do something");
      expect(plan).toHaveProperty("id");
      expect(plan).toHaveProperty("command", "do something");
      expect(plan).toHaveProperty("steps");
      expect(plan).toHaveProperty("createdAt");
      expect(Array.isArray(plan.steps)).toBe(true);
      expect(typeof plan.createdAt).toBe("number");
      expect(plan.id).toMatch(/^plan-/);
    });

    it("uses presentation template for presentation-related commands", () => {
      const plan = generatePlan("create a presentation about AI");
      expect(plan.steps.length).toBeGreaterThan(0);
      const types = plan.steps.map((s) => s.type);
      expect(types).toContain("research");
      expect(types).toContain("code");
      expect(types).toContain("memory");
      expect(types).toContain("automation");
      const titles = plan.steps.map((s) => s.title.toLowerCase());
      expect(titles.some((t) => t.includes("research") || t.includes("topic"))).toBe(true);
    });

    it("uses code template for implement/script commands", () => {
      const plan = generatePlan("implement a script");
      expect(plan.steps.length).toBe(4);
      const types = plan.steps.map((s) => s.type);
      expect(types).toContain("research");
      expect(types).toContain("code");
      expect(types).toContain("automation");
    });

    it("uses default plan for unknown commands", () => {
      const plan = generatePlan("xyz random task");
      expect(plan.steps.length).toBe(4);
      expect(plan.steps.every((s) => ["research", "memory", "code", "automation"].includes(s.type))).toBe(true);
    });

    it("steps have id, type, title, description, order, payload", () => {
      const plan = generatePlan("test");
      plan.steps.forEach((step: TaskStep, i: number) => {
        expect(step).toHaveProperty("id");
        expect(step.id).toMatch(new RegExp(`^${plan.id}-step-\\d+`));
        expect(step).toHaveProperty("type");
        expect(step).toHaveProperty("title");
        expect(step).toHaveProperty("order", i);
        expect(step.payload).toEqual({ command: "test" });
      });
    });

    it("steps are ordered by order field", () => {
      const plan = generatePlan("report");
      for (let i = 0; i < plan.steps.length; i++) {
        expect(plan.steps[i].order).toBe(i);
      }
    });
  });
});
