/**
 * tRPC root - Creates app router and context.
 * Merge all sub-routers (agent, task, billing, user, etc.) here.
 */

import { createTRPCRouter } from "./trpc";
import { placeholderRouter } from "./routers/placeholder";
import { agentRouter } from "./routers/agent";
import { taskRouter } from "./routers/task";
import { memoryRouter } from "./routers/memory";
import { automationRouter } from "./routers/automation";
import { integrationRouter } from "./routers/integration";

export const appRouter = createTRPCRouter({
  placeholder: placeholderRouter,
  agent: agentRouter,
  task: taskRouter,
  memory: memoryRouter,
  automation: automationRouter,
  integration: integrationRouter,
});

export type AppRouter = typeof appRouter;
