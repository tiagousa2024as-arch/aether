/**
 * AETHER modules — production integration layer.
 * agents: LLM provider abstraction (OpenAI / Anthropic).
 * integrations: Connectors (OpenAI, Anthropic, Microsoft, Salesforce, ServiceNow).
 * workflows, commands, executions: Used by workflow engine (see server/agents + Prisma).
 */

export * from "./integrations";
export * from "./agents/llm-provider";
