/**
 * Anthropic integration connector.
 * Implements IntegrationConnector for Claude: createMessage, structured, toolCalling.
 * Set ANTHROPIC_API_KEY to enable.
 */

import type { IntegrationConnector } from "../../types";
import { getAnthropicConfig } from "./config";
import { ANTHROPIC_ACTIONS, executeAction } from "./actions";

export const anthropicConnector: IntegrationConnector = {
  name: "anthropic",

  async authenticate(): Promise<void> {
    const config = getAnthropicConfig();
    if (!config) throw new Error("Anthropic is not configured. Set ANTHROPIC_API_KEY in environment.");
  },

  listActions() {
    return ANTHROPIC_ACTIONS;
  },

  async execute(actionId: string, input: Record<string, unknown>) {
    return executeAction(actionId, input);
  },
};

export { getAnthropicConfig } from "./config";
export * from "./client";
export * from "./types";
export * from "./actions";
