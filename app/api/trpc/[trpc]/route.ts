/**
 * tRPC HTTP handler - /api/trpc/[trpc].
 */

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import superjson from "superjson";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ req, resHeaders: new Headers() }),
    transformer: superjson,
  });

export { handler as GET, handler as POST };
