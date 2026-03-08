/**
 * tRPC HTTP handler - /api/trpc/[trpc].
 * Transformer is set in server/api/trpc.ts (initTRPC.create).
 */

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: (opts) => createTRPCContext(opts),
  });

export { handler as GET, handler as POST };
