/**
 * Anthropic Messages API client — server-side only.
 * Uses messages.create for text, structured (JSON in prompt), and tool use.
 */

import Anthropic from "@anthropic-ai/sdk";
import { getAnthropicConfig } from "./config";

const DEFAULT_MODEL = "claude-sonnet-4-20250514";

let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (_client) return _client;
  const config = getAnthropicConfig();
  if (!config) throw new Error("Anthropic is not configured. Set ANTHROPIC_API_KEY.");
  _client = new Anthropic({ apiKey: config.apiKey });
  return _client;
}

/** Simple text generation (messages.create). */
export async function createMessage(params: {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  maxTokens?: number;
}): Promise<string> {
  const client = getClient();
  const message = await client.messages.create({
    model: params.model ?? DEFAULT_MODEL,
    max_tokens: params.maxTokens ?? 1024,
    system: params.systemPrompt,
    messages: [{ role: "user", content: params.prompt }],
  });

  const block = message.content.find((b) => b.type === "text");
  if (!block || block.type !== "text") throw new Error("Anthropic returned no text content");
  return block.text;
}

/** Structured output: request JSON in the prompt and parse. (No native json_schema in all models.) */
export async function createMessageStructured<T>(params: {
  prompt: string;
  systemPrompt?: string;
  schema: Record<string, unknown>;
  model?: string;
  maxTokens?: number;
}): Promise<T> {
  const sys = params.systemPrompt ?? "";
  const schemaHint = `Respond with valid JSON only, matching this schema: ${JSON.stringify(params.schema)}`;
  const text = await createMessage({
    prompt: params.prompt,
    systemPrompt: sys ? `${sys}\n\n${schemaHint}` : schemaHint,
    model: params.model ?? DEFAULT_MODEL,
    maxTokens: params.maxTokens ?? 2048,
  });

  const trimmed = text.trim();
  const json = trimmed.startsWith("```") ? trimmed.replace(/^```(?:json)?\n?|\n?```$/g, "").trim() : trimmed;
  return JSON.parse(json) as T;
}

/** Tool use: pass tools; model may return tool_use blocks. */
export async function createMessageWithTools(params: {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  tools: Array<{ name: string; description?: string; input_schema: Record<string, unknown> }>;
  model?: string;
  maxTokens?: number;
}): Promise<{ text: string; toolUses: Array<{ id: string; name: string; input: unknown }> }> {
  const client = getClient();
  const formatted = params.messages.map((m) => ({ role: m.role, content: m.content }));

  const anthropicTools = params.tools.map((t) => ({
    name: t.name,
    description: t.description ?? "",
    input_schema: t.input_schema,
  }));

  const message = await client.messages.create({
    model: params.model ?? DEFAULT_MODEL,
    max_tokens: params.maxTokens ?? 1024,
    messages: formatted,
    tools: anthropicTools.length > 0 ? anthropicTools : undefined,
  });

  let text = "";
  const toolUses: Array<{ id: string; name: string; input: unknown }> = [];

  for (const block of message.content) {
    if (block.type === "text") text += block.text;
    if (block.type === "tool_use") toolUses.push({ id: block.id, name: block.name, input: block.input });
  }

  return { text, toolUses };
}

export { getAnthropicConfig };
