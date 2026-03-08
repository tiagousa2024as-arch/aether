import { describe, it, expect, vi } from "vitest";

vi.mock("@/server/auth", () => ({ auth: () => Promise.resolve({ user: { id: "u1", email: "t@t.com", name: "Test" } }) }));
vi.mock("@/server/db", () => ({ db: {} }));

import { appRouter } from "../root";
import { createMockContext } from "../test-utils";

describe("server/api/routers/task", () => {
  const ctx = createMockContext();
  const caller = appRouter.createCaller(ctx);

  describe("getStats", () => {
    it("returns totalRuns and recentRuns", async () => {
      const stats = await caller.task.getStats();
      expect(stats).toHaveProperty("totalRuns");
      expect(stats).toHaveProperty("recentRuns");
      expect(typeof stats.totalRuns).toBe("number");
      expect(Array.isArray(stats.recentRuns)).toBe(true);
    });

    it("recentRuns items have id, command, status, startedAt", async () => {
      const stats = await caller.task.getStats();
      for (const run of stats.recentRuns) {
        expect(run).toHaveProperty("id");
        expect(run).toHaveProperty("command");
        expect(run).toHaveProperty("status");
        expect(run).toHaveProperty("startedAt");
      }
    });
  });

  describe("listRuns", () => {
    it("returns runs array and optional nextCursor", async () => {
      const result = await caller.task.listRuns({ limit: 5 });
      expect(result).toHaveProperty("runs");
      expect(Array.isArray(result.runs)).toBe(true);
    });

    it("accepts limit and cursor", async () => {
      const result = await caller.task.listRuns({ limit: 2 });
      expect(result.runs.length).toBeLessThanOrEqual(2);
    });
  });
});
