import { describe, it, expect, vi } from "vitest";

vi.mock("@/server/auth", () => ({ auth: () => Promise.resolve({ user: { id: "u1", email: "t@t.com", name: "Test" } }) }));
vi.mock("@/server/db", () => ({ db: {} }));

import { appRouter } from "../root";
import { createMockContext } from "../test-utils";

describe("server/api/routers/agent", () => {
  const ctx = createMockContext();
  const caller = appRouter.createCaller(ctx);

  describe("listAgents", () => {
    it("returns array of agent metadata", async () => {
      const agents = await caller.agent.listAgents();
      expect(Array.isArray(agents)).toBe(true);
      expect(agents.length).toBe(4);
    });

    it("each agent has type, name, description", async () => {
      const agents = await caller.agent.listAgents();
      const types = ["research", "code", "automation", "memory"];
      for (const agent of agents) {
        expect(agent).toHaveProperty("type");
        expect(agent).toHaveProperty("name");
        expect(agent).toHaveProperty("description");
        expect(types).toContain(agent.type);
      }
    });
  });

  describe("createPlan", () => {
    it("returns plan with id, command, steps, createdAt", async () => {
      const plan = await caller.agent.createPlan({ command: "create a presentation" });
      expect(plan).toHaveProperty("id");
      expect(plan.id).toMatch(/^plan-/);
      expect(plan).toHaveProperty("command", "create a presentation");
      expect(plan).toHaveProperty("steps");
      expect(Array.isArray(plan.steps)).toBe(true);
      expect(plan).toHaveProperty("createdAt");
      expect(plan.steps.length).toBeGreaterThan(0);
    });

    it("steps have id, type, title, order", async () => {
      const plan = await caller.agent.createPlan({ command: "implement a script" });
      plan.steps.forEach((step, i) => {
        expect(step).toHaveProperty("id");
        expect(step).toHaveProperty("type");
        expect(step).toHaveProperty("title");
        expect(step).toHaveProperty("order", i);
      });
    });
  });

  describe("startTaskRun", () => {
    it("returns taskRunId", async () => {
      const plan = await caller.agent.createPlan({ command: "test" });
      const { taskRunId } = await caller.agent.startTaskRun({ planId: plan.id });
      expect(taskRunId).toBeDefined();
      expect(typeof taskRunId).toBe("string");
    });
  });
});
