/**
 * Workflow engine — execute steps in order via Tool Executor or legacy connectors.
 * Agent → Tool Executor → Tool Registry → Tool → Connector
 */

import type { PrismaClient } from "@prisma/client";
import { hasTool } from "@/modules/tools/registry";
import { executeTool } from "@/modules/tools/executor";
import * as salesforce from "@/modules/integrations/connectors/salesforce";
import * as microsoft from "@/modules/integrations/connectors/microsoft";

const LEGACY_STEP_TO_TOOL: Record<string, string> = {
  salesforce_create_lead: "salesforce.create_lead",
  microsoft_teams_message: "microsoft.teams.send_message",
};

const WORKFLOW_AGENT_ID = "workflow_agent";

export interface RunWorkflowOptions {
  workspaceId?: string;
  agentId?: string;
}

async function executeStep(
  db: PrismaClient,
  step: { id: string; workflowId: string; type: string; input: unknown },
  options: RunWorkflowOptions
): Promise<{ output?: string; error?: string; success: boolean }> {
  const input = (step.input ?? {}) as Record<string, unknown>;
  const toolName = LEGACY_STEP_TO_TOOL[step.type] ?? step.type;
  const workspaceId = options.workspaceId;
  const agentId = options.agentId ?? WORKFLOW_AGENT_ID;

  if (workspaceId && hasTool(toolName)) {
    const result = await executeTool(db, {
      toolName,
      input,
      agentId,
      workspaceId,
    });
    return {
      output: result.output != null ? JSON.stringify(result.output) : undefined,
      error: result.error,
      success: result.success,
    };
  }

  try {
    if (step.type === "salesforce_create_lead" || toolName === "salesforce.create_lead") {
      const result = await salesforce.createLead({
        FirstName: input.FirstName as string | undefined,
        LastName: input.LastName as string | undefined,
        Company: input.Company as string | undefined,
        Email: input.Email as string | undefined,
      });
      return { output: JSON.stringify(result), success: true };
    }
    if (step.type === "microsoft_teams_message" || toolName === "microsoft.teams.send_message") {
      const result = await microsoft.sendTeamsMessage({
        message: (input.message as string) ?? "",
        channelId: (input.channelId as string) ?? (input.channel as string),
      });
      return { output: JSON.stringify(result), success: true };
    }
    return { error: `Unknown step type: ${step.type}`, success: false };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { error: message, success: false };
  }
}

/**
 * Run a workflow: execute each step in order, update step and workflow status, write logs.
 * When workspaceId is provided and the step type is a registered tool, uses Tool Executor (and logs to ToolExecution).
 */
export async function runWorkflow(
  db: PrismaClient,
  workflowId: string,
  options: RunWorkflowOptions = {}
): Promise<"completed" | "failed"> {
  const workflow = await db.workflow.findUnique({
    where: { id: workflowId },
    include: { steps: { orderBy: { order: "asc" } } },
  });
  if (!workflow) throw new Error(`Workflow not found: ${workflowId}`);
  if (workflow.steps.length === 0) {
    await db.workflow.update({ where: { id: workflowId }, data: { status: "completed" } });
    return "completed";
  }

  await db.workflow.update({ where: { id: workflowId }, data: { status: "running" } });

  let workflowStatus: "completed" | "failed" = "completed";

  for (const step of workflow.steps) {
    await db.workflowStep.update({
      where: { id: step.id },
      data: { status: "running", startedAt: new Date() },
    });

    const inputJson = step.input as Record<string, unknown> | null;
    const result = await executeStep(
      db,
      { id: step.id, workflowId, type: step.type, input: inputJson ?? {} },
      options
    );

    const completedAt = new Date();
    await db.workflowStep.update({
      where: { id: step.id },
      data: {
        status: result.success ? "completed" : "failed",
        output: result.output ?? null,
        error: result.error ?? null,
        completedAt,
      },
    });

    await db.executionLog.create({
      data: {
        workflowId,
        stepId: step.id,
        action: step.type,
        result: result.output ?? null,
        error: result.error ?? null,
      },
    });

    if (!result.success) workflowStatus = "failed";
  }

  await db.workflow.update({
    where: { id: workflowId },
    data: { status: workflowStatus },
  });
  return workflowStatus;
}
