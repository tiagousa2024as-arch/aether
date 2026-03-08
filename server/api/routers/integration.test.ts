import { describe, it, expect, vi } from "vitest";

vi.mock("@/server/auth", () => ({ auth: () => Promise.resolve({ user: { id: "u1", email: "t@t.com", name: "Test" } }) }));
vi.mock("@/server/db", () => ({ db: {} }));

import { appRouter } from "../root";
import { createMockContext } from "../test-utils";

describe("server/api/routers/integration", () => {
  const ctx = createMockContext();
  const caller = appRouter.createCaller(ctx);

  describe("list", () => {
    it("returns array of integrations", async () => {
      const list = await caller.integration.list();
      expect(Array.isArray(list)).toBe(true);
    });
  });

  describe("connect", () => {
    it("succeeds for valid provider", async () => {
      const result = await caller.integration.connect({ provider: "slack" });
      expect(result).toEqual({ ok: true });
    });
  });
});
