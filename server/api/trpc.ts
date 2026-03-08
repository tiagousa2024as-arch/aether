/**
 * tRPC initialization - Context, router, and procedure helpers.
 * Context: session (from Auth.js), db. Use for auth in protected procedures.
 */

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { auth } from "@/server/auth";
import { db } from "@/server/db";

export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
  const session = await auth();
  return {
    session,
    db,
    headers: opts.req.headers,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user,
    },
  });
});
