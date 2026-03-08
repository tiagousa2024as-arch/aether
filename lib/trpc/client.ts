/**
 * tRPC React client - For use in client components.
 * Create typed client with createTRPCReact<AppRouter>; wrap app in Provider.
 */

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/api/root";

export const trpc = createTRPCReact<AppRouter>();
