/**
 * Tool Executor — validate, execute, and log tool calls.
 * Enforces: tool exists, agent permission, input schema, then executes and logs.
 */

import type { PrismaClient } from "@prisma/client";
import { getTool, hasTool } from "../registry";
import { registerAllTools } from "../definitions";
import type { ToolExecutionContext, ToolExecutionResult } from "../types";

export interface ExecuteToolParams {
  toolName: string;
  input: unknown;
  agentId: string;
  workspaceId: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface ExecuteToolResult<T = unknown> {
  success: boolean;
  output?: T;
  error?: string;
  durationMs: number;
  executionId?: string;
}

/**
 * 1. Validate tool exists
 * 2. Validate agent permission
 * 3. Validate input schema
 * 4. Execute tool
 * 5. Log execution to DB
 * 6. Return result
 */
export async function executeTool(
  db: PrismaClient,
  params: ExecuteToolParams
): Promise<ExecuteToolResult> {
  registerAllTools();
  const { toolName, input, agentId, workspaceId, userId, metadata } = params;
  const start = Date.now();

  const tool = getTool(toolName);
  if (!tool) {
    const error = `Tool not found: ${toolName}`;
    await logExecution(db, {
      workspaceId,
      agentId,
      toolName,
      input: input as object,
      output: null,
      status: "failed",
      error,
      duration: Date.now() - start,
    });
    return { success: false, error, durationMs: Date.now() - start };
  }

  if (!tool.allowedAgents.includes(agentId)) {
    const error = `Agent ${agentId} is not allowed to use tool ${toolName}`;
    await logExecution(db, {
      workspaceId,
      agentId,
      toolName,
      input: input as object,
      output: null,
      status: "failed",
      error,
      duration: Date.now() - start,
    });
    return { success: false, error, durationMs: Date.now() - start };
  }

  const parsed = tool.inputSchema.safeParse(input);
  if (!parsed.success) {
    const error = `Invalid input: ${parsed.error.message}`;
    await logExecution(db, {
      workspaceId,
      agentId,
      toolName,
      input: input as object,
      output: null,
      status: "failed",
      error,
      duration: Date.now() - start,
    });
    return { success: false, error, durationMs: Date.now() - start };
  }

  const context: ToolExecutionContext = {
    workspaceId,
    agentId,
    userId,
    metadata,
  };

  try {
    const output = await tool.execute(parsed.data, context);
    const duration = Date.now() - start;
    const executionId = await logExecution(db, {
      workspaceId,
      agentId,
      toolName,
      input: input as object,
      output: output as object,
      status: "completed",
      error: null,
      duration,
    });
    return {
      success: true,
      output: output as T,
      durationMs: duration,
      executionId,
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    const duration = Date.now() - start;
    await logExecution(db, {
      workspaceId,
      agentId,
      toolName,
      input: input as object,
      output: null,
      status: "failed",
      error,
      duration,
    });
    return { success: false, error, durationMs: duration };
  }
}

async function logExecution(
  db: PrismaClient,
  params: {
    workspaceId: string;
    agentId: string;
    toolName: string;
    input: object;
    output: object | null;
    status: string;
    error: string | null;
    duration: number;
  }
): Promise<string> {
  const record = await db.toolExecution.create({
    data: {
      workspaceId: params.workspaceId,
      agentId: params.agentId,
      toolName: params.toolName,
      input: params.input as object,
      output: params.output != null ? JSON.stringify(params.output) : null,
      status: params.status,
      error: params.error,
      duration: Math.round(params.duration),
    },
  });
  return record.id;
}
