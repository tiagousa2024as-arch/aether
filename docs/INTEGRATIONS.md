# AETHER Integration Architecture

## Implemented (Phase 2–3)

### 1. Module structure

- `src/modules/integrations/` — connector interface and OpenAI
- `src/modules/integrations/connectors/openai/` — `client.ts`, `types.ts`, `actions.ts`, `config.ts`
- `src/modules/agents/llm-provider.ts` — LLM abstraction (OpenAI today; Anthropic when added)

### 2. Generic connector interface

```ts
interface IntegrationConnector {
  name: string;
  authenticate(): Promise<void>;
  listActions(): ActionDefinition[];
  execute(actionId: string, input: Record<string, unknown>): Promise<ActionResult>;
}
```

All connectors (OpenAI, Anthropic, Microsoft, Salesforce, ServiceNow) implement this.

### 3. OpenAI connector

- **generateText** — chat completion (prompt, systemPrompt, model, maxTokens, temperature)
- **generateStructuredOutput** — JSON output conforming to a schema (uses `response_format`)
- **toolCalling** — messages + tools; returns message and tool_calls

Env: `OPENAI_API_KEY`

### 4. LLM provider abstraction

- `getActiveLLMProvider()` — returns `"openai"` if key set, else `null`
- `generateText(options)` — uses OpenAI when configured
- `generateStructuredOutput(options)` — same

Used by agents when you switch from simulated to real LLM (e.g. planner, research).

### 5. Prisma models (workflow engine)

- **Workspace** — per-user container
- **Command** — `commandText`, `workspaceId`, `status`, `workflowId`, `createdAt`
- **Workflow** — `status`, steps, runs, logs
- **WorkflowStep** — order, type, status, config
- **AgentRun** — workflowId, agentType, status, output, error, timestamps
- **IntegrationConnection** — userId, provider, tokens (for OAuth connectors)
- **ExecutionLog** — workflowId, stepId, action, result, error, timestamp

Run `npx prisma migrate dev` to create tables after pulling.

---

## Next steps (phased)

1. **Anthropic** — Add `@anthropic-ai/sdk`, implement connector (createMessage, structured, tools), add to LLM provider switch.
2. **Microsoft Graph** — OAuth2 flow, client for mail/calendar/Teams; actions: sendEmail, createCalendarEvent, readEmails, createTeamsMessage.
3. **Salesforce** — OAuth2, REST client; actions: createLead, getLead, createContact, createTask, queryObjects.
4. **ServiceNow** — Basic or OAuth, REST client; actions: createIncident, updateIncident, getIncident, listIncidents.
5. **Workflow engine** — Use Command/Workflow/WorkflowStep/AgentRun/ExecutionLog in a runner that parses command → creates workflow → assigns agents → calls connectors → stores logs.
6. **Dashboard** — Command Center already exists; add Execution Logs page and wire to ExecutionLog.

All integrations are server-side only; tokens stored in IntegrationConnection or env; validate inputs with Zod.
