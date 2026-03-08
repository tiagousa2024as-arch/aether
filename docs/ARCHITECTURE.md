# AETHER — System Architecture

## Overview

AETHER is an **AI operating layer** that orchestrates distributed intelligence agents. Users execute work via natural language commands; a pipeline of agents (Planner → Research → Code → Automation → Memory) runs to fulfill each command.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Next.js)                                │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │   Landing   │  │  Dashboard   │  │  Command    │  │ Agents / Tasks   │   │
│  │    Page     │  │   Layout     │  │   Center    │  │ Memory / Billing │   │
│  └──────┬──────┘  └──────┬───────┘  └──────┬──────┘  └────────┬─────────┘   │
│         │                │                 │                    │            │
│         └────────────────┴─────────────────┴────────────────────┘            │
│                                    │                                         │
│                          tRPC (React Query)                                  │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API LAYER (Next.js API Routes)                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐│
│  │  tRPC Router    │  │  Auth (NextAuth) │  │  Stripe Webhooks / Portal   ││
│  │  agent • task   │  │  Credentials +   │  │  checkout • portal • webhook ││
│  │  memory • etc  │  │  OAuth           │  │                              ││
│  └────────┬───────┘  └────────┬─────────┘  └─────────────────────────────┘│
│           │                   │                                              │
└───────────┼───────────────────┼──────────────────────────────────────────────┘
            │                   │
            ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ORCHESTRATION & WORKERS                                │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  Agent Orchestrator                                                   │   │
│  │  PlannerAgent → ResearchAgent → CodeAgent → AutomationAgent → Memory  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────┐  ┌─────────────────┐  (Future: BullMQ + Redis)       │
│  │  Sync execution │  │  Queue (BullMQ)  │  for async pipelines & cron     │
│  │  (tRPC mutate)  │  │  job workers    │                                  │
│  └─────────────────┘  └─────────────────┘                                  │
└────────────────────────────────────┬─────────────────────────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────────────┐
│   PostgreSQL    │       │      Redis       │       │   External Services      │
│   (Prisma)      │       │   (sessions /   │       │   OpenAI • Stripe        │
│   Users, Plans  │       │   BullMQ)       │       │   Slack • GitHub • etc   │
│   TaskRuns      │       │   (optional)    │       │   Embeddings             │
│   Memory        │       │                 │       │                          │
└─────────────────┘       └─────────────────┘       └─────────────────────────┘
```

---

## Component Responsibilities

| Layer | Responsibility |
|-------|----------------|
| **Frontend** | Next.js App Router, dashboard UI, command center, Framer Motion animations, tRPC client |
| **API** | tRPC procedures (agent, task, memory, automation, billing), Auth.js, Stripe routes |
| **Orchestration** | Generate plan from command; execute steps in order; persist Plan, TaskRun, StepResult, Memory |
| **Data** | PostgreSQL (Prisma): auth, plans, task runs, memories, automations, integrations; Redis/BullMQ for queues (optional) |
| **AI** | OpenAI API for planner/agents (or rule-based simulation); embeddings for memory (future) |
| **Billing** | Stripe: checkout, customer portal, webhooks → subscription state |

---

## Data Flow: Command Execution

1. **User** enters a natural language command in the Command Center (e.g. “Prepare a market report”).
2. **Frontend** calls `agent.createPlan.mutate({ command })`.
3. **PlannerAgent** (or OpenAI) produces an execution plan: ordered steps (research → code → automation → memory).
4. **Frontend** calls `agent.startTaskRun.mutate({ planId })` → creates `TaskRun` in DB.
5. **Frontend** (or a worker) runs each step in sequence: `agent.executeStep.mutate({ step, context, taskRunId })`.
6. **Runner** dispatches to the correct agent (ResearchAgent, CodeAgent, etc.); each agent returns a `StepResult`.
7. **StepResult** and optional **Memory** are persisted; when the last step finishes, `agent.completeTaskRun.mutate({ taskRunId, status })` is called.
8. **Tasks** page lists TaskRuns and shows execution logs and results.

---

## Security & Multi-Tenancy

- **Auth**: NextAuth (credentials + OAuth); session required for dashboard and tRPC `protectedProcedure`.
- **Scoping**: Plans, TaskRuns, Memories, Automations are scoped by `userId` where applicable.
- **Stripe**: Customer portal and webhooks use server-side Stripe SDK; no keys in client.

---

## Deployment (Vercel)

- **Next.js** on Vercel (serverless).
- **PostgreSQL**: Vercel Postgres, Neon, or external (use `DATABASE_URL` and optionally `DIRECT_DATABASE_URL`).
- **Redis**: Upstash or external for BullMQ (optional for v1).
- **Env**: `AUTH_SECRET`, `DATABASE_URL`, Stripe keys, optional `OPENAI_API_KEY`, `REDIS_URL`.
