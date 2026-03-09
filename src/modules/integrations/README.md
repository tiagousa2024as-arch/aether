# AETHER Integrations

Production-grade connectors for LLMs and business APIs. Each connector implements `IntegrationConnector`: `authenticate()`, `listActions()`, `execute(actionId, input)`.

## Connectors

| Connector   | Status   | Env vars           | Actions |
|------------|----------|--------------------|---------|
| **OpenAI** | Implemented | `OPENAI_API_KEY`   | generateText, generateStructuredOutput, toolCalling |
| **Anthropic** | Planned | `ANTHROPIC_API_KEY` | createMessage, structured, tools |
| **Microsoft Graph** | Planned | `MICROSOFT_CLIENT_ID/SECRET/TENANT_ID` | sendEmail, createCalendarEvent, readEmails, createTeamsMessage |
| **Salesforce** | Planned | `SALESFORCE_CLIENT_ID/SECRET` | createLead, getLead, createContact, createTask, queryObjects |
| **ServiceNow** | Planned | `SERVICENOW_INSTANCE/USERNAME/PASSWORD` | createIncident, updateIncident, getIncident, listIncidents |

## Usage

```ts
import { openAIConnector } from "@/modules/integrations";

await openAIConnector.authenticate();
const actions = openAIConnector.listActions();
const result = await openAIConnector.execute("generateText", { prompt: "Hello" });
```

Agents call connectors via this interface so the workflow engine stays provider-agnostic.
