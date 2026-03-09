/**
 * GET /api/commands — List command history for the current user.
 * POST /api/commands — Execute a command (save, interpret, run workflow, return results).
 */

import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { NextResponse } from "next/server";
import { interpretCommand } from "@/modules/commands";
import { runWorkflow } from "@/modules/workflows";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const workspaces = await db.workspace.findMany({
    where: { userId: session.user.id },
    include: {
      commands: {
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { workflow: { include: { steps: true, logs: true } } },
      },
    },
  });
  const commands = workspaces.flatMap((w) => w.commands);
  return NextResponse.json({
    commands: commands.map((c) => ({
      id: c.id,
      commandText: c.commandText,
      status: c.status,
      workflowId: c.workflowId,
      createdAt: c.createdAt,
      workflow: c.workflow
        ? {
            id: c.workflow.id,
            status: c.workflow.status,
            steps: c.workflow.steps,
            logs: c.workflow.logs,
          }
        : null,
    })),
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { command?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const commandText = typeof body.command === "string" ? body.command.trim() : "";
  if (!commandText) {
    return NextResponse.json({ error: "Missing or empty command" }, { status: 400 });
  }

  try {
    let workspace = await db.workspace.findFirst({
      where: { userId: session.user.id },
    });
    if (!workspace) {
      workspace = await db.workspace.create({
        data: { name: "Default", userId: session.user.id },
      });
    }

    const command = await db.command.create({
      data: {
        commandText,
        workspaceId: workspace.id,
        status: "pending",
      },
    });

    const interpreted = await interpretCommand(commandText);
    const workflow = await db.workflow.create({
      data: {
        status: "pending",
        steps: {
          create: interpreted.steps.map((s, i) => ({
            order: i,
            type: s.type,
            status: "pending",
            input: s.input as object,
          })),
        },
      },
      include: { steps: true },
    });

    await db.command.update({
      where: { id: command.id },
      data: { workflowId: workflow.id, status: "running" },
    });

    const workflowStatus = await runWorkflow(db, workflow.id, {
      workspaceId: workspace.id,
      agentId: "workflow_agent",
    });
    await db.command.update({
      where: { id: command.id },
      data: { status: workflowStatus },
    });

    const logs = await db.executionLog.findMany({
      where: { workflowId: workflow.id },
      orderBy: { createdAt: "asc" },
    });
    const steps = await db.workflowStep.findMany({
      where: { workflowId: workflow.id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      commandId: command.id,
      workflowId: workflow.id,
      goal: interpreted.goal,
      status: workflowStatus,
      steps: steps.map((s) => ({
        id: s.id,
        type: s.type,
        status: s.status,
        input: s.input,
        output: s.output,
        error: s.error,
        startedAt: s.startedAt,
        completedAt: s.completedAt,
      })),
      logs: logs.map((l) => ({
        stepId: l.stepId,
        action: l.action,
        result: l.result,
        error: l.error,
        createdAt: l.createdAt,
      })),
    });
  } catch (err) {
    console.error("Command execution error:", err);
    const message = err instanceof Error ? err.message : "Command execution failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
