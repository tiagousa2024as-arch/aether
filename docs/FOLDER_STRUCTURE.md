# AETHER — Folder Structure

## App Router (`/app`)

```
app/
├── layout.tsx                    # Root layout, providers
├── page.tsx                      # Landing page
├── globals.css                   # Design system, dashboard utilities
├── providers.tsx                 # tRPC + Query client
│
├── (auth)/                       # Auth route group (no dashboard shell)
│   ├── layout.tsx
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── actions.ts                # Server actions (sign in/up)
│
├── (dashboard)/                  # Dashboard route group (sidebar + header)
│   ├── layout.tsx                # Auth guard, dark theme, DashboardHeader + Shell
│   ├── dashboard/page.tsx        # Home: stats, recent activity
│   ├── command-center/page.tsx   # Command input, plan, pipeline UI
│   ├── agents/page.tsx           # Agent cards (name, capabilities, status)
│   ├── tasks/page.tsx            # Task runs list + detail (logs, results)
│   ├── memory/page.tsx          # Stored memories from MemoryAgent
│   ├── automations/page.tsx      # Workflows (e.g. Morning Report)
│   ├── integrations/page.tsx    # Slack, GitHub, Notion, etc.
│   ├── billing/page.tsx          # Stripe plans, portal
│   │   └── billing-portal-button.tsx
│   └── settings/page.tsx         # Profile, sign out
│
└── api/
    ├── auth/[...nextauth]/route.ts
    ├── trpc/[trpc]/route.ts
    ├── health/route.ts
    ├── stripe/
    │   ├── create-checkout/route.ts
    │   ├── create-portal/route.ts
    │   └── webhook/route.ts
    └── ...
```

---

## Components (`/components`)

```
components/
├── layout/                       # Dashboard shell
│   ├── dashboard-header.tsx     # Logo, user email, sign out
│   ├── dashboard-shell.tsx     # Sidebar + content area
│   ├── sidebar.tsx             # Nav groups (Overview, Orchestration, Account)
│   └── page-header.tsx         # Reusable page title + description + action
│
├── dashboard/                   # Feature-specific (optional)
│   ├── command-pipeline.tsx    # Pipeline visualization (Planner → … → Memory)
│   ├── agent-card.tsx         # Agent name, capabilities, last run, metrics
│   ├── task-run-detail.tsx    # Logs, results, agents used
│   └── ...
│
├── landing/                     # Landing page sections
│   ├── nav.tsx
│   ├── hero.tsx
│   ├── command-demo.tsx
│   ├── pricing.tsx
│   └── ...
│
└── ui/                          # Shadcn-style primitives
    ├── button.tsx
    ├── input.tsx
    ├── label.tsx
    ├── aether-logo.tsx
    └── ...
```

---

## Server & Backend (`/server`)

```
server/
├── api/
│   ├── trpc.ts                  # Context (session, db), procedures
│   ├── root.ts                  # App router (merge all routers)
│   └── routers/
│       ├── agent.ts             # createPlan, startTaskRun, executeStep, completeTaskRun, listAgents
│       ├── task.ts              # getStats, listRuns, getRun
│       ├── memory.ts            # list
│       ├── automation.ts        # (future) list, create, trigger
│       ├── integration.ts       # (future) list, connect, disconnect
│       └── placeholder.ts
│
├── auth/
│   ├── index.ts                 # NextAuth config (adapter, providers)
│   ├── auth.config.ts
│   └── signup.ts
│
├── agents/
│   ├── types.ts                 # TaskStep, ExecutionPlan, StepResult, ExecutionContext
│   ├── base.ts                  # BaseAgent
│   ├── planner-agent.ts         # generatePlan (rule-based or LLM)
│   ├── runner.ts                # getAgent, executeStep, executePlan
│   ├── research-agent.ts
│   ├── code-agent.ts
│   ├── automation-agent.ts
│   ├── memory-agent.ts
│   └── index.ts
│
├── db/
│   └── index.ts                 # Prisma client singleton
│
├── queue/                       # (Future) BullMQ
│   ├── index.ts                 # Queue definition, connection
│   └── workers/
│       └── pipeline-worker.ts
│
└── lib/                         # (Optional) shared server libs
    └── openai.ts                # OpenAI client for agents
```

---

## Lib & Config (`/lib`, root config)

```
lib/
├── trpc/
│   ├── client.ts                # createTRPCReact
│   ├── provider.tsx             # TRPCProvider + QueryClient
│   └── ...
├── stripe/
│   ├── client.ts                # loadStripe (browser)
│   └── server.ts                # Stripe(secret) (server)
└── utils.ts                     # cn, etc.

prisma/
├── schema.prisma                # User, Account, Session, Plan, PlanStep,
│                                # TaskRun, StepResult, Memory, (Automation, Integration)
└── migrations/

docs/
├── ARCHITECTURE.md              # This system overview
├── FOLDER_STRUCTURE.md          # This file
└── ROADMAP.md                   # Implementation roadmap
```

---

## Design System (in code)

- **Tokens**: `app/globals.css` — `:root` and `.dark` CSS variables (background, foreground, primary, accent, muted, border, radius).
- **Palette (dashboard)**: Background `#0B1020`, Primary `#3BC9FF`, Accent `#6C63FF`, Text `#FFFFFF`, Muted `#9AA4C0`.
- **Typography**: Inter (Tailwind default or explicit in globals).
- **Components**: Tailwind + Shadcn UI; Framer Motion for page and pipeline animations.
