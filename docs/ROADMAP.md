# AETHER — Implementation Roadmap

## Current Status (as of roadmap creation)

| Step | Status | Notes |
|------|--------|--------|
| 1. Design system | ✅ Done | Dark theme, primary/accent, dashboard utilities |
| 2. Landing page | ✅ Done | Hero, features, pricing, waitlist |
| 3. Dashboard layout | ✅ Done | Sidebar (grouped nav), header, shell, auth guard |
| 4. Backend agent orchestration | ✅ Done | Planner, Runner, Research/Code/Automation/Memory agents |
| 5. Database schema | ✅ Done | User, Plan, PlanStep, TaskRun, StepResult, Memory |
| 6. Task system | ✅ Done | listRuns, getRun, persist step results; Tasks UI |
| 7. Automations | ✅ Done | Schema (Automation, AutomationStep), tRPC CRUD, list + create UI |
| 8. Integrations | ✅ Done | Schema (Integration), tRPC list/connect/disconnect, cards with connected state |
| 9. Billing | 🟡 Partial | Stripe portal + plans UI (Starter/Pro/Enterprise); webhooks not persisted yet |
| 10. Deployment | 🟡 Ready | Vercel-ready; env docs in README |

---

## Roadmap (ordered work)

### Phase A — Design & polish

- [x] **A1. Design system alignment**
  Exact palette (#0B1020, #3BC9FF, #6C63FF, #FFFFFF, #9AA4C0); Inter via next/font.

- [x] **A2. Pipeline visualization**
  Command Center: vertical pipeline with agent icons, execution state, Framer Motion (CommandPipeline component).

### Phase B — Task system depth

- [ ] **B1. Execution logs in DB**  
  Optional: store per-step logs (e.g. `TaskRunLog[]` or JSON on StepResult) for full audit trail.

- [x] **B2. Task detail UI**  
  Tasks page: expand run detail with full execution log, agents used, timings, and results in a clear hierarchy.

### Phase C — Automations

- [x] **C1. Automation schema**  
  Models: `Automation` (name, trigger type, schedule/cron, enabled), `AutomationStep` (order, agentType, config). Relation to User (and optionally Workspace).

- [x] **C2. Automation CRUD**  
  tRPC: create, list, update, delete. UI: list + inline create form (name, trigger, schedule, steps). 
- [ ] **C3. Automation runner**  
  Run automation steps (reuse agent runner); optional: BullMQ job for scheduled triggers.

### Phase D — Integrations

- [x] **D1. Integration schema**  
  Model: `Integration` (userId, provider: slack | google | github | notion | email | calendar, credentials encrypted or ref, status, createdAt).

- [x] **D2. Integration cards & connect flow**  
  UI: cards per provider (Slack, Google Workspace, GitHub, Notion, Email, Calendar); “Connect” → OAuth or API key flow; list connected integrations.

- [ ] **D3. Use in agents**  
  Pass connected integrations into agent context (e.g. “send to Slack”) or use in Automation steps.

### Phase E — Billing

- [ ] **E1. Stripe products & prices**  
  Create Stripe products: Starter, Pro, Enterprise; link prices in env or DB.

- [x] **E2. Billing UI**
  Dashboard billing: current plan (Free), plans table (Starter / Pro / Enterprise), portal + checkout links.

- [ ] **E3. Webhooks**  
  Handle `customer.subscription.*`, `checkout.session.completed`; persist subscription status (e.g. `Subscription` model or user metadata).

### Phase F — AI & scale

- [ ] **F1. OpenAI for Planner**  
  Replace rule-based planner with LLM (e.g. “break down this command into steps”) and optional embeddings for memory.

- [ ] **F2. Redis + BullMQ**  
  Optional: queue pipeline jobs for long-running or scheduled runs; worker consumes job and calls existing orchestrator.

### Phase G — Deployment

- [ ] **G1. Env & docs**  
  Document all env vars (DB, Auth, Stripe, OpenAI, Redis). Add Docker Compose for local Postgres (and Redis if used).

- [ ] **G2. Vercel**  
  Connect repo; set env; configure Stripe webhook URL; run migrations.

---

## Suggested next implementation order

**Done:** A1, A2, B2, C1, C2, D1, D2, E2.

**Next:**

1. **E1 + E3** — Stripe products/prices; webhooks to persist subscription.  
2. **C3** — Automation runner (schedule; optional BullMQ).  
3. **D3** — Use integrations in agent context.  
4. **F1** — OpenAI planner (optional).5. **F2** — Redis/BullMQ (optional).  
6. **G1 + G2** — Env docs, Docker, Vercel checklist.  
