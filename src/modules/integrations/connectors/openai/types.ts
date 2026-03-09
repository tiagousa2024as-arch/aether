/**
 * OpenAI connector types and Zod schemas for validated I/O.
 */

import { z } from "zod";

/** Input for generateText action. */
export const openAIGenerateTextInputSchema = z.object({
  prompt: z.string().min(1),
  systemPrompt: z.string().optional(),
  model: z.string().optional(),
  maxTokens: z.number().min(1).max(4096).optional(),
  temperature: z.number().min(0).max(2).optional(),
});

export type OpenAIGenerateTextInput = z.infer<typeof openAIGenerateTextInputSchema>;

/** Input for generateStructuredOutput action. */
export const openAIStructuredOutputInputSchema = z.object({
  prompt: z.string().min(1),
  systemPrompt: z.string().optional(),
  schema: z.record(z.unknown()), // JSON Schema for response shape
  model: z.string().optional(),
  maxTokens: z.number().min(1).max(4096).optional(),
});

export type OpenAIStructuredOutputInput = z.infer<typeof openAIStructuredOutputInputSchema>;

/** Tool definition for toolCalling (OpenAI format). */
export const openAIToolSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  parameters: z.record(z.unknown()),
});

export const openAIToolCallingInputSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["system", "user", "assistant"]),
      content: z.string(),
    })
  ),
  tools: z.array(openAIToolSchema),
  model: z.string().optional(),
  maxTokens: z.number().min(1).max(4096).optional(),
});

export type OpenAIToolCallingInput = z.infer<typeof openAIToolCallingInputSchema>;
