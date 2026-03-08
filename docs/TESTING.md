# AETHER — Testing

Tests use **Vitest** and live next to the code they cover.

## Commands

```bash
npm run test          # Run all tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run with coverage report
```

## Structure

| Module | Test file | What’s tested |
|--------|-----------|----------------|
| **lib/utils** | `lib/utils.test.ts` | `cn()` classname merge and Tailwind override |
| **server/agents** | `server/agents/planner-agent.test.ts` | `generatePlan()` templates and plan shape |
| | `server/agents/runner.test.ts` | `getAgent`, `executeStep`, `executePlan` |
| | `server/agents/research-agent.test.ts` | ResearchAgent `execute` |
| | `server/agents/code-agent.test.ts` | CodeAgent `execute` |
| | `server/agents/memory-agent.test.ts` | MemoryAgent `execute` |
| | `server/agents/automation-agent.test.ts` | AutomationAgent `execute` |
| **server/api/routers** | `server/api/routers/agent.test.ts` | `listAgents`, `createPlan`, `startTaskRun` (with mock ctx) |
| | `server/api/routers/task.test.ts` | `getStats`, `listRuns` |
| | `server/api/routers/memory.test.ts` | `list` |
| | `server/api/routers/automation.test.ts` | `list`, `create` |
| | `server/api/routers/integration.test.ts` | `list`, `connect` |

## Router tests

Router tests use a **mock tRPC context** (`server/api/test-utils.ts`) with a fake Prisma client so no real DB is used. The app router is created with `appRouter.createCaller(mockContext)` and procedures are called as in production.

## Agent tests

Agent tests run the real planner and agents. Research, Code, Memory, and Automation agents use simulated delays (~500–1000 ms), so the full agent test suite can take a few seconds.
