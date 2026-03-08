/**
 * Automation tRPC router - Workflows with trigger + steps.
 * [deploy-fix] config uses toConfigJson + Prisma cast (no string in Json field).
 */

import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const stepSchema = z.object({
  order: z.number(),
  agentType: z.enum(["research", "code", "automation", "memory"]),
  config: z.record(z.unknown()).optional(),
});

/** Prisma Json column accepts object only (no string). Normalize at runtime. */
function toConfigJson(val: unknown): object | undefined {
  if (val === undefined || val === null) return undefined;
  if (typeof val === "object" && val !== null) return val as object;
  return undefined;
}

/** Nested create payload for AutomationStep. Cast to Prisma type so build passes (config is object-only at runtime). */
type StepCreate = {
  order: number;
  agentType: string;
  config?: object;
};

export const automationRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const automations = await ctx.db.automation.findMany({
      where: { userId: ctx.user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        steps: { orderBy: { order: "asc" } },
      },
    });
    return automations.map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      triggerType: a.triggerType,
      schedule: a.schedule,
      enabled: a.enabled,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
      steps: a.steps.map((s) => ({
        id: s.id,
        order: s.order,
        agentType: s.agentType,
        config: s.config,
      })),
    }));
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(120),
        description: z.string().max(500).optional(),
        triggerType: z.enum(["schedule", "manual"]),
        schedule: z.string().max(100).optional(),
        steps: z.array(stepSchema).min(1).max(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const stepsCreate: StepCreate[] = input.steps.map((s) => ({
        order: s.order,
        agentType: s.agentType,
        config: toConfigJson(s.config),
      }));
      const automation = await ctx.db.automation.create({
        data: {
          userId: ctx.user.id,
          name: input.name,
          description: input.description ?? null,
          triggerType: input.triggerType,
          schedule: input.schedule ?? null,
          enabled: true,
          steps: {
            create: stepsCreate as Prisma.AutomationStepCreateWithoutAutomationInput[],
          },
        },
        include: { steps: true },
      });
      return {
        id: automation.id,
        name: automation.name,
        triggerType: automation.triggerType,
        schedule: automation.schedule,
        steps: automation.steps.length,
      };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(120).optional(),
        description: z.string().max(500).optional(),
        enabled: z.boolean().optional(),
        schedule: z.string().max(100).optional(),
        steps: z.array(stepSchema).min(1).max(10).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.automation.findFirst({
        where: { id: input.id, userId: ctx.user.id },
      });
      if (!existing) throw new Error("Automation not found");

      const data: {
        name?: string;
        description?: string | null;
        enabled?: boolean;
        schedule?: string | null;
        steps?: { deleteMany: {}; create: Prisma.AutomationStepCreateWithoutAutomationInput[] };
      } = {};
      if (input.name !== undefined) data.name = input.name;
      if (input.description !== undefined) data.description = input.description;
      if (input.enabled !== undefined) data.enabled = input.enabled;
      if (input.schedule !== undefined) data.schedule = input.schedule;
      if (input.steps !== undefined) {
        const stepsCreate: StepCreate[] = input.steps.map((s) => ({
          order: s.order,
          agentType: s.agentType,
          config: toConfigJson(s.config),
        }));
        data.steps = {
          deleteMany: {},
          create: stepsCreate as Prisma.AutomationStepCreateWithoutAutomationInput[],
        };
      }

      await ctx.db.automation.update({
        where: { id: input.id },
        data,
      });
      return { ok: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.automation.findFirst({
        where: { id: input.id, userId: ctx.user.id },
      });
      if (!existing) throw new Error("Automation not found");
      await ctx.db.automation.delete({ where: { id: input.id } });
      return { ok: true };
    }),
});
