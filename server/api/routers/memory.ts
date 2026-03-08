/**
 * Memory tRPC router - List and manage agent-stored memories.
 */

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const memoryRouter = createTRPCRouter({
  /** List recent memories for the current user. */
  list: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).optional().default(30),
          cursor: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 30;
      const memories = await ctx.db.memory.findMany({
        where: { userId: ctx.user.id },
        take: limit + 1,
        cursor: input?.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
      });
      let nextCursor: string | undefined;
      if (memories.length > limit) {
        const next = memories.pop();
        nextCursor = next?.id;
      }
      return {
        memories: memories.map((m) => ({
          id: m.id,
          content: m.content,
          source: m.source,
          createdAt: m.createdAt.toISOString(),
        })),
        nextCursor,
      };
    }),
});
