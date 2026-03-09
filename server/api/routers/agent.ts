/**
 * Agent tRPC router - Create plans and execute steps (simulated pipeline).
 * Persists plans and task runs to DB when session/db available.
 */

import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { generatePlanAsync, executeStep } from "@/server/agents";

const taskStepSchema = z.object({
  id: z.string(),
  type: z.enum(["planner", "research", "code", "automation", "memory"]),
  title: z.string(),
  description: z.string().optional(),
  payload: z.record(z.unknown()).optional(),
  order: z.number(),
});

const stepResultSchema = z.object({
  stepId: z.string(),
  status: z.enum(["pending", "running", "completed", "failed"]),
  output: z.string().optional(),
  error: z.string().optional(),
  durationMs: z.number().optional(),
  artifacts: z.record(z.unknown()).optional(),
});

const executionContextSchema = z.object({
  planId: z.string(),
  command: z.string(),
  previousResults: z.array(stepResultSchema),
  metadata: z.record(z.unknown()).optional(),
});

const AGENT_META = [
  {
    type: "research" as const,
    name: "Research",
    description: "Gathers context, sources, and key facts for your task.",
  },
  {
    type: "code" as const,
    name: "Code",
    description: "Implements solutions, generates content, and structures output.",
  },
  {
    type: "automation" as const,
    name: "Automation",
    description: "Configures workflows, triggers, and validation steps.",
  },
  {
    type: "memory" as const,
    name: "Memory",
    description: "Stores and recalls context for future tasks.",
  },
] as const;

export const agentRouter = createTRPCRouter({
  /** List available execution agents (metadata only). */
  listAgents: protectedProcedure.query(() => AGENT_META),

  /** Generate an execution plan from a user command; persist to DB. */
  createPlan: protectedProcedure
    .input(z.object({ command: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const plan = await generatePlanAsync(input.command);
      await ctx.db.plan.upsert({
        where: { id: plan.id },
        create: {
          id: plan.id,
          userId: ctx.user.id,
          command: plan.command,
          steps: {
            create: plan.steps.map((s) => ({
              id: s.id,
              type: s.type,
              title: s.title,
              description: s.description ?? null,
              order: s.order,
              payload: (s.payload ?? undefined) as Prisma.InputJsonValue | undefined,
            })),
          },
        },
        update: {
          command: plan.command,
          steps: {
            deleteMany: {},
            create: plan.steps.map((s) => ({
              id: s.id,
              type: s.type,
              title: s.title,
              description: s.description ?? null,
              order: s.order,
              payload: (s.payload ?? undefined) as Prisma.InputJsonValue | undefined,
            })),
          },
        },
      });
      return plan;
    }),

  /** Start a task run for a plan; returns taskRunId for persisting step results. */
  startTaskRun: protectedProcedure
    .input(z.object({ planId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const run = await ctx.db.taskRun.create({
        data: {
          planId: input.planId,
          userId: ctx.user.id,
          status: "running",
        },
      });
      return { taskRunId: run.id };
    }),

  /** Execute a single step; optionally persist result when taskRunId provided. */
  executeStep: protectedProcedure
    .input(
      z.object({
        step: taskStepSchema,
        context: executionContextSchema,
        taskRunId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await executeStep(input.step, input.context);
      if (input.taskRunId) {
        await ctx.db.stepResult.create({
          data: {
            taskRunId: input.taskRunId,
            stepId: input.step.id,
            status: result.status,
            output: result.output ?? null,
            error: result.error ?? null,
            durationMs: result.durationMs ?? null,
            artifacts: (result.artifacts ?? undefined) as Prisma.InputJsonValue | undefined,
          },
        });
        if (
          input.step.type === "memory" &&
          result.status === "completed" &&
          result.output
        ) {
          await ctx.db.memory.create({
            data: {
              userId: ctx.user.id,
              content: result.output,
              source: input.taskRunId,
            },
          });
        }
      }
      return result;
    }),

  /** Mark a task run as completed or failed (call after last step). */
  completeTaskRun: protectedProcedure
    .input(
      z.object({
        taskRunId: z.string(),
        status: z.enum(["completed", "failed"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.taskRun.update({
        where: { id: input.taskRunId },
        data: {
          status: input.status,
          completedAt: new Date(),
        },
      });
      return { ok: true };
    }),
});
