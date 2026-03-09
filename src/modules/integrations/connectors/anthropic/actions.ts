/**
 * Anthropic connector actions — execute by action ID with Zod validation.
 */

import type { ActionDefinition, ActionResult } from "../../types";
import * as client from "./client";
import {
  anthropicCreateMessageInputSchema,
  anthropicStructuredInputSchema,
  anthropicToolCallingInputSchema,
} from "./types";

export const ANTHROPIC_ACTIONS: ActionDefinition[] = [
  {
    id: "createMessage",
    name: "Create Message",
    description: "Generate text completion using Claude Messages API.",
    requiredInputs: ["prompt"],
  },
  {
    id: "createMessageStructured",
    name: "Create Message (Structured)",
    description: "Generate JSON output matching a schema (via prompt).",
    requiredInputs: ["prompt", "schema"],
  },
  {
    id: "toolCalling",
    name: "Tool Calling",
    description: "Send messages with tools; model may return tool_use blocks.",
    requiredInputs: ["messages", "tools"],
  },
];

export async function executeCreateMessage(input: Record<string, unknown>): Promise<ActionResult<{ text: string }>> {
  const parsed = anthropicCreateMessageInputSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.message };
  try {
    const text = await client.createMessage({
      prompt: parsed.data.prompt,
      systemPrompt: parsed.data.systemPrompt,
      model: parsed.data.model,
      maxTokens: parsed.data.maxTokens,
    });
    return { success: true, data: { text }, meta: { model: parsed.data.model ?? "claude-sonnet-4" } };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function executeCreateMessageStructured(
  input: Record<string, unknown>
): Promise<ActionResult<{ output: unknown }>> {
  const parsed = anthropicStructuredInputSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.message };
  try {
    const output = await client.createMessageStructured<unknown>({
      prompt: parsed.data.prompt,
      systemPrompt: parsed.data.systemPrompt,
      schema: parsed.data.schema as Record<string, unknown>,
      model: parsed.data.model,
      maxTokens: parsed.data.maxTokens,
    });
    return { success: true, data: { output }, meta: { model: parsed.data.model ?? "claude-sonnet-4" } };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function executeToolCalling(
  input: Record<string, unknown>
): Promise<ActionResult<{ text: string; toolUses: unknown[] }>> {
  const parsed = anthropicToolCallingInputSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.message };
  try {
    const result = await client.createMessageWithTools({
      messages: parsed.data.messages,
      tools: parsed.data.tools.map((t) => ({
        name: t.name,
        description: t.description,
        input_schema: t.input_schema as Record<string, unknown>,
      })),
      model: parsed.data.model,
      maxTokens: parsed.data.maxTokens,
    });
    return { success: true, data: { text: result.text, toolUses: result.toolUses }, meta: { count: result.toolUses.length } };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function executeAction(actionId: string, input: Record<string, unknown>): Promise<ActionResult> {
  switch (actionId) {
    case "createMessage":
      return executeCreateMessage(input);
    case "createMessageStructured":
      return executeCreateMessageStructured(input);
    case "toolCalling":
      return executeToolCalling(input);
    default:
      return { success: false, error: `Unknown action: ${actionId}` };
  }
}
