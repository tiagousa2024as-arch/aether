/**
 * Integration tRPC router - Connected providers (Slack, GitHub, etc.).
 */

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const PROVIDERS = ["slack", "google", "github", "notion", "email", "calendar"] as const;

export const integrationRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const list = await ctx.db.integration.findMany({
      where: { userId: ctx.user.id },
    });
    return list.map((i) => ({
      id: i.id,
      provider: i.provider,
      status: i.status,
      createdAt: i.createdAt.toISOString(),
    }));
  }),

  connect: protectedProcedure
    .input(z.object({ provider: z.enum(PROVIDERS) }))
    .mutation(async ({ ctx, input }) => {
      // Placeholder: create a stub connection. Real OAuth would redirect to provider.
      await ctx.db.integration.upsert({
        where: {
          userId_provider: { userId: ctx.user.id, provider: input.provider },
        },
        create: {
          userId: ctx.user.id,
          provider: input.provider,
          status: "active",
        },
        update: { status: "active" },
      });
      return { ok: true };
    }),

  disconnect: protectedProcedure
    .input(z.object({ provider: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.integration.deleteMany({
        where: { userId: ctx.user.id, provider: input.provider },
      });
      return { ok: true };
    }),
});
