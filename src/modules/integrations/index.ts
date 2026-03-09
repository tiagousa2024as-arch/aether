/**
 * AETHER Integrations — connector registry and shared types.
 * Import connectors from here. Agents call connectors via the IntegrationConnector interface.
 */

export type { ActionDefinition, ActionResult, IntegrationConnector } from "./types";
export { openAIConnector } from "./connectors/openai";
export { anthropicConnector } from "./connectors/anthropic";
