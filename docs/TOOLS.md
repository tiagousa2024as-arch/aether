# AETHER Tool System

Agents never call integrations directly. Flow:

**User command → LLM → Workflow → Tool Executor → Tool Registry → Tool → Connector → External API**

## Structure

- `src/modules/tools/types.ts` — `AetherTool`, `ToolExecutionContext`
- `src/modules/tools/registry/` — `registerTool`, `getTool`, `listTools`, `listToolsForAgent`, `hasTool`
- `src/modules/tools/executor/` — `executeTool` (validates tool, agent, input; executes; logs to `ToolExecution`)
- `src/modules/tools/definitions/` — OpenAI, Anthropic, Salesforce, Microsoft, ServiceNow tools

## Registered tools

| Tool | Connector | Allowed agents |
|------|-----------|----------------|
| openai.generate_text | openai | planner_agent, research_agent |
| openai.generate_structured_plan | openai | planner_agent, research_agent |
| anthropic.generate_plan | anthropic | planner_agent, research_agent |
| salesforce.create_lead | salesforce | sales_agent, workflow_agent |
| salesforce.create_contact | salesforce | sales_agent, workflow_agent |
| microsoft.teams.send_message | microsoft | operations_agent, workflow_agent |
| microsoft.outlook.send_email | microsoft | operations_agent, workflow_agent |
| servicenow.create_incident | servicenow | support_agent |
| servicenow.update_incident | servicenow | support_agent |

## Database

- **ToolExecution** (Prisma): id, workspaceId, toolName, agentId, input, output, status, error, duration, createdAt.
- Run `npx prisma migrate dev` or `npx prisma db push` so the table exists.

## API & UI

- **GET /api/tools/executions** — list executions for current user's workspaces.
- **Dashboard → Tool executions** — view log (tool, agent, status, duration, result).

## Adding a new tool

1. Implement connector in `src/modules/integrations/connectors/<name>/` (client, config, types).
2. In `src/modules/tools/definitions/<name>.ts`: define `AetherTool` with name, description, connector, allowedAgents, inputSchema (Zod), execute.
3. Call `registerTool(tool)` and add `register<Name>Tools()` to `definitions/index.ts` in `registerAllTools()`.
