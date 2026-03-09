/**
 * OpenAI integration connector.
 * Implements IntegrationConnector for LLM: generateText, generateStructuredOutput, toolCalling.
 * Server-side only. Set OPENAI_API_KEY to enable.
 */

import type { IntegrationConnector } from "../../types";
import { getOpenAIConfig } from "./config";
import { OPENAI_ACTIONS, executeAction } from "./actions";

export const openAIConnector: IntegrationConnector = {
  name: "openai",

  async authenticate(): Promise<void> {
    const config = getOpenAIConfig();
    if (!config) throw new Error("OpenAI is not configured. Set OPENAI_API_KEY in environment.");
    // Optionally validate key with a minimal API call; for now we just check presence.
  },

  listActions() {
    return OPENAI_ACTIONS;
  },

  async execute(actionId: string, input: Record<string, unknown>) {
    return executeAction(actionId, input);
  },
};

export { getOpenAIConfig } from "./config";
export * from "./client";
export * from "./types";
export * from "./actions";
