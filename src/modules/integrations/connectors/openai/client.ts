/**
 * OpenAI API client — server-side only.
 * Wraps the official OpenAI Node SDK for chat completions, structured output, and tool use.
 */

import OpenAI from "openai";
import { getOpenAIConfig, OPENAI_DEFAULT_MODEL, OPENAI_STRUCTURED_MODEL } from "./config";

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (_client) return _client;
  const config = getOpenAIConfig();
  if (!config) throw new Error("OpenAI is not configured. Set OPENAI_API_KEY.");
  _client = new OpenAI({ apiKey: config.apiKey });
  return _client;
}

/** Simple text generation (chat completion). */
export async function generateText(params: {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  const client = getClient();
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
  if (params.systemPrompt) {
    messages.push({ role: "system", content: params.systemPrompt });
  }
  messages.push({ role: "user", content: params.prompt });

  const completion = await client.chat.completions.create({
    model: params.model ?? OPENAI_DEFAULT_MODEL,
    messages,
    max_tokens: params.maxTokens ?? 1024,
    temperature: params.temperature ?? 0.7,
  });

  const content = completion.choices[0]?.message?.content;
  if (content == null) throw new Error("OpenAI returned no content");
  return content;
}

/** Structured output: response conforms to a JSON schema. Uses response_format. */
export async function generateStructuredOutput<T>(params: {
  prompt: string;
  systemPrompt?: string;
  schema: Record<string, unknown>;
  model?: string;
  maxTokens?: number;
}): Promise<T> {
  const client = getClient();
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
  if (params.systemPrompt) {
    messages.push({ role: "system", content: params.systemPrompt });
  }
  messages.push({ role: "user", content: params.prompt });

  const completion = await client.chat.completions.create({
    model: params.model ?? OPENAI_STRUCTURED_MODEL,
    messages,
    max_tokens: params.maxTokens ?? 2048,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "response",
        strict: true,
        schema: params.schema as Record<string, unknown>,
      },
    } as OpenAI.Chat.Completions.ChatCompletionCreateParams["response_format"],
  });

  const content = completion.choices[0]?.message?.content;
  if (content == null) throw new Error("OpenAI returned no content");
  return JSON.parse(content) as T;
}

/** Tool calling: model can request tool calls; execute and optionally continue. */
export async function toolCalling(params: {
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  tools: Array<{ name: string; description?: string; parameters: Record<string, unknown> }>;
  model?: string;
  maxTokens?: number;
}): Promise<{ message: OpenAI.Chat.ChatCompletionMessage; toolCalls: OpenAI.Chat.ChatCompletionMessageToolCall[] }> {
  const client = getClient();
  const openAIMessages: OpenAI.Chat.ChatCompletionMessageParam[] = params.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const tools: OpenAI.Chat.ChatCompletionTool[] = params.tools.map((t) => ({
    type: "function",
    function: {
      name: t.name,
      description: t.description ?? "",
      parameters: t.parameters as OpenAI.Chat.ChatCompletionTool["function"]["parameters"],
    },
  }));

  const completion = await client.chat.completions.create({
    model: params.model ?? OPENAI_DEFAULT_MODEL,
    messages: openAIMessages,
    max_tokens: params.maxTokens ?? 1024,
    tools: tools.length > 0 ? tools : undefined,
  });

  const message = completion.choices[0]?.message;
  if (!message) throw new Error("OpenAI returned no message");

  const toolCalls = message.tool_calls ?? [];
  return { message, toolCalls };
}

/**
 * Responses API (gpt-5-nano, etc.) — when your SDK supports client.responses.create.
 * Uses OPENAI_API_KEY from env (never hardcode keys).
 * If the SDK has no responses API, falls back to chat completions.
 */
export async function createResponseText(params: {
  input: string;
  model?: string;
  store?: boolean;
}): Promise<string> {
  const client = getClient();
  const api = (client as { responses?: { create: (opts: { model: string; input: string; store?: boolean }) => Promise<{ output_text?: string }> } }).responses;
  if (api) {
    const response = await api.create({
      model: params.model ?? "gpt-5-nano",
      input: params.input,
      store: params.store ?? true,
    });
    return response.output_text ?? "";
  }
  return generateText({
    prompt: params.input,
    model: params.model ?? OPENAI_DEFAULT_MODEL,
  });
}

export { getOpenAIConfig };
