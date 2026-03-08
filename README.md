# AETHER

**AI operating layer** that orchestrates distributed intelligence agents. Users execute work using natural language commands (e.g. *"Prepare a market report"*). Agents run in a pipeline: **Planner → Research → Code → Automation → Memory**.

## Documentation

- **[System architecture](docs/ARCHITECTURE.md)** — High-level design, data flow, deployment
- **[Folder structure](docs/FOLDER_STRUCTURE.md)** — App, components, server layout
- **[Implementation roadmap](docs/ROADMAP.md)** — Current status and next steps
- **[Testing](docs/TESTING.md)** — Vitest, test layout, and how to run tests

## Tech stack

- **Next.js 14** (App Router), **TypeScript**, **TailwindCSS**, **Shadcn UI**, **Framer Motion**
- **Stripe** (billing), **Prisma** + **PostgreSQL**, **Auth.js**, **tRPC**
- **Vercel** deployment ready

## Project structure (overview)

- **`/app`** — App Router: landing, (auth), (dashboard), api (auth, stripe, trpc, health)
- **`/components`** — UI, layout (sidebar, header), landing, dashboard, command-center
- **`/lib`** — utils, trpc client/provider, stripe client/server
- **`/server`** — auth (Auth.js), db (Prisma), api (tRPC root, context, routers)
- **`/database`** — Docs; schema in `/prisma/schema.prisma`
- **`/styles`** — Docs; global styles in `app/globals.css`
- **`/hooks`** — Custom React hooks
- **`/utils`** — Constants and pure helpers
- **`/types`** — Shared TS types

## Setup

1. Copy `.env.example` to `.env.local` and set `DATABASE_URL`, `AUTH_SECRET`, Stripe keys.
2. `npm install`
3. `npm run db:generate` then `npm run db:push` (or `npm run db:migrate` for migrations).
4. `npm run dev`

## Deploy (Vercel)

- Connect repo; set env vars (same as `.env.example`).
- Add `DATABASE_URL` (e.g. Vercel Postgres or Neon).
- Stripe webhook: set URL to `https://<domain>/api/stripe/webhook` and `STRIPE_WEBHOOK_SECRET`.

## Sections

Landing · Dashboard · **Command center** (natural language → pipeline) · **Agents** (Planner, Research, Code, Automation, Memory) · **Tasks** (runs, logs, results) · **Memory** · **Automations** (workflows) · **Integrations** (Slack, GitHub, Notion, etc.) · **Billing** (Starter / Pro / Enterprise) · Settings
