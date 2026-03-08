import { describe, it, expect, vi } from "vitest";

vi.mock("@/server/auth", () => ({ auth: () => Promise.resolve({ user: { id: "u1", email: "t@t.com", name: "Test" } }) }));
vi.mock("@/server/db", () => ({ db: {} }));

import { appRouter } from "../root";
import { createMockContext } from "../test-utils";

describe("server/api/routers/automation", () => {
  const ctx = createMockContext();
  const caller = appRouter.createCaller(ctx);

  describe("list", () => {
    it("returns array of automations", async () => {
      const list = await caller.automation.list();
      expect(Array.isArray(list)).toBe(true);
    });
  });

  describe("create", () => {
    it("creates automation and returns id, name, triggerType, steps count", async () => {
      const result = await caller.automation.create({
        name: "Test Workflow",
        description: "Test",
        triggerType: "manual",
        steps: [
          { order: 0, agentType: "research" },
          { order: 1, agentType: "memory" },
        ],
      });
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("name", "Test Workflow");
      expect(result).toHaveProperty("triggerType", "manual");
      expect(result).toHaveProperty("steps", 2);
    });
  });
});
