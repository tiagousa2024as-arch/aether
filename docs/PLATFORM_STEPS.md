# Aether platform – steps checklist

## Done

- **Planner → LLM**  
  `generatePlanAsync()` in `server/agents/planner-agent.ts` uses OpenAI or Anthropic (when keys set) to generate plans; falls back to rule-based `generatePlan()`.

- **Research agent → LLM**  
  `server/agents/research-agent.ts` calls `generateText()` when an LLM is configured; otherwise uses simulated delay and placeholder text.

- **Agent router**  
  `server/api/routers/agent.ts` uses `generatePlanAsync` for `createPlan` so the dashboard gets LLM plans when configured.

- **Integrations**  
  OpenAI and Anthropic connectors in `src/modules/integrations/connectors/`; `src/modules/agents/llm-provider.ts` picks provider (Anthropic preferred if both set).

- **Env**  
  `.env.example` documents `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, and other vars.

---

## You should do

1. **Build**  
   From project root:
   ```bash
   npm run build
   ```
   If you see lock or `.next` errors, delete the `.next` folder and run again.

2. **Deploy to Vercel**  
   Commit and push (including `server/api/routers/automation.ts` and any new `src/modules` changes). Set env vars in Vercel (e.g. `DATABASE_URL`, `AUTH_SECRET`, optional `OPENAI_API_KEY` / `ANTHROPIC_API_KEY`).

3. **Database**  
   If you added new Prisma models (Workspace, Command, Workflow, etc.):
   ```bash
   npx prisma migrate dev --name add_workflow_models
   ```
   Or use `npx prisma db push` for a quick schema sync without migration history.

---

## Optional later

- Full connectors: Microsoft Graph, Salesforce, ServiceNow (see `docs/INTEGRATIONS.md`).
- Workflow engine and Execution Logs UI using the new Prisma models.
- Wire Code / Automation / Memory agents to LLM or external APIs.
