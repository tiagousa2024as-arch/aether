/**
 * Task tRPC router - List and get task runs (execution history).
 */

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const taskRouter = createTRPCRouter({
  /** Dashboard stats: total runs and recent runs. */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const [totalRuns, recentRuns] = await Promise.all([
      ctx.db.taskRun.count({ where: { userId: ctx.user.id } }),
      ctx.db.taskRun.findMany({
        where: { userId: ctx.user.id },
        take: 5,
        orderBy: { startedAt: "desc" },
        include: {
          plan: { select: { command: true } },
        },
      }),
    ]);
    return {
      totalRuns,
      recentRuns: recentRuns.map((r) => ({
        id: r.id,
        command: r.plan.command,
        status: r.status,
        startedAt: r.startedAt.toISOString(),
      })),
    };
  }),

  /** List recent task runs for the current user. */
  listRuns: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).optional().default(20),
          cursor: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 20;
      const runs = await ctx.db.taskRun.findMany({
        where: { userId: ctx.user.id },
        take: limit + 1,
        cursor: input?.cursor ? { id: input.cursor } : undefined,
        orderBy: { startedAt: "desc" },
        include: {
          plan: {
            select: { id: true, command: true },
          },
          _count: { select: { stepResults: true } },
        },
      });
      let nextCursor: string | undefined;
      if (runs.length > limit) {
        const next = runs.pop();
        nextCursor = next?.id;
      }
      return {
        runs: runs.map((r) => ({
          id: r.id,
          planId: r.planId,
          command: r.plan.command,
          status: r.status,
          startedAt: r.startedAt.toISOString(),
          completedAt: r.completedAt?.toISOString() ?? null,
          stepCount: r._count.stepResults,
        })),
        nextCursor,
      };
    }),

  /** Get a single task run with plan steps and step results. */
  getRun: protectedProcedure
    .input(z.object({ runId: z.string() }))
    .query(async ({ ctx, input }) => {
      const run = await ctx.db.taskRun.findFirst({
        where: { id: input.runId, userId: ctx.user.id },
        include: {
          plan: {
            include: { steps: { orderBy: { order: "asc" } } },
          },
          stepResults: true,
        },
      });
      if (!run) return null;
      return {
        id: run.id,
        planId: run.planId,
        command: run.plan.command,
        status: run.status,
        startedAt: run.startedAt.toISOString(),
        completedAt: run.completedAt?.toISOString() ?? null,
        steps: run.plan.steps.map((s) => ({
          id: s.id,
          type: s.type,
          title: s.title,
          description: s.description,
          order: s.order,
        })),
        stepResults: run.stepResults.map((r) => ({
          stepId: r.stepId,
          status: r.status,
          output: r.output,
          error: r.error,
          durationMs: r.durationMs,
        })),
      };
    }),
});
