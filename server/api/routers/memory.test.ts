import { describe, it, expect, vi } from "vitest";

vi.mock("@/server/auth", () => ({ auth: () => Promise.resolve({ user: { id: "u1", email: "t@t.com", name: "Test" } }) }));
vi.mock("@/server/db", () => ({ db: {} }));

import { appRouter } from "../root";
import { createMockContext } from "../test-utils";

describe("server/api/routers/memory", () => {
  const ctx = createMockContext();
  const caller = appRouter.createCaller(ctx);

  describe("list", () => {
    it("returns memories array and optional nextCursor", async () => {
      const result = await caller.memory.list({ limit: 10 });
      expect(result).toHaveProperty("memories");
      expect(Array.isArray(result.memories)).toBe(true);
    });
  });
});
