/**
 * OpenAI connector actions — map action IDs to API calls.
 * Validates input with Zod and returns normalized ActionResult.
 */

import type { ActionDefinition, ActionResult } from "../../types";
import * as client from "./client";
import {
  openAIGenerateTextInputSchema,
  openAIStructuredOutputInputSchema,
  openAIToolCallingInputSchema,
} from "./types";

export const OPENAI_ACTIONS: ActionDefinition[] = [
  {
    id: "generateText",
    name: "Generate Text",
    description: "Generate text completion from a prompt using the chat API.",
    requiredInputs: ["prompt"],
  },
  {
    id: "generateStructuredOutput",
    name: "Generate Structured Output",
    description: "Generate JSON output that conforms to a provided schema.",
    requiredInputs: ["prompt", "schema"],
  },
  {
    id: "toolCalling",
    name: "Tool Calling",
    description: "Send messages and tools; model may return tool calls.",
    requiredInputs: ["messages", "tools"],
  },
];

export async function executeGenerateText(
  input: Record<string, unknown>
): Promise<ActionResult<{ text: string }>> {
  const parsed = openAIGenerateTextInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }
  try {
    const text = await client.generateText({
      prompt: parsed.data.prompt,
      systemPrompt: parsed.data.systemPrompt,
      model: parsed.data.model,
      maxTokens: parsed.data.maxTokens,
      temperature: parsed.data.temperature,
    });
    return { success: true, data: { text }, meta: { model: parsed.data.model ?? "gpt-4o-mini" } };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

export async function executeGenerateStructuredOutput(
  input: Record<string, unknown>
): Promise<ActionResult<{ output: unknown }>> {
  const parsed = openAIStructuredOutputInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }
  try {
    const output = await client.generateStructuredOutput<unknown>({
      prompt: parsed.data.prompt,
      systemPrompt: parsed.data.systemPrompt,
      schema: parsed.data.schema as Record<string, unknown>,
      model: parsed.data.model,
      maxTokens: parsed.data.maxTokens,
    });
    return { success: true, data: { output }, meta: { model: parsed.data.model ?? "gpt-4o" } };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

export async function executeToolCalling(
  input: Record<string, unknown>
): Promise<ActionResult<{ message: unknown; toolCalls: unknown[] }>> {
  const parsed = openAIToolCallingInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }
  try {
    const result = await client.toolCalling({
      messages: parsed.data.messages,
      tools: parsed.data.tools,
      model: parsed.data.model,
      maxTokens: parsed.data.maxTokens,
    });
    return {
      success: true,
      data: {
        message: result.message as unknown,
        toolCalls: result.toolCalls as unknown[],
      },
      meta: { count: result.toolCalls.length },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

export async function executeAction(
  actionId: string,
  input: Record<string, unknown>
): Promise<ActionResult> {
  switch (actionId) {
    case "generateText":
      return executeGenerateText(input);
    case "generateStructuredOutput":
      return executeGenerateStructuredOutput(input);
    case "toolCalling":
      return executeToolCalling(input);
    default:
      return { success: false, error: `Unknown action: ${actionId}` };
  }
}
