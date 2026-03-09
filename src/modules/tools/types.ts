/**
 * AETHER Tool System — generic tool interface.
 * Agents never call integrations directly; they call tools via the executor.
 */

import type { z } from "zod";

export interface ToolExecutionContext {
  workspaceId: string;
  agentId: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Generic tool interface. All tools define name, description, connector,
 * allowed agents, input schema, and execute function.
 */
export interface AetherTool<TInput = unknown, TOutput = unknown> {
  name: string;
  description: string;
  connector: string;
  allowedAgents: string[];
  inputSchema: z.ZodType<TInput>;
  execute: (input: TInput, context: ToolExecutionContext) => Promise<TOutput>;
}

export type ToolExecutionStatus = "pending" | "running" | "completed" | "failed";

export interface ToolExecutionResult<TOutput = unknown> {
  success: boolean;
  output?: TOutput;
  error?: string;
  durationMs: number;
}
