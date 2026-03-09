/**
 * Anthropic connector types and Zod schemas.
 */

import { z } from "zod";

export const anthropicCreateMessageInputSchema = z.object({
  prompt: z.string().min(1),
  systemPrompt: z.string().optional(),
  model: z.string().optional(),
  maxTokens: z.number().min(1).max(8192).optional(),
});

export const anthropicStructuredInputSchema = z.object({
  prompt: z.string().min(1),
  systemPrompt: z.string().optional(),
  schema: z.record(z.unknown()),
  model: z.string().optional(),
  maxTokens: z.number().min(1).max(8192).optional(),
});

export const anthropicToolSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  input_schema: z.record(z.unknown()),
});

export const anthropicToolCallingInputSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ),
  tools: z.array(anthropicToolSchema),
  model: z.string().optional(),
  maxTokens: z.number().min(1).max(8192).optional(),
});

export type AnthropicCreateMessageInput = z.infer<typeof anthropicCreateMessageInputSchema>;
export type AnthropicStructuredInput = z.infer<typeof anthropicStructuredInputSchema>;
export type AnthropicToolCallingInput = z.infer<typeof anthropicToolCallingInputSchema>;
