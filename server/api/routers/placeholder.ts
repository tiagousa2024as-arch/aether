/**
 * Placeholder router - Example tRPC router.
 * Replace with agent, task, billing, user routers; register in server/api/root.ts.
 */

import { createTRPCRouter, publicProcedure } from "../trpc";

export const placeholderRouter = createTRPCRouter({
  hello: publicProcedure.query(() => ({ message: "Aether" })),
});
