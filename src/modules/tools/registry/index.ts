/**
 * Tool Registry — dynamic registration and lookup of tools.
 * Agent → Tool Executor → Registry → Tool → Connector
 */

import type { AetherTool } from "../types";

const tools = new Map<string, AetherTool>();

export function registerTool<TInput = unknown, TOutput = unknown>(
  tool: AetherTool<TInput, TOutput>
): void {
  if (tools.has(tool.name)) {
    console.warn(`[ToolRegistry] Overwriting existing tool: ${tool.name}`);
  }
  tools.set(tool.name, tool as AetherTool);
}

export function getTool(name: string): AetherTool | null {
  return tools.get(name) ?? null;
}

export function listTools(): AetherTool[] {
  return Array.from(tools.values());
}

export function listToolsForAgent(agentId: string): AetherTool[] {
  return listTools().filter((t) => t.allowedAgents.includes(agentId));
}

export function hasTool(name: string): boolean {
  return tools.has(name);
}
