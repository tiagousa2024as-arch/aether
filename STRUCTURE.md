# Aether – Full file structure and directory notes

Production-grade SaaS scaffold. No business logic implemented; structure and comments only.

---

## Root

| File | Purpose |
|------|--------|
| `package.json` | Dependencies: Next.js 14, React, Tailwind, Shadcn (Radix), Framer Motion, Stripe, Prisma, Auth.js, tRPC, Zod. Scripts: dev, build, db:* |
| `tsconfig.json` | TypeScript config; path alias `@/*` → project root |
| `next.config.js` | Next.js config; React strict mode; server actions enabled |
| `tailwind.config.ts` | Tailwind + dark mode (class); content paths; tailwindcss-animate |
| `postcss.config.js` | Tailwind + Autoprefixer |
| `components.json` | Shadcn CLI config (style, RSC, aliases) |
| `.env.example` | Template: DATABASE_URL, AUTH_*, STRIPE_*, NEXT_PUBLIC_APP_URL |
| `.gitignore` | node_modules, .next, .env*, IDE, Vercel, Prisma lock |
| `middleware.ts` | Edge middleware; auth matcher (exclude api, static, favicon) |
| `vercel.json` | Vercel framework and build settings |
| `README.md` | Stack, structure overview, setup, deploy |

---

## `/app` – App Router

| Path | Purpose |
|------|--------|
| `layout.tsx` | Root layout: metadata, Providers (tRPC), globals.css |
| `page.tsx` | Landing page (public): hero, features, CTA |
| `globals.css` | Tailwind base/components/utilities; Shadcn CSS variables (light/dark) |
| `providers.tsx` | Client providers: TRPCProvider (and later SessionProvider, theme) |

### `/app/(auth)` – Auth route group (no dashboard shell)

| Path | Purpose |
|------|--------|
| `layout.tsx` | Centered auth layout for login/signup |
| `login/page.tsx` | Sign-in (credentials/OAuth); redirect to dashboard on success |
| `signup/page.tsx` | Registration; redirect to dashboard or onboarding |

### `/app/(dashboard)` – Protected app

| Path | Purpose |
|------|--------|
| `layout.tsx` | Dashboard layout: sidebar, header, auth guard |
| `dashboard/page.tsx` | Dashboard home: overview, stats, recent tasks |
| `command-center/page.tsx` | Command center: AI command input and execution |
| `agents/page.tsx` | Agents: list, create, configure, enable/disable |
| `tasks/page.tsx` | Tasks: list, status, logs, filters |
| `memory/page.tsx` | Memory: persistent context/knowledge for agents |
| `automations/page.tsx` | Automations: triggers and workflows |
| `integrations/page.tsx` | Integrations: third-party connections |
| `billing/page.tsx` | Billing: Stripe plans, payment, invoices |
| `settings/page.tsx` | Settings: profile, security, API keys |

### `/app/api` – API routes

| Path | Purpose |
|------|--------|
| `auth/[...nextauth]/route.ts` | Auth.js catch-all: signIn, signOut, callbacks |
| `stripe/webhook/route.ts` | Stripe webhook: verify signature; handle subscription/invoice events |
| `stripe/create-checkout/route.ts` | Create Stripe Checkout session (subscribe/one-time) |
| `stripe/create-portal/route.ts` | Create Stripe Customer Portal session |
| `trpc/[trpc]/route.ts` | tRPC HTTP handler (GET/POST); wire to app router |
| `health/route.ts` | Health check for Vercel/monitoring |

---

## `/components`

| Path | Purpose |
|------|--------|
| `ui/README.md` | Shadcn components: add via `npx shadcn@latest add <component>` |
| `ui/button.tsx` | Base button (Shadcn-style); extend with CVA as needed |
| `layout/sidebar.tsx` | Dashboard nav: Dashboard, Command center, Agents, Tasks, Memory, Automations, Integrations, Billing, Settings |
| `layout/header.tsx` | Dashboard header: logo, search/command, user menu |
| `layout/dashboard-shell.tsx` | Composes sidebar + header + main for dashboard layout |
| `landing/hero.tsx` | Landing hero: headline, CTA |
| `landing/features.tsx` | Landing features grid |
| `landing/cta.tsx` | Landing final CTA |
| `dashboard/stats-cards.tsx` | Dashboard KPIs |
| `dashboard/recent-tasks.tsx` | Dashboard recent tasks list |
| `command-center/command-input.tsx` | Command center main input |
| `command-center/command-history.tsx` | Command history / results |

---

## `/lib`

| Path | Purpose |
|------|--------|
| `utils.ts` | `cn()` (clsx + tailwind-merge) and shared helpers |
| `trpc/client.ts` | tRPC React client: `createTRPCReact<AppRouter>` |
| `trpc/provider.tsx` | tRPC + React Query provider; batch link to /api/trpc |
| `stripe/client.ts` | Browser Stripe (loadStripe) for Checkout/Elements |
| `stripe/server.ts` | Server Stripe instance (secret key) for API/webhooks |

---

## `/server`

| Path | Purpose |
|------|--------|
| `auth/auth.config.ts` | Auth.js config: providers, pages, authorized callback |
| `auth/index.ts` | Auth.js main export: NextAuth + Prisma adapter + authConfig |
| `db/index.ts` | Prisma client singleton (dev-safe) |
| `api/trpc.ts` | tRPC init: context (session, db), router, publicProcedure, protectedProcedure |
| `api/root.ts` | App router: merge all sub-routers (placeholder, agent, task, billing, user) |
| `api/routers/placeholder.ts` | Example tRPC router; replace with domain routers |

---

## `/prisma`

| Path | Purpose |
|------|--------|
| `schema.prisma` | PostgreSQL schema: Auth (Account, Session, User, VerificationToken); extend for Subscription, Agent, Task, etc. |

---

## `/database`

| Path | Purpose |
|------|--------|
| `README.md` | Points to Prisma schema; client from `@/server/db`; migration and seed notes |

---

## `/styles`

| Path | Purpose |
|------|--------|
| `README.md` | Global styles in app/globals.css; Tailwind and design tokens |

---

## `/hooks`

| Path | Purpose |
|------|--------|
| `use-mobile.ts` | Detect mobile viewport (e.g. sidebar collapse) |
| `index.ts` | Barrel export for hooks |

---

## `/utils`

| Path | Purpose |
|------|--------|
| `README.md` | Prefer @/lib/utils for shared; put pure helpers/constants here |
| `constants.ts` | App routes and other constants |

---

## `/types`

| Path | Purpose |
|------|--------|
| `index.ts` | Shared types (extend from Prisma/Zod as needed) |
| `stripe.ts` | Stripe-related types (subscription status, plan IDs) |

---

## Summary

- **App**: Landing + (auth) + (dashboard) with all main sections; API for auth, Stripe, tRPC, health.
- **Components**: UI (Shadcn), layout (sidebar, header, shell), landing, dashboard, command-center.
- **Lib**: utils, tRPC client/provider, Stripe client/server.
- **Server**: Auth.js config + entry, Prisma db, tRPC context + root + routers.
- **Config**: Env example, Vercel, Prisma schema with Auth models; Stripe and domain models to be added with implementation.
