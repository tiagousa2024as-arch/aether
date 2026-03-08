/**
 * Test utilities for tRPC router tests.
 * Provides mock context with db stubs.
 */

import { vi } from "vitest";
import type { PrismaClient } from "@prisma/client";

export function createMockContext(overrides: {
  userId?: string;
  db?: Partial<PrismaClient>;
} = {}) {
  const userId = overrides.userId ?? "test-user-id";
  const db = overrides.db ?? createMockDb();
  return {
    session: {
      user: { id: userId, email: "test@example.com", name: "Test" },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    user: { id: userId, email: "test@example.com", name: "Test" },
    db: db as PrismaClient,
    headers: new Headers(),
  };
}

function createMockDb(): Record<string, unknown> {
  return {
    plan: {
      upsert: vi.fn().mockResolvedValue({ id: "plan-1" }),
    },
    taskRun: {
      create: vi.fn().mockResolvedValue({ id: "run-1" }),
      update: vi.fn().mockResolvedValue({}),
      findMany: vi.fn().mockResolvedValue([]),
      findFirst: vi.fn().mockResolvedValue(null),
      findUnique: vi.fn().mockResolvedValue(null),
      count: vi.fn().mockResolvedValue(0),
    },
    stepResult: {
      create: vi.fn().mockResolvedValue({}),
    },
    memory: {
      create: vi.fn().mockResolvedValue({}),
      findMany: vi.fn().mockResolvedValue([]),
    },
    automation: {
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockImplementation((args: { data?: { name?: string; triggerType?: string; schedule?: string | null; steps?: { create: unknown[] } } }) => {
        const steps = args?.data?.steps?.create ?? [];
        return Promise.resolve({
          id: "auto-1",
          name: args?.data?.name ?? "Test",
          triggerType: args?.data?.triggerType ?? "manual",
          schedule: args?.data?.schedule ?? null,
          steps: Array.isArray(steps) ? steps : [],
        });
      }),
      update: vi.fn().mockResolvedValue({}),
      findFirst: vi.fn().mockResolvedValue(null),
      delete: vi.fn().mockResolvedValue({}),
    },
    integration: {
      findMany: vi.fn().mockResolvedValue([]),
      upsert: vi.fn().mockResolvedValue({}),
      deleteMany: vi.fn().mockResolvedValue({}),
    },
  };
}
