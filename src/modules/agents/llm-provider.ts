/**
 * LLM provider abstraction — switch between OpenAI and Anthropic.
 * Prefers Anthropic if ANTHROPIC_API_KEY is set, else OpenAI if OPENAI_API_KEY is set.
 */

import { getAnthropicConfig } from "@/modules/integrations/connectors/anthropic/config";
import * as anthropicClient from "@/modules/integrations/connectors/anthropic/client";
import { getOpenAIConfig } from "@/modules/integrations/connectors/openai/config";
import * as openaiClient from "@/modules/integrations/connectors/openai/client";

export type LLMProviderId = "openai" | "anthropic";

export interface GenerateTextOptions {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface StructuredOutputOptions {
  prompt: string;
  systemPrompt?: string;
  schema: Record<string, unknown>;
  maxTokens?: number;
}

/** Get the active LLM provider (Anthropic preferred if both keys set). */
export function getActiveLLMProvider(): LLMProviderId | null {
  if (getAnthropicConfig()) return "anthropic";
  if (getOpenAIConfig()) return "openai";
  return null;
}

/**
 * Generate text using the configured LLM.
 * Throws if no provider is configured.
 */
export async function generateText(options: GenerateTextOptions): Promise<string> {
  const provider = getActiveLLMProvider();
  if (provider === "anthropic") {
    return anthropicClient.createMessage({
      prompt: options.prompt,
      systemPrompt: options.systemPrompt,
      maxTokens: options.maxTokens,
    });
  }
  if (provider === "openai") {
    return openaiClient.generateText({
      prompt: options.prompt,
      systemPrompt: options.systemPrompt,
      maxTokens: options.maxTokens,
      temperature: options.temperature,
    });
  }
  throw new Error("No LLM provider configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY.");
}

/**
 * Generate structured JSON output.
 * Throws if no provider is configured.
 */
export async function generateStructuredOutput<T>(options: StructuredOutputOptions): Promise<T> {
  const provider = getActiveLLMProvider();
  if (provider === "anthropic") {
    return anthropicClient.createMessageStructured<T>({
      prompt: options.prompt,
      systemPrompt: options.systemPrompt,
      schema: options.schema,
      maxTokens: options.maxTokens,
    });
  }
  if (provider === "openai") {
    return openaiClient.generateStructuredOutput<T>({
      prompt: options.prompt,
      systemPrompt: options.systemPrompt,
      schema: options.schema,
      maxTokens: options.maxTokens,
    });
  }
  throw new Error("No LLM provider configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY.");
}
