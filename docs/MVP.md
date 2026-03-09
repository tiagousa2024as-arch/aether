# AETHER MVP — Command execution

First working flow: **user command → LLM interpretation → workflow → real actions (Salesforce, Microsoft Teams) → execution logs**.

## Flow

1. **User** types a command on the **Commands** dashboard (e.g. "Create Salesforce lead and notify sales team in Microsoft Teams").
2. **POST /api/commands** saves the command, calls **OpenAI** to interpret it into a structured workflow (goal + steps with `type` and `input`).
3. **Workflow** is stored (Workflow + WorkflowSteps with `input`).
4. **Workflow engine** runs each step in order:
   - `salesforce_create_lead` → Salesforce REST API `createLead` (FirstName, LastName, Company).
   - `microsoft_teams_message` → Microsoft Graph API `sendTeamsMessage` (channel, message).
5. Every step updates **status**, **output**/ **error**, **startedAt**/ **completedAt** and writes an **ExecutionLog** row.
6. **Response** returns command id, workflow status, steps, and logs.

## Modules

| Path | Purpose |
|------|--------|
| `src/modules/commands` | `interpretCommand()` — OpenAI → Zod-validated workflow |
| `src/modules/workflows` | `runWorkflow()` — execute steps, update DB, write logs |
| `src/modules/executions` | Re-exports workflow engine (logging in engine) |
| `src/modules/integrations/connectors/openai` | Already present — used for interpretation |
| `src/modules/integrations/connectors/salesforce` | `createLead()` — real REST API (token or OAuth2) |
| `src/modules/integrations/connectors/microsoft` | `sendTeamsMessage()` — Graph API (client credentials) |

## Database

- **Command**: commandText, status, workflowId, workspaceId.
- **Workflow**: status; **WorkflowStep**: type, status, input, output, error, startedAt, completedAt.
- **ExecutionLog**: workflowId, stepId, action, result, error, createdAt.

Run after schema changes:

```bash
npx prisma migrate dev --name mvp_workflow_steps
# or
npx prisma db push
```

## Environment (see .env.example)

- **OPENAI_API_KEY** — required for command interpretation.
- **Salesforce**: either `SALESFORCE_ACCESS_TOKEN` + `SALESFORCE_INSTANCE_URL`, or OAuth2 (client id/secret, username, password, instance URL).
- **Microsoft Teams**: `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`, `MICROSOFT_TENANT_ID`, `MICROSOFT_TEAMS_TEAM_ID`, `MICROSOFT_TEAMS_CHANNEL_ID`.

## UI

- **Dashboard → Commands** (sidebar): command input, Execute button, command history with workflow status and execution logs (dark minimal).

## API

- **GET /api/commands** — list command history for the current user (with workflow, steps, logs).
- **POST /api/commands** — body `{ "command": "..." }` — run full pipeline and return result.
