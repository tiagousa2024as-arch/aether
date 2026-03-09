/**
 * GET /api/tools/executions — List tool executions for the current user's workspaces.
 */

import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const workspaces = await db.workspace.findMany({
      where: { userId: session.user.id },
      select: { id: true },
    });
    const workspaceIds = workspaces.map((w) => w.id);
    if (workspaceIds.length === 0) {
      return NextResponse.json({ executions: [] });
    }
    const executions = await db.toolExecution.findMany({
      where: { workspaceId: { in: workspaceIds } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({
      executions: executions.map((e) => ({
        id: e.id,
        workspaceId: e.workspaceId,
        toolName: e.toolName,
        agentId: e.agentId,
        input: e.input,
        output: e.output,
        status: e.status,
        error: e.error,
        duration: e.duration,
        createdAt: e.createdAt,
      })),
    });
  } catch (err) {
    console.error("[GET /api/tools/executions]", err);
    const message = err instanceof Error ? err.message : "Database error";
    const hint =
      message.includes("toolExecution") || message.includes("does not exist")
        ? "Run: npx prisma migrate dev (or npx prisma db push)"
        : undefined;
    return NextResponse.json(
      { error: message, hint },
      { status: 500 }
    );
  }
}
